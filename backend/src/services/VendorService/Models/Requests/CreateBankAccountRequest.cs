using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to add bank account
/// </summary>
public class CreateBankAccountRequest
{
    [Required]
    [StringLength(100)]
    public string AccountHolderName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    public string AccountNumber { get; set; } = string.Empty;
    
    [Required]
    [StringLength(11)]
    public string IfscCode { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string BankName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string BranchName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    public string AccountType { get; set; } = "Savings";
    
    public bool IsPrimary { get; set; }
}
