namespace PaymentService.Services;

public interface IVendorService
{
    Task<VendorBankDetails?> GetVendorBankDetailsAsync(Guid vendorId);
    Task<bool> IsVendorActiveAsync(Guid vendorId);
}

public class VendorBankDetails
{
    public Guid VendorId { get; set; }
    public string AccountHolderName { get; set; } = null!;
    public string AccountNumber { get; set; } = null!;
    public string IfscCode { get; set; } = null!;
    public string BankName { get; set; } = null!;
    public bool IsVerified { get; set; }
}
