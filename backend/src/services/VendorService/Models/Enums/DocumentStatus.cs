namespace VendorService.Models.Enums;

/// <summary>
/// Status of document verification
/// </summary>
public enum DocumentStatus
{
    Pending = 0,
    Verified = 1,
    Rejected = 2,
    Expired = 3
}
