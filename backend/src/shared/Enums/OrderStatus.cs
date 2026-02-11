namespace RealServ.Shared.Domain.Enums;

public enum OrderStatus
{
    Pending = 1,
    PaymentPending = 2,
    Paid = 3,
    Confirmed = 4,
    InProgress = 5,
    OutForDelivery = 6,
    Delivered = 7,
    Completed = 8,
    Cancelled = 9,
    Disputed = 10
}
