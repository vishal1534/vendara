using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotificationService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "notification_templates",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    template_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    template_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    subject = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    body = table.Column<string>(type: "text", nullable: false),
                    variables = table.Column<string>(type: "jsonb", nullable: true),
                    whatsapp_template_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    whatsapp_language = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification_templates", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    recipient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    recipient_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    notification_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    channel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    subject = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    body = table.Column<string>(type: "text", nullable: false),
                    data = table.Column<string>(type: "jsonb", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "pending"),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    delivered_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    failed_reason = table.Column<string>(type: "text", nullable: true),
                    provider = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    provider_message_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user_notification_preferences",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    email_order_updates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    email_payment_updates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    email_promotions = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    whatsapp_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    whatsapp_order_updates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    whatsapp_payment_updates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    whatsapp_promotions = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    sms_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    sms_order_updates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    push_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    push_order_updates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    push_payment_updates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_notification_preferences", x => x.id);
                });

            // Create indexes
            migrationBuilder.CreateIndex(
                name: "idx_notification_templates_name",
                table: "notification_templates",
                column: "template_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_notification_templates_type",
                table: "notification_templates",
                column: "template_type");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_recipient_id",
                table: "notifications",
                column: "recipient_id");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_status",
                table: "notifications",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_created_at",
                table: "notifications",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_preferences_user_id",
                table: "user_notification_preferences",
                column: "user_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notification_templates");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "user_notification_preferences");
        }
    }
}
