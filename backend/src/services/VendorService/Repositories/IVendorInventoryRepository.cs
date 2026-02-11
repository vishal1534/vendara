using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for VendorInventoryItem operations
/// </summary>
public interface IVendorInventoryRepository
{
    Task<VendorInventoryItem?> GetByIdAsync(Guid id);
    Task<IEnumerable<VendorInventoryItem>> GetByVendorIdAsync(Guid vendorId);
    Task<VendorInventoryItem?> GetByVendorAndMaterialAsync(Guid vendorId, Guid materialId);
    Task<IEnumerable<VendorInventoryItem>> GetAvailableByVendorIdAsync(Guid vendorId);
    Task<VendorInventoryItem> CreateAsync(VendorInventoryItem item);
    Task<VendorInventoryItem> UpdateAsync(VendorInventoryItem item);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid vendorId, Guid materialId);
}
