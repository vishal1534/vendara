using RealServ.Shared.Domain.Enums;

namespace IdentityService.Models.DTOs;

/// <summary>
/// Request to register a new user
/// </summary>
public class RegisterUserRequest
{
    public string FirebaseUid { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public UserType UserType { get; set; }
}

/// <summary>
/// User response DTO
/// </summary>
public class UserResponse
{
    public Guid Id { get; set; }
    public string FirebaseUid { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public UserType UserType { get; set; }
    public UserStatus Status { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? ProfileImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Update user request
/// </summary>
public class UpdateUserRequest
{
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? ProfileImageUrl { get; set; }
}

/// <summary>
/// Create buyer profile request
/// </summary>
public class CreateBuyerProfileRequest
{
    public Guid UserId { get; set; }
    public string? BusinessName { get; set; }
    public string PreferredLanguage { get; set; } = "en";
}

/// <summary>
/// Buyer profile DTO
/// </summary>
public class BuyerProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? BusinessName { get; set; }
    public string PreferredLanguage { get; set; } = "en";
    public bool IsVerified { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Update buyer profile request
/// </summary>
public class UpdateBuyerProfileRequest
{
    public string? BusinessName { get; set; }
    public string? PreferredLanguage { get; set; }
}

/// <summary>
/// Create delivery address request
/// </summary>
public class CreateDeliveryAddressRequest
{
    public string Label { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsDefault { get; set; } = false;
}

/// <summary>
/// Delivery address DTO
/// </summary>
public class DeliveryAddressDto
{
    public Guid Id { get; set; }
    public Guid BuyerProfileId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Update delivery address request
/// </summary>
public class UpdateDeliveryAddressRequest
{
    public string? Label { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Pincode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool? IsDefault { get; set; }
}

/// <summary>
/// Create admin profile request
/// </summary>
public class CreateAdminProfileRequest
{
    public Guid UserId { get; set; }
    public string Role { get; set; } = "admin";
    public List<string> Permissions { get; set; } = new();
}

/// <summary>
/// Admin profile DTO
/// </summary>
public class AdminProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Role { get; set; } = "admin";
    public List<string> Permissions { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Verify phone OTP request
/// </summary>
public class VerifyPhoneRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
}

/// <summary>
/// Login response with token
/// </summary>
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserResponse User { get; set; } = null!;
    public BuyerProfileDto? BuyerProfile { get; set; }
    public AdminProfileDto? AdminProfile { get; set; }
}

/// <summary>
/// Email/Password signup request
/// </summary>
public class SignUpRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserType UserType { get; set; }
}

/// <summary>
/// Email/Password login request
/// </summary>
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Social sign-in request (Google, Apple)
/// </summary>
public class SocialSignInRequest
{
    public string IdToken { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public UserType UserType { get; set; }
    public string Provider { get; set; } = string.Empty; // "google", "apple"
}

/// <summary>
/// Forgot password request
/// </summary>
public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}

/// <summary>
/// Reset password request
/// </summary>
public class ResetPasswordRequest
{
    public string Email { get; set; } = string.Empty;
    public string OobCode { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

/// <summary>
/// Verify email request
/// </summary>
public class VerifyEmailRequest
{
    public string OobCode { get; set; } = string.Empty;
}

/// <summary>
/// Resend verification email request
/// </summary>
public class ResendVerificationRequest
{
    public string Email { get; set; } = string.Empty;
}

/// <summary>
/// Refresh token request
/// </summary>
public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>
/// Refresh token response
/// </summary>
public class RefreshTokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
}

/// <summary>
/// Send OTP request
/// </summary>
public class SendOtpRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
}

/// <summary>
/// Verify OTP request
/// </summary>
public class VerifyOtpRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
    public UserType UserType { get; set; }
}

/// <summary>
/// Token response with refresh token
/// </summary>
public class TokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public UserResponse User { get; set; } = null!;
    public BuyerProfileDto? BuyerProfile { get; set; }
    public AdminProfileDto? AdminProfile { get; set; }
}