using Microsoft.AspNetCore.Mvc;
using OrderService.Models.DTOs;
using OrderService.Models.Entities;
using OrderService.Repositories;

namespace OrderService.Controllers;

[ApiController]
[Route("api/v1/delivery-addresses")]
public class DeliveryAddressesController : ControllerBase
{
    private readonly IDeliveryAddressRepository _addressRepository;
    private readonly ILogger<DeliveryAddressesController> _logger;

    public DeliveryAddressesController(
        IDeliveryAddressRepository addressRepository,
        ILogger<DeliveryAddressesController> logger)
    {
        _addressRepository = addressRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get delivery address by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAddress(Guid id)
    {
        try
        {
            var address = await _addressRepository.GetByIdAsync(id);

            if (address == null)
            {
                return NotFound(new { success = false, message = "Address not found" });
            }

            return Ok(new
            {
                success = true,
                data = address
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting address {AddressId}", id);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching the address" });
        }
    }

    /// <summary>
    /// Get all addresses for a customer
    /// </summary>
    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetCustomerAddresses(Guid customerId)
    {
        try
        {
            var addresses = await _addressRepository.GetByCustomerIdAsync(customerId);

            return Ok(new
            {
                success = true,
                data = addresses,
                count = addresses.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting addresses for customer {CustomerId}", customerId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching customer addresses" });
        }
    }

    /// <summary>
    /// Get customer's default address
    /// </summary>
    [HttpGet("customer/{customerId}/default")]
    public async Task<IActionResult> GetDefaultAddress(Guid customerId)
    {
        try
        {
            var address = await _addressRepository.GetDefaultByCustomerIdAsync(customerId);

            if (address == null)
            {
                return NotFound(new { success = false, message = "No default address found" });
            }

            return Ok(new
            {
                success = true,
                data = address
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting default address for customer {CustomerId}", customerId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching the default address" });
        }
    }

    /// <summary>
    /// Create new delivery address
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateAddress([FromBody] CreateDeliveryAddressRequest request)
    {
        try
        {
            var address = new DeliveryAddress
            {
                Id = Guid.NewGuid(),
                CustomerId = request.CustomerId,
                Label = request.Label,
                ContactName = request.ContactName,
                ContactPhone = request.ContactPhone,
                AddressLine1 = request.AddressLine1,
                AddressLine2 = request.AddressLine2,
                Landmark = request.Landmark,
                City = request.City,
                State = request.State,
                PostalCode = request.PostalCode,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                IsDefault = request.IsDefault,
                IsActive = true
            };

            var createdAddress = await _addressRepository.CreateAsync(address);

            _logger.LogInformation("Address {AddressId} created for customer {CustomerId}", createdAddress.Id, request.CustomerId);

            return CreatedAtAction(nameof(GetAddress), new { id = createdAddress.Id }, new
            {
                success = true,
                message = "Address created successfully",
                data = createdAddress
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating address for customer {CustomerId}", request.CustomerId);
            return StatusCode(500, new { success = false, message = "An error occurred while creating the address" });
        }
    }

    /// <summary>
    /// Update delivery address
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAddress(Guid id, [FromBody] CreateDeliveryAddressRequest request)
    {
        try
        {
            var existingAddress = await _addressRepository.GetByIdAsync(id);

            if (existingAddress == null)
            {
                return NotFound(new { success = false, message = "Address not found" });
            }

            existingAddress.Label = request.Label;
            existingAddress.ContactName = request.ContactName;
            existingAddress.ContactPhone = request.ContactPhone;
            existingAddress.AddressLine1 = request.AddressLine1;
            existingAddress.AddressLine2 = request.AddressLine2;
            existingAddress.Landmark = request.Landmark;
            existingAddress.City = request.City;
            existingAddress.State = request.State;
            existingAddress.PostalCode = request.PostalCode;
            existingAddress.Latitude = request.Latitude;
            existingAddress.Longitude = request.Longitude;
            existingAddress.IsDefault = request.IsDefault;

            var updatedAddress = await _addressRepository.UpdateAsync(existingAddress);

            _logger.LogInformation("Address {AddressId} updated", id);

            return Ok(new
            {
                success = true,
                message = "Address updated successfully",
                data = updatedAddress
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating address {AddressId}", id);
            return StatusCode(500, new { success = false, message = "An error occurred while updating the address" });
        }
    }

    /// <summary>
    /// Delete delivery address (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAddress(Guid id)
    {
        try
        {
            var deleted = await _addressRepository.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound(new { success = false, message = "Address not found" });
            }

            _logger.LogInformation("Address {AddressId} deleted", id);

            return Ok(new
            {
                success = true,
                message = "Address deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting address {AddressId}", id);
            return StatusCode(500, new { success = false, message = "An error occurred while deleting the address" });
        }
    }

    /// <summary>
    /// Set address as default
    /// </summary>
    [HttpPost("{id}/set-default")]
    public async Task<IActionResult> SetAsDefault(Guid id, [FromQuery] Guid customerId)
    {
        try
        {
            var success = await _addressRepository.SetAsDefaultAsync(id, customerId);

            if (!success)
            {
                return NotFound(new { success = false, message = "Address not found" });
            }

            _logger.LogInformation("Address {AddressId} set as default for customer {CustomerId}", id, customerId);

            return Ok(new
            {
                success = true,
                message = "Address set as default successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting address {AddressId} as default", id);
            return StatusCode(500, new { success = false, message = "An error occurred while setting the address as default" });
        }
    }
}
