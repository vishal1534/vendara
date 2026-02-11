using VendorService.Models.Entities;
using VendorService.Models.Enums;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for VendorDocument operations
/// </summary>
public interface IVendorDocumentRepository
{
    Task<VendorDocument?> GetByIdAsync(Guid id);
    Task<IEnumerable<VendorDocument>> GetByVendorIdAsync(Guid vendorId);
    Task<IEnumerable<VendorDocument>> GetByStatusAsync(DocumentStatus status);
    Task<VendorDocument> CreateAsync(VendorDocument document);
    Task<VendorDocument> UpdateAsync(VendorDocument document);
    Task<bool> DeleteAsync(Guid id);
}
