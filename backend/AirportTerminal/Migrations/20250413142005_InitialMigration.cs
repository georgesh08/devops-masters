using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AirportTerminal.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Flights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DepartureDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ArrivalDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DepartureAirport = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DestinationAirport = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AircraftModel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Airline = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FlightNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flights", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Flights",
                columns: new[] { "Id", "AircraftModel", "Airline", "ArrivalDateTime", "DepartureAirport", "DepartureDateTime", "DestinationAirport", "FlightNumber" },
                values: new object[,]
                {
                    { 1, "Boeing 737-800", "Аэрофлот", new DateTime(2025, 4, 13, 14, 0, 0, 0, DateTimeKind.Utc), "Москва (SVO)", new DateTime(2025, 4, 13, 12, 30, 0, 0, DateTimeKind.Utc), "Санкт-Петербург (LED)", "SU1234" },
                    { 2, "Airbus A320", "S7", new DateTime(2025, 4, 13, 3, 50, 0, 0, DateTimeKind.Utc), "Москва (SVO)", new DateTime(2025, 4, 11, 0, 15, 0, 0, DateTimeKind.Utc), "Сочи (AER)", "S71234" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Flights");
        }
    }
}
