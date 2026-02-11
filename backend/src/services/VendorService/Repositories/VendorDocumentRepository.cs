using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;
using VendorService.Models.Enums;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for VendorDocument operations
/// </summary>
public class VendorDocumentRepository : IVendorDocumentRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorDocumentRepository> _logger;

    public VendorDocumentRepository(VendorDbContext context, ILogger<VendorDocumentRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<VendorDocument?> GetByIdAsync(Guid id)
    {
        return await _context.VendorDocuments.FindAsync(id);
    }

    public async Task<IEnumerable<VendorDocument>> GetByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorDocuments
            .Where(d => d.VendorId == vendorId)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<VendorDocument>> GetByStatusAsync(DocumentStatus status)
    {
        return await _context.VendorDocuments
            .Where(d => d.Status == status)
            .OrderBy(d => d.UploadedAt)
            .ToListAsync();
    }

    public async Task<VendorDocument> CreateAsync(VendorDocument document)
    {
        document.UploadedAt = DateTime.UtcNow;
        document.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorDocuments.Add(document);
        await _context.SaveChangesAsync();
        
        return document;
    }

    public async Task<VendorDocument> UpdateAsync(VendorDocument document)
    {
        document.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorDocuments.Update(document);
        await _context.SaveChangesAsync();
        
        return document;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var document = await _context.VendorDocuments.FindAsync(id);
        if (document == null)
            return false;

        _context.VendorDocuments.Remove(document);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
