using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for VendorBankAccount operations
/// </summary>
public class VendorBankAccountRepository : IVendorBankAccountRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorBankAccountRepository> _logger;

    public VendorBankAccountRepository(VendorDbContext context, ILogger<VendorBankAccountRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<VendorBankAccount?> GetByIdAsync(Guid id)
    {
        return await _context.VendorBankAccounts.FindAsync(id);
    }

    public async Task<IEnumerable<VendorBankAccount>> GetByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorBankAccounts
            .Where(b => b.VendorId == vendorId)
            .OrderByDescending(b => b.IsPrimary)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<VendorBankAccount?> GetPrimaryByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorBankAccounts
            .FirstOrDefaultAsync(b => b.VendorId == vendorId && b.IsPrimary);
    }

    public async Task<VendorBankAccount> CreateAsync(VendorBankAccount bankAccount)
    {
        bankAccount.CreatedAt = DateTime.UtcNow;
        
        _context.VendorBankAccounts.Add(bankAccount);
        await _context.SaveChangesAsync();
        
        return bankAccount;
    }

    public async Task<VendorBankAccount> UpdateAsync(VendorBankAccount bankAccount)
    {
        _context.VendorBankAccounts.Update(bankAccount);
        await _context.SaveChangesAsync();
        
        return bankAccount;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var bankAccount = await _context.VendorBankAccounts.FindAsync(id);
        if (bankAccount == null)
            return false;

        _context.VendorBankAccounts.Remove(bankAccount);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task UnsetPrimaryForVendorAsync(Guid vendorId)
    {
        var accounts = await _context.VendorBankAccounts
            .Where(b => b.VendorId == vendorId && b.IsPrimary)
            .ToListAsync();

        foreach (var account in accounts)
        {
            account.IsPrimary = false;
        }

        await _context.SaveChangesAsync();
    }
}
