using Microsoft.AspNetCore.Mvc;
using CatalogService.Repositories.Interfaces;
using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using RealServ.Shared.Infrastructure.Middleware;

namespace CatalogService.Controllers;

/// <summary>
/// Vendor Labor Availability Management
/// Vendors manage their labor service offerings
/// </summary>
[ApiController]
[Route("api/v1/vendor-labor")]
[ServiceFilter(typeof(FirebaseAuthenticationFilter))]
public class VendorLaborController : ControllerBase
{
    private readonly IVendorLaborAvailabilityRepository _vendorLaborRepository;
    private readonly ILaborCategoryRepository _laborCategoryRepository;
    private readonly ILogger<VendorLaborController> _logger;

    public VendorLaborController(
        IVendorLaborAvailabilityRepository vendorLaborRepository,
        ILaborCategoryRepository laborCategoryRepository,
        ILogger<VendorLaborController> logger)
    {
        _vendorLaborRepository = vendorLaborRepository;
        _laborCategoryRepository = laborCategoryRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all labor services for a specific vendor
    /// </summary>
    [HttpGet("vendor/{vendorId}")]
    public async Task<ActionResult<List<VendorLaborAvailabilityDto>>> GetVendorLaborServices(Guid vendorId)
    {
        try
        {
            var laborServices = await _vendorLaborRepository.GetByVendorIdAsync(vendorId);
            
            var dtos = laborServices.Select(service => new VendorLaborAvailabilityDto
            {
                Id = service.Id,
                VendorId = service.VendorId,
                LaborCategoryId = service.LaborCategoryId,
                LaborCategoryName = service.LaborCategory?.Name ?? "",
                HourlyRate = service.HourlyRate,
                DailyRate = service.DailyRate,
                AvailableWorkers = service.AvailableWorkers,
                MinBookingHours = service.MinBookingHours,
                IsAvailable = service.IsAvailable
            }).ToList();

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vendor labor services for vendor {VendorId}", vendorId);
            return StatusCode(500, new { error = "Failed to retrieve vendor labor services" });
        }
    }

    /// <summary>
    /// Get a specific labor service
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<VendorLaborAvailabilityDto>> GetLaborService(Guid id)
    {
        try
        {
            var service = await _vendorLaborRepository.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound(new { error = "Labor service not found" });
            }

            var dto = new VendorLaborAvailabilityDto
            {
                Id = service.Id,
                VendorId = service.VendorId,
                LaborCategoryId = service.LaborCategoryId,
                LaborCategoryName = service.LaborCategory?.Name ?? "",
                HourlyRate = service.HourlyRate,
                DailyRate = service.DailyRate,
                AvailableWorkers = service.AvailableWorkers,
                MinBookingHours = service.MinBookingHours,
                IsAvailable = service.IsAvailable
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting labor service {Id}", id);
            return StatusCode(500, new { error = "Failed to retrieve labor service" });
        }
    }

    /// <summary>
    /// Add labor service to vendor offerings
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<VendorLaborAvailabilityDto>> AddLaborService([FromBody] CreateVendorLaborAvailabilityRequest request)
    {
        try
        {
            // Verify labor category exists
            var laborCategory = await _laborCategoryRepository.GetByIdAsync(request.LaborCategoryId);
            if (laborCategory == null)
            {
                return BadRequest(new { error = "Labor category not found" });
            }

            // Check if vendor already offers this labor service
            var existingService = await _vendorLaborRepository.GetByVendorAndLaborCategoryAsync(
                request.VendorId, request.LaborCategoryId);
            
            if (existingService != null)
            {
                return Conflict(new { error = "Vendor already offers this labor service. Use PUT to update." });
            }

            var laborService = new VendorLaborAvailability
            {
                VendorId = request.VendorId,
                LaborCategoryId = request.LaborCategoryId,
                HourlyRate = request.HourlyRate,
                DailyRate = request.DailyRate,
                AvailableWorkers = request.AvailableWorkers,
                MinBookingHours = request.MinBookingHours,
                IsAvailable = request.IsAvailable
            };

            var created = await _vendorLaborRepository.CreateAsync(laborService);

            var dto = new VendorLaborAvailabilityDto
            {
                Id = created.Id,
                VendorId = created.VendorId,
                LaborCategoryId = created.LaborCategoryId,
                LaborCategoryName = laborCategory.Name,
                HourlyRate = created.HourlyRate,
                DailyRate = created.DailyRate,
                AvailableWorkers = created.AvailableWorkers,
                MinBookingHours = created.MinBookingHours,
                IsAvailable = created.IsAvailable
            };

            return CreatedAtAction(nameof(GetLaborService), new { id = created.Id }, dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating labor service");
            return StatusCode(500, new { error = "Failed to create labor service" });
        }
    }

    /// <summary>
    /// Update vendor labor service
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<VendorLaborAvailabilityDto>> UpdateLaborService(
        Guid id, 
        [FromBody] UpdateVendorLaborAvailabilityRequest request)
    {
        try
        {
            var existingService = await _vendorLaborRepository.GetByIdAsync(id);
            if (existingService == null)
            {
                return NotFound(new { error = "Labor service not found" });
            }

            // Update fields
            if (request.HourlyRate.HasValue)
                existingService.HourlyRate = request.HourlyRate.Value;
            
            if (request.DailyRate.HasValue)
                existingService.DailyRate = request.DailyRate.Value;
            
            if (request.AvailableWorkers.HasValue)
                existingService.AvailableWorkers = request.AvailableWorkers.Value;
            
            if (request.MinBookingHours.HasValue)
                existingService.MinBookingHours = request.MinBookingHours.Value;
            
            if (request.IsAvailable.HasValue)
                existingService.IsAvailable = request.IsAvailable.Value;

            var updated = await _vendorLaborRepository.UpdateAsync(existingService);

            var dto = new VendorLaborAvailabilityDto
            {
                Id = updated.Id,
                VendorId = updated.VendorId,
                LaborCategoryId = updated.LaborCategoryId,
                LaborCategoryName = updated.LaborCategory?.Name ?? "",
                HourlyRate = updated.HourlyRate,
                DailyRate = updated.DailyRate,
                AvailableWorkers = updated.AvailableWorkers,
                MinBookingHours = updated.MinBookingHours,
                IsAvailable = updated.IsAvailable
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating labor service {Id}", id);
            return StatusCode(500, new { error = "Failed to update labor service" });
        }
    }

    /// <summary>
    /// Toggle availability of labor service
    /// </summary>
    [HttpPatch("{id}/toggle-availability")]
    public async Task<ActionResult> ToggleAvailability(Guid id)
    {
        try
        {
            var service = await _vendorLaborRepository.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound(new { error = "Labor service not found" });
            }

            service.IsAvailable = !service.IsAvailable;
            await _vendorLaborRepository.UpdateAsync(service);

            return Ok(new { 
                id = service.Id, 
                isAvailable = service.IsAvailable,
                message = service.IsAvailable ? "Service is now available" : "Service is now unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling availability for service {Id}", id);
            return StatusCode(500, new { error = "Failed to toggle availability" });
        }
    }

    /// <summary>
    /// Delete labor service
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteLaborService(Guid id)
    {
        try
        {
            var service = await _vendorLaborRepository.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound(new { error = "Labor service not found" });
            }

            await _vendorLaborRepository.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting labor service {Id}", id);
            return StatusCode(500, new { error = "Failed to delete labor service" });
        }
    }

    /// <summary>
    /// Update available workers count
    /// </summary>
    [HttpPatch("{id}/workers")]
    public async Task<ActionResult> UpdateWorkerCount(Guid id, [FromBody] UpdateWorkerCountRequest request)
    {
        try
        {
            var service = await _vendorLaborRepository.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound(new { error = "Labor service not found" });
            }

            service.AvailableWorkers = request.AvailableWorkers;
            await _vendorLaborRepository.UpdateAsync(service);

            return Ok(new { 
                id = service.Id, 
                availableWorkers = service.AvailableWorkers,
                message = "Worker count updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating worker count for service {Id}", id);
            return StatusCode(500, new { error = "Failed to update worker count" });
        }
    }
}

public class UpdateWorkerCountRequest
{
    public int AvailableWorkers { get; set; }
}
