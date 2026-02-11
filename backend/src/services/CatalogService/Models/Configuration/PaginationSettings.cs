namespace CatalogService.Models.Configuration;

public class PaginationSettings
{
    public int DefaultPageSize { get; set; } = 20;
    public int MaxPageSize { get; set; } = 100;
    
    public int ValidatePageSize(int requestedPageSize)
    {
        if (requestedPageSize <= 0)
            return DefaultPageSize;
        
        return requestedPageSize > MaxPageSize ? MaxPageSize : requestedPageSize;
    }
    
    public int ValidatePage(int page)
    {
        return page < 1 ? 1 : page;
    }
}
