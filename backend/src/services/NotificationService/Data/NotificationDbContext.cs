using Microsoft.EntityFrameworkCore;
using NotificationService.Models.Entities;

namespace NotificationService.Data;

public class NotificationDbContext : DbContext
{
    public NotificationDbContext(DbContextOptions<NotificationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NotificationTemplate> NotificationTemplates { get; set; }
    public DbSet<UserNotificationPreference> UserNotificationPreferences { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Notification configuration
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("notifications");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RecipientId).HasColumnName("recipient_id").IsRequired();
            entity.Property(e => e.RecipientType).HasColumnName("recipient_type").HasMaxLength(20).IsRequired();
            entity.Property(e => e.NotificationType).HasColumnName("notification_type").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Channel).HasColumnName("channel").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(255);
            entity.Property(e => e.Body).HasColumnName("body").IsRequired();
            entity.Property(e => e.Data).HasColumnName("data").HasColumnType("jsonb");
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).IsRequired().HasDefaultValue("pending");
            entity.Property(e => e.SentAt).HasColumnName("sent_at");
            entity.Property(e => e.DeliveredAt).HasColumnName("delivered_at");
            entity.Property(e => e.FailedReason).HasColumnName("failed_reason");
            entity.Property(e => e.Provider).HasColumnName("provider").HasMaxLength(50);
            entity.Property(e => e.ProviderMessageId).HasColumnName("provider_message_id").HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();

            // Indexes
            entity.HasIndex(e => e.RecipientId).HasDatabaseName("idx_notifications_recipient_id");
            entity.HasIndex(e => e.Status).HasDatabaseName("idx_notifications_status");
            entity.HasIndex(e => e.CreatedAt).HasDatabaseName("idx_notifications_created_at");
        });

        // NotificationTemplate configuration
        modelBuilder.Entity<NotificationTemplate>(entity =>
        {
            entity.ToTable("notification_templates");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TemplateName).HasColumnName("template_name").HasMaxLength(100).IsRequired();
            entity.Property(e => e.TemplateType).HasColumnName("template_type").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(255);
            entity.Property(e => e.Body).HasColumnName("body").IsRequired();
            entity.Property(e => e.Variables).HasColumnName("variables").HasColumnType("jsonb");
            entity.Property(e => e.WhatsAppTemplateId).HasColumnName("whatsapp_template_id").HasMaxLength(100);
            entity.Property(e => e.WhatsAppLanguage).HasColumnName("whatsapp_language").HasMaxLength(10);
            entity.Property(e => e.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();

            // Indexes
            entity.HasIndex(e => e.TemplateName).IsUnique().HasDatabaseName("idx_notification_templates_name");
            entity.HasIndex(e => e.TemplateType).HasDatabaseName("idx_notification_templates_type");
        });

        // UserNotificationPreference configuration
        modelBuilder.Entity<UserNotificationPreference>(entity =>
        {
            entity.ToTable("user_notification_preferences");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(e => e.EmailEnabled).HasColumnName("email_enabled").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.EmailOrderUpdates).HasColumnName("email_order_updates").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.EmailPaymentUpdates).HasColumnName("email_payment_updates").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.EmailPromotions).HasColumnName("email_promotions").IsRequired().HasDefaultValue(false);
            entity.Property(e => e.WhatsAppEnabled).HasColumnName("whatsapp_enabled").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.WhatsAppOrderUpdates).HasColumnName("whatsapp_order_updates").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.WhatsAppPaymentUpdates).HasColumnName("whatsapp_payment_updates").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.WhatsAppPromotions).HasColumnName("whatsapp_promotions").IsRequired().HasDefaultValue(false);
            entity.Property(e => e.SmsEnabled).HasColumnName("sms_enabled").IsRequired().HasDefaultValue(false);
            entity.Property(e => e.SmsOrderUpdates).HasColumnName("sms_order_updates").IsRequired().HasDefaultValue(false);
            entity.Property(e => e.PushEnabled).HasColumnName("push_enabled").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.PushOrderUpdates).HasColumnName("push_order_updates").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.PushPaymentUpdates).HasColumnName("push_payment_updates").IsRequired().HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();

            // Indexes
            entity.HasIndex(e => e.UserId).IsUnique().HasDatabaseName("idx_user_notification_preferences_user_id");
        });
    }
}
