using OrderService.Models.Entities;
using OrderService.Models.Enums;

namespace OrderService.Data.Seeds;

/// <summary>
/// Enhanced seed data for disputes and issues
/// </summary>
public static class EnhancedSeedData
{
    // Re-use IDs from main seed data
    private static readonly Guid Customer1Id = Guid.Parse("c0000000-0000-0000-0000-000000000001");
    private static readonly Guid Customer2Id = Guid.Parse("c0000000-0000-0000-0000-000000000002");
    private static readonly Guid Customer3Id = Guid.Parse("c0000000-0000-0000-0000-000000000003");
    private static readonly Guid Vendor1Id = Guid.Parse("v0000000-0000-0000-0000-000000000001");
    private static readonly Guid Vendor2Id = Guid.Parse("v0000000-0000-0000-0000-000000000002");
    private static readonly Guid Admin1Id = Guid.Parse("a0000000-0000-0000-0000-000000000001");
    
    private static readonly Guid Order1Id = Guid.Parse("00000001-0000-0000-0000-000000000001");
    private static readonly Guid Order2Id = Guid.Parse("00000002-0000-0000-0000-000000000002");
    private static readonly Guid Order3Id = Guid.Parse("00000003-0000-0000-0000-000000000003");
    private static readonly Guid Order5Id = Guid.Parse("00000005-0000-0000-0000-000000000005");

    public static List<Dispute> GetDisputes()
    {
        var baseDate = DateTime.UtcNow.AddDays(-15);
        
        return new List<Dispute>
        {
            // Dispute 1: Damaged items - Resolved with refund
            new Dispute
            {
                Id = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                OrderId = Order1Id,
                Reason = DisputeReason.DamagedItems,
                Description = "Received 5 bags of cement that were wet and damaged during delivery. The bags were torn and cement had hardened.",
                Status = DisputeStatus.ResolvedRefund,
                Priority = DisputePriority.High,
                DisputedAmount = 2200.00m,
                RefundAmount = 2200.00m,
                RaisedBy = Customer1Id,
                RaisedByRole = "buyer",
                AssignedTo = Admin1Id,
                AssignedAt = baseDate.AddDays(-12).AddHours(1),
                ResolutionNote = "Verified with delivery photos. Full refund processed for 5 damaged bags. Vendor instructed to improve packaging.",
                ResolvedBy = Admin1Id,
                ResolvedAt = baseDate.AddDays(-10),
                CreatedAt = baseDate.AddDays(-12),
                UpdatedAt = baseDate.AddDays(-10)
            },
            
            // Dispute 2: Quality issue - Under review
            new Dispute
            {
                Id = Guid.Parse("d0000002-0000-0000-0000-000000000002"),
                OrderId = Order3Id,
                Reason = DisputeReason.QualityIssue,
                Description = "TMT bars received are not matching the specified grade. Customer engineer tested and found grade to be lower than Fe 500D as ordered.",
                Status = DisputeStatus.UnderReview,
                Priority = DisputePriority.Critical,
                DisputedAmount = 27500.00m,
                RaisedBy = Customer3Id,
                RaisedByRole = "buyer",
                AssignedTo = Admin1Id,
                AssignedAt = baseDate.AddDays(-6).AddHours(2),
                CreatedAt = baseDate.AddDays(-6),
                UpdatedAt = baseDate.AddDays(-5)
            },
            
            // Dispute 3: Late delivery - Open
            new Dispute
            {
                Id = Guid.Parse("d0000003-0000-0000-0000-000000000003"),
                OrderId = Order5Id,
                Reason = DisputeReason.LateDelivery,
                Description = "Order was supposed to be delivered on same day (express delivery) but arrived 2 days late. This delayed our project timeline.",
                Status = DisputeStatus.Open,
                Priority = DisputePriority.Medium,
                DisputedAmount = 300.00m, // Delivery charges
                RaisedBy = Customer2Id,
                RaisedByRole = "buyer",
                CreatedAt = baseDate.AddDays(-8),
                UpdatedAt = baseDate.AddDays(-8)
            },
            
            // Dispute 4: Missing items - Resolved with partial refund
            new Dispute
            {
                Id = Guid.Parse("d0000004-0000-0000-0000-000000000004"),
                OrderId = Order2Id,
                Reason = DisputeReason.IncompleteWork,
                Description = "Only 1 mason reported to site instead of 2 as booked. Work progress was significantly impacted.",
                Status = DisputeStatus.ResolvedPartialRefund,
                Priority = DisputePriority.High,
                DisputedAmount = 4800.00m,
                RefundAmount = 2400.00m,
                RaisedBy = Customer2Id,
                RaisedByRole = "buyer",
                AssignedTo = Admin1Id,
                AssignedAt = baseDate.AddDays(-7).AddHours(3),
                ResolutionNote = "Verified with vendor. Partial refund of 50% provided for 4 days where only 1 worker was present.",
                ResolvedBy = Admin1Id,
                ResolvedAt = baseDate.AddDays(-5),
                CreatedAt = baseDate.AddDays(-7),
                UpdatedAt = baseDate.AddDays(-5)
            },
            
            // Dispute 5: Wrong pricing - Escalated
            new Dispute
            {
                Id = Guid.Parse("d0000005-0000-0000-0000-000000000005"),
                OrderId = Order3Id,
                Reason = DisputeReason.WrongPricing,
                Description = "Invoice shows higher prices than quoted on platform. Sand price was ₹45/cft but charged ₹50/cft.",
                Status = DisputeStatus.Escalated,
                Priority = DisputePriority.Critical,
                DisputedAmount = 2000.00m,
                RaisedBy = Customer3Id,
                RaisedByRole = "buyer",
                AssignedTo = Admin1Id,
                AssignedAt = baseDate.AddDays(-4).AddHours(1),
                EscalatedAt = baseDate.AddDays(-3),
                EscalationReason = "Vendor disputes the platform pricing. Requires management review and policy clarification.",
                CreatedAt = baseDate.AddDays(-4),
                UpdatedAt = baseDate.AddDays(-3)
            }
        };
    }

    public static List<DisputeEvidence> GetDisputeEvidences()
    {
        var baseDate = DateTime.UtcNow.AddDays(-15);
        
        return new List<DisputeEvidence>
        {
            // Dispute 1 evidence (Damaged items)
            new DisputeEvidence
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Type = "image",
                Url = "https://storage.realserv.com/disputes/d0000001/damaged-bags-1.jpg",
                UploadedBy = Customer1Id,
                UploadedByRole = "buyer",
                Description = "Photo showing torn cement bags with wet cement",
                UploadedAt = baseDate.AddDays(-12).AddHours(0.5)
            },
            new DisputeEvidence
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Type = "image",
                Url = "https://storage.realserv.com/disputes/d0000001/damaged-bags-2.jpg",
                UploadedBy = Customer1Id,
                UploadedByRole = "buyer",
                Description = "Close-up of hardened cement spilling from damaged bag",
                UploadedAt = baseDate.AddDays(-12).AddHours(0.6)
            },
            new DisputeEvidence
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Type = "image",
                Url = "https://storage.realserv.com/disputes/d0000001/delivery-receipt.jpg",
                UploadedBy = Vendor1Id,
                UploadedByRole = "vendor",
                Description = "Delivery receipt signed by customer acknowledging damaged goods",
                UploadedAt = baseDate.AddDays(-11).AddHours(2)
            },
            
            // Dispute 2 evidence (Quality issue)
            new DisputeEvidence
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000002-0000-0000-0000-000000000002"),
                Type = "document",
                Url = "https://storage.realserv.com/disputes/d0000002/test-report.pdf",
                UploadedBy = Customer3Id,
                UploadedByRole = "buyer",
                Description = "Third-party lab test report showing actual grade of TMT bars",
                UploadedAt = baseDate.AddDays(-6).AddHours(1)
            },
            new DisputeEvidence
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000002-0000-0000-0000-000000000002"),
                Type = "image",
                Url = "https://storage.realserv.com/disputes/d0000002/rods-markings.jpg",
                UploadedBy = Customer3Id,
                UploadedByRole = "buyer",
                Description = "Photos of rod markings and manufacturer details",
                UploadedAt = baseDate.AddDays(-6).AddHours(1.5)
            },
            
            // Dispute 3 evidence (Late delivery)
            new DisputeEvidence
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000003-0000-0000-0000-000000000003"),
                Type = "image",
                Url = "https://storage.realserv.com/disputes/d0000003/tracking-screenshot.jpg",
                UploadedBy = Customer2Id,
                UploadedByRole = "buyer",
                Description = "Tracking history showing delayed delivery",
                UploadedAt = baseDate.AddDays(-8).AddHours(2)
            }
        };
    }

    public static List<DisputeTimeline> GetDisputeTimelines()
    {
        var baseDate = DateTime.UtcNow.AddDays(-15);
        
        return new List<DisputeTimeline>
        {
            // Dispute 1 timeline
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Actor = "Vishal Chauhan",
                ActorId = Customer1Id,
                ActorRole = "buyer",
                Action = "Dispute Created",
                Description = "Buyer opened dispute for damaged cement bags",
                Timestamp = baseDate.AddDays(-12)
            },
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Actor = "Vishal Chauhan",
                ActorId = Customer1Id,
                ActorRole = "buyer",
                Action = "Evidence Uploaded",
                Description = "Added 2 photos of damaged bags",
                Timestamp = baseDate.AddDays(-12).AddHours(0.5)
            },
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Actor = "Admin",
                ActorId = Admin1Id,
                ActorRole = "admin",
                Action = "Dispute Assigned",
                Description = "Dispute assigned to admin for review",
                Timestamp = baseDate.AddDays(-12).AddHours(1)
            },
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Actor = "Admin",
                ActorId = Admin1Id,
                ActorRole = "admin",
                Action = "Status Changed",
                Description = "Status changed to Under Review",
                Timestamp = baseDate.AddDays(-12).AddHours(1)
            },
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Actor = "Vendor",
                ActorId = Vendor1Id,
                ActorRole = "vendor",
                Action = "Evidence Uploaded",
                Description = "Added delivery receipt",
                Timestamp = baseDate.AddDays(-11).AddHours(2)
            },
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000001-0000-0000-0000-000000000001"),
                Actor = "Admin",
                ActorId = Admin1Id,
                ActorRole = "admin",
                Action = "Dispute Resolved",
                Description = "Full refund approved for damaged items",
                Timestamp = baseDate.AddDays(-10)
            },
            
            // Dispute 2 timeline
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000002-0000-0000-0000-000000000002"),
                Actor = "Venkat Rao",
                ActorId = Customer3Id,
                ActorRole = "buyer",
                Action = "Dispute Created",
                Description = "Buyer reported quality issue with TMT bars",
                Timestamp = baseDate.AddDays(-6)
            },
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000002-0000-0000-0000-000000000002"),
                Actor = "Venkat Rao",
                ActorId = Customer3Id,
                ActorRole = "buyer",
                Action = "Evidence Uploaded",
                Description = "Added test report and photos",
                Timestamp = baseDate.AddDays(-6).AddHours(1)
            },
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000002-0000-0000-0000-000000000002"),
                Actor = "Admin",
                ActorId = Admin1Id,
                ActorRole = "admin",
                Action = "Dispute Assigned",
                Description = "Critical priority - assigned for immediate review",
                Timestamp = baseDate.AddDays(-6).AddHours(2)
            },
            
            // Dispute 5 timeline (Escalated)
            new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = Guid.Parse("d0000005-0000-0000-0000-000000000005"),
                Actor = "Admin",
                ActorId = Admin1Id,
                ActorRole = "admin",
                Action = "Dispute Escalated",
                Description = "Escalated to management due to pricing policy conflict",
                Timestamp = baseDate.AddDays(-3)
            }
        };
    }

    public static List<OrderIssue> GetOrderIssues()
    {
        var baseDate = DateTime.UtcNow.AddDays(-15);
        
        return new List<OrderIssue>
        {
            // Issue 1: Vendor reporting buyer unavailable
            new OrderIssue
            {
                Id = Guid.Parse("i0000001-0000-0000-0000-000000000001"),
                OrderId = Order5Id,
                Description = "Customer not available at delivery address. Driver waited for 30 minutes. Need to reschedule delivery.",
                IssueType = "delivery_issue",
                Status = "resolved",
                ReportedBy = Vendor1Id,
                ReportedByRole = "vendor",
                ReportedAt = baseDate.AddDays(-9),
                Resolution = "Contacted customer and rescheduled delivery for next day. Successfully delivered.",
                ResolvedBy = Vendor1Id,
                ResolvedAt = baseDate.AddDays(-8),
                EscalatedToDispute = false,
                CreatedAt = baseDate.AddDays(-9),
                UpdatedAt = baseDate.AddDays(-8)
            },
            
            // Issue 2: Stock shortage
            new OrderIssue
            {
                Id = Guid.Parse("i0000002-0000-0000-0000-000000000002"),
                OrderId = Order3Id,
                Description = "We have only 300kg of TMT bars in stock instead of 500kg ordered. Can deliver 300kg immediately and remaining 200kg tomorrow.",
                IssueType = "stock_shortage",
                Status = "resolved",
                ReportedBy = Vendor2Id,
                ReportedByRole = "vendor",
                ReportedAt = baseDate.AddDays(-13),
                Resolution = "Customer agreed to split delivery. First batch delivered today, second batch delivered next day.",
                ResolvedBy = Vendor2Id,
                ResolvedAt = baseDate.AddDays(-12),
                Notes = "Customer satisfied with vendor's proactive communication",
                EscalatedToDispute = false,
                CreatedAt = baseDate.AddDays(-13),
                UpdatedAt = baseDate.AddDays(-12)
            },
            
            // Issue 3: Site access problem - Open
            new OrderIssue
            {
                Id = Guid.Parse("i0000003-0000-0000-0000-000000000003"),
                OrderId = Order3Id,
                Description = "Unable to access construction site - road is blocked due to local festival. Heavy vehicle cannot enter.",
                IssueType = "delivery_issue",
                Status = "open",
                ReportedBy = Vendor2Id,
                ReportedByRole = "vendor",
                ReportedAt = baseDate.AddDays(-8),
                Notes = "Waiting for customer response on alternate delivery arrangement",
                EscalatedToDispute = false,
                CreatedAt = baseDate.AddDays(-8),
                UpdatedAt = baseDate.AddDays(-8)
            }
        };
    }
}
