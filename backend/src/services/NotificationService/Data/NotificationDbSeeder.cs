using Microsoft.EntityFrameworkCore;
using NotificationService.Models.Entities;

namespace NotificationService.Data;

public static class NotificationDbSeeder
{
    public static async Task SeedAsync(NotificationDbContext context)
    {
        // Check if templates already exist
        if (await context.NotificationTemplates.AnyAsync())
        {
            return; // Database has been seeded
        }

        // Seed notification templates
        var templates = new List<NotificationTemplate>
        {
            // Email templates
            new NotificationTemplate
            {
                Id = Guid.NewGuid(),
                TemplateName = "order_created_email",
                TemplateType = "email",
                Subject = "Order Confirmed - {{order_number}}",
                Body = "Hi {{customer_name}},\n\nYour order #{{order_number}} has been confirmed.\n\nOrder Total: ₹{{order_total}}\nExpected Delivery: {{delivery_date}}\n\nThank you for choosing RealServ!",
                Variables = "[\"customer_name\",\"order_number\",\"order_total\",\"delivery_date\"]",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new NotificationTemplate
            {
                Id = Guid.NewGuid(),
                TemplateName = "payment_success_email",
                TemplateType = "email",
                Subject = "Payment Successful - Order {{order_number}}",
                Body = "Hi {{customer_name}},\n\nYour payment of ₹{{amount}} for order #{{order_number}} was successful.\n\nPayment ID: {{payment_id}}\nPayment Method: {{payment_method}}\n\nThank you!",
                Variables = "[\"customer_name\",\"order_number\",\"amount\",\"payment_id\",\"payment_method\"]",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new NotificationTemplate
            {
                Id = Guid.NewGuid(),
                TemplateName = "order_delivered_email",
                TemplateType = "email",
                Subject = "Order Delivered - {{order_number}}",
                Body = "Hi {{customer_name}},\n\nYour order #{{order_number}} has been delivered successfully.\n\nDelivered at: {{delivery_time}}\n\nWe hope you're satisfied with your purchase!",
                Variables = "[\"customer_name\",\"order_number\",\"delivery_time\"]",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // WhatsApp templates
            new NotificationTemplate
            {
                Id = Guid.NewGuid(),
                TemplateName = "order_created_whatsapp",
                TemplateType = "whatsapp",
                Body = "Hi {{1}}, your order #{{2}} has been confirmed. Total: ₹{{3}}. Expected delivery: {{4}}. - RealServ",
                Variables = "[\"customer_name\",\"order_number\",\"order_total\",\"delivery_date\"]",
                WhatsAppTemplateId = "order_confirmation",
                WhatsAppLanguage = "en",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new NotificationTemplate
            {
                Id = Guid.NewGuid(),
                TemplateName = "delivery_otp_whatsapp",
                TemplateType = "whatsapp",
                Body = "Your delivery OTP for order #{{1}} is: {{2}}. Share this with the delivery person. - RealServ",
                Variables = "[\"order_number\",\"otp\"]",
                WhatsAppTemplateId = "delivery_otp",
                WhatsAppLanguage = "en",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // SMS templates
            new NotificationTemplate
            {
                Id = Guid.NewGuid(),
                TemplateName = "otp_verification_sms",
                TemplateType = "sms",
                Body = "Your RealServ OTP is: {{otp}}. Valid for 10 minutes. Do not share with anyone.",
                Variables = "[\"otp\"]",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },

            // Push notification templates
            new NotificationTemplate
            {
                Id = Guid.NewGuid(),
                TemplateName = "order_status_push",
                TemplateType = "push",
                Subject = "Order Status Update",
                Body = "Your order #{{order_number}} status: {{status}}",
                Variables = "[\"order_number\",\"status\"]",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await context.NotificationTemplates.AddRangeAsync(templates);
        await context.SaveChangesAsync();
    }
}
