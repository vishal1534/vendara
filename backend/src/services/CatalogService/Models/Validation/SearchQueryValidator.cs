using System.Text.RegularExpressions;

namespace CatalogService.Models.Validation;

public static class SearchQueryValidator
{
    private const int MaxSearchTermLength = 100;
    private static readonly Regex AllowedCharactersRegex = new(@"^[\w\s\-\.]+$", RegexOptions.Compiled);
    
    public static string? SanitizeSearchTerm(string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return null;
        
        // Trim whitespace
        searchTerm = searchTerm.Trim();
        
        // Limit length
        if (searchTerm.Length > MaxSearchTermLength)
            searchTerm = searchTerm.Substring(0, MaxSearchTermLength);
        
        // Remove potentially dangerous characters
        searchTerm = Regex.Replace(searchTerm, @"[<>""';\\%]", "");
        
        // Normalize whitespace
        searchTerm = Regex.Replace(searchTerm, @"\s+", " ");
        
        return string.IsNullOrWhiteSpace(searchTerm) ? null : searchTerm;
    }
    
    public static bool IsValidSearchTerm(string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return true; // Empty is valid (will be ignored)
        
        if (searchTerm.Length > MaxSearchTermLength)
            return false;
        
        return AllowedCharactersRegex.IsMatch(searchTerm);
    }
}
