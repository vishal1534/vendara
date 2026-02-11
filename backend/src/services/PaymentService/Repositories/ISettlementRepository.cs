using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public interface ISettlementRepository
{
    Task<VendorSettlement?> GetByIdAsync(Guid id);
    Task<List<VendorSettlement>> GetByVendorIdAsync(Guid vendorId, int page, int pageSize);
    Task<List<VendorSettlement>> GetAllAsync(int page, int pageSize, string? status = null);
    Task<VendorSettlement> CreateAsync(VendorSettlement settlement);
    Task<VendorSettlement> UpdateAsync(VendorSettlement settlement);
    Task<int> GetTotalCountAsync(string? status = null);
    Task<int> GetVendorSettlementCountAsync(Guid vendorId);
    Task<List<SettlementLineItem>> GetLineItemsBySettlementIdAsync(Guid settlementId);
    Task<SettlementLineItem> CreateLineItemAsync(SettlementLineItem lineItem);
}
