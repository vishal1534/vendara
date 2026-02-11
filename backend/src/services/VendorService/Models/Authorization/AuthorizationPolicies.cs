namespace VendorService.Models.Authorization;

/// <summary>
/// Authorization policy names used throughout the application
/// </summary>
public static class AuthorizationPolicies
{
    public const string AdminOnly = "AdminOnly";
    public const string VendorOnly = "VendorOnly";
    public const string CustomerOnly = "CustomerOnly";
    public const string VendorOrAdmin = "VendorOrAdmin";
    public const string CustomerOrAdmin = "CustomerOrAdmin";
    public const string AnyAuthenticated = "AnyAuthenticated";
}
