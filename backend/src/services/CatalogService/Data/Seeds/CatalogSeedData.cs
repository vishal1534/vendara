using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Data.Seeds;

public static class CatalogSeedData
{
    public static async Task SeedAsync(CatalogServiceDbContext context)
    {
        // Check if already seeded
        if (await context.Categories.AnyAsync())
        {
            Console.WriteLine("Catalog data already seeded.");
            return;
        }

        Console.WriteLine("Seeding catalog data...");

        // === MATERIAL CATEGORIES ===
        var cementCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Cement",
            Key = "cement",
            Description = "Various types of cement for construction",
            Type = CategoryType.Material,
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var bricksCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Bricks",
            Key = "bricks",
            Description = "Clay bricks, fly ash bricks, and concrete blocks",
            Type = CategoryType.Material,
            DisplayOrder = 2,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var steelCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Steel & Iron",
            Key = "steel",
            Description = "TMT bars, angles, channels, and structural steel",
            Type = CategoryType.Material,
            DisplayOrder = 3,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var sandCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Sand & Aggregates",
            Key = "sand-aggregates",
            Description = "River sand, M-sand, gravel, and crushed stone",
            Type = CategoryType.Material,
            DisplayOrder = 4,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var paintsCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Paints & Putty",
            Key = "paints",
            Description = "Interior/exterior paints, primers, and wall putty",
            Type = CategoryType.Material,
            DisplayOrder = 5,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // === LABOR CATEGORIES ===
        var masonryCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Masonry Services",
            Key = "masonry",
            Description = "Bricklaying, plastering, and concrete work",
            Type = CategoryType.Labor,
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var carpentryCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Carpentry Services",
            Key = "carpentry",
            Description = "Furniture making, door/window installation, and woodwork",
            Type = CategoryType.Labor,
            DisplayOrder = 2,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var electricalCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Electrical Services",
            Key = "electrical",
            Description = "Wiring, fixtures, and electrical installations",
            Type = CategoryType.Labor,
            DisplayOrder = 3,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var plumbingCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Plumbing Services",
            Key = "plumbing",
            Description = "Pipe laying, sanitary fittings, and water supply",
            Type = CategoryType.Labor,
            DisplayOrder = 4,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var paintingCategory = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Painting Services",
            Key = "painting",
            Description = "Interior/exterior painting and wall finishing",
            Type = CategoryType.Labor,
            DisplayOrder = 5,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Categories.AddRange(
            cementCategory, bricksCategory, steelCategory, sandCategory, paintsCategory,
            masonryCategory, carpentryCategory, electricalCategory, plumbingCategory, paintingCategory
        );

        // === MATERIALS ===
        var materials = new List<Material>
        {
            // Cement
            new Material
            {
                CategoryId = cementCategory.Id,
                Name = "OPC 53 Grade Cement",
                Description = "Ordinary Portland Cement - 53 Grade for high strength concrete",
                Sku = "CEM-OPC53",
                BasePrice = 440,
                Unit = "bag (50kg)",
                MinOrderQuantity = 1,
                MaxOrderQuantity = 500,
                Brand = "UltraTech",
                Specifications = "53 Grade, 50kg bag",
                HsnCode = "2523",
                GstPercentage = 28,
                IsActive = true,
                IsPopular = true,
                DisplayOrder = 1,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "cement", "construction", "high-strength", "popular" }),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Material
            {
                CategoryId = cementCategory.Id,
                Name = "PPC Cement (Portland Pozzolana)",
                Description = "Portland Pozzolana Cement for durability and crack resistance",
                Sku = "CEM-PPC",
                BasePrice = 380,
                Unit = "bag (50kg)",
                MinOrderQuantity = 1,
                MaxOrderQuantity = 500,
                Brand = "ACC",
                Specifications = "50kg bag",
                HsnCode = "2523",
                GstPercentage = 28,
                IsActive = true,
                IsPopular = false,
                DisplayOrder = 2,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "cement", "ppc", "eco-friendly" }),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Bricks
            new Material
            {
                CategoryId = bricksCategory.Id,
                Name = "Red Clay Bricks (9 inch)",
                Description = "Standard red clay bricks for wall construction",
                Sku = "BRK-RED9",
                BasePrice = 8,
                Unit = "piece",
                MinOrderQuantity = 100,
                MaxOrderQuantity = 10000,
                Specifications = "9\" x 4\" x 3\"",
                HsnCode = "6904",
                GstPercentage = 12,
                IsActive = true,
                IsPopular = true,
                DisplayOrder = 1,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "bricks", "clay", "standard", "popular" }),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Material
            {
                CategoryId = bricksCategory.Id,
                Name = "Fly Ash Bricks (AAC)",
                Description = "Autoclaved Aerated Concrete blocks - lightweight and eco-friendly",
                Sku = "BRK-AAC",
                BasePrice = 45,
                Unit = "piece",
                MinOrderQuantity = 50,
                Brand = "Siporex",
                Specifications = "24\" x 8\" x 4\"",
                HsnCode = "6810",
                GstPercentage = 18,
                IsActive = true,
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Steel
            new Material
            {
                CategoryId = steelCategory.Id,
                Name = "TMT Bar 12mm (Fe 500)",
                Description = "Thermo-Mechanically Treated steel reinforcement bars",
                Sku = "STL-TMT12",
                BasePrice = 60,
                Unit = "kg",
                MinOrderQuantity = 50,
                Brand = "Tata Tiscon",
                Specifications = "12mm diameter, Fe 500 grade, 12m length",
                HsnCode = "7214",
                GstPercentage = 18,
                IsActive = true,
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Material
            {
                CategoryId = steelCategory.Id,
                Name = "TMT Bar 16mm (Fe 500)",
                Description = "16mm TMT bars for structural columns and beams",
                Sku = "STL-TMT16",
                BasePrice = 62,
                Unit = "kg",
                MinOrderQuantity = 100,
                Brand = "JSW Neosteel",
                Specifications = "16mm diameter, Fe 500 grade, 12m length",
                HsnCode = "7214",
                GstPercentage = 18,
                IsActive = true,
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Sand
            new Material
            {
                CategoryId = sandCategory.Id,
                Name = "River Sand (Fine)",
                Description = "Natural river sand for plastering and concrete",
                Sku = "SND-RIVER",
                BasePrice = 1800,
                Unit = "ton",
                MinOrderQuantity = 1,
                Specifications = "Fine grade, washed",
                HsnCode = "2505",
                GstPercentage = 5,
                IsActive = true,
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Material
            {
                CategoryId = sandCategory.Id,
                Name = "M-Sand (Manufactured Sand)",
                Description = "Crushed granite sand - eco-friendly alternative to river sand",
                Sku = "SND-MSAND",
                BasePrice = 1400,
                Unit = "ton",
                MinOrderQuantity = 1,
                Specifications = "Medium grade, 0-4.75mm",
                HsnCode = "2517",
                GstPercentage = 5,
                IsActive = true,
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Material
            {
                CategoryId = sandCategory.Id,
                Name = "20mm Jelly (Coarse Aggregate)",
                Description = "20mm crushed stone for concrete mixing",
                Sku = "AGG-20MM",
                BasePrice = 1600,
                Unit = "ton",
                MinOrderQuantity = 1,
                Specifications = "20mm nominal size",
                HsnCode = "2517",
                GstPercentage = 5,
                IsActive = true,
                DisplayOrder = 3,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Paints
            new Material
            {
                CategoryId = paintsCategory.Id,
                Name = "Asian Paints Tractor Emulsion (White)",
                Description = "Premium interior emulsion paint",
                Sku = "PNT-TRACT-W",
                BasePrice = 420,
                Unit = "litre",
                MinOrderQuantity = 1,
                Brand = "Asian Paints",
                Specifications = "1L, White, Matt finish",
                HsnCode = "3209",
                GstPercentage = 28,
                IsActive = true,
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Material
            {
                CategoryId = paintsCategory.Id,
                Name = "Birla White Wall Putty",
                Description = "Premium wall putty for smooth finish",
                Sku = "PTY-BIRLA",
                BasePrice = 600,
                Unit = "bag (40kg)",
                MinOrderQuantity = 1,
                Brand = "Birla White",
                Specifications = "40kg bag",
                HsnCode = "3214",
                GstPercentage = 18,
                IsActive = true,
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Materials.AddRange(materials);

        // === LABOR CATEGORIES ===
        var laborCategories = new List<LaborCategory>
        {
            // Masonry
            new LaborCategory
            {
                CategoryId = masonryCategory.Id,
                Name = "Mason (Skilled)",
                Description = "Experienced mason for brickwork, plastering, and concrete work",
                BaseHourlyRate = 80,
                BaseDailyRate = 640,
                SkillLevel = SkillLevel.Skilled,
                IsActive = true,
                IsPopular = true,
                MinimumExperienceYears = 3,
                CertificationRequired = false,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "masonry", "brickwork", "plastering", "popular" }),
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new LaborCategory
            {
                CategoryId = masonryCategory.Id,
                Name = "Mason Helper",
                Description = "Helper for assisting mason in construction work",
                BaseHourlyRate = 45,
                BaseDailyRate = 360,
                SkillLevel = SkillLevel.Helper,
                IsActive = true,
                IsPopular = false,
                MinimumExperienceYears = 0,
                CertificationRequired = false,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "masonry", "helper" }),
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Carpentry
            new LaborCategory
            {
                CategoryId = carpentryCategory.Id,
                Name = "Carpenter (Skilled)",
                Description = "Experienced carpenter for furniture, doors, windows, and woodwork",
                BaseHourlyRate = 75,
                BaseDailyRate = 600,
                SkillLevel = SkillLevel.Skilled,
                IsActive = true,
                IsPopular = true,
                MinimumExperienceYears = 2,
                CertificationRequired = false,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "carpentry", "furniture", "woodwork", "popular" }),
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Electrical
            new LaborCategory
            {
                CategoryId = electricalCategory.Id,
                Name = "Electrician (Skilled)",
                Description = "Licensed electrician for wiring, fixtures, and installations",
                BaseHourlyRate = 85,
                BaseDailyRate = 680,
                SkillLevel = SkillLevel.Skilled,
                IsActive = true,
                IsPopular = true,
                MinimumExperienceYears = 3,
                CertificationRequired = true,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "electrical", "wiring", "licensed", "popular" }),
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Plumbing
            new LaborCategory
            {
                CategoryId = plumbingCategory.Id,
                Name = "Plumber (Skilled)",
                Description = "Experienced plumber for pipes, fittings, and sanitary work",
                BaseHourlyRate = 70,
                BaseDailyRate = 560,
                SkillLevel = SkillLevel.Skilled,
                IsActive = true,
                IsPopular = true,
                MinimumExperienceYears = 2,
                CertificationRequired = false,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "plumbing", "pipes", "sanitary", "popular" }),
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Painting
            new LaborCategory
            {
                CategoryId = paintingCategory.Id,
                Name = "Painter (Skilled)",
                Description = "Professional painter for interior and exterior work",
                BaseHourlyRate = 60,
                BaseDailyRate = 480,
                SkillLevel = SkillLevel.Skilled,
                IsActive = true,
                IsPopular = false,
                MinimumExperienceYears = 1,
                CertificationRequired = false,
                Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "painting", "interior", "exterior" }),
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.LaborCategories.AddRange(laborCategories);

        await context.SaveChangesAsync();

        Console.WriteLine($"Seeded {materials.Count} materials and {laborCategories.Count} labor categories successfully!");
    }
}