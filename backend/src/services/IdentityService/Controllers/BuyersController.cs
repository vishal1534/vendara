using Microsoft.AspNetCore.Mvc;
using RealServ.Shared.Application.Models;
using IdentityService.Models.DTOs;
using IdentityService.Services;
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

namespace IdentityService.Controllers;

[ApiController]
[Route("api/v1/buyers")]
public class BuyersController : ControllerBase
{
    private readonly IBuyerService _buyerService;
    private readonly ILogger<BuyersController> _logger;

    public BuyersController(IBuyerService buyerService, ILogger<BuyersController> logger)
    {
        _buyerService = buyerService;
        _logger = logger;
    }

    /// <summary>
    /// Get buyer profile by ID (Admin/Support access)
    /// </summary>
    [HttpGet("{id}")]
    [RequirePermission("buyers:read")]
    public async Task<ActionResult<ApiResponse<BuyerProfileDto>>> GetBuyerProfile(Guid id)
    {
        try
        {
            var result = await _buyerService.GetBuyerProfileAsync(id);
            return Ok(ApiResponse<BuyerProfileDto>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting buyer profile {Id}", id);
            return NotFound(ApiResponse<BuyerProfileDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Get buyer profile by user ID (own profile or admin)
    /// </summary>
    [HttpGet("user/{userId}")]
    [RequirePermission("buyers:read:own")]
    public async Task<ActionResult<ApiResponse<BuyerProfileDto>>> GetBuyerProfileByUserId(Guid userId)
    {
        try
        {
            // Enforce ownership - buyer can only access their own profile
            var ownershipCheck = this.EnforceOwnershipOrAdmin(userId);
            if (ownershipCheck != null) return ownershipCheck;
            
            var result = await _buyerService.GetBuyerProfileByUserIdAsync(userId);
            return Ok(ApiResponse<BuyerProfileDto>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting buyer profile for user {UserId}", userId);
            return NotFound(ApiResponse<BuyerProfileDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Create a new buyer profile (typically called after registration)
    /// </summary>
    [HttpPost]
    [RequirePermission("buyers:create")]
    public async Task<ActionResult<ApiResponse<BuyerProfileDto>>> CreateBuyerProfile([FromBody] CreateBuyerProfileRequest request)
    {
        try
        {
            var result = await _buyerService.CreateBuyerProfileAsync(request);
            return CreatedAtAction(nameof(GetBuyerProfile), new { id = result.Id }, 
                ApiResponse<BuyerProfileDto>.SuccessResponse(result, "Buyer profile created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating buyer profile");
            return BadRequest(ApiResponse<BuyerProfileDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Update buyer profile (own profile or admin)
    /// </summary>
    [HttpPut("{id}")]
    [RequirePermission("buyers:update:own")]
    public async Task<ActionResult<ApiResponse<BuyerProfileDto>>> UpdateBuyerProfile(Guid id, [FromBody] UpdateBuyerProfileRequest request)
    {
        try
        {
            // Get the buyer profile to check user ID
            var existingProfile = await _buyerService.GetBuyerProfileAsync(id);
            
            // Enforce ownership - buyer can only update their own profile
            var ownershipCheck = this.EnforceOwnershipOrAdmin(existingProfile.UserId);
            if (ownershipCheck != null) return ownershipCheck;
            
            var result = await _buyerService.UpdateBuyerProfileAsync(id, request);
            return Ok(ApiResponse<BuyerProfileDto>.SuccessResponse(result, "Buyer profile updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating buyer profile {Id}", id);
            return BadRequest(ApiResponse<BuyerProfileDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Get delivery addresses for a buyer (own addresses or admin)
    /// </summary>
    [HttpGet("{buyerProfileId}/addresses")]
    [RequirePermission("buyers:read:own")]
    public async Task<ActionResult<ApiResponse<List<DeliveryAddressDto>>>> GetDeliveryAddresses(Guid buyerProfileId)
    {
        try
        {
            // Get the buyer profile to check user ID
            var profile = await _buyerService.GetBuyerProfileAsync(buyerProfileId);
            
            // Enforce ownership
            var ownershipCheck = this.EnforceOwnershipOrAdmin(profile.UserId);
            if (ownershipCheck != null) return ownershipCheck;
            
            var result = await _buyerService.GetDeliveryAddressesAsync(buyerProfileId);
            return Ok(ApiResponse<List<DeliveryAddressDto>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting delivery addresses for buyer {BuyerProfileId}", buyerProfileId);
            return BadRequest(ApiResponse<List<DeliveryAddressDto>>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Get a specific delivery address (own address or admin)
    /// </summary>
    [HttpGet("{buyerProfileId}/addresses/{addressId}")]
    [RequirePermission("buyers:read:own")]
    public async Task<ActionResult<ApiResponse<DeliveryAddressDto>>> GetDeliveryAddress(Guid buyerProfileId, Guid addressId)
    {
        try
        {
            // Get the buyer profile to check user ID
            var profile = await _buyerService.GetBuyerProfileAsync(buyerProfileId);
            
            // Enforce ownership
            var ownershipCheck = this.EnforceOwnershipOrAdmin(profile.UserId);
            if (ownershipCheck != null) return ownershipCheck;
            
            var result = await _buyerService.GetDeliveryAddressAsync(addressId);
            return Ok(ApiResponse<DeliveryAddressDto>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting delivery address {AddressId}", addressId);
            return NotFound(ApiResponse<DeliveryAddressDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Create a new delivery address (own address only)
    /// </summary>
    [HttpPost("{buyerProfileId}/addresses")]
    [RequirePermission("buyers:update:own")]
    public async Task<ActionResult<ApiResponse<DeliveryAddressDto>>> CreateDeliveryAddress(
        Guid buyerProfileId, 
        [FromBody] CreateDeliveryAddressRequest request)
    {
        try
        {
            // Get the buyer profile to check user ID
            var profile = await _buyerService.GetBuyerProfileAsync(buyerProfileId);
            
            // Enforce ownership
            var ownershipCheck = this.EnforceOwnershipOrAdmin(profile.UserId);
            if (ownershipCheck != null) return ownershipCheck;
            
            var result = await _buyerService.CreateDeliveryAddressAsync(buyerProfileId, request);
            return CreatedAtAction(nameof(GetDeliveryAddress), 
                new { buyerProfileId, addressId = result.Id }, 
                ApiResponse<DeliveryAddressDto>.SuccessResponse(result, "Delivery address created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating delivery address for buyer {BuyerProfileId}", buyerProfileId);
            return BadRequest(ApiResponse<DeliveryAddressDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Update a delivery address (own address only)
    /// </summary>
    [HttpPut("{buyerProfileId}/addresses/{addressId}")]
    [RequirePermission("buyers:update:own")]
    public async Task<ActionResult<ApiResponse<DeliveryAddressDto>>> UpdateDeliveryAddress(
        Guid buyerProfileId,
        Guid addressId,
        [FromBody] UpdateDeliveryAddressRequest request)
    {
        try
        {
            // Get the buyer profile to check user ID
            var profile = await _buyerService.GetBuyerProfileAsync(buyerProfileId);
            
            // Enforce ownership
            var ownershipCheck = this.EnforceOwnershipOrAdmin(profile.UserId);
            if (ownershipCheck != null) return ownershipCheck;
            
            var result = await _buyerService.UpdateDeliveryAddressAsync(addressId, request);
            return Ok(ApiResponse<DeliveryAddressDto>.SuccessResponse(result, "Delivery address updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating delivery address {AddressId}", addressId);
            return BadRequest(ApiResponse<DeliveryAddressDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Delete a delivery address (own address only)
    /// </summary>
    [HttpDelete("{buyerProfileId}/addresses/{addressId}")]
    [RequirePermission("buyers:update:own")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteDeliveryAddress(Guid buyerProfileId, Guid addressId)
    {
        try
        {
            // Get the buyer profile to check user ID
            var profile = await _buyerService.GetBuyerProfileAsync(buyerProfileId);
            
            // Enforce ownership
            var ownershipCheck = this.EnforceOwnershipOrAdmin(profile.UserId);
            if (ownershipCheck != null) return ownershipCheck;
            
            await _buyerService.DeleteDeliveryAddressAsync(addressId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Delivery address deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting delivery address {AddressId}", addressId);
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Set default delivery address (own address only)
    /// </summary>
    [HttpPost("{buyerProfileId}/addresses/{addressId}/set-default")]
    [RequirePermission("buyers:update:own")]
    public async Task<ActionResult<ApiResponse<object>>> SetDefaultAddress(Guid buyerProfileId, Guid addressId)
    {
        try
        {
            // Get the buyer profile to check user ID
            var profile = await _buyerService.GetBuyerProfileAsync(buyerProfileId);
            
            // Enforce ownership
            var ownershipCheck = this.EnforceOwnershipOrAdmin(profile.UserId);
            if (ownershipCheck != null) return ownershipCheck;
            
            await _buyerService.SetDefaultAddressAsync(buyerProfileId, addressId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Default address set successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting default address {AddressId}", addressId);
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }
}