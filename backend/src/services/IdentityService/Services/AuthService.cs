using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using IdentityService.Models.DTOs;
using IdentityService.Models.Entities;
using IdentityService.Repositories;
using RealServ.Shared.Domain.Enums;
using RealServ.Shared.Domain.Exceptions;
using RealServ.Shared.Observability.Metrics;
using System.Text;
using System.Text.Json;

namespace IdentityService.Services;

public interface IAuthService
{
    // Firebase-based Authentication
    Task<UserResponse> RegisterUserAsync(RegisterUserRequest request);
    Task<UserResponse> GetCurrentUserAsync(string firebaseUid);
    Task<string> VerifyFirebaseTokenAsync(string idToken);
    
    // Email/Password Authentication (Firebase managed)
    Task<FirebaseAuthResponse> SignUpWithEmailPasswordAsync(SignUpRequest request);
    Task<FirebaseAuthResponse> LoginWithEmailPasswordAsync(LoginRequest request);
    
    // Password Management (Firebase managed)
    Task SendPasswordResetEmailAsync(string email);
    
    // Email Verification (Firebase managed)
    Task SendVerificationEmailAsync(string email);
    
    // Social Login (Firebase managed)
    Task<FirebaseAuthResponse> SignInWithSocialAsync(SocialSignInRequest request);
    
    // Phone OTP
    Task SendPhoneOtpAsync(string phoneNumber);
    Task<UserResponse> VerifyPhoneOtpAsync(VerifyOtpRequest request);
    
    // User Management
    Task LogoutAsync(Guid userId);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IBuyerRepository _buyerRepository;
    private readonly IOtpRepository _otpRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly IBusinessMetricsService _metricsService;

    public AuthService(
        IUserRepository userRepository,
        IBuyerRepository buyerRepository,
        IOtpRepository otpRepository,
        IEmailService emailService,
        ILogger<AuthService> logger,
        IConfiguration configuration,
        HttpClient httpClient,
        IBusinessMetricsService metricsService)
    {
        _userRepository = userRepository;
        _buyerRepository = buyerRepository;
        _otpRepository = otpRepository;
        _emailService = emailService;
        _logger = logger;
        _configuration = configuration;
        _httpClient = httpClient;
        _metricsService = metricsService;
    }

    // ==================== FIREBASE REGISTRATION ====================

    public async Task<UserResponse> RegisterUserAsync(RegisterUserRequest request)
    {
        // Check if user already exists
        var existingUser = await _userRepository.GetByFirebaseUidAsync(request.FirebaseUid);
        if (existingUser != null)
        {
            return MapToUserResponse(existingUser);
        }

        // Check if phone number is already registered
        if (await _userRepository.ExistsAsync(request.PhoneNumber))
        {
            throw new ValidationException("PhoneNumber", "Phone number already registered");
        }

        // Create new user
        var user = new User
        {
            FirebaseUid = request.FirebaseUid,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            FullName = request.FullName,
            UserType = request.UserType,
            Status = UserStatus.Active,
            LastLoginAt = DateTime.UtcNow
        };

        user = await _userRepository.CreateAsync(user);

        // Create buyer profile if user type is buyer
        if (request.UserType == UserType.Buyer)
        {
            var buyerProfile = new BuyerProfile
            {
                UserId = user.Id,
                PreferredLanguage = "en",
                IsVerified = false
            };

            await _buyerRepository.CreateAsync(buyerProfile);
            user.BuyerProfile = buyerProfile;
        }

        _logger.LogInformation("User registered successfully: {UserId}, Type: {UserType}", user.Id, user.UserType);

        return MapToUserResponse(user);
    }

    public async Task<UserResponse> GetCurrentUserAsync(string firebaseUid)
    {
        var user = await _userRepository.GetByFirebaseUidAsync(firebaseUid);
        if (user == null)
        {
            throw new NotFoundException("User", firebaseUid);
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return MapToUserResponse(user);
    }

    public async Task<string> VerifyFirebaseTokenAsync(string idToken)
    {
        try
        {
            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
            return decodedToken.Uid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to verify Firebase token");
            throw new UnauthorizedException("Invalid Firebase token");
        }
    }

    // ==================== EMAIL/PASSWORD AUTHENTICATION ====================

    public async Task<FirebaseAuthResponse> SignUpWithEmailPasswordAsync(SignUpRequest request)
    {
        _logger.LogInformation("SignUp request for email: {Email}", request.Email);

        // Check if email already exists in our database
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new ValidationException("Email", "Email already registered");
        }

        // Check if phone number is already registered
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            var existingPhoneUser = await _userRepository.GetByPhoneNumberAsync(request.PhoneNumber);
            if (existingPhoneUser != null)
            {
                throw new ValidationException("PhoneNumber", "Phone number already registered");
            }
        }

        try
        {
            // Create user in Firebase
            var userRecordArgs = new UserRecordArgs
            {
                Email = request.Email,
                Password = request.Password,
                DisplayName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                EmailVerified = false,
                Disabled = false
            };

            var firebaseUser = await FirebaseAuth.DefaultInstance.CreateUserAsync(userRecordArgs);
            _logger.LogInformation("Firebase user created: {FirebaseUid}", firebaseUser.Uid);

            // Create user in our database
            var user = new User
            {
                FirebaseUid = firebaseUser.Uid,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber ?? string.Empty,
                FullName = request.FullName,
                UserType = request.UserType,
                Status = UserStatus.Active,
                EmailVerified = false,
                PhoneVerified = false,
                LastLoginAt = DateTime.UtcNow
            };

            user = await _userRepository.CreateAsync(user);

            // Create buyer profile if user type is buyer
            if (request.UserType == UserType.Buyer)
            {
                var buyerProfile = new BuyerProfile
                {
                    UserId = user.Id,
                    PreferredLanguage = "en",
                    IsVerified = false
                };
                await _buyerRepository.CreateAsync(buyerProfile);
            }

            // Send verification email via Firebase
            await SendVerificationEmailAsync(user.Email!);

            _logger.LogInformation("User signed up successfully: {UserId}", user.Id);

            // Return response - client should use Firebase SDK to get ID token
            return new FirebaseAuthResponse
            {
                Success = true,
                Message = "Signup successful. Please sign in with Firebase SDK to get your token.",
                User = MapToUserResponse(user)
            };
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogError(ex, "Firebase signup failed: {Message}", ex.Message);
            throw new ValidationException("Signup failed: " + ex.Message);
        }
    }

    public async Task<FirebaseAuthResponse> LoginWithEmailPasswordAsync(LoginRequest request)
    {
        _logger.LogInformation("Login request for email: {Email}", request.Email);

        try
        {
            // Firebase REST API for email/password login
            var firebaseApiKey = _configuration["Firebase:ApiKey"];
            var loginUrl = $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebaseApiKey}";

            var loginPayload = new
            {
                email = request.Email,
                password = request.Password,
                returnSecureToken = true
            };

            var content = new StringContent(JsonSerializer.Serialize(loginPayload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(loginUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Firebase login failed: {Error}", errorContent);
                throw new UnauthorizedException("Invalid email or password");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var firebaseResponse = JsonSerializer.Deserialize<FirebaseLoginResponse>(responseContent);

            if (firebaseResponse == null || string.IsNullOrWhiteSpace(firebaseResponse.localId))
            {
                throw new UnauthorizedException("Invalid Firebase response");
            }

            // Get user from database
            var user = await _userRepository.GetByFirebaseUidAsync(firebaseResponse.localId);
            if (user == null)
            {
                // User exists in Firebase but not in our database - should not happen
                throw new NotFoundException("User", firebaseResponse.localId);
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("User logged in successfully: {UserId}", user.Id);

            // Return Firebase tokens to client
            return new FirebaseAuthResponse
            {
                Success = true,
                Message = "Login successful",
                IdToken = firebaseResponse.idToken,
                RefreshToken = firebaseResponse.refreshToken,
                ExpiresIn = firebaseResponse.expiresIn,
                User = MapToUserResponse(user)
            };
        }
        catch (Exception ex) when (ex is not UnauthorizedException && ex is not NotFoundException)
        {
            _logger.LogError(ex, "Login failed: {Message}", ex.Message);
            throw new UnauthorizedException("Login failed");
        }
    }

    // ==================== PASSWORD MANAGEMENT ====================

    public async Task SendPasswordResetEmailAsync(string email)
    {
        _logger.LogInformation("Password reset requested for email: {Email}", email);

        try
        {
            // Generate password reset link using Firebase REST API
            var firebaseApiKey = _configuration["Firebase:ApiKey"];
            var resetUrl = $"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={firebaseApiKey}";

            var resetPayload = new
            {
                requestType = "PASSWORD_RESET",
                email = email
            };

            var content = new StringContent(JsonSerializer.Serialize(resetPayload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(resetUrl, content);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Password reset email sent to: {Email}", email);
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send password reset email: {Error}", errorContent);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email");
        }
    }

    // ==================== EMAIL VERIFICATION ====================

    public async Task SendVerificationEmailAsync(string email)
    {
        _logger.LogInformation("Sending verification email for: {Email}", email);

        try
        {
            // Send verification email using Firebase REST API
            var firebaseApiKey = _configuration["Firebase:ApiKey"];
            var verifyUrl = $"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={firebaseApiKey}";

            var verifyPayload = new
            {
                requestType = "VERIFY_EMAIL",
                email = email
            };

            var content = new StringContent(JsonSerializer.Serialize(verifyPayload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(verifyUrl, content);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Verification email sent to: {Email}", email);
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send verification email: {Error}", errorContent);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send verification email");
        }
    }

    // ==================== SOCIAL LOGIN ====================

    public async Task<FirebaseAuthResponse> SignInWithSocialAsync(SocialSignInRequest request)
    {
        _logger.LogInformation("Social sign-in request");

        try
        {
            // Verify social provider token with Firebase
            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(request.IdToken);
            
            var firebaseUid = decodedToken.Uid;
            var email = decodedToken.Claims.TryGetValue("email", out var emailClaim) 
                ? emailClaim.ToString() 
                : request.Email;
            var name = decodedToken.Claims.TryGetValue("name", out var nameClaim) 
                ? nameClaim.ToString() 
                : request.FullName;

            // Check if user exists
            var user = await _userRepository.GetByFirebaseUidAsync(firebaseUid);
            
            if (user == null)
            {
                // Create new user
                user = new User
                {
                    FirebaseUid = firebaseUid,
                    Email = email,
                    PhoneNumber = request.PhoneNumber ?? string.Empty,
                    FullName = name ?? string.Empty,
                    UserType = request.UserType,
                    Status = UserStatus.Active,
                    EmailVerified = decodedToken.Claims.TryGetValue("email_verified", out var emailVerified) 
                        && Convert.ToBoolean(emailVerified),
                    PhoneVerified = false,
                    LastLoginAt = DateTime.UtcNow
                };

                user = await _userRepository.CreateAsync(user);

                // Create buyer profile if user type is buyer
                if (request.UserType == UserType.Buyer)
                {
                    var buyerProfile = new BuyerProfile
                    {
                        UserId = user.Id,
                        PreferredLanguage = "en",
                        IsVerified = false
                    };
                    await _buyerRepository.CreateAsync(buyerProfile);
                }

                _logger.LogInformation("New user created via social login: {UserId}", user.Id);
            }
            else
            {
                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);
                _logger.LogInformation("Existing user logged in via social: {UserId}", user.Id);
            }

            return new FirebaseAuthResponse
            {
                Success = true,
                Message = "Social sign-in successful",
                IdToken = request.IdToken,
                User = MapToUserResponse(user)
            };
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogError(ex, "Social sign-in failed: {Message}", ex.Message);
            throw new UnauthorizedException("Invalid social auth token");
        }
    }

    // ==================== PHONE OTP ====================

    public async Task SendPhoneOtpAsync(string phoneNumber)
    {
        _logger.LogInformation("Send OTP request for phone: {PhoneNumber}", phoneNumber);

        // Validate phone number format (should be E.164 format: +91XXXXXXXXXX)
        if (!phoneNumber.StartsWith("+"))
        {
            throw new ValidationException("PhoneNumber", "Phone number must be in E.164 format (e.g., +911234567890)");
        }

        // Generate 6-digit OTP
        var random = new Random();
        var otpCode = random.Next(100000, 999999).ToString();

        // Save OTP to database
        var phoneOtp = new PhoneOtp
        {
            PhoneNumber = phoneNumber,
            OtpCode = otpCode,
            ExpiresAt = DateTime.UtcNow.AddMinutes(5),
            IsVerified = false,
            AttemptCount = 0
        };

        await _otpRepository.CreatePhoneOtpAsync(phoneOtp);

        // TODO: Send OTP via WhatsApp/SMS
        // For now, just log it (in production, integrate with Twilio/WhatsApp Business API)
        _logger.LogWarning("OTP Code for {PhoneNumber}: {OtpCode} (REMOVE THIS LOG IN PRODUCTION)", phoneNumber, otpCode);

        _logger.LogInformation("OTP sent to phone: {PhoneNumber}", phoneNumber);
    }

    public async Task<UserResponse> VerifyPhoneOtpAsync(VerifyOtpRequest request)
    {
        _logger.LogInformation("Verify OTP request for phone: {PhoneNumber}", request.PhoneNumber);

        // Get OTP from database
        var phoneOtp = await _otpRepository.GetLatestPhoneOtpAsync(request.PhoneNumber);
        
        if (phoneOtp == null)
        {
            throw new ValidationException("No OTP found for this phone number");
        }

        // Check if OTP is expired
        if (phoneOtp.ExpiresAt < DateTime.UtcNow)
        {
            throw new ValidationException("OTP has expired");
        }

        // Check if OTP is already verified
        if (phoneOtp.IsVerified)
        {
            throw new ValidationException("OTP already used");
        }

        // Check max attempts
        if (phoneOtp.AttemptCount >= 3)
        {
            throw new ValidationException("Maximum OTP verification attempts exceeded");
        }

        // Verify OTP code
        if (phoneOtp.OtpCode != request.OtpCode)
        {
            // Increment attempt count
            phoneOtp.AttemptCount++;
            await _otpRepository.UpdatePhoneOtpAsync(phoneOtp);
            
            throw new ValidationException("Invalid OTP code");
        }

        // Mark OTP as verified
        phoneOtp.IsVerified = true;
        phoneOtp.VerifiedAt = DateTime.UtcNow;
        await _otpRepository.UpdatePhoneOtpAsync(phoneOtp);

        // Check if user exists with this phone number
        var user = await _userRepository.GetByPhoneNumberAsync(request.PhoneNumber);

        if (user == null)
        {
            // Create Firebase user with phone number
            var userRecordArgs = new UserRecordArgs
            {
                PhoneNumber = request.PhoneNumber,
                Disabled = false
            };

            var firebaseUser = await FirebaseAuth.DefaultInstance.CreateUserAsync(userRecordArgs);

            // Create new user in our database
            user = new User
            {
                FirebaseUid = firebaseUser.Uid,
                PhoneNumber = request.PhoneNumber,
                Email = null,
                FullName = null,
                UserType = request.UserType,
                Status = UserStatus.Active,
                EmailVerified = false,
                PhoneVerified = true,
                LastLoginAt = DateTime.UtcNow
            };

            user = await _userRepository.CreateAsync(user);

            // Create buyer profile if user type is buyer
            if (request.UserType == UserType.Buyer)
            {
                var buyerProfile = new BuyerProfile
                {
                    UserId = user.Id,
                    PreferredLanguage = "en",
                    IsVerified = false
                };
                await _buyerRepository.CreateAsync(buyerProfile);
            }

            _logger.LogInformation("New user created via phone OTP: {UserId}", user.Id);
        }
        else
        {
            // Update phone verified and last login
            user.PhoneVerified = true;
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            
            _logger.LogInformation("Existing user logged in via phone OTP: {UserId}", user.Id);
        }

        // Note: Client should use Firebase Phone Auth to get Firebase ID token
        return MapToUserResponse(user);
    }

    // ==================== USER MANAGEMENT ====================

    public async Task LogoutAsync(Guid userId)
    {
        _logger.LogInformation("Logout request for user: {UserId}", userId);
        // With Firebase, logout is handled client-side
        // We can log the event here for audit purposes
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            _logger.LogInformation("User logged out: {UserId}", userId);
        }
    }

    // ==================== HELPER METHODS ====================

    private UserResponse MapToUserResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            FirebaseUid = user.FirebaseUid,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            FullName = user.FullName,
            UserType = user.UserType,
            Status = user.Status,
            LastLoginAt = user.LastLoginAt,
            ProfileImageUrl = user.ProfileImageUrl,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}

// Firebase API response models
internal class FirebaseLoginResponse
{
    public string localId { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string idToken { get; set; } = string.Empty;
    public string refreshToken { get; set; } = string.Empty;
    public int expiresIn { get; set; }
}

// Response DTO for Firebase auth operations
public class FirebaseAuthResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? IdToken { get; set; }
    public string? RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
    public UserResponse? User { get; set; }
}