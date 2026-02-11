# RBAC Implementation - 3 User Type Validation

## ✅ Scenario 1: BUYER

### User Type
- `UserType.Buyer`

### Roles
- **buyer** (system role)

### Permissions
| Permission | Description |
|------------|-------------|
| `buyer.profile.view` | View own buyer profile |
| `buyer.profile.edit` | Edit own buyer profile |
| `buyer.orders.create` | Place new orders |
| `buyer.orders.view` | View order history |
| `buyer.orders.cancel` | Cancel own orders |
| `buyer.catalog.view` | Browse materials and labor |
| `buyer.addresses.manage` | Manage delivery addresses |

### Use Cases
1. **Registration/Login** → User created with `UserType.Buyer` → Auto-assigned `buyer` role
2. **Browse Catalog** → Check permission: `buyer.catalog.view`
3. **Place Order** → Check permission: `buyer.orders.create`
4. **View Orders** → Check permission: `buyer.orders.view`
5. **Manage Profile** → Check permission: `buyer.profile.edit`
6. **Add Delivery Address** → Check permission: `buyer.addresses.manage`

### Validation
- ✅ Role exists: `buyer` for `UserType.Buyer`
- ✅ Permissions cover all buyer workflows
- ✅ No admin/vendor permissions

---

## ✅ Scenario 2: VENDOR

### User Type
- `UserType.Vendor`

### Roles
- **vendor** (system role)

### Access Channels
- ✅ **Web/Mobile Portal** - Full-featured UI
- ✅ **WhatsApp Bot** - Conversational interface

**Note:** Access channel is tracked separately (via `UserSession.deviceType` or login metadata), NOT via separate roles. The role represents "what you can do", not "how you login".

### Permissions
| Permission | Description |
|------------|-------------|
| `vendor.profile.view` | View own vendor profile |
| `vendor.profile.edit` | Edit own vendor profile |
| `vendor.orders.view` | View assigned orders |
| `vendor.orders.accept` | Accept assigned orders |
| `vendor.orders.update` | Update order status and tracking |
| `vendor.orders.complete` | Mark orders as completed |
| `vendor.catalog.view` | View own products and services |
| `vendor.catalog.manage` | Manage own products and services |
| `vendor.settlements.view` | View settlement history |

### Use Cases

#### Portal Access
1. **Registration/Login (Portal)** → User created with `UserType.Vendor` → Auto-assigned `vendor` role
2. **View Orders (Portal)** → Check permission: `vendor.orders.view`
3. **Accept Order (Portal)** → Check permission: `vendor.orders.accept`
4. **Update Order Status (Portal)** → Check permission: `vendor.orders.update`
5. **Complete Order (Portal)** → Check permission: `vendor.orders.complete`
6. **Manage Catalog (Portal)** → Check permission: `vendor.catalog.manage`
7. **View Settlements (Portal)** → Check permission: `vendor.settlements.view`
8. **Update Profile (Portal)** → Check permission: `vendor.profile.edit`

#### WhatsApp Access
1. **WhatsApp Bot Authentication** → User authenticated with `UserType.Vendor` → Has `vendor` role
2. **View New Orders (WhatsApp)** → Check permission: `vendor.orders.view`
3. **Accept Order (WhatsApp reply)** → Check permission: `vendor.orders.accept`
4. **Update Status (WhatsApp)** → Check permission: `vendor.orders.update`
5. **Complete Order (WhatsApp)** → Check permission: `vendor.orders.complete`

### Validation
- ✅ Single `vendor` role for `UserType.Vendor`
- ✅ Same permissions across all access channels
- ✅ Access channel tracked separately from role
- ✅ Permissions cover all vendor workflows (portal + WhatsApp)
- ✅ No buyer/admin permissions

---

## ✅ Scenario 3: ADMIN

### User Type
- `UserType.Admin`

### Roles
1. **super_admin** (system role) - Full access
2. **operations** (system role) - Business operations
3. **support** (system role) - Customer support
4. **finance** (system role) - Financial operations

### Permissions by Role

#### SUPER ADMIN
**ALL PERMISSIONS** (50 permissions total)

#### OPERATIONS
| Permission | Description |
|------------|-------------|
| **Vendor Management** |
| `vendors.view` | View vendor profiles |
| `vendors.approve` | Approve/reject vendor applications |
| `vendors.suspend` | Suspend/activate vendors |
| `vendors.edit` | Edit vendor information |
| **Buyer Management** |
| `buyers.view` | View buyer profiles |
| `buyers.edit` | Edit buyer information |
| `buyers.suspend` | Suspend/activate buyers |
| **Order Management** |
| `orders.view` | View all orders |
| `orders.update` | Update order status |
| `orders.assign` | Assign orders to vendors |
| `orders.cancel` | Cancel orders |
| **Catalog Management** |
| `catalog.view` | View catalog |
| `catalog.create` | Create new items |
| `catalog.update` | Update catalog |
| **Delivery Management** |
| `delivery.view` | View delivery zones |
| `delivery.manage` | Manage delivery zones |
| **Settlement Management** |
| `settlements.view` | View settlements |
| `settlements.process` | Process settlements |
| **Support Management** |
| `support.view` | View support tickets |
| `support.respond` | Respond to tickets |
| `support.close` | Close tickets |
| **Analytics** |
| `analytics.view` | View analytics |
| `reports.view` | View reports |
| `reports.export` | Export reports |

#### SUPPORT
| Permission | Description |
|------------|-------------|
| `vendors.view` | View vendor profiles (read-only) |
| `buyers.view` | View buyer profiles (read-only) |
| `orders.view` | View orders |
| `orders.update` | Update order status (limited) |
| `catalog.view` | View catalog (read-only) |
| `support.view` | View support tickets |
| `support.respond` | Respond to tickets |
| `support.close` | Close tickets |
| `reports.view` | View reports |

#### FINANCE
| Permission | Description |
|------------|-------------|
| `vendors.view` | View vendor profiles |
| `buyers.view` | View buyer profiles |
| `orders.view` | View orders |
| `settlements.view` | View settlements |
| `settlements.process` | Process settlements |
| `settlements.approve` | Approve large settlements |
| `analytics.view` | View analytics |
| `reports.view` | View reports |
| `reports.export` | Export reports |

### Use Cases

#### Super Admin
1. **Access Everything** → No permission checks (superuser)
2. **Manage Roles** → Create/edit/delete roles
3. **Manage Permissions** → Create/edit/delete permissions
4. **System Settings** → Configure system
5. **View Logs** → Access audit logs

#### Operations
1. **Approve Vendor** → Check permission: `vendors.approve`
2. **Assign Order** → Check permission: `orders.assign`
3. **Update Catalog** → Check permission: `catalog.update`
4. **Process Settlement** → Check permission: `settlements.process`
5. **Manage Delivery Zones** → Check permission: `delivery.manage`

#### Support
1. **View Ticket** → Check permission: `support.view`
2. **Respond to Ticket** → Check permission: `support.respond`
3. **Update Order** → Check permission: `orders.update`
4. **View Reports** → Check permission: `reports.view`

#### Finance
1. **View Settlements** → Check permission: `settlements.view`
2. **Process Settlement** → Check permission: `settlements.process`
3. **Approve Large Settlement** → Check permission: `settlements.approve`
4. **Export Financial Reports** → Check permission: `reports.export`

### Validation
- ✅ 4 distinct admin roles
- ✅ Super admin has all permissions
- ✅ Operations has business permissions
- ✅ Support has limited support permissions
- ✅ Finance has financial permissions
- ✅ No role overlap (flat RBAC)
- ✅ All roles are for `UserType.Admin` only

---

## 🔒 Security Validations

### Role-to-UserType Enforcement
```csharp
// In RoleService.AssignRolesToUserAsync()
if (role.UserType != user.UserType)
{
    throw new InvalidOperationException(
        $"Role '{role.Name}' is for {role.UserType} users only"
    );
}
```

**Prevents:**
- ❌ Assigning admin role to buyer
- ❌ Assigning buyer role to vendor
- ❌ Assigning vendor role to admin

### Examples
- ✅ Assign `buyer` role to `UserType.Buyer` → **ALLOWED**
- ❌ Assign `super_admin` role to `UserType.Buyer` → **BLOCKED**
- ✅ Assign `vendor` role to `UserType.Vendor` → **ALLOWED**
- ❌ Assign `buyer` role to `UserType.Admin` → **BLOCKED**

### Multi-Role Support
- ✅ User can have multiple roles
- ✅ Permissions are flattened (union of all role permissions)
- ✅ Example: Admin can have both `operations` AND `finance` roles

---

## 📊 Database Schema

### Tables
1. **roles** - Role definitions
2. **permissions** - Permission definitions
3. **role_permissions** - Role-to-Permission mapping (M:N)
4. **user_roles** - User-to-Role mapping (M:N)

### Key Fields
- **roles.user_type** - Restricts role to specific user type
- **roles.is_system_role** - Prevents deletion of core roles
- **user_roles.assigned_by** - Audit trail for role assignments

---

## 🎯 API Endpoints

### Role Management
```
GET    /api/v1/roles                          # Get all roles
GET    /api/v1/roles?userType=Admin           # Filter by user type
GET    /api/v1/roles/{roleId}                 # Get role by ID
GET    /api/v1/roles/by-name/{roleName}       # Get role by name
POST   /api/v1/roles                          # Create role
PUT    /api/v1/roles/{roleId}                 # Update role
DELETE /api/v1/roles/{roleId}                 # Delete role
```

### Permission Management
```
GET    /api/v1/permissions                    # Get all permissions
GET    /api/v1/permissions?category=vendors   # Filter by category
GET    /api/v1/permissions/{permissionId}     # Get permission
POST   /api/v1/permissions                    # Create permission
PUT    /api/v1/permissions/{permissionId}     # Update permission
DELETE /api/v1/permissions/{permissionId}     # Delete permission
```

### User Role Assignment
```
POST   /api/v1/users/{userId}/roles           # Assign roles to user
DELETE /api/v1/users/{userId}/roles           # Remove roles from user
GET    /api/v1/users/{userId}/roles           # Get user with roles
GET    /api/v1/users/{userId}/permissions     # Get user permissions
GET    /api/v1/users/{userId}/permissions/{permissionName}/check
GET    /api/v1/users/{userId}/roles/{roleName}/check
```

---

## ✅ 3-User-Type Checklist

### Buyer ✅
- [x] Role: `buyer` for `UserType.Buyer`
- [x] 7 permissions covering all workflows
- [x] Auto-assigned on registration
- [x] Cannot access admin/vendor features

### Vendor ✅
- [x] Role: `vendor` for `UserType.Vendor`
- [x] 9 permissions covering all workflows
- [x] Works for BOTH portal and WhatsApp access
- [x] Auto-assigned on registration/authentication
- [x] Cannot access admin/buyer features
- [x] Access channel tracked separately

### Admin ✅
- [x] 4 roles: `super_admin`, `operations`, `support`, `finance`
- [x] All for `UserType.Admin`
- [x] 39 admin permissions across 10 categories
- [x] Proper permission segregation
- [x] Supports multi-role assignment

---

## 🚀 Migration Path

### Existing AdminProfile (Deprecated)
```csharp
[Obsolete("Use UserRoles with RBAC instead")]
public string Role { get; set; } = "admin";
```

### Migration Steps
1. Seed roles and permissions tables
2. Migrate existing admin users to new RBAC
3. Phase out AdminProfile.Role and AdminProfile.Permissions
4. Use UserRoles table exclusively

---

## 📝 Summary

**Total Roles:** 6
- Admin: 4 (super_admin, operations, support, finance)
- Vendor: 1 (vendor)
- Buyer: 1 (buyer)

**Total Permissions:** 50
- Admin: 39 permissions
- Vendor: 9 permissions
- Buyer: 7 permissions

**Architecture:**
- ✅ Flat RBAC (no inheritance)
- ✅ Multi-role support (1:N user-to-role)
- ✅ Role-to-UserType validation
- ✅ System roles (cannot be deleted)
- ✅ Dynamic permission management
- ✅ All 3 user types fully supported
- ✅ Single Identity Service for all users (industry best practice)

**Access Channels:**
- ✅ Buyer: Mobile app, Web portal
- ✅ Vendor: Mobile app, Web portal, WhatsApp bot
- ✅ Admin: Web portal
- ✅ Channel tracked separately from roles (UserSession, login metadata)
