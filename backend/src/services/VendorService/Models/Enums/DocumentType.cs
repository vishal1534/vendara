namespace VendorService.Models.Enums;

/// <summary>
/// Types of documents vendors can upload for verification
/// </summary>
public enum DocumentType
{
    AadharCard = 1,
    PanCard = 2,
    GstCertificate = 3,
    ShopLicense = 4,
    BankStatement = 5,
    CancelledCheque = 6,
    BusinessRegistration = 7,
    Other = 99
}
