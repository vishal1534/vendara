using Microsoft.EntityFrameworkCore;
using IntegrationService.Models.Entities;

namespace IntegrationService.Data;

public class IntegrationDbContext : DbContext
{
    public IntegrationDbContext(DbContextOptions<IntegrationDbContext> options)
        : base(options)
    {
    }

    public DbSet<WhatsAppMessage> WhatsAppMessages { get; set; } = null!;
    public DbSet<MediaFile> MediaFiles { get; set; } = null!;
    public DbSet<LocationCache> LocationCaches { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ====================================================================
        // WHATSAPP MESSAGES
        // ====================================================================
        modelBuilder.Entity<WhatsAppMessage>(entity =>
        {
            entity.HasIndex(e => e.WhatsAppMessageId)
                .IsUnique()
                .HasFilter("whatsapp_message_id IS NOT NULL");

            entity.HasIndex(e => e.PhoneNumber);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.Direction, e.Status });
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => new { e.RelatedEntityType, e.RelatedEntityId });

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // ====================================================================
        // MEDIA FILES
        // ====================================================================
        modelBuilder.Entity<MediaFile>(entity =>
        {
            entity.HasIndex(e => e.S3Key).IsUnique();
            entity.HasIndex(e => e.UploadedByUserId);
            entity.HasIndex(e => new { e.Category, e.UploadContext });
            entity.HasIndex(e => new { e.RelatedEntityType, e.RelatedEntityId });
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.DeletedAt);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Global query filter for soft deletes
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ====================================================================
        // LOCATION CACHE
        // ====================================================================
        modelBuilder.Entity<LocationCache>(entity =>
        {
            entity.HasIndex(e => e.NormalizedAddress).IsUnique();
            entity.HasIndex(e => e.PlaceId);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
            entity.HasIndex(e => e.ExpiresAt);
            entity.HasIndex(e => e.LastAccessedAt);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.LastAccessedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Global query filter to exclude expired cache
            entity.HasQueryFilter(e => e.ExpiresAt > DateTime.UtcNow);
        });

        // ====================================================================
        // AUDIT LOGS
        // ====================================================================
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Action);
            entity.HasIndex(e => new { e.EntityType, e.EntityId });
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.Result);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}