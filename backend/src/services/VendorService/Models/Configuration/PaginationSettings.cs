namespace VendorService.Models.Configuration;

/// <summary>
/// Pagination configuration settings
/// </summary>
public class PaginationSettings
{
    public int DefaultPageSize { get; set; } = 20;
    public int MaxPageSize { get; set; } = 100;

    /// <summary>
    /// Validates and returns safe page number (minimum 1)
    /// </summary>
    public int GetSafePage(int page)
    {
        return page < 1 ? 1 : page;
    }

    /// <summary>
    /// Validates and returns safe page size (within min and max bounds)
    /// </summary>
    public int GetSafePageSize(int pageSize)
    {
        if (pageSize < 1) return DefaultPageSize;
        if (pageSize > MaxPageSize) return MaxPageSize;
        return pageSize;
    }
}
