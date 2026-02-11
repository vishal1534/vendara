using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for VendorServiceArea operations
/// </summary>
public interface IVendorServiceAreaRepository
{
    Task<VendorServiceArea?> GetByIdAsync(Guid id);
    Task<IEnumerable<VendorServiceArea>> GetByVendorIdAsync(Guid vendorId);
    Task<IEnumerable<VendorServiceArea>> GetActiveByVendorIdAsync(Guid vendorId);
    Task<VendorServiceArea> CreateAsync(VendorServiceArea serviceArea);
    Task<VendorServiceArea> UpdateAsync(VendorServiceArea serviceArea);
    Task<bool> DeleteAsync(Guid id);
}
