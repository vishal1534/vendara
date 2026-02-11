namespace OrderService.Models.Enums;

/// <summary>
/// Payment method enumeration
/// </summary>
public enum PaymentMethod
{
    /// <summary>
    /// Cash on delivery
    /// </summary>
    CashOnDelivery = 1,
    
    /// <summary>
    /// Online payment (UPI, cards, wallets)
    /// </summary>
    Online = 2,
    
    /// <summary>
    /// Bank transfer/NEFT/RTGS
    /// </summary>
    BankTransfer = 3,
    
    /// <summary>
    /// Credit (pay later)
    /// </summary>
    Credit = 4,
    
    /// <summary>
    /// Cheque
    /// </summary>
    Cheque = 5
}
