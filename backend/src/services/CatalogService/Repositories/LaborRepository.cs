using CatalogService.Data;
using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Repositories;

public interface ILaborRepository
{
    Task<LaborCategory?> GetByIdAsync(Guid id);
    Task<List<LaborCategory>> GetAllAsync(bool includeInactive = false);
    Task<List<LaborCategory>> GetByCategoryAsync(Guid categoryId, bool includeInactive = false);
    Task<LaborCategory> CreateAsync(LaborCategory labor);
    Task<LaborCategory> UpdateAsync(LaborCategory labor);
    Task<bool> DeleteAsync(Guid id);
}

// Alias interface for controller compatibility
public interface ILaborCategoryRepository : ILaborRepository { }

public class LaborRepository : ILaborRepository
{
    private readonly CatalogServiceDbContext _context;

    public LaborRepository(CatalogServiceDbContext context)
    {
        _context = context;
    }

    public async Task<LaborCategory?> GetByIdAsync(Guid id)
    {
        return await _context.LaborCategories
            .Include(l => l.Category)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<List<LaborCategory>> GetAllAsync(bool includeInactive = false)
    {
        var query = _context.LaborCategories
            .Include(l => l.Category)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(l => l.IsActive);
        }

        return await query
            .OrderBy(l => l.DisplayOrder)
            .ThenBy(l => l.Name)
            .ToListAsync();
    }

    public async Task<List<LaborCategory>> GetByCategoryAsync(Guid categoryId, bool includeInactive = false)
    {
        var query = _context.LaborCategories
            .Include(l => l.Category)
            .Where(l => l.CategoryId == categoryId);

        if (!includeInactive)
        {
            query = query.Where(l => l.IsActive);
        }

        return await query
            .OrderBy(l => l.DisplayOrder)
            .ThenBy(l => l.Name)
            .ToListAsync();
    }

    public async Task<LaborCategory> CreateAsync(LaborCategory labor)
    {
        labor.CreatedAt = DateTime.UtcNow;
        labor.UpdatedAt = DateTime.UtcNow;

        _context.LaborCategories.Add(labor);
        await _context.SaveChangesAsync();
        return labor;
    }

    public async Task<LaborCategory> UpdateAsync(LaborCategory labor)
    {
        labor.UpdatedAt = DateTime.UtcNow;

        _context.LaborCategories.Update(labor);
        await _context.SaveChangesAsync();
        return labor;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var labor = await _context.LaborCategories.FindAsync(id);
        if (labor == null)
            return false;

        _context.LaborCategories.Remove(labor);
        await _context.SaveChangesAsync();
        return true;
    }
}