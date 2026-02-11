namespace RealServ.Shared.Domain.Enums;

public enum PaymentStatus
{
    Pending = 1,
    Processing = 2,
    Captured = 3,
    Failed = 4,
    Refunded = 5,
    PartiallyRefunded = 6,
    CODPending = 7,
    CODCollected = 8
}

public enum PaymentMethod
{
    Online = 1,
    COD = 2,
    UPI = 3,
    Card = 4,
    NetBanking = 5,
    Wallet = 6
}
