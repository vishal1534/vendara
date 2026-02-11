using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for VendorBusinessHour operations
/// </summary>
public interface IVendorBusinessHourRepository
{
    Task<IEnumerable<VendorBusinessHour>> GetByVendorIdAsync(Guid vendorId);
    Task CreateBulkAsync(IEnumerable<VendorBusinessHour> hours);
    Task DeleteByVendorIdAsync(Guid vendorId);
}
