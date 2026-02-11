using Microsoft.EntityFrameworkCore;

namespace OrderService.Data.Seeds;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(OrderServiceDbContext context)
    {
        // Check if database has been seeded
        if (await context.Orders.AnyAsync())
        {
            Console.WriteLine("Database already seeded. Skipping seed data.");
            return;
        }

        Console.WriteLine("Seeding Order Service database...");

        try
        {
            // Seed delivery addresses
            var addresses = SeedData.GetDeliveryAddresses();
            await context.DeliveryAddresses.AddRangeAsync(addresses);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {addresses.Count} delivery addresses");

            // Seed orders
            var orders = SeedData.GetOrders();
            await context.Orders.AddRangeAsync(orders);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {orders.Count} orders");

            // Seed order items
            var orderItems = SeedData.GetOrderItems();
            await context.OrderItems.AddRangeAsync(orderItems);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {orderItems.Count} order items");

            // Seed order labors
            var orderLabors = SeedData.GetOrderLabors();
            await context.OrderLabors.AddRangeAsync(orderLabors);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {orderLabors.Count} labor bookings");

            // Seed payments
            var payments = SeedData.GetPayments();
            await context.Payments.AddRangeAsync(payments);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {payments.Count} payment records");

            // Seed deliveries
            var deliveries = SeedData.GetDeliveries();
            await context.Deliveries.AddRangeAsync(deliveries);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {deliveries.Count} delivery records");

            // Seed order status history
            var statusHistories = SeedData.GetOrderStatusHistories();
            await context.OrderStatusHistories.AddRangeAsync(statusHistories);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {statusHistories.Count} status history records");
            
            // Seed disputes
            var disputes = EnhancedSeedData.GetDisputes();
            await context.Disputes.AddRangeAsync(disputes);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {disputes.Count} disputes");
            
            // Seed dispute evidence
            var disputeEvidences = EnhancedSeedData.GetDisputeEvidences();
            await context.DisputeEvidences.AddRangeAsync(disputeEvidences);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {disputeEvidences.Count} dispute evidence records");
            
            // Seed dispute timeline
            var disputeTimelines = EnhancedSeedData.GetDisputeTimelines();
            await context.DisputeTimelines.AddRangeAsync(disputeTimelines);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {disputeTimelines.Count} dispute timeline entries");
            
            // Seed order issues
            var orderIssues = EnhancedSeedData.GetOrderIssues();
            await context.OrderIssues.AddRangeAsync(orderIssues);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {orderIssues.Count} order issues");

            Console.WriteLine("✅ Order Service database seeded successfully!");
            Console.WriteLine($"   - {addresses.Count} delivery addresses");
            Console.WriteLine($"   - {orders.Count} orders");
            Console.WriteLine($"   - {orderItems.Count} order items");
            Console.WriteLine($"   - {orderLabors.Count} labor bookings");
            Console.WriteLine($"   - {payments.Count} payments");
            Console.WriteLine($"   - {deliveries.Count} deliveries");
            Console.WriteLine($"   - {statusHistories.Count} status changes");
            Console.WriteLine($"   - {disputes.Count} disputes");
            Console.WriteLine($"   - {disputeEvidences.Count} evidence files");
            Console.WriteLine($"   - {disputeTimelines.Count} timeline entries");
            Console.WriteLine($"   - {orderIssues.Count} order issues");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error seeding database: {ex.Message}");
            throw;
        }
    }
}