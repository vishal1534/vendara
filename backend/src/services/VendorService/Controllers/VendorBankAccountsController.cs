using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorService.Models.Authorization;
using VendorService.Models.Entities;
using VendorService.Models.Requests;
using VendorService.Models.Responses;
using VendorService.Repositories;
using VendorService.Services;
using System.Security.Claims;

namespace VendorService.Controllers;

/// <summary>
/// Vendor bank accounts management controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}/bank-accounts")]
[Authorize]
public class VendorBankAccountsController : ControllerBase
{
    private readonly IVendorBankAccountRepository _bankAccountRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly ILogger<VendorBankAccountsController> _logger;

    public VendorBankAccountsController(
        IVendorBankAccountRepository bankAccountRepository,
        IVendorRepository vendorRepository,
        ICachingService cache,
        ILogger<VendorBankAccountsController> logger)
    {
        _bankAccountRepository = bankAccountRepository;
        _vendorRepository = vendorRepository;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Get all bank accounts for a vendor
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetBankAccounts(Guid vendorId)
    {
        if (!await CanAccessVendor(vendorId))
            return Forbid();

        var accounts = await _bankAccountRepository.GetByVendorIdAsync(vendorId);
        var response = accounts.Select(MapToResponse);

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Get specific bank account
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetBankAccount(Guid vendorId, Guid id)
    {
        if (!await CanAccessVendor(vendorId))
            return Forbid();

        var account = await _bankAccountRepository.GetByIdAsync(id);
        
        if (account == null || account.VendorId != vendorId)
            return NotFound(new { success = false, message = "Bank account not found" });

        return Ok(new { success = true, data = MapToResponse(account) });
    }

    /// <summary>
    /// Add a new bank account
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> AddBankAccount(Guid vendorId, [FromBody] CreateBankAccountRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        // If setting as primary, unset other primary accounts
        if (request.IsPrimary)
        {
            await _bankAccountRepository.UnsetPrimaryForVendorAsync(vendorId);
        }

        var account = new VendorBankAccount
        {
            Id = Guid.NewGuid(),
            VendorId = vendorId,
            AccountHolderName = request.AccountHolderName,
            AccountNumber = request.AccountNumber,
            IfscCode = request.IfscCode,
            BankName = request.BankName,
            BranchName = request.BranchName,
            AccountType = request.AccountType,
            IsPrimary = request.IsPrimary,
            IsVerified = false
        };

        var created = await _bankAccountRepository.CreateAsync(account);
        
        // Invalidate vendor cache
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Bank account added for Vendor: {VendorId}", vendorId);

        return CreatedAtAction(
            nameof(GetBankAccount),
            new { vendorId, id = created.Id },
            new { success = true, data = MapToResponse(created) });
    }

    /// <summary>
    /// Verify a bank account (Admin only)
    /// </summary>
    [HttpPatch("{id}/verify")]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> VerifyBankAccount(Guid vendorId, Guid id)
    {
        var account = await _bankAccountRepository.GetByIdAsync(id);
        if (account == null || account.VendorId != vendorId)
            return NotFound(new { success = false, message = "Bank account not found" });

        account.IsVerified = true;
        account.VerifiedAt = DateTime.UtcNow;

        await _bankAccountRepository.UpdateAsync(account);
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Bank account verified: {AccountId} for Vendor: {VendorId}", id, vendorId);

        return Ok(new { success = true, data = MapToResponse(account) });
    }

    /// <summary>
    /// Set bank account as primary
    /// </summary>
    [HttpPatch("{id}/set-primary")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> SetPrimaryAccount(Guid vendorId, Guid id)
    {
        if (!await CanManageVendor(vendorId))
            return Forbid();

        var account = await _bankAccountRepository.GetByIdAsync(id);
        if (account == null || account.VendorId != vendorId)
            return NotFound(new { success = false, message = "Bank account not found" });

        // Unset other primary accounts
        await _bankAccountRepository.UnsetPrimaryForVendorAsync(vendorId);

        // Set this as primary
        account.IsPrimary = true;
        await _bankAccountRepository.UpdateAsync(account);
        await _cache.RemoveAsync($"vendor:{vendorId}");

        return Ok(new { success = true, data = MapToResponse(account) });
    }

    /// <summary>
    /// Delete a bank account
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> DeleteBankAccount(Guid vendorId, Guid id)
    {
        if (!await CanManageVendor(vendorId))
            return Forbid();

        var account = await _bankAccountRepository.GetByIdAsync(id);
        if (account == null || account.VendorId != vendorId)
            return NotFound(new { success = false, message = "Bank account not found" });

        // Don't allow deleting verified primary account
        if (account.IsPrimary && account.IsVerified)
        {
            return BadRequest(new { 
                success = false, 
                message = "Cannot delete verified primary account. Set another account as primary first." 
            });
        }

        await _bankAccountRepository.DeleteAsync(id);
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Bank account deleted: {AccountId} for Vendor: {VendorId}", id, vendorId);

        return Ok(new { success = true, message = "Bank account deleted successfully" });
    }

    private VendorBankAccountResponse MapToResponse(VendorBankAccount account)
    {
        return new VendorBankAccountResponse
        {
            Id = account.Id,
            VendorId = account.VendorId,
            AccountHolderName = account.AccountHolderName,
            AccountNumberMasked = MaskAccountNumber(account.AccountNumber),
            IfscCode = account.IfscCode,
            BankName = account.BankName,
            BranchName = account.BranchName,
            AccountType = account.AccountType,
            IsPrimary = account.IsPrimary,
            IsVerified = account.IsVerified,
            VerifiedAt = account.VerifiedAt,
            CreatedAt = account.CreatedAt
        };
    }

    private string MaskAccountNumber(string accountNumber)
    {
        if (string.IsNullOrEmpty(accountNumber) || accountNumber.Length <= 4)
            return "****";

        return $"****{accountNumber.Substring(accountNumber.Length - 4)}";
    }

    private async Task<bool> CanAccessVendor(Guid vendorId)
    {
        if (User.IsInRole(UserRoles.Admin))
            return true;

        var userId = GetUserIdFromClaims();
        var vendor = await _vendorRepository.GetByIdAsync(vendorId);
        return vendor != null && vendor.UserId == userId;
    }

    private async Task<bool> CanManageVendor(Guid vendorId)
    {
        if (User.IsInRole(UserRoles.Admin))
            return true;

        var userId = GetUserIdFromClaims();
        var vendor = await _vendorRepository.GetByIdAsync(vendorId);
        return vendor != null && vendor.UserId == userId;
    }

    private Guid GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("user_id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}
