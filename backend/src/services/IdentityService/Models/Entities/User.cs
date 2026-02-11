using RealServ.Shared.Domain.Entities;
using RealServ.Shared.Domain.Enums;

namespace IdentityService.Models.Entities;

/// <summary>
/// Core user entity
/// </summary>
public class User : AuditableEntity
{
    public string FirebaseUid { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public UserType UserType { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Active;
    public DateTime? LastLoginAt { get; set; }
    public string? ProfileImageUrl { get; set; }
    public bool EmailVerified { get; set; } = false;
    public bool PhoneVerified { get; set; } = false;

    // Navigation properties
    public BuyerProfile? BuyerProfile { get; set; }
    public AdminProfile? AdminProfile { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

/// <summary>
/// Buyer-specific profile
/// </summary>
public class BuyerProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public string? BusinessName { get; set; }
    public string? PreferredLanguage { get; set; } = "en";
    public bool IsVerified { get; set; } = false;

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<DeliveryAddress> DeliveryAddresses { get; set; } = new List<DeliveryAddress>();
}

/// <summary>
/// Delivery address for buyers
/// </summary>
public class DeliveryAddress : BaseEntity
{
    public Guid BuyerProfileId { get; set; }
    public string Label { get; set; } = string.Empty; // e.g., "Home", "Construction Site 1"
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsDefault { get; set; } = false;

    // Navigation properties
    public BuyerProfile BuyerProfile { get; set; } = null!;
}

/// <summary>
/// Admin-specific profile
/// DEPRECATED: Use UserRoles with RBAC instead
/// Kept for backward compatibility during migration
/// </summary>
public class AdminProfile : BaseEntity
{
    public Guid UserId { get; set; }
    [Obsolete("Use UserRoles with RBAC instead")]
    public string Role { get; set; } = "admin"; // admin, super_admin
    [Obsolete("Use RolePermissions with RBAC instead")]
    public List<string> Permissions { get; set; } = new();

    // Navigation properties
    public User User { get; set; } = null!;
}

/// <summary>
/// User session tracking
/// </summary>
public class UserSession : BaseEntity
{
    public Guid UserId { get; set; }
    public string DeviceId { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty; // mobile, web
    public string? FcmToken { get; set; }
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public User User { get; set; } = null!;
}

/// <summary>
/// Phone OTP for authentication
/// </summary>
public class PhoneOtp : BaseEntity
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsVerified { get; set; } = false;
    public int AttemptCount { get; set; } = 0;
    public DateTime? VerifiedAt { get; set; }
}

/// <summary>
/// Email OTP for verification
/// </summary>
public class EmailOtp : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsVerified { get; set; } = false;
    public int AttemptCount { get; set; } = 0;
    public DateTime? VerifiedAt { get; set; }
}

// UserRole moved to Role.cs - remove duplicate