using VendorService.Models.Entities;
using VendorService.Models.Enums;

namespace VendorService.Repositories;

/// <summary>
/// Repository interface for Vendor operations
/// </summary>
public interface IVendorRepository
{
    Task<Vendor?> GetByIdAsync(Guid id);
    Task<Vendor?> GetByUserIdAsync(Guid userId);
    Task<Vendor?> GetByEmailAsync(string email);
    Task<(IEnumerable<Vendor> vendors, int totalCount)> GetAllAsync(
        int page, int pageSize, VendorStatus? status = null, string? city = null, string? searchTerm = null);
    Task<IEnumerable<Vendor>> SearchAsync(string searchTerm, string? city = null, int limit = 10);
    Task<Vendor> CreateAsync(Vendor vendor);
    Task<Vendor> UpdateAsync(Vendor vendor);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetTotalCountAsync();
    Task<IEnumerable<Vendor>> GetTopRatedAsync(int limit = 10, string? city = null);
}
