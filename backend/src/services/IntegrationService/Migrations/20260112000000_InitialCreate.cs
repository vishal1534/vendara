using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IntegrationService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ================================================================
            // WHATSAPP MESSAGES TABLE
            // ================================================================
            migrationBuilder.CreateTable(
                name: "whatsapp_messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    whatsapp_message_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    direction = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    message_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    phone_number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    user_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    user_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    content = table.Column<string>(type: "text", nullable: true),
                    media_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    media_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    caption = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    error_message = table.Column<string>(type: "text", nullable: true),
                    context = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    related_entity_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    related_entity_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    metadata = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_whatsapp_messages", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_messages_whatsapp_message_id",
                table: "whatsapp_messages",
                column: "whatsapp_message_id",
                unique: true,
                filter: "whatsapp_message_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_messages_phone_number",
                table: "whatsapp_messages",
                column: "phone_number");

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_messages_user_id",
                table: "whatsapp_messages",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_messages_direction_status",
                table: "whatsapp_messages",
                columns: new[] { "direction", "status" });

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_messages_created_at",
                table: "whatsapp_messages",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_messages_related_entity",
                table: "whatsapp_messages",
                columns: new[] { "related_entity_type", "related_entity_id" });

            // ================================================================
            // MEDIA FILES TABLE
            // ================================================================
            migrationBuilder.CreateTable(
                name: "media_files",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    original_filename = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    storage_filename = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    bucket_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    s3_key = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    mime_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    file_size = table.Column<long>(type: "bigint", nullable: false),
                    category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    upload_context = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    uploaded_by_user_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    uploaded_by_user_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    related_entity_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    related_entity_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_public = table.Column<bool>(type: "boolean", nullable: false),
                    metadata = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_media_files", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_media_files_s3_key",
                table: "media_files",
                column: "s3_key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_media_files_uploaded_by_user_id",
                table: "media_files",
                column: "uploaded_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_media_files_category_context",
                table: "media_files",
                columns: new[] { "category", "upload_context" });

            migrationBuilder.CreateIndex(
                name: "IX_media_files_related_entity",
                table: "media_files",
                columns: new[] { "related_entity_type", "related_entity_id" });

            migrationBuilder.CreateIndex(
                name: "IX_media_files_created_at",
                table: "media_files",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "IX_media_files_deleted_at",
                table: "media_files",
                column: "deleted_at");

            // ================================================================
            // LOCATION CACHE TABLE
            // ================================================================
            migrationBuilder.CreateTable(
                name: "location_cache",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    normalized_address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    latitude = table.Column<double>(type: "double precision", nullable: false),
                    longitude = table.Column<double>(type: "double precision", nullable: false),
                    formatted_address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    state = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    postal_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    place_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    address_components = table.Column<string>(type: "jsonb", nullable: true),
                    hit_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    last_accessed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_location_cache", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_location_cache_normalized_address",
                table: "location_cache",
                column: "normalized_address",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_location_cache_place_id",
                table: "location_cache",
                column: "place_id");

            migrationBuilder.CreateIndex(
                name: "IX_location_cache_coordinates",
                table: "location_cache",
                columns: new[] { "latitude", "longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_location_cache_expires_at",
                table: "location_cache",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "IX_location_cache_last_accessed_at",
                table: "location_cache",
                column: "last_accessed_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "whatsapp_messages");
            migrationBuilder.DropTable(name: "media_files");
            migrationBuilder.DropTable(name: "location_cache");
        }
    }
}
