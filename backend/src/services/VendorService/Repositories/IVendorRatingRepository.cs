using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for VendorRating operations
/// </summary>
public interface IVendorRatingRepository
{
    Task<VendorRating?> GetByIdAsync(Guid id);
    Task<IEnumerable<VendorRating>> GetByVendorIdAsync(Guid vendorId, int page, int pageSize);
    Task<VendorRating?> GetByOrderIdAsync(Guid orderId);
    Task<(decimal averageRating, int totalCount)> GetVendorRatingSummaryAsync(Guid vendorId);
    Task<VendorRating> CreateAsync(VendorRating rating);
    Task<VendorRating> UpdateAsync(VendorRating rating);
    Task<bool> DeleteAsync(Guid id);
}
