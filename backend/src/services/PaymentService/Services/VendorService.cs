using System.Text.Json;

namespace PaymentService.Services;

public class VendorService : IVendorService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<VendorService> _logger;

    public VendorService(HttpClient httpClient, ILogger<VendorService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<VendorBankDetails?> GetVendorBankDetailsAsync(Guid vendorId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/v1/vendors/{vendorId}/bank-details");
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to get bank details for vendor {VendorId}. Status: {Status}", 
                    vendorId, response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ApiResponse<VendorBankDetails>>(content, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result?.Data;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bank details for vendor {VendorId}", vendorId);
            return null;
        }
    }

    public async Task<bool> IsVendorActiveAsync(Guid vendorId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/v1/vendors/{vendorId}");
            
            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ApiResponse<VendorInfo>>(content, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result?.Data?.Status?.ToLower() == "active";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking vendor status for {VendorId}", vendorId);
            return false;
        }
    }

    private class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
    }

    private class VendorInfo
    {
        public string Status { get; set; } = null!;
    }
}
