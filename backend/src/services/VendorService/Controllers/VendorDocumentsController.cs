using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorService.Models.Authorization;
using VendorService.Models.Entities;
using VendorService.Models.Enums;
using VendorService.Models.Requests;
using VendorService.Models.Responses;
using VendorService.Repositories;
using VendorService.Services;
using System.Security.Claims;

namespace VendorService.Controllers;

/// <summary>
/// Vendor KYC documents management controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}/documents")]
[Authorize]
public class VendorDocumentsController : ControllerBase
{
    private readonly IVendorDocumentRepository _documentRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly ILogger<VendorDocumentsController> _logger;

    public VendorDocumentsController(
        IVendorDocumentRepository documentRepository,
        IVendorRepository vendorRepository,
        ICachingService cache,
        ILogger<VendorDocumentsController> logger)
    {
        _documentRepository = documentRepository;
        _vendorRepository = vendorRepository;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Get all documents for a vendor
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetDocuments(Guid vendorId)
    {
        if (!await CanAccessVendor(vendorId))
            return Forbid();

        var documents = await _documentRepository.GetByVendorIdAsync(vendorId);
        var response = documents.Select(MapToResponse);

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Get specific document
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetDocument(Guid vendorId, Guid id)
    {
        if (!await CanAccessVendor(vendorId))
            return Forbid();

        var document = await _documentRepository.GetByIdAsync(id);
        
        if (document == null || document.VendorId != vendorId)
            return NotFound(new { success = false, message = "Document not found" });

        return Ok(new { success = true, data = MapToResponse(document) });
    }

    /// <summary>
    /// Upload a new KYC document
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> UploadDocument(Guid vendorId, [FromBody] CreateDocumentRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        var document = new VendorDocument
        {
            Id = Guid.NewGuid(),
            VendorId = vendorId,
            DocumentType = request.DocumentType,
            DocumentNumber = request.DocumentNumber,
            FileUrl = request.FileUrl,
            FileName = request.FileName,
            FileSize = request.FileSize,
            MimeType = request.MimeType,
            ExpiryDate = request.ExpiryDate,
            Notes = request.Notes,
            Status = DocumentStatus.Pending
        };

        var created = await _documentRepository.CreateAsync(document);
        
        // Invalidate vendor cache
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Document uploaded for Vendor: {VendorId}, Type: {DocumentType}", 
            vendorId, request.DocumentType);

        return CreatedAtAction(
            nameof(GetDocument),
            new { vendorId, id = created.Id },
            new { success = true, data = MapToResponse(created) });
    }

    /// <summary>
    /// Delete a document
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> DeleteDocument(Guid vendorId, Guid id)
    {
        if (!await CanManageVendor(vendorId))
            return Forbid();

        var document = await _documentRepository.GetByIdAsync(id);
        if (document == null || document.VendorId != vendorId)
            return NotFound(new { success = false, message = "Document not found" });

        await _documentRepository.DeleteAsync(id);
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Document deleted: {DocumentId} for Vendor: {VendorId}", id, vendorId);

        return Ok(new { success = true, message = "Document deleted successfully" });
    }

    /// <summary>
    /// Verify a document (Admin only)
    /// </summary>
    [HttpPatch("{id}/verify")]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> VerifyDocument(
        Guid vendorId, 
        Guid id, 
        [FromBody] VerifyDocumentRequest request)
    {
        var document = await _documentRepository.GetByIdAsync(id);
        if (document == null || document.VendorId != vendorId)
            return NotFound(new { success = false, message = "Document not found" });

        document.Status = request.Approved ? DocumentStatus.Verified : DocumentStatus.Rejected;
        document.VerifiedAt = request.Approved ? DateTime.UtcNow : null;
        document.RejectionReason = request.Approved ? null : request.RejectionReason;

        await _documentRepository.UpdateAsync(document);
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Document {Status}: {DocumentId} for Vendor: {VendorId}", 
            document.Status, id, vendorId);

        return Ok(new { success = true, data = MapToResponse(document) });
    }

    /// <summary>
    /// Get pending documents for review (Admin only)
    /// </summary>
    [HttpGet("~/api/v1/documents/pending")]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> GetPendingDocuments()
    {
        var documents = await _documentRepository.GetByStatusAsync(DocumentStatus.Pending);
        var response = documents.Select(MapToResponse);

        return Ok(new { success = true, data = response });
    }

    private VendorDocumentResponse MapToResponse(VendorDocument document)
    {
        return new VendorDocumentResponse
        {
            Id = document.Id,
            VendorId = document.VendorId,
            DocumentType = document.DocumentType,
            DocumentNumber = document.DocumentNumber,
            FileUrl = document.FileUrl,
            FileName = document.FileName,
            FileSize = document.FileSize,
            Status = document.Status,
            VerifiedAt = document.VerifiedAt,
            RejectionReason = document.RejectionReason,
            ExpiryDate = document.ExpiryDate,
            UploadedAt = document.UploadedAt
        };
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

/// <summary>
/// Request to verify/reject document
/// </summary>
public class VerifyDocumentRequest
{
    public bool Approved { get; set; }
    public string? RejectionReason { get; set; }
}
