using System.Text.Json;
using NotificationService.Models.DTOs;
using NotificationService.Models.Entities;
using NotificationService.Models.Requests;
using NotificationService.Repositories.Interfaces;
using NotificationService.Services.Interfaces;

namespace NotificationService.Services;

public class NotificationTemplateManagementService : INotificationTemplateService
{
    private readonly INotificationTemplateRepository _templateRepository;
    private readonly ILogger<NotificationTemplateManagementService> _logger;

    public NotificationTemplateManagementService(
        INotificationTemplateRepository templateRepository,
        ILogger<NotificationTemplateManagementService> logger)
    {
        _templateRepository = templateRepository;
        _logger = logger;
    }

    public async Task<NotificationTemplateDto> CreateTemplateAsync(CreateTemplateRequest request)
    {
        // Check if template name already exists
        var existing = await _templateRepository.GetByNameAsync(request.TemplateName);
        if (existing != null)
        {
            throw new InvalidOperationException($"Template with name '{request.TemplateName}' already exists");
        }

        var template = new NotificationTemplate
        {
            Id = Guid.NewGuid(),
            TemplateName = request.TemplateName,
            TemplateType = request.TemplateType,
            Subject = request.Subject,
            Body = request.Body,
            Variables = request.Variables != null ? JsonSerializer.Serialize(request.Variables) : null,
            WhatsAppTemplateId = request.WhatsAppTemplateId,
            WhatsAppLanguage = request.WhatsAppLanguage,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _templateRepository.CreateAsync(template);
        _logger.LogInformation("Created notification template: {TemplateName}", request.TemplateName);

        return MapToDto(template);
    }

    public async Task<NotificationTemplateDto> UpdateTemplateAsync(Guid id, UpdateTemplateRequest request)
    {
        var template = await _templateRepository.GetByIdAsync(id);
        if (template == null)
        {
            throw new KeyNotFoundException($"Template with ID {id} not found");
        }

        if (request.Subject != null)
            template.Subject = request.Subject;
        
        if (request.Body != null)
            template.Body = request.Body;
        
        if (request.Variables != null)
            template.Variables = JsonSerializer.Serialize(request.Variables);
        
        if (request.IsActive.HasValue)
            template.IsActive = request.IsActive.Value;

        template.UpdatedAt = DateTime.UtcNow;

        await _templateRepository.UpdateAsync(template);
        _logger.LogInformation("Updated notification template: {TemplateId}", id);

        return MapToDto(template);
    }

    public async Task<NotificationTemplateDto?> GetTemplateByIdAsync(Guid id)
    {
        var template = await _templateRepository.GetByIdAsync(id);
        return template != null ? MapToDto(template) : null;
    }

    public async Task<NotificationTemplateDto?> GetTemplateByNameAsync(string templateName)
    {
        var template = await _templateRepository.GetByNameAsync(templateName);
        return template != null ? MapToDto(template) : null;
    }

    public async Task<List<NotificationTemplateDto>> GetAllTemplatesAsync()
    {
        var templates = await _templateRepository.GetAllAsync();
        return templates.Select(MapToDto).ToList();
    }

    public async Task DeleteTemplateAsync(Guid id)
    {
        await _templateRepository.DeleteAsync(id);
        _logger.LogInformation("Deleted notification template: {TemplateId}", id);
    }

    private static NotificationTemplateDto MapToDto(NotificationTemplate template)
    {
        return new NotificationTemplateDto
        {
            Id = template.Id,
            TemplateName = template.TemplateName,
            TemplateType = template.TemplateType,
            Subject = template.Subject,
            Body = template.Body,
            Variables = template.Variables != null 
                ? JsonSerializer.Deserialize<List<string>>(template.Variables) 
                : null,
            WhatsAppTemplateId = template.WhatsAppTemplateId,
            WhatsAppLanguage = template.WhatsAppLanguage,
            IsActive = template.IsActive,
            CreatedAt = template.CreatedAt,
            UpdatedAt = template.UpdatedAt
        };
    }
}

public class UserNotificationPreferenceManagementService : IUserNotificationPreferenceService
{
    private readonly IUserNotificationPreferenceRepository _preferenceRepository;
    private readonly ILogger<UserNotificationPreferenceManagementService> _logger;

    public UserNotificationPreferenceManagementService(
        IUserNotificationPreferenceRepository preferenceRepository,
        ILogger<UserNotificationPreferenceManagementService> logger)
    {
        _preferenceRepository = preferenceRepository;
        _logger = logger;
    }

    public async Task<UserNotificationPreferenceDto> GetOrCreatePreferencesAsync(Guid userId)
    {
        var preference = await _preferenceRepository.GetByUserIdAsync(userId);
        
        if (preference == null)
        {
            // Create default preferences
            preference = new UserNotificationPreference
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                EmailEnabled = true,
                EmailOrderUpdates = true,
                EmailPaymentUpdates = true,
                EmailPromotions = false,
                WhatsAppEnabled = true,
                WhatsAppOrderUpdates = true,
                WhatsAppPaymentUpdates = true,
                WhatsAppPromotions = false,
                SmsEnabled = false,
                SmsOrderUpdates = false,
                PushEnabled = true,
                PushOrderUpdates = true,
                PushPaymentUpdates = true,
                UpdatedAt = DateTime.UtcNow
            };

            await _preferenceRepository.CreateAsync(preference);
            _logger.LogInformation("Created default notification preferences for user: {UserId}", userId);
        }

        return MapToDto(preference);
    }

    public async Task<UserNotificationPreferenceDto> UpdatePreferencesAsync(Guid userId, UpdatePreferencesRequest request)
    {
        var preference = await _preferenceRepository.GetByUserIdAsync(userId);
        
        if (preference == null)
        {
            throw new KeyNotFoundException($"Preferences for user {userId} not found");
        }

        // Update only provided fields
        if (request.EmailEnabled.HasValue)
            preference.EmailEnabled = request.EmailEnabled.Value;
        if (request.EmailOrderUpdates.HasValue)
            preference.EmailOrderUpdates = request.EmailOrderUpdates.Value;
        if (request.EmailPaymentUpdates.HasValue)
            preference.EmailPaymentUpdates = request.EmailPaymentUpdates.Value;
        if (request.EmailPromotions.HasValue)
            preference.EmailPromotions = request.EmailPromotions.Value;
        
        if (request.WhatsAppEnabled.HasValue)
            preference.WhatsAppEnabled = request.WhatsAppEnabled.Value;
        if (request.WhatsAppOrderUpdates.HasValue)
            preference.WhatsAppOrderUpdates = request.WhatsAppOrderUpdates.Value;
        if (request.WhatsAppPaymentUpdates.HasValue)
            preference.WhatsAppPaymentUpdates = request.WhatsAppPaymentUpdates.Value;
        if (request.WhatsAppPromotions.HasValue)
            preference.WhatsAppPromotions = request.WhatsAppPromotions.Value;
        
        if (request.SmsEnabled.HasValue)
            preference.SmsEnabled = request.SmsEnabled.Value;
        if (request.SmsOrderUpdates.HasValue)
            preference.SmsOrderUpdates = request.SmsOrderUpdates.Value;
        
        if (request.PushEnabled.HasValue)
            preference.PushEnabled = request.PushEnabled.Value;
        if (request.PushOrderUpdates.HasValue)
            preference.PushOrderUpdates = request.PushOrderUpdates.Value;
        if (request.PushPaymentUpdates.HasValue)
            preference.PushPaymentUpdates = request.PushPaymentUpdates.Value;

        preference.UpdatedAt = DateTime.UtcNow;

        await _preferenceRepository.UpdateAsync(preference);
        _logger.LogInformation("Updated notification preferences for user: {UserId}", userId);

        return MapToDto(preference);
    }

    private static UserNotificationPreferenceDto MapToDto(UserNotificationPreference preference)
    {
        return new UserNotificationPreferenceDto
        {
            Id = preference.Id,
            UserId = preference.UserId,
            EmailEnabled = preference.EmailEnabled,
            EmailOrderUpdates = preference.EmailOrderUpdates,
            EmailPaymentUpdates = preference.EmailPaymentUpdates,
            EmailPromotions = preference.EmailPromotions,
            WhatsAppEnabled = preference.WhatsAppEnabled,
            WhatsAppOrderUpdates = preference.WhatsAppOrderUpdates,
            WhatsAppPaymentUpdates = preference.WhatsAppPaymentUpdates,
            WhatsAppPromotions = preference.WhatsAppPromotions,
            SmsEnabled = preference.SmsEnabled,
            SmsOrderUpdates = preference.SmsOrderUpdates,
            PushEnabled = preference.PushEnabled,
            PushOrderUpdates = preference.PushOrderUpdates,
            PushPaymentUpdates = preference.PushPaymentUpdates,
            UpdatedAt = preference.UpdatedAt
        };
    }
}
