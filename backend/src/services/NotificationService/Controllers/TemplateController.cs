using Microsoft.AspNetCore.Mvc;
using NotificationService.Models.Requests;
using NotificationService.Models.Responses;
using NotificationService.Services.Interfaces;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/v1/notifications/templates")]
public class TemplateController : ControllerBase
{
    private readonly INotificationTemplateService _templateService;
    private readonly ILogger<TemplateController> _logger;

    public TemplateController(
        INotificationTemplateService templateService,
        ILogger<TemplateController> logger)
    {
        _templateService = templateService;
        _logger = logger;
    }

    /// <summary>
    /// Get all notification templates
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllTemplates()
    {
        try
        {
            var templates = await _templateService.GetAllTemplatesAsync();
            return Ok(templates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving templates");
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to retrieve templates",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Get template by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTemplateById(Guid id)
    {
        try
        {
            var template = await _templateService.GetTemplateByIdAsync(id);
            
            if (template == null)
            {
                return NotFound(new ErrorResponse { Error = "Template not found" });
            }

            return Ok(template);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving template {TemplateId}", id);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to retrieve template",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Get template by name
    /// </summary>
    [HttpGet("by-name/{templateName}")]
    public async Task<IActionResult> GetTemplateByName(string templateName)
    {
        try
        {
            var template = await _templateService.GetTemplateByNameAsync(templateName);
            
            if (template == null)
            {
                return NotFound(new ErrorResponse { Error = "Template not found" });
            }

            return Ok(template);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving template {TemplateName}", templateName);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to retrieve template",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Create a new notification template (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateTemplateRequest request)
    {
        try
        {
            var template = await _templateService.CreateTemplateAsync(request);
            return CreatedAtAction(nameof(GetTemplateById), new { id = template.Id }, template);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ErrorResponse { Error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating template");
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to create template",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Update a notification template (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTemplate(Guid id, [FromBody] UpdateTemplateRequest request)
    {
        try
        {
            var template = await _templateService.UpdateTemplateAsync(id, request);
            return Ok(template);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorResponse { Error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating template {TemplateId}", id);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to update template",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Delete a notification template (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        try
        {
            await _templateService.DeleteTemplateAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting template {TemplateId}", id);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to delete template",
                Details = ex.Message
            });
        }
    }
}
