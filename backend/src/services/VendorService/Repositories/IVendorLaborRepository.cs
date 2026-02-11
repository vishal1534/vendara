using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for VendorLaborAvailability operations
/// </summary>
public interface IVendorLaborRepository
{
    Task<VendorLaborAvailability?> GetByIdAsync(Guid id);
    Task<IEnumerable<VendorLaborAvailability>> GetByVendorIdAsync(Guid vendorId);
    Task<VendorLaborAvailability?> GetByVendorAndLaborCategoryAsync(Guid vendorId, Guid laborCategoryId, int skillLevel);
    Task<IEnumerable<VendorLaborAvailability>> GetAvailableByVendorIdAsync(Guid vendorId);
    Task<VendorLaborAvailability> CreateAsync(VendorLaborAvailability labor);
    Task<VendorLaborAvailability> UpdateAsync(VendorLaborAvailability labor);
    Task<bool> DeleteAsync(Guid id);
}
