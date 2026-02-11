using CatalogService.Data;
using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Repositories;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id);
    Task<List<Category>> GetAllAsync(CategoryType? type = null, bool includeInactive = false);
    Task<List<Category>> GetRootCategoriesAsync(CategoryType type, bool includeInactive = false);
    Task<Category> CreateAsync(Category category);
    Task<Category> UpdateAsync(Category category);
    Task<bool> DeleteAsync(Guid id);
}

public class CategoryRepository : ICategoryRepository
{
    private readonly CatalogServiceDbContext _context;

    public CategoryRepository(CatalogServiceDbContext context)
    {
        _context = context;
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        return await _context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Category>> GetAllAsync(CategoryType? type = null, bool includeInactive = false)
    {
        var query = _context.Categories.AsQueryable();

        if (type.HasValue)
        {
            query = query.Where(c => c.Type == type.Value);
        }

        if (!includeInactive)
        {
            query = query.Where(c => c.IsActive);
        }

        return await query
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<List<Category>> GetRootCategoriesAsync(CategoryType type, bool includeInactive = false)
    {
        var query = _context.Categories
            .Where(c => c.Type == type && c.ParentCategoryId == null);

        if (!includeInactive)
        {
            query = query.Where(c => c.IsActive);
        }

        return await query
            .Include(c => c.SubCategories)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Category> CreateAsync(Category category)
    {
        category.CreatedAt = DateTime.UtcNow;
        category.UpdatedAt = DateTime.UtcNow;

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category> UpdateAsync(Category category)
    {
        category.UpdatedAt = DateTime.UtcNow;

        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return false;

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}
