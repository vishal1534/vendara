namespace VendorService.Models.Entities;

/// <summary>
/// Vendor bank account details for settlements
/// </summary>
public class VendorBankAccount
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    
    public string AccountHolderName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string IfscCode { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string BranchName { get; set; } = string.Empty;
    
    public string AccountType { get; set; } = "Savings"; // Savings, Current
    
    public bool IsPrimary { get; set; }
    public bool IsVerified { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Vendor Vendor { get; set; } = null!;
}
