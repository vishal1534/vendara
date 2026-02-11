using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RealServ.Shared.Application.Models;
using IdentityService.Models.DTOs;
using IdentityService.Services;
using System.Security.Claims;

namespace IdentityService.Controllers;

/// <summary>
/// Authentication and authorization endpoints - Firebase Auth Only
/// All token management is handled by Firebase
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
    /// Sign up with email and password (Firebase Auth)
    /// Client should then use Firebase SDK to sign in and get ID token
    /// </summary>
    [HttpPost("signup")]
    [ProducesResponseType(typeof(ApiResponse<FirebaseAuthResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<FirebaseAuthResponse>), 400)]
    public async Task<ActionResult<ApiResponse<FirebaseAuthResponse>>> SignUp([FromBody] SignUpRequest request)
    {
        try
        {
            var result = await _authService.SignUpWithEmailPasswordAsync(request);
            return Ok(ApiResponse<FirebaseAuthResponse>.SuccessResponse(result, "User signed up successfully. Use Firebase SDK to get your ID token."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error signing up user");
            return BadRequest(ApiResponse<FirebaseAuthResponse>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Login with email and password (Firebase Auth)
    /// Returns Firebase ID token and refresh token
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<FirebaseAuthResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<FirebaseAuthResponse>), 401)]
    public async Task<ActionResult<ApiResponse<FirebaseAuthResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginWithEmailPasswordAsync(request);
            return Ok(ApiResponse<FirebaseAuthResponse>.SuccessResponse(result, "Login successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging in user");
            return Unauthorized(ApiResponse<FirebaseAuthResponse>.ErrorResponse(ex.Message));
        }
    }

    // ==================== TOKEN REFRESH (Firebase SDK) ====================

    /// <summary>
    /// Token refresh is handled by Firebase SDK client-side
    /// This endpoint is for documentation purposes only
    /// 
    /// Client should use Firebase SDK:
    /// const user = firebase.auth().currentUser;
    /// const idToken = await user.getIdToken(true); // force refresh
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public ActionResult<ApiResponse<object>> RefreshToken()
    {
        return Ok(ApiResponse<object>.SuccessResponse(
            new { message = "Token refresh is handled by Firebase SDK. Call user.getIdToken(true) on client." },
            "Use Firebase SDK for token refresh"
        ));
    }

    // ==================== LOGOUT ====================

    /// <summary>
    /// Logout user (audit log only - actual logout is Firebase client-side)
    /// </summary>
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
            return Ok(ApiResponse<object>.SuccessResponse(null, "Logged out successfully. Clear Firebase auth on client."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging out user");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    // ==================== PASSWORD MANAGEMENT ====================

    /// <summary>
    /// Request password reset email (Firebase Auth)
    /// </summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<ActionResult<ApiResponse<object>>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _authService.SendPasswordResetEmailAsync(request.Email);
            return Ok(ApiResponse<object>.SuccessResponse(null, "If the email exists, a password reset link will be sent"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending password reset email");
            // Don't reveal if email exists or not (security best practice)
            return Ok(ApiResponse<object>.SuccessResponse(null, "If the email exists, a password reset link will be sent"));
        }
    }

    /// <summary>
    /// Password reset is handled by Firebase via email link
    /// No backend endpoint needed - user clicks link in email
    /// </summary>
    [HttpGet("reset-password-info")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public ActionResult<ApiResponse<object>> ResetPasswordInfo()
    {
        return Ok(ApiResponse<object>.SuccessResponse(
            new { message = "Password reset is handled via Firebase email link. User clicks link to reset password." },
            "Password reset via Firebase"
        ));
    }

    // ==================== EMAIL VERIFICATION ====================

    /// <summary>
    /// Resend email verification (Firebase Auth)
    /// </summary>
    [HttpPost("resend-verification")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<ActionResult<ApiResponse<object>>> ResendVerification([FromBody] ResendVerificationRequest request)
    {
        try
        {
            await _authService.SendVerificationEmailAsync(request.Email);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Verification email sent"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resending verification email");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Email verification is handled by Firebase via email link
    /// No backend endpoint needed - user clicks link in email
    /// </summary>
    [HttpGet("verify-email-info")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public ActionResult<ApiResponse<object>> VerifyEmailInfo()
    {
        return Ok(ApiResponse<object>.SuccessResponse(
            new { message = "Email verification is handled via Firebase email link. User clicks link to verify." },
            "Email verification via Firebase"
        ));
    }

    // ==================== SOCIAL LOGIN ====================

    /// <summary>
    /// Sign in with Google/Apple (Firebase Auth)
    /// Client should use Firebase SDK for social auth, then call this to create user in our DB
    /// </summary>
    [HttpPost("social")]
    [ProducesResponseType(typeof(ApiResponse<FirebaseAuthResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<FirebaseAuthResponse>), 401)]
    public async Task<ActionResult<ApiResponse<FirebaseAuthResponse>>> SignInWithSocial([FromBody] SocialSignInRequest request)
    {
        try
        {
            var result = await _authService.SignInWithSocialAsync(request);
            return Ok(ApiResponse<FirebaseAuthResponse>.SuccessResponse(result, "Social sign-in successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error signing in with social provider");
            return Unauthorized(ApiResponse<FirebaseAuthResponse>.ErrorResponse(ex.Message));
        }
    }

    // ==================== PHONE OTP ====================

    /// <summary>
    /// Send OTP to phone number
    /// </summary>
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
    /// Returns user info - client should then use Firebase Phone Auth to get ID token
    /// </summary>
    [HttpPost("phone/verify-otp")]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), 400)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> VerifyPhoneOtp([FromBody] VerifyOtpRequest request)
    {
        try
        {
            var result = await _authService.VerifyPhoneOtpAsync(request);
            return Ok(ApiResponse<UserResponse>.SuccessResponse(result, "OTP verified. Use Firebase Phone Auth to get your ID token."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying OTP");
            return BadRequest(ApiResponse<UserResponse>.ErrorResponse(ex.Message));
        }
    }

    // ==================== CURRENT USER ====================

    /// <summary>
    /// Get current user profile
    /// Requires Firebase ID token in Authorization header: Bearer {firebase-id-token}
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetCurrentUser()
    {
        try
        {
            // Extract Firebase UID from JWT token (set by Firebase auth middleware)
            var firebaseUidClaim = User.FindFirst("user_id")?.Value ?? User.FindFirst("firebase_uid")?.Value;
            
            if (string.IsNullOrEmpty(firebaseUidClaim))
            {
                return Unauthorized(ApiResponse<UserResponse>.ErrorResponse("Invalid Firebase token"));
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

    // ==================== LEGACY/COMPATIBILITY ====================

    /// <summary>
    /// Register a new user (Legacy - for backward compatibility)
    /// Requires Firebase UID from prior Firebase authentication
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Register([FromBody] RegisterUserRequest request)
    {
        try
        {
            var result = await _authService.RegisterUserAsync(request);
            return Ok(ApiResponse<UserResponse>.SuccessResponse(result, "User registered successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user");
            return BadRequest(ApiResponse<UserResponse>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Verify Firebase ID token (for testing/debugging)
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
