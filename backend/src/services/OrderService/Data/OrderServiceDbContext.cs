using OrderService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Data;

public class OrderServiceDbContext : DbContext
{
    public OrderServiceDbContext(DbContextOptions<OrderServiceDbContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<OrderLabor> OrderLabors { get; set; }
    public DbSet<DeliveryAddress> DeliveryAddresses { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Delivery> Deliveries { get; set; }
    public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
    public DbSet<Dispute> Disputes { get; set; }
    public DbSet<DisputeEvidence> DisputeEvidences { get; set; }
    public DbSet<DisputeTimeline> DisputeTimelines { get; set; }
    public DbSet<OrderIssue> OrderIssues { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure PostgreSQL snake_case naming
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(entity.GetTableName()?.ToLower());

            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.GetColumnName()));
            }

            foreach (var key in entity.GetKeys())
            {
                key.SetName(ToSnakeCase(key.GetName()));
            }

            foreach (var foreignKey in entity.GetForeignKeys())
            {
                foreignKey.SetConstraintName(ToSnakeCase(foreignKey.GetConstraintName()));
            }

            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName()));
            }
        }

        // Order Configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CustomerNotes).HasMaxLength(1000);
            entity.Property(e => e.VendorNotes).HasMaxLength(1000);
            entity.Property(e => e.CancellationReason).HasMaxLength(500);
            entity.Property(e => e.RejectionReason).HasMaxLength(500);
            entity.Property(e => e.BuyerName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.BuyerPhone).IsRequired().HasMaxLength(20);
            entity.Property(e => e.BuyerLocation).IsRequired().HasMaxLength(200);
            entity.Property(e => e.VendorName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.VendorType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.VendorPhone).IsRequired().HasMaxLength(20);
            entity.Property(e => e.SettlementStatus).HasMaxLength(50);
            entity.Property(e => e.ReviewText).HasMaxLength(1000);
            
            entity.Property(e => e.SubtotalAmount).HasPrecision(12, 2);
            entity.Property(e => e.GstAmount).HasPrecision(12, 2);
            entity.Property(e => e.DeliveryCharges).HasPrecision(12, 2);
            entity.Property(e => e.DiscountAmount).HasPrecision(12, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(12, 2);
            entity.Property(e => e.PlatformFee).HasPrecision(12, 2);
            entity.Property(e => e.VendorPayoutAmount).HasPrecision(12, 2);
            entity.Property(e => e.LogisticsFee).HasPrecision(12, 2);
            entity.Property(e => e.Deductions).HasPrecision(12, 2);

            entity.HasOne(e => e.DeliveryAddress)
                .WithMany()
                .HasForeignKey(e => e.DeliveryAddressId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Payment)
                .WithOne(e => e.Order)
                .HasForeignKey<Payment>(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Delivery)
                .WithOne(e => e.Order)
                .HasForeignKey<Delivery>(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.OrderItems)
                .WithOne(e => e.Order)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.LaborBookings)
                .WithOne(e => e.Order)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.StatusHistory)
                .WithOne(e => e.Order)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.OrderNumber).IsUnique();
            entity.HasIndex(e => e.CustomerId);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.OrderType);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.HasActiveDispute);
            entity.HasIndex(e => e.SettlementId);
            entity.HasIndex(e => new { e.CustomerId, e.Status });
            entity.HasIndex(e => new { e.VendorId, e.Status });
            entity.HasIndex(e => new { e.CustomerId, e.CreatedAt });
        });

        // OrderItem Configuration
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.MaterialName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Sku).HasMaxLength(50);
            entity.Property(e => e.Unit).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Notes).HasMaxLength(500);
            
            entity.Property(e => e.UnitPrice).HasPrecision(10, 2);
            entity.Property(e => e.Quantity).HasPrecision(10, 2);
            entity.Property(e => e.GstPercentage).HasPrecision(5, 2);
            entity.Property(e => e.GstAmount).HasPrecision(10, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(10, 2);

            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.MaterialId);
            entity.HasIndex(e => e.VendorInventoryId);
            entity.HasIndex(e => e.Category);
        });

        // OrderLabor Configuration
        modelBuilder.Entity<OrderLabor>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.LaborCategoryName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Requirements).HasMaxLength(1000);
            
            entity.Property(e => e.HourlyRate).HasPrecision(10, 2);
            entity.Property(e => e.DailyRate).HasPrecision(10, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(10, 2);

            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.LaborCategoryId);
            entity.HasIndex(e => e.VendorLaborAvailabilityId);
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => new { e.StartDate, e.EndDate });
        });

        // DeliveryAddress Configuration
        modelBuilder.Entity<DeliveryAddress>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Label).IsRequired().HasMaxLength(50);
            entity.Property(e => e.ContactName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ContactPhone).IsRequired().HasMaxLength(20);
            entity.Property(e => e.AddressLine1).IsRequired().HasMaxLength(200);
            entity.Property(e => e.AddressLine2).HasMaxLength(200);
            entity.Property(e => e.Landmark).HasMaxLength(200);
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);
            entity.Property(e => e.State).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PostalCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Country).IsRequired().HasMaxLength(100);

            entity.HasIndex(e => e.CustomerId);
            entity.HasIndex(e => new { e.CustomerId, e.IsDefault });
            entity.HasIndex(e => new { e.CustomerId, e.IsActive });
        });

        // Payment Configuration
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.TransactionId).HasMaxLength(100);
            entity.Property(e => e.GatewayReference).HasMaxLength(200);
            entity.Property(e => e.Gateway).HasMaxLength(50);
            entity.Property(e => e.FailureReason).HasMaxLength(500);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.Property(e => e.Amount).HasPrecision(12, 2);
            entity.Property(e => e.AmountPaid).HasPrecision(12, 2);
            entity.Property(e => e.AmountRefunded).HasPrecision(12, 2);

            entity.HasIndex(e => e.OrderId).IsUnique();
            entity.HasIndex(e => e.TransactionId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.PaymentMethod);
        });

        // Delivery Configuration
        modelBuilder.Entity<Delivery>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.TrackingNumber).HasMaxLength(100);
            entity.Property(e => e.DeliveryPartner).HasMaxLength(100);
            entity.Property(e => e.DriverName).HasMaxLength(100);
            entity.Property(e => e.DriverPhone).HasMaxLength(20);
            entity.Property(e => e.VehicleNumber).HasMaxLength(20);
            entity.Property(e => e.Instructions).HasMaxLength(500);
            entity.Property(e => e.Notes).HasMaxLength(1000);

            entity.HasIndex(e => e.OrderId).IsUnique();
            entity.HasIndex(e => e.TrackingNumber);
            entity.HasIndex(e => e.ScheduledDate);
        });

        // OrderStatusHistory Configuration
        modelBuilder.Entity<OrderStatusHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.ChangedByType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Reason).HasMaxLength(500);
            entity.Property(e => e.Notes).HasMaxLength(1000);

            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.ChangedAt);
            entity.HasIndex(e => new { e.OrderId, e.ChangedAt });
        });

        // Dispute Configuration
        modelBuilder.Entity<Dispute>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.RaisedByRole).IsRequired().HasMaxLength(50);
            entity.Property(e => e.ResolutionNote).HasMaxLength(2000);
            entity.Property(e => e.EscalationReason).HasMaxLength(500);
            
            entity.Property(e => e.DisputedAmount).HasPrecision(12, 2);
            entity.Property(e => e.RefundAmount).HasPrecision(12, 2);

            entity.HasOne(e => e.Order)
                .WithMany()
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.Evidence)
                .WithOne(e => e.Dispute)
                .HasForeignKey(e => e.DisputeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Timeline)
                .WithOne(e => e.Dispute)
                .HasForeignKey(e => e.DisputeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Priority);
            entity.HasIndex(e => e.AssignedTo);
            entity.HasIndex(e => e.CreatedAt);
        });

        // DisputeEvidence Configuration
        modelBuilder.Entity<DisputeEvidence>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Url).IsRequired().HasMaxLength(500);
            entity.Property(e => e.UploadedByRole).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(1000);
            
            entity.HasIndex(e => e.DisputeId);
            entity.HasIndex(e => e.UploadedAt);
        });

        // DisputeTimeline Configuration
        modelBuilder.Entity<DisputeTimeline>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Actor).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ActorRole).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Metadata).HasMaxLength(2000);
            
            entity.HasIndex(e => e.DisputeId);
            entity.HasIndex(e => e.Timestamp);
        });

        // OrderIssue Configuration
        modelBuilder.Entity<OrderIssue>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.IssueType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
            entity.Property(e => e.ReportedByRole).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Resolution).HasMaxLength(2000);
            entity.Property(e => e.Notes).HasMaxLength(1000);

            entity.HasOne(e => e.Order)
                .WithMany()
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.ReportedBy);
            entity.HasIndex(e => e.ReportedAt);
            entity.HasIndex(e => e.EscalatedToDispute);
        });
    }

    private static string ToSnakeCase(string? input)
    {
        if (string.IsNullOrEmpty(input))
            return input ?? string.Empty;

        var result = new System.Text.StringBuilder();
        result.Append(char.ToLower(input[0]));

        for (int i = 1; i < input.Length; i++)
        {
            if (char.IsUpper(input[i]))
            {
                result.Append('_');
                result.Append(char.ToLower(input[i]));
            }
            else
            {
                result.Append(input[i]);
            }
        }

        return result.ToString();
    }
}