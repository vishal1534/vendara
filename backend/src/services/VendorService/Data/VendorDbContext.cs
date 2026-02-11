using Microsoft.EntityFrameworkCore;
using VendorService.Models.Entities;

namespace VendorService.Data;

/// <summary>
/// Database context for Vendor Service
/// </summary>
public class VendorDbContext : DbContext
{
    public VendorDbContext(DbContextOptions<VendorDbContext> options) : base(options)
    {
    }

    public DbSet<Vendor> Vendors { get; set; }
    public DbSet<VendorDocument> VendorDocuments { get; set; }
    public DbSet<VendorInventoryItem> VendorInventoryItems { get; set; }
    public DbSet<VendorLaborAvailability> VendorLaborAvailability { get; set; }
    public DbSet<VendorServiceArea> VendorServiceAreas { get; set; }
    public DbSet<VendorBusinessHour> VendorBusinessHours { get; set; }
    public DbSet<VendorBankAccount> VendorBankAccounts { get; set; }
    public DbSet<VendorRating> VendorRatings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Vendor
        modelBuilder.Entity<Vendor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.PhoneNumber);
            entity.HasIndex(e => e.GstNumber);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.City);
            
            entity.Property(e => e.BusinessName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ContactPersonName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(15);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);
            entity.Property(e => e.State).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PostalCode).IsRequired().HasMaxLength(10);
            
            entity.Property(e => e.AverageRating).HasPrecision(3, 2);
            entity.Property(e => e.FulfillmentRate).HasPrecision(5, 2);
            entity.Property(e => e.Latitude).HasPrecision(10, 7);
            entity.Property(e => e.Longitude).HasPrecision(10, 7);
            entity.Property(e => e.MinimumOrderValue).HasPrecision(10, 2);
        });

        // VendorDocument
        modelBuilder.Entity<VendorDocument>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.DocumentType);
            entity.HasIndex(e => e.Status);
            
            entity.Property(e => e.DocumentNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.FileUrl).IsRequired().HasMaxLength(500);
            
            entity.HasOne(e => e.Vendor)
                  .WithMany(v => v.Documents)
                  .HasForeignKey(e => e.VendorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VendorInventoryItem
        modelBuilder.Entity<VendorInventoryItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.MaterialId);
            entity.HasIndex(e => new { e.VendorId, e.MaterialId }).IsUnique();
            
            entity.Property(e => e.UnitPrice).HasPrecision(10, 2);
            entity.Property(e => e.MinimumOrderQuantity).HasPrecision(10, 2);
            entity.Property(e => e.MaximumOrderQuantity).HasPrecision(10, 2);
            entity.Property(e => e.DiscountPercentage).HasPrecision(5, 2);
            entity.Property(e => e.BulkDiscountQuantity).HasPrecision(10, 2);
            entity.Property(e => e.BulkDiscountPercentage).HasPrecision(5, 2);
            entity.Property(e => e.StockQuantity).HasPrecision(10, 2);
            entity.Property(e => e.ReorderLevel).HasPrecision(10, 2);
            
            entity.HasOne(e => e.Vendor)
                  .WithMany(v => v.InventoryItems)
                  .HasForeignKey(e => e.VendorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VendorLaborAvailability
        modelBuilder.Entity<VendorLaborAvailability>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.LaborCategoryId);
            entity.HasIndex(e => new { e.VendorId, e.LaborCategoryId, e.SkillLevel }).IsUnique();
            
            entity.Property(e => e.HourlyRate).HasPrecision(10, 2);
            entity.Property(e => e.DailyRate).HasPrecision(10, 2);
            entity.Property(e => e.WeeklyRate).HasPrecision(10, 2);
            entity.Property(e => e.MonthlyRate).HasPrecision(10, 2);
            entity.Property(e => e.OvertimeRate).HasPrecision(10, 2);
            
            entity.HasOne(e => e.Vendor)
                  .WithMany(v => v.LaborAvailability)
                  .HasForeignKey(e => e.VendorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VendorServiceArea
        modelBuilder.Entity<VendorServiceArea>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.Pincode);
            entity.HasIndex(e => e.City);
            
            entity.Property(e => e.AreaName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);
            entity.Property(e => e.State).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DeliveryCharge).HasPrecision(10, 2);
            entity.Property(e => e.MinimumOrderValue).HasPrecision(10, 2);
            
            entity.HasOne(e => e.Vendor)
                  .WithMany(v => v.ServiceAreas)
                  .HasForeignKey(e => e.VendorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VendorBusinessHour
        modelBuilder.Entity<VendorBusinessHour>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => new { e.VendorId, e.DayOfWeek }).IsUnique();
            
            entity.HasOne(e => e.Vendor)
                  .WithMany(v => v.BusinessHours)
                  .HasForeignKey(e => e.VendorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VendorBankAccount
        modelBuilder.Entity<VendorBankAccount>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => new { e.VendorId, e.IsPrimary });
            
            entity.Property(e => e.AccountHolderName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.AccountNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.IfscCode).IsRequired().HasMaxLength(11);
            entity.Property(e => e.BankName).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.Vendor)
                  .WithMany(v => v.BankAccounts)
                  .HasForeignKey(e => e.VendorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VendorRating
        modelBuilder.Entity<VendorRating>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.CustomerId);
            entity.HasIndex(e => new { e.VendorId, e.OrderId }).IsUnique();
            
            entity.HasOne(e => e.Vendor)
                  .WithMany(v => v.Ratings)
                  .HasForeignKey(e => e.VendorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
