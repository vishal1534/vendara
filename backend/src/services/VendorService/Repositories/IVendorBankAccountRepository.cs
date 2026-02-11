using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for VendorBankAccount operations
/// </summary>
public interface IVendorBankAccountRepository
{
    Task<VendorBankAccount?> GetByIdAsync(Guid id);
    Task<IEnumerable<VendorBankAccount>> GetByVendorIdAsync(Guid vendorId);
    Task<VendorBankAccount?> GetPrimaryByVendorIdAsync(Guid vendorId);
    Task<VendorBankAccount> CreateAsync(VendorBankAccount bankAccount);
    Task<VendorBankAccount> UpdateAsync(VendorBankAccount bankAccount);
    Task<bool> DeleteAsync(Guid id);
    Task UnsetPrimaryForVendorAsync(Guid vendorId);
}
