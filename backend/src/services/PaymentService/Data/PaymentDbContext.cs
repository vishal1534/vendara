using Microsoft.EntityFrameworkCore;
using PaymentService.Models.Entities;

namespace PaymentService.Data;

public class PaymentDbContext : DbContext
{
    public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options)
    {
    }

    public DbSet<Payment> Payments { get; set; }
    public DbSet<PaymentRefund> PaymentRefunds { get; set; }
    public DbSet<VendorSettlement> VendorSettlements { get; set; }
    public DbSet<SettlementLineItem> SettlementLineItems { get; set; }
    public DbSet<PaymentWebhook> PaymentWebhooks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Payment configuration
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("payments");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.BuyerId);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.RazorpayOrderId);
            entity.HasIndex(e => e.RazorpayPaymentId);
            entity.HasIndex(e => e.PaymentStatus);
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Currency).HasDefaultValue("INR");
            entity.Property(e => e.PaymentStatus).HasDefaultValue("pending");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // PaymentRefund configuration
        modelBuilder.Entity<PaymentRefund>(entity =>
        {
            entity.ToTable("payment_refunds");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PaymentId);
            entity.HasIndex(e => e.RazorpayRefundId);
            entity.HasIndex(e => e.RefundStatus);
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Currency).HasDefaultValue("INR");
            entity.Property(e => e.RefundStatus).HasDefaultValue("pending");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Payment)
                  .WithMany(p => p.Refunds)
                  .HasForeignKey(e => e.PaymentId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // VendorSettlement configuration
        modelBuilder.Entity<VendorSettlement>(entity =>
        {
            entity.ToTable("vendor_settlements");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.SettlementStatus);
            entity.HasIndex(e => e.PeriodStart);
            entity.HasIndex(e => e.PeriodEnd);
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.Property(e => e.CommissionPercentage).HasPrecision(5, 2);
            entity.Property(e => e.CommissionAmount).HasPrecision(18, 2);
            entity.Property(e => e.SettlementAmount).HasPrecision(18, 2);
            entity.Property(e => e.TaxAmount).HasPrecision(18, 2).HasDefaultValue(0);
            entity.Property(e => e.AdjustmentAmount).HasPrecision(18, 2).HasDefaultValue(0);
            entity.Property(e => e.SettlementStatus).HasDefaultValue("pending");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // SettlementLineItem configuration
        modelBuilder.Entity<SettlementLineItem>(entity =>
        {
            entity.ToTable("settlement_line_items");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.SettlementId);
            entity.HasIndex(e => e.PaymentId);
            entity.HasIndex(e => e.OrderId);

            entity.Property(e => e.OrderAmount).HasPrecision(18, 2);
            entity.Property(e => e.CommissionAmount).HasPrecision(18, 2);
            entity.Property(e => e.SettlementAmount).HasPrecision(18, 2);

            entity.HasOne(e => e.Settlement)
                  .WithMany(s => s.LineItems)
                  .HasForeignKey(e => e.SettlementId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // PaymentWebhook configuration
        modelBuilder.Entity<PaymentWebhook>(entity =>
        {
            entity.ToTable("payment_webhooks");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PaymentId);
            entity.HasIndex(e => e.EventType);
            entity.HasIndex(e => e.RazorpayEventId);
            entity.HasIndex(e => e.IsProcessed);
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.IsProcessed).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Payment)
                  .WithMany(p => p.Webhooks)
                  .HasForeignKey(e => e.PaymentId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
