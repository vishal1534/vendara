using Microsoft.EntityFrameworkCore;
using IdentityService.Models.Entities;

namespace IdentityService.Data;

/// <summary>
/// Database context for Identity Service
/// </summary>
public class IdentityServiceDbContext : DbContext
{
    public IdentityServiceDbContext(DbContextOptions<IdentityServiceDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<BuyerProfile> BuyerProfiles { get; set; } = null!;
    public DbSet<DeliveryAddress> DeliveryAddresses { get; set; } = null!;
    public DbSet<AdminProfile> AdminProfiles { get; set; } = null!;
    public DbSet<UserSession> UserSessions { get; set; } = null!;
    public DbSet<PhoneOtp> PhoneOtps { get; set; } = null!;
    public DbSet<EmailOtp> EmailOtps { get; set; } = null!;
    
    // RBAC entities
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.FirebaseUid)
                .IsRequired()
                .HasMaxLength(128)
                .HasColumnName("firebase_uid");

            entity.HasIndex(e => e.FirebaseUid)
                .IsUnique()
                .HasDatabaseName("idx_users_firebase_uid");

            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20)
                .HasColumnName("phone_number");

            entity.HasIndex(e => e.PhoneNumber)
                .IsUnique()
                .HasDatabaseName("idx_users_phone_number");

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");

            entity.HasIndex(e => e.Email)
                .HasDatabaseName("idx_users_email");

            entity.Property(e => e.FullName)
                .HasMaxLength(255)
                .HasColumnName("full_name");

            entity.Property(e => e.UserType)
                .IsRequired()
                .HasColumnName("user_type");

            entity.Property(e => e.Status)
                .IsRequired()
                .HasColumnName("status");

            entity.Property(e => e.LastLoginAt)
                .HasColumnName("last_login_at");

            entity.Property(e => e.ProfileImageUrl)
                .HasMaxLength(500)
                .HasColumnName("profile_image_url");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by");

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");
        });

        // Configure BuyerProfile entity
        modelBuilder.Entity<BuyerProfile>(entity =>
        {
            entity.ToTable("buyer_profiles");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasColumnName("user_id");

            entity.HasIndex(e => e.UserId)
                .IsUnique()
                .HasDatabaseName("idx_buyer_profiles_user_id");

            entity.Property(e => e.BusinessName)
                .HasMaxLength(255)
                .HasColumnName("business_name");

            entity.Property(e => e.PreferredLanguage)
                .HasMaxLength(10)
                .HasDefaultValue("en")
                .HasColumnName("preferred_language");

            entity.Property(e => e.IsVerified)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_verified");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            // Relationships
            entity.HasOne(e => e.User)
                .WithOne(u => u.BuyerProfile)
                .HasForeignKey<BuyerProfile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure DeliveryAddress entity
        modelBuilder.Entity<DeliveryAddress>(entity =>
        {
            entity.ToTable("delivery_addresses");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.BuyerProfileId)
                .IsRequired()
                .HasColumnName("buyer_profile_id");

            entity.HasIndex(e => e.BuyerProfileId)
                .HasDatabaseName("idx_delivery_addresses_buyer_profile_id");

            entity.Property(e => e.Label)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("label");

            entity.Property(e => e.AddressLine1)
                .IsRequired()
                .HasMaxLength(500)
                .HasColumnName("address_line1");

            entity.Property(e => e.AddressLine2)
                .HasMaxLength(500)
                .HasColumnName("address_line2");

            entity.Property(e => e.City)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("city");

            entity.Property(e => e.State)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("state");

            entity.Property(e => e.Pincode)
                .IsRequired()
                .HasMaxLength(10)
                .HasColumnName("pincode");

            entity.Property(e => e.Latitude)
                .HasColumnName("latitude");

            entity.Property(e => e.Longitude)
                .HasColumnName("longitude");

            entity.Property(e => e.IsDefault)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_default");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            // Relationships
            entity.HasOne(e => e.BuyerProfile)
                .WithMany(b => b.DeliveryAddresses)
                .HasForeignKey(e => e.BuyerProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure AdminProfile entity
        modelBuilder.Entity<AdminProfile>(entity =>
        {
            entity.ToTable("admin_profiles");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasColumnName("user_id");

            entity.HasIndex(e => e.UserId)
                .IsUnique()
                .HasDatabaseName("idx_admin_profiles_user_id");

            entity.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("admin")
                .HasColumnName("role");

            entity.Property(e => e.Permissions)
                .HasColumnType("jsonb")
                .HasColumnName("permissions");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            // Relationships
            entity.HasOne(e => e.User)
                .WithOne(u => u.AdminProfile)
                .HasForeignKey<AdminProfile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure UserSession entity
        modelBuilder.Entity<UserSession>(entity =>
        {
            entity.ToTable("user_sessions");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasColumnName("user_id");

            entity.HasIndex(e => e.UserId)
                .HasDatabaseName("idx_user_sessions_user_id");

            entity.Property(e => e.DeviceId)
                .IsRequired()
                .HasMaxLength(255)
                .HasColumnName("device_id");

            entity.Property(e => e.DeviceType)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnName("device_type");

            entity.Property(e => e.FcmToken)
                .HasMaxLength(255)
                .HasColumnName("fcm_token");

            entity.Property(e => e.LastActiveAt)
                .IsRequired()
                .HasColumnName("last_active_at");

            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("is_active");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            // Relationships
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure PhoneOtp entity
        modelBuilder.Entity<PhoneOtp>(entity =>
        {
            entity.ToTable("phone_otps");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20)
                .HasColumnName("phone_number");

            entity.HasIndex(e => e.PhoneNumber)
                .HasDatabaseName("idx_phone_otps_phone_number");

            entity.Property(e => e.OtpCode)
                .IsRequired()
                .HasMaxLength(6)
                .HasColumnName("otp_code");

            entity.Property(e => e.ExpiresAt)
                .IsRequired()
                .HasColumnName("expires_at");

            entity.Property(e => e.IsVerified)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_verified");

            entity.Property(e => e.AttemptCount)
                .IsRequired()
                .HasDefaultValue(0)
                .HasColumnName("attempt_count");

            entity.Property(e => e.VerifiedAt)
                .HasColumnName("verified_at");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
        });

        // Configure EmailOtp entity
        modelBuilder.Entity<EmailOtp>(entity =>
        {
            entity.ToTable("email_otps");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255)
                .HasColumnName("email");

            entity.HasIndex(e => e.Email)
                .HasDatabaseName("idx_email_otps_email");

            entity.Property(e => e.OtpCode)
                .IsRequired()
                .HasMaxLength(6)
                .HasColumnName("otp_code");

            entity.Property(e => e.ExpiresAt)
                .IsRequired()
                .HasColumnName("expires_at");

            entity.Property(e => e.IsVerified)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_verified");

            entity.Property(e => e.AttemptCount)
                .IsRequired()
                .HasDefaultValue(0)
                .HasColumnName("attempt_count");

            entity.Property(e => e.VerifiedAt)
                .HasColumnName("verified_at");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
        });

        // Configure Role entity
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("roles");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnName("name");

            entity.HasIndex(e => e.Name)
                .IsUnique()
                .HasDatabaseName("idx_roles_name");

            entity.Property(e => e.DisplayName)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("display_name");

            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");

            entity.Property(e => e.UserType)
                .IsRequired()
                .HasColumnName("user_type");

            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("is_active");

            entity.Property(e => e.IsSystemRole)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_system_role");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by");

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");
        });

        // Configure Permission entity
        modelBuilder.Entity<Permission>(entity =>
        {
            entity.ToTable("permissions");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnName("name");

            entity.HasIndex(e => e.Name)
                .IsUnique()
                .HasDatabaseName("idx_permissions_name");

            entity.Property(e => e.DisplayName)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("display_name");

            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");

            entity.Property(e => e.Category)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnName("category");

            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("is_active");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
        });

        // Configure RolePermission entity
        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.ToTable("role_permissions");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.RoleId)
                .IsRequired()
                .HasColumnName("role_id");

            entity.HasIndex(e => e.RoleId)
                .HasDatabaseName("idx_role_permissions_role_id");

            entity.Property(e => e.PermissionId)
                .IsRequired()
                .HasColumnName("permission_id");

            entity.HasIndex(e => e.PermissionId)
                .HasDatabaseName("idx_role_permissions_permission_id");

            // Composite unique index
            entity.HasIndex(e => new { e.RoleId, e.PermissionId })
                .IsUnique()
                .HasDatabaseName("idx_role_permissions_unique");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            // Relationships
            entity.HasOne(e => e.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(e => e.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure UserRole entity
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.ToTable("user_roles");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasColumnName("user_id");

            entity.HasIndex(e => e.UserId)
                .HasDatabaseName("idx_user_roles_user_id");

            entity.Property(e => e.RoleId)
                .IsRequired()
                .HasColumnName("role_id");

            entity.HasIndex(e => e.RoleId)
                .HasDatabaseName("idx_user_roles_role_id");

            // Composite unique index
            entity.HasIndex(e => new { e.UserId, e.RoleId })
                .IsUnique()
                .HasDatabaseName("idx_user_roles_unique");

            entity.Property(e => e.AssignedAt)
                .IsRequired()
                .HasColumnName("assigned_at");

            entity.Property(e => e.AssignedBy)
                .HasColumnName("assigned_by");

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            // Relationships
            entity.HasOne(e => e.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}