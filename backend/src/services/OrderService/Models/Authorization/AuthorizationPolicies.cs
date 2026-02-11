namespace OrderService.Models.Authorization;

public static class AuthorizationPolicies
{
    public const string AdminOnly = "AdminOnly";
    public const string VendorOnly = "VendorOnly";
    public const string CustomerOnly = "CustomerOnly";
    public const string VendorOrAdmin = "VendorOrAdmin";
    public const string CustomerOrAdmin = "CustomerOrAdmin";
    public const string CustomerOrVendor = "CustomerOrVendor";
    public const string AnyAuthenticated = "AnyAuthenticated";
}

public static class UserRoles
{
    public const string Admin = "admin";
    public const string Vendor = "vendor";
    public const string Customer = "customer";
}
