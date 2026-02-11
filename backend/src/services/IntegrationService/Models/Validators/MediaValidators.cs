using FluentValidation;
using IntegrationService.Models.Requests;

namespace IntegrationService.Models.Validators;

/// <summary>
/// Validator for UploadMediaRequest
/// </summary>
public class UploadMediaRequestValidator : AbstractValidator<UploadMediaRequest>
{
    // Maximum file size: 100 MB
    private const long MaxFileSizeBytes = 100 * 1024 * 1024;

    // Allowed file extensions for MVP
    private static readonly string[] AllowedExtensions = new[]
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", // Images
        ".pdf", ".doc", ".docx", ".xls", ".xlsx", // Documents
        ".mp4", ".mov", ".avi", ".webm", // Videos
        ".mp3", ".wav", ".ogg", ".m4a" // Audio
    };

    public UploadMediaRequestValidator()
    {
        RuleFor(x => x.File)
            .NotNull().WithMessage("File is required")
            .Must(HaveValidSize).WithMessage($"File size cannot exceed {MaxFileSizeBytes / 1024 / 1024} MB")
            .Must(HaveValidExtension).WithMessage($"File extension not allowed. Allowed: {string.Join(", ", AllowedExtensions)}");

        RuleFor(x => x.UploadContext)
            .MaximumLength(200).WithMessage("Upload context cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.UploadContext));

        RuleFor(x => x.UploadedByUserId)
            .MaximumLength(100).WithMessage("UploadedByUserId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.UploadedByUserId));

        RuleFor(x => x.UploadedByUserType)
            .Must(BeValidUserType).WithMessage("UploadedByUserType must be 'buyer', 'vendor', or 'admin'")
            .When(x => !string.IsNullOrEmpty(x.UploadedByUserType));

        RuleFor(x => x.RelatedEntityId)
            .MaximumLength(100).WithMessage("RelatedEntityId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityId));

        RuleFor(x => x.RelatedEntityType)
            .Must(BeValidEntityType).WithMessage("RelatedEntityType must be 'order', 'payment', 'dispute', 'vendor', 'buyer', or 'catalog'")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityType));
    }

    private bool HaveValidSize(Microsoft.AspNetCore.Http.IFormFile? file)
    {
        if (file == null) return false;
        return file.Length > 0 && file.Length <= MaxFileSizeBytes;
    }

    private bool HaveValidExtension(Microsoft.AspNetCore.Http.IFormFile? file)
    {
        if (file == null || string.IsNullOrEmpty(file.FileName)) return false;
        
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        return AllowedExtensions.Contains(extension);
    }

    private bool BeValidUserType(string? userType)
    {
        if (string.IsNullOrEmpty(userType)) return true;
        var validTypes = new[] { "buyer", "vendor", "admin" };
        return validTypes.Contains(userType.ToLowerInvariant());
    }

    private bool BeValidEntityType(string? entityType)
    {
        if (string.IsNullOrEmpty(entityType)) return true;
        var validTypes = new[] { "order", "payment", "dispute", "vendor", "buyer", "catalog" };
        return validTypes.Contains(entityType.ToLowerInvariant());
    }
}

/// <summary>
/// Validator for UploadMultipleMediaRequest
/// </summary>
public class UploadMultipleMediaRequestValidator : AbstractValidator<UploadMultipleMediaRequest>
{
    // Maximum file size: 100 MB per file
    private const long MaxFileSizeBytes = 100 * 1024 * 1024;

    // Maximum number of files in a single batch upload
    private const int MaxFilesCount = 10;

    // Allowed file extensions for MVP
    private static readonly string[] AllowedExtensions = new[]
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", // Images
        ".pdf", ".doc", ".docx", ".xls", ".xlsx", // Documents
        ".mp4", ".mov", ".avi", ".webm", // Videos
        ".mp3", ".wav", ".ogg", ".m4a" // Audio
    };

    public UploadMultipleMediaRequestValidator()
    {
        RuleFor(x => x.Files)
            .NotNull().WithMessage("Files list is required")
            .NotEmpty().WithMessage("At least one file is required")
            .Must(files => files.Count <= MaxFilesCount).WithMessage($"Cannot upload more than {MaxFilesCount} files at once");

        RuleForEach(x => x.Files)
            .NotNull().WithMessage("File cannot be null")
            .Must(HaveValidSize).WithMessage($"File size cannot exceed {MaxFileSizeBytes / 1024 / 1024} MB")
            .Must(HaveValidExtension).WithMessage($"File extension not allowed. Allowed: {string.Join(", ", AllowedExtensions)}");

        RuleFor(x => x.UploadContext)
            .MaximumLength(200).WithMessage("Upload context cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.UploadContext));

        RuleFor(x => x.UploadedByUserId)
            .MaximumLength(100).WithMessage("UploadedByUserId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.UploadedByUserId));

        RuleFor(x => x.UploadedByUserType)
            .Must(BeValidUserType).WithMessage("UploadedByUserType must be 'buyer', 'vendor', or 'admin'")
            .When(x => !string.IsNullOrEmpty(x.UploadedByUserType));

        RuleFor(x => x.RelatedEntityId)
            .MaximumLength(100).WithMessage("RelatedEntityId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityId));

        RuleFor(x => x.RelatedEntityType)
            .Must(BeValidEntityType).WithMessage("RelatedEntityType must be 'order', 'payment', 'dispute', 'vendor', 'buyer', or 'catalog'")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityType));
    }

    private bool HaveValidSize(Microsoft.AspNetCore.Http.IFormFile? file)
    {
        if (file == null) return false;
        return file.Length > 0 && file.Length <= MaxFileSizeBytes;
    }

    private bool HaveValidExtension(Microsoft.AspNetCore.Http.IFormFile? file)
    {
        if (file == null || string.IsNullOrEmpty(file.FileName)) return false;
        
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        return AllowedExtensions.Contains(extension);
    }

    private bool BeValidUserType(string? userType)
    {
        if (string.IsNullOrEmpty(userType)) return true;
        var validTypes = new[] { "buyer", "vendor", "admin" };
        return validTypes.Contains(userType.ToLowerInvariant());
    }

    private bool BeValidEntityType(string? entityType)
    {
        if (string.IsNullOrEmpty(entityType)) return true;
        var validTypes = new[] { "order", "payment", "dispute", "vendor", "buyer", "catalog" };
        return validTypes.Contains(entityType.ToLowerInvariant());
    }
}
