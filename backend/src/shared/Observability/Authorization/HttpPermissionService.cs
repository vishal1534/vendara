using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace RealServ.Shared.Observability.Authorization;

/// <summary>
/// HTTP-based permission service that calls IdentityService to verify user permissions.
/// Uses caching to minimize calls to IdentityService.
/// </summary>
/// <remarks>
/// <para>
/// Configuration in appsettings.json:
/// <code>
/// {
///   "Services": {
///     "IdentityServiceUrl": "http://identity-service:5001"
///   },
///   "InternalApiKeys": {
///     "IdentityService": "your-secret-key"
///   }
/// }
/// </code>
/// </para>
/// <para>
/// Register in Program.cs:
/// <code>
/// builder.Services.AddHttpClient&lt;IPermissionService, HttpPermissionService&gt;();
/// builder.Services.AddMemoryCache();
/// </code>
/// </para>
/// </remarks>
public class HttpPermissionService : IPermissionService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<HttpPermissionService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _identityServiceUrl;
    private readonly string? _internalApiKey;

    // Simple in-memory cache (consider using IMemoryCache for production)
    private readonly Dictionary<string, HashSet<string>> _permissionsCache = new();
    private readonly Dictionary<string, DateTime> _cacheExpiry = new();
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(5);
    private readonly object _cacheLock = new();

    public HttpPermissionService(
        HttpClient httpClient,
        ILogger<HttpPermissionService> logger,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;

        _identityServiceUrl = configuration["Services:IdentityServiceUrl"] 
            ?? "http://localhost:5001";
        
        _internalApiKey = configuration["InternalApiKeys:IdentityService"];

        if (string.IsNullOrEmpty(_internalApiKey))
        {
            _logger.LogWarning(
                "No internal API key configured for IdentityService. " +
                "Permission checks will fail. Configure InternalApiKeys:IdentityService in appsettings.json"
            );
        }
    }

    public async Task<bool> UserHasPermissionAsync(string userId, string permission)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogWarning("UserHasPermissionAsync called with null or empty userId");
            return false;
        }

        if (string.IsNullOrWhiteSpace(permission))
        {
            _logger.LogWarning("UserHasPermissionAsync called with null or empty permission");
            return false;
        }

        // Check cache first
        lock (_cacheLock)
        {
            if (_permissionsCache.TryGetValue(userId, out var cachedPermissions) &&
                _cacheExpiry.TryGetValue(userId, out var expiry) &&
                DateTime.UtcNow < expiry)
            {
                var hasPermission = cachedPermissions.Contains(permission);
                _logger.LogDebug(
                    "Permission check from cache: User {UserId} {HasPermission} permission {Permission}",
                    userId,
                    hasPermission ? "has" : "does not have",
                    permission
                );
                return hasPermission;
            }
        }

        // Fetch permissions from IdentityService
        try
        {
            var permissions = await FetchUserPermissionsAsync(userId);

            // Update cache
            lock (_cacheLock)
            {
                _permissionsCache[userId] = permissions;
                _cacheExpiry[userId] = DateTime.UtcNow.Add(_cacheDuration);
            }

            var hasPermission = permissions.Contains(permission);
            _logger.LogInformation(
                "Permission check from IdentityService: User {UserId} {HasPermission} permission {Permission}",
                userId,
                hasPermission ? "has" : "does not have",
                permission
            );

            return hasPermission;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to fetch permissions for user {UserId} from IdentityService",
                userId
            );

            // Fail open or closed? For MVP, fail closed (deny permission)
            return false;
        }
    }

    private async Task<HashSet<string>> FetchUserPermissionsAsync(string userId)
    {
        var url = $"{_identityServiceUrl}/api/v1/admin/users/{userId}/permissions";

        var request = new HttpRequestMessage(HttpMethod.Get, url);

        // Add internal API key for service-to-service authentication
        if (!string.IsNullOrEmpty(_internalApiKey))
        {
            request.Headers.Add("X-Internal-API-Key", _internalApiKey);
        }

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning(
                "Failed to fetch permissions for user {UserId}: {StatusCode}",
                userId,
                response.StatusCode
            );

            return new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        }

        var result = await response.Content.ReadFromJsonAsync<PermissionsResponse>();

        if (result?.Permissions == null)
        {
            _logger.LogWarning(
                "Invalid response from IdentityService for user {UserId}: No permissions array",
                userId
            );
            return new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        }

        return new HashSet<string>(result.Permissions, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Clears the permission cache for a specific user
    /// (call this when user roles/permissions change)
    /// </summary>
    public void ClearCache(string userId)
    {
        lock (_cacheLock)
        {
            _permissionsCache.Remove(userId);
            _cacheExpiry.Remove(userId);
        }

        _logger.LogInformation("Cleared permission cache for user {UserId}", userId);
    }

    /// <summary>
    /// Clears the entire permission cache
    /// </summary>
    public void ClearAllCache()
    {
        lock (_cacheLock)
        {
            _permissionsCache.Clear();
            _cacheExpiry.Clear();
        }

        _logger.LogInformation("Cleared all permission cache");
    }

    private class PermissionsResponse
    {
        public List<string> Permissions { get; set; } = new();
    }
}
