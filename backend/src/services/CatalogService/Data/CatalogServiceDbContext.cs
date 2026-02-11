using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Data;

public class CatalogServiceDbContext : DbContext
{
    public CatalogServiceDbContext(DbContextOptions<CatalogServiceDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<LaborCategory> LaborCategories { get; set; }
    public DbSet<VendorInventory> VendorInventories { get; set; }
    public DbSet<VendorLaborAvailability> VendorLaborAvailabilities { get; set; }
    public DbSet<PriceHistory> PriceHistories { get; set; }

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

        // Category Configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Type).IsRequired();
            entity.Property(e => e.IconUrl).HasMaxLength(500);

            entity.HasOne(e => e.ParentCategory)
                .WithMany(e => e.SubCategories)
                .HasForeignKey(e => e.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => new { e.Type, e.IsActive });
        });

        // Material Configuration
        modelBuilder.Entity<Material>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Sku).HasMaxLength(50);
            entity.Property(e => e.Unit).IsRequired().HasMaxLength(20);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.Brand).HasMaxLength(100);
            entity.Property(e => e.Specifications).HasMaxLength(500);
            entity.Property(e => e.HsnCode).HasMaxLength(10);

            entity.Property(e => e.BasePrice).HasPrecision(10, 2);
            entity.Property(e => e.MinOrderQuantity).HasPrecision(10, 2);
            entity.Property(e => e.GstPercentage).HasPrecision(5, 2);

            entity.HasOne(e => e.Category)
                .WithMany(e => e.Materials)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Sku);
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => new { e.CategoryId, e.IsActive });
        });

        // LaborCategory Configuration
        modelBuilder.Entity<LaborCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IconUrl).HasMaxLength(500);

            entity.Property(e => e.BaseHourlyRate).HasPrecision(10, 2);
            entity.Property(e => e.BaseDailyRate).HasPrecision(10, 2);

            entity.HasOne(e => e.Category)
                .WithMany(e => e.LaborCategories)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => new { e.CategoryId, e.IsActive });
        });

        // VendorInventory Configuration
        modelBuilder.Entity<VendorInventory>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.VendorPrice).HasPrecision(10, 2);
            entity.Property(e => e.StockQuantity).HasPrecision(10, 2);
            entity.Property(e => e.MinOrderQuantity).HasPrecision(10, 2);

            entity.HasOne(e => e.Material)
                .WithMany(e => e.VendorInventories)
                .HasForeignKey(e => e.MaterialId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.MaterialId);
            entity.HasIndex(e => new { e.VendorId, e.MaterialId }).IsUnique();
            entity.HasIndex(e => new { e.VendorId, e.IsAvailable });
        });

        // VendorLaborAvailability Configuration
        modelBuilder.Entity<VendorLaborAvailability>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.HourlyRate).HasPrecision(10, 2);
            entity.Property(e => e.DailyRate).HasPrecision(10, 2);

            entity.HasOne(e => e.LaborCategory)
                .WithMany(e => e.VendorLaborAvailabilities)
                .HasForeignKey(e => e.LaborCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.LaborCategoryId);
            entity.HasIndex(e => new { e.VendorId, e.LaborCategoryId }).IsUnique();
            entity.HasIndex(e => new { e.VendorId, e.IsAvailable });
        });

        // PriceHistory Configuration
        modelBuilder.Entity<PriceHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.ItemName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.OldPrice).HasPrecision(10, 2);
            entity.Property(e => e.NewPrice).HasPrecision(10, 2);
            entity.Property(e => e.PriceChange).HasPrecision(10, 2);
            entity.Property(e => e.PercentageChange).HasPrecision(10, 2);
            entity.Property(e => e.PriceType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.ChangedBy).HasMaxLength(100);
            entity.Property(e => e.ChangeReason).HasMaxLength(500);

            entity.HasIndex(e => e.ItemId);
            entity.HasIndex(e => e.ItemType);
            entity.HasIndex(e => e.VendorId);
            entity.HasIndex(e => e.ChangedAt);
            entity.HasIndex(e => new { e.ItemType, e.ItemId, e.ChangedAt });
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