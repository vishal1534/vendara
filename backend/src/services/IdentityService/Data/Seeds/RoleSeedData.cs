using IdentityService.Models.Entities;
using RealServ.Shared.Domain.Enums;

namespace IdentityService.Data.Seeds;

/// <summary>
/// Seed data for RBAC: Roles and Permissions
/// Covers all 3 user types: Admin, Vendor, Buyer
/// </summary>
public static class RoleSeedData
{
    // ============================================================================
    // PERMISSIONS
    // ============================================================================

    public static List<Permission> GetPermissions()
    {
        return new List<Permission>
        {
            // ====================================================================
            // ADMIN PERMISSIONS
            // ====================================================================
            
            // Vendor Management
            new() { Id = Guid.Parse("10000000-0000-0000-0000-000000000001"), Name = "vendors.view", DisplayName = "View Vendors", Description = "View vendor profiles and details", Category = "vendors" },
            new() { Id = Guid.Parse("10000000-0000-0000-0000-000000000002"), Name = "vendors.approve", DisplayName = "Approve Vendors", Description = "Approve or reject vendor applications", Category = "vendors" },
            new() { Id = Guid.Parse("10000000-0000-0000-0000-000000000003"), Name = "vendors.suspend", DisplayName = "Suspend Vendors", Description = "Suspend or activate vendor accounts", Category = "vendors" },
            new() { Id = Guid.Parse("10000000-0000-0000-0000-000000000004"), Name = "vendors.edit", DisplayName = "Edit Vendors", Description = "Edit vendor profile information", Category = "vendors" },
            new() { Id = Guid.Parse("10000000-0000-0000-0000-000000000005"), Name = "vendors.delete", DisplayName = "Delete Vendors", Description = "Delete vendor accounts", Category = "vendors" },

            // Buyer Management
            new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000001"), Name = "buyers.view", DisplayName = "View Buyers", Description = "View buyer profiles and details", Category = "buyers" },
            new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000002"), Name = "buyers.edit", DisplayName = "Edit Buyers", Description = "Edit buyer profile information", Category = "buyers" },
            new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000003"), Name = "buyers.suspend", DisplayName = "Suspend Buyers", Description = "Suspend or activate buyer accounts", Category = "buyers" },
            new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000004"), Name = "buyers.delete", DisplayName = "Delete Buyers", Description = "Delete buyer accounts", Category = "buyers" },

            // Order Management
            new() { Id = Guid.Parse("30000000-0000-0000-0000-000000000001"), Name = "orders.view", DisplayName = "View Orders", Description = "View order details and history", Category = "orders" },
            new() { Id = Guid.Parse("30000000-0000-0000-0000-000000000002"), Name = "orders.update", DisplayName = "Update Orders", Description = "Update order status and details", Category = "orders" },
            new() { Id = Guid.Parse("30000000-0000-0000-0000-000000000003"), Name = "orders.assign", DisplayName = "Assign Orders", Description = "Assign orders to vendors", Category = "orders" },
            new() { Id = Guid.Parse("30000000-0000-0000-0000-000000000004"), Name = "orders.cancel", DisplayName = "Cancel Orders", Description = "Cancel orders", Category = "orders" },
            new() { Id = Guid.Parse("30000000-0000-0000-0000-000000000005"), Name = "orders.refund", DisplayName = "Process Refunds", Description = "Process order refunds", Category = "orders" },

            // Catalog Management
            new() { Id = Guid.Parse("40000000-0000-0000-0000-000000000001"), Name = "catalog.view", DisplayName = "View Catalog", Description = "View materials and labor catalog", Category = "catalog" },
            new() { Id = Guid.Parse("40000000-0000-0000-0000-000000000002"), Name = "catalog.create", DisplayName = "Create Catalog Items", Description = "Create new materials and labor services", Category = "catalog" },
            new() { Id = Guid.Parse("40000000-0000-0000-0000-000000000003"), Name = "catalog.update", DisplayName = "Update Catalog", Description = "Update catalog items and pricing", Category = "catalog" },
            new() { Id = Guid.Parse("40000000-0000-0000-0000-000000000004"), Name = "catalog.delete", DisplayName = "Delete Catalog Items", Description = "Delete catalog items", Category = "catalog" },

            // Delivery Management
            new() { Id = Guid.Parse("50000000-0000-0000-0000-000000000001"), Name = "delivery.view", DisplayName = "View Delivery", Description = "View delivery zones and tracking", Category = "delivery" },
            new() { Id = Guid.Parse("50000000-0000-0000-0000-000000000002"), Name = "delivery.manage", DisplayName = "Manage Delivery", Description = "Manage delivery zones and fees", Category = "delivery" },

            // Settlement Management
            new() { Id = Guid.Parse("60000000-0000-0000-0000-000000000001"), Name = "settlements.view", DisplayName = "View Settlements", Description = "View vendor settlements", Category = "settlements" },
            new() { Id = Guid.Parse("60000000-0000-0000-0000-000000000002"), Name = "settlements.process", DisplayName = "Process Settlements", Description = "Process and approve settlements", Category = "settlements" },
            new() { Id = Guid.Parse("60000000-0000-0000-0000-000000000003"), Name = "settlements.approve", DisplayName = "Approve Large Settlements", Description = "Approve settlements above threshold", Category = "settlements" },

            // Support Management
            new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000001"), Name = "support.view", DisplayName = "View Support Tickets", Description = "View support tickets and messages", Category = "support" },
            new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000002"), Name = "support.respond", DisplayName = "Respond to Support", Description = "Respond to support tickets", Category = "support" },
            new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000003"), Name = "support.close", DisplayName = "Close Support Tickets", Description = "Close and resolve support tickets", Category = "support" },

            // Analytics & Reports
            new() { Id = Guid.Parse("80000000-0000-0000-0000-000000000001"), Name = "analytics.view", DisplayName = "View Analytics", Description = "View analytics and dashboards", Category = "analytics" },
            new() { Id = Guid.Parse("80000000-0000-0000-0000-000000000002"), Name = "reports.view", DisplayName = "View Reports", Description = "View and generate reports", Category = "reports" },
            new() { Id = Guid.Parse("80000000-0000-0000-0000-000000000003"), Name = "reports.export", DisplayName = "Export Reports", Description = "Export reports to CSV/Excel", Category = "reports" },

            // System Administration
            new() { Id = Guid.Parse("90000000-0000-0000-0000-000000000001"), Name = "system.logs", DisplayName = "View System Logs", Description = "View system and audit logs", Category = "system" },
            new() { Id = Guid.Parse("90000000-0000-0000-0000-000000000002"), Name = "system.settings", DisplayName = "Manage Settings", Description = "Manage system settings and configuration", Category = "system" },
            new() { Id = Guid.Parse("90000000-0000-0000-0000-000000000003"), Name = "system.users", DisplayName = "Manage Admin Users", Description = "Manage admin users and roles", Category = "system" },

            // ====================================================================
            // VENDOR PERMISSIONS (Portal & WhatsApp)
            // ====================================================================

            // Vendor Profile
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000001"), Name = "vendor.profile.view", DisplayName = "View Own Profile", Description = "View own vendor profile", Category = "vendor" },
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000002"), Name = "vendor.profile.edit", DisplayName = "Edit Own Profile", Description = "Edit own vendor profile", Category = "vendor" },

            // Vendor Orders
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000003"), Name = "vendor.orders.view", DisplayName = "View Own Orders", Description = "View assigned orders", Category = "vendor" },
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000004"), Name = "vendor.orders.accept", DisplayName = "Accept Orders", Description = "Accept assigned orders", Category = "vendor" },
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000005"), Name = "vendor.orders.update", DisplayName = "Update Order Status", Description = "Update order status and tracking", Category = "vendor" },
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000006"), Name = "vendor.orders.complete", DisplayName = "Complete Orders", Description = "Mark orders as completed", Category = "vendor" },

            // Vendor Catalog
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000007"), Name = "vendor.catalog.view", DisplayName = "View Own Catalog", Description = "View own products and services", Category = "vendor" },
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000008"), Name = "vendor.catalog.manage", DisplayName = "Manage Own Catalog", Description = "Manage own products and services", Category = "vendor" },

            // Vendor Settlements
            new() { Id = Guid.Parse("a0000000-0000-0000-0000-000000000009"), Name = "vendor.settlements.view", DisplayName = "View Own Settlements", Description = "View settlement history", Category = "vendor" },

            // ====================================================================
            // BUYER PERMISSIONS
            // ====================================================================

            // Buyer Profile
            new() { Id = Guid.Parse("b0000000-0000-0000-0000-000000000001"), Name = "buyer.profile.view", DisplayName = "View Own Profile", Description = "View own buyer profile", Category = "buyer" },
            new() { Id = Guid.Parse("b0000000-0000-0000-0000-000000000002"), Name = "buyer.profile.edit", DisplayName = "Edit Own Profile", Description = "Edit own buyer profile", Category = "buyer" },

            // Buyer Orders
            new() { Id = Guid.Parse("b0000000-0000-0000-0000-000000000003"), Name = "buyer.orders.create", DisplayName = "Create Orders", Description = "Place new orders", Category = "buyer" },
            new() { Id = Guid.Parse("b0000000-0000-0000-0000-000000000004"), Name = "buyer.orders.view", DisplayName = "View Own Orders", Description = "View order history", Category = "buyer" },
            new() { Id = Guid.Parse("b0000000-0000-0000-0000-000000000005"), Name = "buyer.orders.cancel", DisplayName = "Cancel Own Orders", Description = "Cancel own orders", Category = "buyer" },

            // Buyer Catalog
            new() { Id = Guid.Parse("b0000000-0000-0000-0000-000000000006"), Name = "buyer.catalog.view", DisplayName = "View Catalog", Description = "Browse materials and labor", Category = "buyer" },

            // Buyer Addresses
            new() { Id = Guid.Parse("b0000000-0000-0000-0000-000000000007"), Name = "buyer.addresses.manage", DisplayName = "Manage Addresses", Description = "Manage delivery addresses", Category = "buyer" },
        };
    }

    // ============================================================================
    // ROLES
    // ============================================================================

    public static List<Role> GetRoles()
    {
        return new List<Role>
        {
            // ====================================================================
            // ADMIN ROLES
            // ====================================================================
            
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "super_admin",
                DisplayName = "Super Admin",
                Description = "Full system access - all features, no limits",
                UserType = UserType.Admin,
                IsActive = true,
                IsSystemRole = true
            },
            
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "operations",
                DisplayName = "Operations",
                Description = "Operations team - business operations, vendor/buyer management",
                UserType = UserType.Admin,
                IsActive = true,
                IsSystemRole = true
            },
            
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Name = "support",
                DisplayName = "Support",
                Description = "Customer support - limited access, order/support management",
                UserType = UserType.Admin,
                IsActive = true,
                IsSystemRole = true
            },
            
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                Name = "finance",
                DisplayName = "Finance",
                Description = "Finance team - settlements, payments, financial reports",
                UserType = UserType.Admin,
                IsActive = true,
                IsSystemRole = true
            },

            // ====================================================================
            // VENDOR ROLES
            // ====================================================================
            
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                Name = "vendor",
                DisplayName = "Vendor",
                Description = "Vendor - can access via portal or WhatsApp",
                UserType = UserType.Vendor,
                IsActive = true,
                IsSystemRole = true
            },

            // ====================================================================
            // BUYER ROLES
            // ====================================================================
            
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
                Name = "buyer",
                DisplayName = "Buyer",
                Description = "Individual home builder",
                UserType = UserType.Buyer,
                IsActive = true,
                IsSystemRole = true
            }
        };
    }

    // ============================================================================
    // ROLE-PERMISSION MAPPINGS
    // ============================================================================

    public static List<RolePermission> GetRolePermissions()
    {
        var mappings = new List<RolePermission>();
        var permissions = GetPermissions().ToDictionary(p => p.Name, p => p.Id);
        var roles = GetRoles().ToDictionary(r => r.Name, r => r.Id);

        // ====================================================================
        // SUPER ADMIN - All permissions
        // ====================================================================
        var superAdminPerms = permissions.Keys.ToList();
        foreach (var perm in superAdminPerms)
        {
            mappings.Add(new RolePermission
            {
                RoleId = roles["super_admin"],
                PermissionId = permissions[perm]
            });
        }

        // ====================================================================
        // OPERATIONS - Business operations
        // ====================================================================
        var operationsPerms = new[]
        {
            "vendors.view", "vendors.approve", "vendors.suspend", "vendors.edit",
            "buyers.view", "buyers.edit", "buyers.suspend",
            "orders.view", "orders.update", "orders.assign", "orders.cancel",
            "catalog.view", "catalog.create", "catalog.update",
            "delivery.view", "delivery.manage",
            "settlements.view", "settlements.process",
            "support.view", "support.respond", "support.close",
            "analytics.view", "reports.view", "reports.export"
        };
        foreach (var perm in operationsPerms)
        {
            mappings.Add(new RolePermission
            {
                RoleId = roles["operations"],
                PermissionId = permissions[perm]
            });
        }

        // ====================================================================
        // SUPPORT - Customer support
        // ====================================================================
        var supportPerms = new[]
        {
            "vendors.view",
            "buyers.view",
            "orders.view", "orders.update",
            "catalog.view",
            "support.view", "support.respond", "support.close",
            "reports.view"
        };
        foreach (var perm in supportPerms)
        {
            mappings.Add(new RolePermission
            {
                RoleId = roles["support"],
                PermissionId = permissions[perm]
            });
        }

        // ====================================================================
        // FINANCE - Financial operations
        // ====================================================================
        var financePerms = new[]
        {
            "vendors.view",
            "buyers.view",
            "orders.view",
            "settlements.view", "settlements.process", "settlements.approve",
            "analytics.view", "reports.view", "reports.export"
        };
        foreach (var perm in financePerms)
        {
            mappings.Add(new RolePermission
            {
                RoleId = roles["finance"],
                PermissionId = permissions[perm]
            });
        }

        // ====================================================================
        // VENDOR (Portal & WhatsApp) - Same permissions
        // ====================================================================
        var vendorPerms = new[]
        {
            "vendor.profile.view", "vendor.profile.edit",
            "vendor.orders.view", "vendor.orders.accept", "vendor.orders.update", "vendor.orders.complete",
            "vendor.catalog.view", "vendor.catalog.manage",
            "vendor.settlements.view"
        };
        
        foreach (var perm in vendorPerms)
        {
            // Portal vendor
            mappings.Add(new RolePermission
            {
                RoleId = roles["vendor"],
                PermissionId = permissions[perm]
            });
        }

        // ====================================================================
        // BUYER
        // ====================================================================
        var buyerPerms = new[]
        {
            "buyer.profile.view", "buyer.profile.edit",
            "buyer.orders.create", "buyer.orders.view", "buyer.orders.cancel",
            "buyer.catalog.view",
            "buyer.addresses.manage"
        };
        foreach (var perm in buyerPerms)
        {
            mappings.Add(new RolePermission
            {
                RoleId = roles["buyer"],
                PermissionId = permissions[perm]
            });
        }

        return mappings;
    }
}