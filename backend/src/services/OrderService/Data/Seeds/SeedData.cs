using OrderService.Models.Entities;
using OrderService.Models.Enums;

namespace OrderService.Data.Seeds;

public static class SeedData
{
    // Sample UUIDs for testing (these would come from Identity and Catalog services in production)
    private static readonly Guid Customer1Id = Guid.Parse("c0000000-0000-0000-0000-000000000001");
    private static readonly Guid Customer2Id = Guid.Parse("c0000000-0000-0000-0000-000000000002");
    private static readonly Guid Customer3Id = Guid.Parse("c0000000-0000-0000-0000-000000000003");
    
    private static readonly Guid Vendor1Id = Guid.Parse("v0000000-0000-0000-0000-000000000001");
    private static readonly Guid Vendor2Id = Guid.Parse("v0000000-0000-0000-0000-000000000002");
    
    private static readonly Guid Admin1Id = Guid.Parse("a0000000-0000-0000-0000-000000000001");
    
    private static readonly Guid Material1Id = Guid.Parse("33333333-3333-3333-3333-333333333301"); // OPC 53 Cement
    private static readonly Guid Material2Id = Guid.Parse("33333333-3333-3333-3333-333333333303"); // Red Bricks
    private static readonly Guid Material3Id = Guid.Parse("33333333-3333-3333-3333-333333333305"); // TMT Bar 12mm
    private static readonly Guid Material4Id = Guid.Parse("33333333-3333-3333-3333-333333333307"); // River Sand
    
    private static readonly Guid Labor1Id = Guid.Parse("44444444-4444-4444-4444-444444444401"); // Skilled Mason
    private static readonly Guid Labor2Id = Guid.Parse("44444444-4444-4444-4444-444444444403"); // Skilled Carpenter

    public static List<DeliveryAddress> GetDeliveryAddresses()
    {
        return new List<DeliveryAddress>
        {
            new DeliveryAddress
            {
                Id = Guid.Parse("a0000000-0000-0000-0000-000000000001"),
                CustomerId = Customer1Id,
                Label = "Construction Site - Hitech City",
                ContactName = "Vishal Chauhan",
                ContactPhone = "+91 7906441952",
                AddressLine1 = "Plot No. 123, Hitech City Road",
                AddressLine2 = "Near Cyber Towers",
                Landmark = "Opposite Mindspace IT Park",
                City = "Hyderabad",
                State = "Telangana",
                PostalCode = "500081",
                Country = "India",
                Latitude = 17.4435,
                Longitude = 78.3772,
                IsDefault = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new DeliveryAddress
            {
                Id = Guid.Parse("a0000000-0000-0000-0000-000000000002"),
                CustomerId = Customer2Id,
                Label = "Residential Site - Gachibowli",
                ContactName = "Srinivas Reddy",
                ContactPhone = "+91 98765 43211",
                AddressLine1 = "H.No. 8-2-120/87, Gachibowli",
                AddressLine2 = "Road No. 3, Telecom Nagar",
                Landmark = "Near DLF Cyber City",
                City = "Hyderabad",
                State = "Telangana",
                PostalCode = "500032",
                Country = "India",
                Latitude = 17.4399,
                Longitude = 78.3489,
                IsDefault = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new DeliveryAddress
            {
                Id = Guid.Parse("a0000000-0000-0000-0000-000000000003"),
                CustomerId = Customer3Id,
                Label = "Villa Project - Manikonda",
                ContactName = "Venkat Rao",
                ContactPhone = "+91 98765 43212",
                AddressLine1 = "Plot No. 456, Manikonda Main Road",
                AddressLine2 = "Lanco Hills Layout",
                Landmark = "Near Manikonda Bus Stop",
                City = "Hyderabad",
                State = "Telangana",
                PostalCode = "500089",
                Country = "India",
                Latitude = 17.4126,
                Longitude = 78.3870,
                IsDefault = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-20)
            }
        };
    }

    public static List<Order> GetOrders()
    {
        var baseDate = DateTime.UtcNow.AddDays(-15);
        
        return new List<Order>
        {
            // Order 1: Completed material order
            new Order
            {
                Id = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                OrderNumber = "ORD-2026-00001",
                CustomerId = Customer1Id,
                VendorId = Vendor1Id,
                OrderType = OrderType.Material,
                Status = OrderStatus.Completed,
                DeliveryAddressId = Guid.Parse("a0000000-0000-0000-0000-000000000001"),
                SubtotalAmount = 22000.00m,
                GstAmount = 6160.00m,
                DeliveryCharges = 500.00m,
                DiscountAmount = 0.00m,
                TotalAmount = 28660.00m,
                
                // Platform fees and vendor payout
                PlatformFee = 660.00m, // 3% of subtotal
                LogisticsFee = 500.00m, // Same as delivery charges
                Deductions = 220.00m, // Damaged items refund deduction
                VendorPayoutAmount = 20620.00m, // Subtotal - platform fee - logistics - deductions
                
                // Denormalized buyer information
                BuyerName = "Vishal Chauhan",
                BuyerPhone = "+91 7906441952",
                BuyerLocation = "Hitech City, Hyderabad",
                
                // Denormalized vendor information
                VendorName = "BuildMart Suppliers",
                VendorType = "Material Supplier",
                VendorPhone = "+91 98765 55555",
                
                // Offer and acceptance tracking
                OfferedAt = baseDate.AddHours(-2),
                OfferExpiresAt = baseDate.AddHours(22), // 24 hour window
                AcceptedAt = baseDate.AddHours(2),
                RespondedAt = baseDate.AddHours(2),
                
                // Rating and review
                Rating = 4,
                ReviewText = "Good quality cement, but had some damaged bags. Vendor was responsive and refunded for damaged items.",
                ReviewedAt = baseDate.AddDays(2).AddHours(8),
                
                // Settlement tracking
                SettlementId = Guid.Parse("s0000001-0000-0000-0000-000000000001"),
                SettlementDate = baseDate.AddDays(5),
                SettlementStatus = "settled",
                
                // Delivery time slot
                DeliverySlotStart = new TimeSpan(8, 0, 0), // 8:00 AM
                DeliverySlotEnd = new TimeSpan(12, 0, 0), // 12:00 PM
                
                CustomerNotes = "Please deliver between 8 AM - 12 PM",
                ExpectedDeliveryDate = baseDate.AddDays(2),
                ActualDeliveryDate = baseDate.AddDays(2),
                CreatedAt = baseDate,
                UpdatedAt = baseDate.AddDays(2)
            },
            
            // Order 2: In-progress labor booking
            new Order
            {
                Id = Guid.Parse("00000002-0000-0000-0000-000000000002"),
                OrderNumber = "ORD-2026-00002",
                CustomerId = Customer2Id,
                VendorId = Vendor1Id,
                OrderType = OrderType.Labor,
                Status = OrderStatus.Processing,
                DeliveryAddressId = Guid.Parse("a0000000-0000-0000-0000-000000000002"),
                SubtotalAmount = 9600.00m,
                GstAmount = 0.00m,
                DeliveryCharges = 0.00m,
                DiscountAmount = 0.00m,
                TotalAmount = 9600.00m,
                CustomerNotes = "Need skilled masons for wall construction",
                ExpectedDeliveryDate = baseDate.AddDays(5),
                CreatedAt = baseDate.AddDays(1),
                UpdatedAt = baseDate.AddDays(3)
            },
            
            // Order 3: Combined order - confirmed
            new Order
            {
                Id = Guid.Parse("00000003-0000-0000-0000-000000000003"),
                OrderNumber = "ORD-2026-00003",
                CustomerId = Customer3Id,
                VendorId = Vendor2Id,
                OrderType = OrderType.Combined,
                Status = OrderStatus.Confirmed,
                DeliveryAddressId = Guid.Parse("a0000000-0000-0000-0000-000000000003"),
                SubtotalAmount = 45500.00m,
                GstAmount = 8190.00m,
                DeliveryCharges = 800.00m,
                DiscountAmount = 500.00m,
                TotalAmount = 53990.00m,
                CustomerNotes = "Large order for villa construction - foundation work",
                ExpectedDeliveryDate = baseDate.AddDays(7),
                CreatedAt = baseDate.AddDays(2),
                UpdatedAt = baseDate.AddDays(2)
            },
            
            // Order 4: Pending order
            new Order
            {
                Id = Guid.Parse("00000004-0000-0000-0000-000000000004"),
                OrderNumber = "ORD-2026-00004",
                CustomerId = Customer1Id,
                VendorId = Vendor2Id,
                OrderType = OrderType.Material,
                Status = OrderStatus.Pending,
                DeliveryAddressId = Guid.Parse("a0000000-0000-0000-0000-000000000001"),
                SubtotalAmount = 12000.00m,
                GstAmount = 2160.00m,
                DeliveryCharges = 400.00m,
                DiscountAmount = 0.00m,
                TotalAmount = 14560.00m,
                CustomerNotes = "Required for second floor construction",
                ExpectedDeliveryDate = baseDate.AddDays(10),
                CreatedAt = baseDate.AddDays(5),
                UpdatedAt = baseDate.AddDays(5)
            },
            
            // Order 5: Dispatched order
            new Order
            {
                Id = Guid.Parse("00000005-0000-0000-0000-000000000005"),
                OrderNumber = "ORD-2026-00005",
                CustomerId = Customer2Id,
                VendorId = Vendor1Id,
                OrderType = OrderType.Material,
                Status = OrderStatus.Dispatched,
                DeliveryAddressId = Guid.Parse("a0000000-0000-0000-0000-000000000002"),
                SubtotalAmount = 8500.00m,
                GstAmount = 1530.00m,
                DeliveryCharges = 300.00m,
                DiscountAmount = 100.00m,
                TotalAmount = 10230.00m,
                CustomerNotes = "Sand and aggregates for plastering work",
                ExpectedDeliveryDate = baseDate.AddDays(8),
                CreatedAt = baseDate.AddDays(4),
                UpdatedAt = baseDate.AddDays(6)
            }
        };
    }

    public static List<OrderItem> GetOrderItems()
    {
        return new List<OrderItem>
        {
            // Order 1 items (Cement)
            new OrderItem
            {
                Id = Guid.Parse("10000001-0000-0000-0000-000000000001"),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                MaterialId = Material1Id,
                VendorInventoryId = Guid.NewGuid(),
                MaterialName = "OPC 53 Grade Cement",
                Category = "Cement",
                Sku = "CEM-OPC53-UT",
                Unit = "bag (50kg)",
                UnitPrice = 440.00m,
                Quantity = 50,
                GstPercentage = 28.00m,
                GstAmount = 6160.00m,
                TotalAmount = 22000.00m,
                Notes = "UltraTech brand",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            },
            
            // Order 3 items (Combined order)
            new OrderItem
            {
                Id = Guid.Parse("10000002-0000-0000-0000-000000000002"),
                OrderId = Guid.Parse("00000003-0000-0000-0000-000000000003"),
                MaterialId = Material3Id,
                VendorInventoryId = Guid.NewGuid(),
                MaterialName = "TMT Bar 12mm",
                Category = "Steel",
                Sku = "STL-TMT12-JS",
                Unit = "kg",
                UnitPrice = 55.00m,
                Quantity = 500,
                GstPercentage = 18.00m,
                GstAmount = 4950.00m,
                TotalAmount = 27500.00m,
                Notes = "JSW Steel - Grade Fe 500D",
                CreatedAt = DateTime.UtcNow.AddDays(-13)
            },
            new OrderItem
            {
                Id = Guid.Parse("10000003-0000-0000-0000-000000000003"),
                OrderId = Guid.Parse("00000003-0000-0000-0000-000000000003"),
                MaterialId = Material4Id,
                VendorInventoryId = Guid.NewGuid(),
                MaterialName = "River Sand",
                Category = "Sand",
                Sku = "SND-RIV-NAT",
                Unit = "cft",
                UnitPrice = 45.00m,
                Quantity = 400,
                GstPercentage = 5.00m,
                GstAmount = 900.00m,
                TotalAmount = 18000.00m,
                Notes = "Washed and graded",
                CreatedAt = DateTime.UtcNow.AddDays(-13)
            },
            
            // Order 4 items
            new OrderItem
            {
                Id = Guid.Parse("10000004-0000-0000-0000-000000000004"),
                OrderId = Guid.Parse("00000004-0000-0000-0000-000000000004"),
                MaterialId = Material2Id,
                VendorInventoryId = Guid.NewGuid(),
                MaterialName = "Red Clay Bricks",
                Category = "Bricks",
                Sku = "BRK-RED-STD",
                Unit = "piece",
                UnitPrice = 8.50m,
                Quantity = 1000,
                GstPercentage = 12.00m,
                GstAmount = 1020.00m,
                TotalAmount = 8500.00m,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new OrderItem
            {
                Id = Guid.Parse("10000005-0000-0000-0000-000000000005"),
                OrderId = Guid.Parse("00000004-0000-0000-0000-000000000004"),
                MaterialId = Material1Id,
                VendorInventoryId = Guid.NewGuid(),
                MaterialName = "OPC 53 Grade Cement",
                Category = "Cement",
                Sku = "CEM-OPC53-UT",
                Unit = "bag (50kg)",
                UnitPrice = 440.00m,
                Quantity = 8,
                GstPercentage = 28.00m,
                GstAmount = 985.60m,
                TotalAmount = 3520.00m,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            
            // Order 5 items
            new OrderItem
            {
                Id = Guid.Parse("10000006-0000-0000-0000-000000000006"),
                OrderId = Guid.Parse("00000005-0000-0000-0000-000000000005"),
                MaterialId = Material4Id,
                VendorInventoryId = Guid.NewGuid(),
                MaterialName = "River Sand",
                Category = "Sand",
                Sku = "SND-RIV-NAT",
                Unit = "cft",
                UnitPrice = 45.00m,
                Quantity = 150,
                GstPercentage = 5.00m,
                GstAmount = 337.50m,
                TotalAmount = 6750.00m,
                CreatedAt = DateTime.UtcNow.AddDays(-11)
            }
        };
    }

    public static List<OrderLabor> GetOrderLabors()
    {
        return new List<OrderLabor>
        {
            // Order 2 labor (Labor only order)
            new OrderLabor
            {
                Id = Guid.Parse("20000001-0000-0000-0000-000000000001"),
                OrderId = Guid.Parse("00000002-0000-0000-0000-000000000002"),
                LaborCategoryId = Labor1Id,
                VendorLaborAvailabilityId = Guid.NewGuid(),
                LaborCategoryName = "Skilled Mason",
                SkillLevel = 2,
                WorkerCount = 2,
                HourlyRate = 75.00m,
                DailyRate = 600.00m,
                StartDate = DateTime.UtcNow.AddDays(-12),
                EndDate = DateTime.UtcNow.AddDays(-4),
                DaysBooked = 8,
                TotalAmount = 9600.00m,
                Requirements = "Experienced in wall construction and plastering",
                CreatedAt = DateTime.UtcNow.AddDays(-14)
            },
            
            // Order 3 labor (Combined order)
            new OrderLabor
            {
                Id = Guid.Parse("20000002-0000-0000-0000-000000000002"),
                OrderId = Guid.Parse("00000003-0000-0000-0000-000000000003"),
                LaborCategoryId = Labor2Id,
                VendorLaborAvailabilityId = Guid.NewGuid(),
                LaborCategoryName = "Skilled Carpenter",
                SkillLevel = 2,
                WorkerCount = 1,
                HourlyRate = 80.00m,
                DailyRate = 640.00m,
                StartDate = DateTime.UtcNow.AddDays(-10),
                EndDate = DateTime.UtcNow.AddDays(-5),
                DaysBooked = 5,
                TotalAmount = 3200.00m,
                Requirements = "Formwork for foundation",
                CreatedAt = DateTime.UtcNow.AddDays(-13)
            }
        };
    }

    public static List<Payment> GetPayments()
    {
        return new List<Payment>
        {
            new Payment
            {
                Id = Guid.Parse("30000001-0000-0000-0000-000000000001"),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                PaymentMethod = PaymentMethod.Online,
                Status = PaymentStatus.Paid,
                Amount = 28660.00m,
                AmountPaid = 28660.00m,
                AmountRefunded = 0.00m,
                TransactionId = "TXN2026010100001",
                GatewayReference = "RZP_PAY_2026_00123",
                Gateway = "Razorpay",
                PaidAt = DateTime.UtcNow.AddDays(-15),
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-15)
            },
            new Payment
            {
                Id = Guid.Parse("30000002-0000-0000-0000-000000000002"),
                OrderId = Guid.Parse("00000002-0000-0000-0000-000000000002"),
                PaymentMethod = PaymentMethod.CashOnDelivery,
                Status = PaymentStatus.Pending,
                Amount = 9600.00m,
                AmountPaid = 0.00m,
                AmountRefunded = 0.00m,
                DueDate = DateTime.UtcNow.AddDays(2),
                CreatedAt = DateTime.UtcNow.AddDays(-14),
                UpdatedAt = DateTime.UtcNow.AddDays(-14)
            },
            new Payment
            {
                Id = Guid.Parse("30000003-0000-0000-0000-000000000003"),
                OrderId = Guid.Parse("00000003-0000-0000-0000-000000000003"),
                PaymentMethod = PaymentMethod.Online,
                Status = PaymentStatus.Paid,
                Amount = 53990.00m,
                AmountPaid = 53990.00m,
                AmountRefunded = 0.00m,
                TransactionId = "TXN2026010300001",
                GatewayReference = "RZP_PAY_2026_00456",
                Gateway = "Razorpay",
                PaidAt = DateTime.UtcNow.AddDays(-13),
                CreatedAt = DateTime.UtcNow.AddDays(-13),
                UpdatedAt = DateTime.UtcNow.AddDays(-13)
            },
            new Payment
            {
                Id = Guid.Parse("30000004-0000-0000-0000-000000000004"),
                OrderId = Guid.Parse("00000004-0000-0000-0000-000000000004"),
                PaymentMethod = PaymentMethod.CashOnDelivery,
                Status = PaymentStatus.Pending,
                Amount = 14560.00m,
                AmountPaid = 0.00m,
                AmountRefunded = 0.00m,
                DueDate = DateTime.UtcNow.AddDays(5),
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Payment
            {
                Id = Guid.Parse("30000005-0000-0000-0000-000000000005"),
                OrderId = Guid.Parse("00000005-0000-0000-0000-000000000005"),
                PaymentMethod = PaymentMethod.Online,
                Status = PaymentStatus.Paid,
                Amount = 10230.00m,
                AmountPaid = 10230.00m,
                AmountRefunded = 0.00m,
                TransactionId = "TXN2026010500001",
                GatewayReference = "RZP_PAY_2026_00789",
                Gateway = "Razorpay",
                PaidAt = DateTime.UtcNow.AddDays(-11),
                CreatedAt = DateTime.UtcNow.AddDays(-11),
                UpdatedAt = DateTime.UtcNow.AddDays(-11)
            }
        };
    }

    public static List<Delivery> GetDeliveries()
    {
        return new List<Delivery>
        {
            new Delivery
            {
                Id = Guid.Parse("40000001-0000-0000-0000-000000000001"),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                DeliveryMethod = DeliveryMethod.HomeDelivery,
                TrackingNumber = "DEL2026010100001",
                DeliveryPartner = "RealServ Logistics",
                DriverName = "Mohammed Ali",
                DriverPhone = "+91 98765 11111",
                VehicleNumber = "TS 09 AB 1234",
                ScheduledDate = DateTime.UtcNow.AddDays(-13),
                DispatchedAt = DateTime.UtcNow.AddDays(-13),
                DeliveredAt = DateTime.UtcNow.AddDays(-13),
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-13)
            },
            new Delivery
            {
                Id = Guid.Parse("40000002-0000-0000-0000-000000000002"),
                OrderId = Guid.Parse("00000002-0000-0000-0000-000000000002"),
                DeliveryMethod = DeliveryMethod.SelfPickup,
                ScheduledDate = DateTime.UtcNow.AddDays(-12),
                Instructions = "Workers will report directly to site",
                CreatedAt = DateTime.UtcNow.AddDays(-14),
                UpdatedAt = DateTime.UtcNow.AddDays(-12)
            },
            new Delivery
            {
                Id = Guid.Parse("40000003-0000-0000-0000-000000000003"),
                OrderId = Guid.Parse("00000003-0000-0000-0000-000000000003"),
                DeliveryMethod = DeliveryMethod.ScheduledDelivery,
                TrackingNumber = "DEL2026010300001",
                ScheduledDate = DateTime.UtcNow.AddDays(-8),
                Instructions = "Call before delivery - Large order",
                CreatedAt = DateTime.UtcNow.AddDays(-13),
                UpdatedAt = DateTime.UtcNow.AddDays(-13)
            },
            new Delivery
            {
                Id = Guid.Parse("40000004-0000-0000-0000-000000000004"),
                OrderId = Guid.Parse("00000004-0000-0000-0000-000000000004"),
                DeliveryMethod = DeliveryMethod.HomeDelivery,
                ScheduledDate = DateTime.UtcNow.AddDays(5),
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Delivery
            {
                Id = Guid.Parse("40000005-0000-0000-0000-000000000005"),
                OrderId = Guid.Parse("00000005-0000-0000-0000-000000000005"),
                DeliveryMethod = DeliveryMethod.ExpressDelivery,
                TrackingNumber = "DEL2026010500001",
                DeliveryPartner = "RealServ Logistics",
                DriverName = "Ravi Kumar",
                DriverPhone = "+91 98765 22222",
                VehicleNumber = "TS 09 CD 5678",
                ScheduledDate = DateTime.UtcNow.AddDays(-9),
                DispatchedAt = DateTime.UtcNow.AddDays(-9),
                Instructions = "Same-day delivery requested",
                CreatedAt = DateTime.UtcNow.AddDays(-11),
                UpdatedAt = DateTime.UtcNow.AddDays(-9)
            }
        };
    }

    public static List<OrderStatusHistory> GetOrderStatusHistories()
    {
        return new List<OrderStatusHistory>
        {
            // Order 1 history
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                PreviousStatus = null,
                NewStatus = OrderStatus.Pending,
                ChangedBy = Customer1Id,
                ChangedByType = "Customer",
                Reason = "Order created",
                ChangedAt = DateTime.UtcNow.AddDays(-15)
            },
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                PreviousStatus = OrderStatus.Pending,
                NewStatus = OrderStatus.Confirmed,
                ChangedBy = Vendor1Id,
                ChangedByType = "Vendor",
                Reason = "Order confirmed by vendor",
                ChangedAt = DateTime.UtcNow.AddDays(-15).AddHours(2)
            },
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                PreviousStatus = OrderStatus.Confirmed,
                NewStatus = OrderStatus.Dispatched,
                ChangedBy = Vendor1Id,
                ChangedByType = "Vendor",
                Reason = "Order dispatched for delivery",
                ChangedAt = DateTime.UtcNow.AddDays(-13)
            },
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                PreviousStatus = OrderStatus.Dispatched,
                NewStatus = OrderStatus.Delivered,
                ChangedBy = Vendor1Id,
                ChangedByType = "Vendor",
                Reason = "Order delivered successfully",
                ChangedAt = DateTime.UtcNow.AddDays(-13).AddHours(4)
            },
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                PreviousStatus = OrderStatus.Delivered,
                NewStatus = OrderStatus.Completed,
                ChangedBy = Customer1Id,
                ChangedByType = "Customer",
                Reason = "Order completed - materials received in good condition",
                ChangedAt = DateTime.UtcNow.AddDays(-13).AddHours(6)
            },
            
            // Order 2 history
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000002-0000-0000-0000-000000000002"),
                PreviousStatus = null,
                NewStatus = OrderStatus.Pending,
                ChangedBy = Customer2Id,
                ChangedByType = "Customer",
                Reason = "Labor booking created",
                ChangedAt = DateTime.UtcNow.AddDays(-14)
            },
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000002-0000-0000-0000-000000000002"),
                PreviousStatus = OrderStatus.Pending,
                NewStatus = OrderStatus.Confirmed,
                ChangedBy = Vendor1Id,
                ChangedByType = "Vendor",
                Reason = "Workers assigned",
                ChangedAt = DateTime.UtcNow.AddDays(-13)
            },
            new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = Guid.Parse("00000002-0000-0000-0000-000000000002"),
                PreviousStatus = OrderStatus.Confirmed,
                NewStatus = OrderStatus.Processing,
                ChangedBy = Vendor1Id,
                ChangedByType = "Vendor",
                Reason = "Work in progress",
                ChangedAt = DateTime.UtcNow.AddDays(-12)
            }
        };
    }
}