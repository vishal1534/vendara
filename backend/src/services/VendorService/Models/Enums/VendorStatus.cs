namespace VendorService.Models.Enums;

/// <summary>
/// Vendor account status
/// </summary>
public enum VendorStatus
{
    PendingVerification = 0,
    Active = 1,
    Suspended = 2,
    Rejected = 3,
    Inactive = 4
}
