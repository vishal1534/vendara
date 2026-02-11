namespace VendorService.Models.Responses;

/// <summary>
/// Vendor bank account response DTO (partial for security)
/// </summary>
public class VendorBankAccountResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    
    public string AccountHolderName { get; set; } = string.Empty;
    public string AccountNumberMasked { get; set; } = string.Empty; // Last 4 digits only
    public string IfscCode { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string BranchName { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    
    public bool IsPrimary { get; set; }
    public bool IsVerified { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
