using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RealServ.Shared.Application.Models;
using IdentityService.Models.DTOs;
using IdentityService.Services;
using System.Security.Claims;

namespace IdentityService.Controllers;

/// <summary>
/// Authentication and authorization endpoints
/// </summary>
[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    // ==================== EMAIL/PASSWORD AUTHENTICATION ====================

    /// <summary>
    /// Sign up with email and password
    /// </summary>
    /// <param name="request">Signup request</param>
    /// <returns>Token response with user data</returns>
    [HttpPost("signup")]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 400)]
    public async Task<ActionResult<ApiResponse<TokenResponse>>> SignUp([FromBody] SignUpRequest request)
    {
        try
        {
            var result = await _authService.SignUpWithEmailPasswordAsync(request);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "User signed up successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error signing up user");
            return BadRequest(ApiResponse<TokenResponse>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    /// <param name="request">Login request</param>
    /// <returns>Token response with user data</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 401)]
    public async Task<ActionResult<ApiResponse<TokenResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginWithEmailPasswordAsync(request);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "Login successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging in user");
            return Unauthorized(ApiResponse<TokenResponse>.ErrorResponse(ex.Message));
        }
    }

    // ==================== TOKEN MANAGEMENT ====================

    /// <summary>
    /// Refresh access token
    /// </summary>
    /// <param name="request">Refresh token request</param>
    /// <returns>New access and refresh tokens</returns>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ApiResponse<RefreshTokenResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<RefreshTokenResponse>), 401)]
    public async Task<ActionResult<ApiResponse<RefreshTokenResponse>>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(ApiResponse<RefreshTokenResponse>.SuccessResponse(result, "Token refreshed successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return Unauthorized(ApiResponse<RefreshTokenResponse>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Logout user and revoke refresh tokens
    /// </summary>
    /// <returns>Success response</returns>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<ActionResult<ApiResponse<object>>> Logout()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
            }

            await _authService.LogoutAsync(userId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Logged out successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging out user");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    // ==================== PASSWORD MANAGEMENT ====================

    /// <summary>
    /// Request password reset email
    /// </summary>
    /// <param name="request">Email address</param>
    /// <returns>Success response</returns>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<ActionResult<ApiResponse<object>>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _authService.SendPasswordResetEmailAsync(request.Email);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Password reset email sent"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending password reset email");
            // Don't reveal if email exists or not (security best practice)
            return Ok(ApiResponse<object>.SuccessResponse(null, "If the email exists, a reset link will be sent"));
        }
    }

    /// <summary>
    /// Reset password with OOB code
    /// </summary>
    /// <param name="request">Reset password request</param>
    /// <returns>Success response</returns>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<ActionResult<ApiResponse<object>>> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Password reset successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    // ==================== EMAIL VERIFICATION ====================

    /// <summary>
    /// Verify email with OOB code
    /// </summary>
    /// <param name="request">Verification request</param>
    /// <returns>Success response</returns>
    [HttpPost("verify-email")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<ActionResult<ApiResponse<object>>> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        try
        {
            await _authService.VerifyEmailAsync(request.OobCode);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Email verified successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying email");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Resend email verification
    /// </summary>
    /// <param name="request">Email address</param>
    /// <returns>Success response</returns>
    [HttpPost("resend-verification")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<ActionResult<ApiResponse<object>>> ResendVerification([FromBody] ResendVerificationRequest request)
    {
        try
        {
            await _authService.ResendVerificationEmailAsync(request.Email);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Verification email sent"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resending verification email");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    // ==================== SOCIAL LOGIN ====================

    /// <summary>
    /// Sign in with Google OAuth
    /// </summary>
    /// <param name="request">Google sign-in request</param>
    /// <returns>Token response with user data</returns>
    [HttpPost("google")]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 401)]
    public async Task<ActionResult<ApiResponse<TokenResponse>>> SignInWithGoogle([FromBody] SocialSignInRequest request)
    {
        try
        {
            var result = await _authService.SignInWithGoogleAsync(request);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "Google sign-in successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error signing in with Google");
            return Unauthorized(ApiResponse<TokenResponse>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Sign in with Apple
    /// </summary>
    /// <param name="request">Apple sign-in request</param>
    /// <returns>Token response with user data</returns>
    [HttpPost("apple")]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 401)]
    public async Task<ActionResult<ApiResponse<TokenResponse>>> SignInWithApple([FromBody] SocialSignInRequest request)
    {
        try
        {
            var result = await _authService.SignInWithAppleAsync(request);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "Apple sign-in successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error signing in with Apple");
            return Unauthorized(ApiResponse<TokenResponse>.ErrorResponse(ex.Message));
        }
    }

    // ==================== PHONE OTP ====================

    /// <summary>
    /// Send OTP to phone number
    /// </summary>
    /// <param name="request">Phone number</param>
    /// <returns>Success response</returns>
    [HttpPost("phone/send-otp")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<ActionResult<ApiResponse<object>>> SendPhoneOtp([FromBody] SendOtpRequest request)
    {
        try
        {
            await _authService.SendPhoneOtpAsync(request.PhoneNumber);
            return Ok(ApiResponse<object>.SuccessResponse(null, "OTP sent successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending OTP");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Verify phone OTP and login/signup
    /// </summary>
    /// <param name="request">OTP verification request</param>
    /// <returns>Token response with user data</returns>
    [HttpPost("phone/verify-otp")]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), 400)]
    public async Task<ActionResult<ApiResponse<TokenResponse>>> VerifyPhoneOtp([FromBody] VerifyOtpRequest request)
    {
        try
        {
            var result = await _authService.VerifyPhoneOtpAsync(request);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "OTP verified successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying OTP");
            return BadRequest(ApiResponse<TokenResponse>.ErrorResponse(ex.Message));
        }
    }

    // ==================== LEGACY ENDPOINTS (Keep for backward compatibility) ====================

    /// <summary>
    /// Register a new user (Legacy - use /signup instead)
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), 200)]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Register([FromBody] RegisterUserRequest request)
    {
        try
        {
            var result = await _authService.RegisterUserAsync(request);
            return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "User registered successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user");
            return BadRequest(ApiResponse<LoginResponse>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetCurrentUser()
    {
        try
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var firebaseUidClaim = User.FindFirst("firebase_uid")?.Value;
            
            if (string.IsNullOrEmpty(firebaseUidClaim))
            {
                return Unauthorized(ApiResponse<UserResponse>.ErrorResponse("Invalid token"));
            }

            var result = await _authService.GetCurrentUserAsync(firebaseUidClaim);
            return Ok(ApiResponse<UserResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return BadRequest(ApiResponse<UserResponse>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Verify Firebase token (for testing)
    /// </summary>
    [HttpPost("verify-token")]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    public async Task<ActionResult<ApiResponse<string>>> VerifyToken([FromBody] VerifyTokenRequest request)
    {
        try
        {
            var firebaseUid = await _authService.VerifyFirebaseTokenAsync(request.IdToken);
            return Ok(ApiResponse<string>.SuccessResponse(firebaseUid, "Token verified successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying token");
            return Unauthorized(ApiResponse<string>.ErrorResponse(ex.Message));
        }
    }
}

public class VerifyTokenRequest
{
    public string IdToken { get; set; } = string.Empty;
}
