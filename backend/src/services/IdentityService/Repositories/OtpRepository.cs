using IdentityService.Data;
using IdentityService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Repositories;

public interface IOtpRepository
{
    // Phone OTP
    Task<PhoneOtp> CreatePhoneOtpAsync(PhoneOtp phoneOtp);
    Task<PhoneOtp?> GetLatestPhoneOtpAsync(string phoneNumber);
    Task UpdatePhoneOtpAsync(PhoneOtp phoneOtp);
    Task DeleteExpiredPhoneOtpsAsync();
    
    // Email OTP
    Task<EmailOtp> CreateEmailOtpAsync(EmailOtp emailOtp);
    Task<EmailOtp?> GetLatestEmailOtpAsync(string email);
    Task UpdateEmailOtpAsync(EmailOtp emailOtp);
    Task DeleteExpiredEmailOtpsAsync();
}

public class OtpRepository : IOtpRepository
{
    private readonly IdentityServiceDbContext _context;
    private readonly ILogger<OtpRepository> _logger;

    public OtpRepository(IdentityServiceDbContext context, ILogger<OtpRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    // ==================== PHONE OTP ====================

    public async Task<PhoneOtp> CreatePhoneOtpAsync(PhoneOtp phoneOtp)
    {
        phoneOtp.CreatedAt = DateTime.UtcNow;
        _context.PhoneOtps.Add(phoneOtp);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Phone OTP created for: {PhoneNumber}", phoneOtp.PhoneNumber);
        return phoneOtp;
    }

    public async Task<PhoneOtp?> GetLatestPhoneOtpAsync(string phoneNumber)
    {
        return await _context.PhoneOtps
            .Where(o => o.PhoneNumber == phoneNumber && !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task UpdatePhoneOtpAsync(PhoneOtp phoneOtp)
    {
        phoneOtp.UpdatedAt = DateTime.UtcNow;
        _context.PhoneOtps.Update(phoneOtp);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Phone OTP updated for: {PhoneNumber}", phoneOtp.PhoneNumber);
    }

    public async Task DeleteExpiredPhoneOtpsAsync()
    {
        var expiredDate = DateTime.UtcNow.AddHours(-24); // Delete OTPs older than 24 hours
        
        var expiredOtps = await _context.PhoneOtps
            .Where(o => o.CreatedAt < expiredDate)
            .ToListAsync();

        if (expiredOtps.Any())
        {
            _context.PhoneOtps.RemoveRange(expiredOtps);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Deleted {Count} expired phone OTPs", expiredOtps.Count);
        }
    }

    // ==================== EMAIL OTP ====================

    public async Task<EmailOtp> CreateEmailOtpAsync(EmailOtp emailOtp)
    {
        emailOtp.CreatedAt = DateTime.UtcNow;
        _context.EmailOtps.Add(emailOtp);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Email OTP created for: {Email}", emailOtp.Email);
        return emailOtp;
    }

    public async Task<EmailOtp?> GetLatestEmailOtpAsync(string email)
    {
        return await _context.EmailOtps
            .Where(o => o.Email == email && !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateEmailOtpAsync(EmailOtp emailOtp)
    {
        emailOtp.UpdatedAt = DateTime.UtcNow;
        _context.EmailOtps.Update(emailOtp);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Email OTP updated for: {Email}", emailOtp.Email);
    }

    public async Task DeleteExpiredEmailOtpsAsync()
    {
        var expiredDate = DateTime.UtcNow.AddHours(-24); // Delete OTPs older than 24 hours
        
        var expiredOtps = await _context.EmailOtps
            .Where(o => o.CreatedAt < expiredDate)
            .ToListAsync();

        if (expiredOtps.Any())
        {
            _context.EmailOtps.RemoveRange(expiredOtps);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Deleted {Count} expired email OTPs", expiredOtps.Count);
        }
    }
}
