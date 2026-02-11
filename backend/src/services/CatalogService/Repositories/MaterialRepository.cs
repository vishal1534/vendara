using CatalogService.Data;
using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Repositories;

public interface IMaterialRepository
{
    Task<Material?> GetByIdAsync(Guid id);
    Task<(List<Material> Items, int TotalCount)> GetAllAsync(bool includeInactive = false, int page = 1, int pageSize = 50);
    Task<(List<Material> Items, int TotalCount)> GetByCategoryAsync(Guid categoryId, bool includeInactive = false, int page = 1, int pageSize = 50);
    Task<Material> CreateAsync(Material material);
    Task<Material> UpdateAsync(Material material);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}

public class MaterialRepository : IMaterialRepository
{
    private readonly CatalogServiceDbContext _context;

    public MaterialRepository(CatalogServiceDbContext context)
    {
        _context = context;
    }

    public async Task<Material?> GetByIdAsync(Guid id)
    {
        return await _context.Materials
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<(List<Material> Items, int TotalCount)> GetAllAsync(bool includeInactive = false, int page = 1, int pageSize = 50)
    {
        var query = _context.Materials
            .Include(m => m.Category)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(m => m.IsActive);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(m => m.Category.Name)
            .ThenBy(m => m.DisplayOrder)
            .ThenBy(m => m.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<(List<Material> Items, int TotalCount)> GetByCategoryAsync(Guid categoryId, bool includeInactive = false, int page = 1, int pageSize = 50)
    {
        var query = _context.Materials
            .Include(m => m.Category)
            .Where(m => m.CategoryId == categoryId);

        if (!includeInactive)
        {
            query = query.Where(m => m.IsActive);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(m => m.DisplayOrder)
            .ThenBy(m => m.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Material> CreateAsync(Material material)
    {
        material.CreatedAt = DateTime.UtcNow;
        material.UpdatedAt = DateTime.UtcNow;

        _context.Materials.Add(material);
        await _context.SaveChangesAsync();
        return material;
    }

    public async Task<Material> UpdateAsync(Material material)
    {
        material.UpdatedAt = DateTime.UtcNow;

        _context.Materials.Update(material);
        await _context.SaveChangesAsync();
        return material;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var material = await _context.Materials.FindAsync(id);
        if (material == null)
            return false;

        _context.Materials.Remove(material);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Materials.AnyAsync(m => m.Id == id);
    }
}