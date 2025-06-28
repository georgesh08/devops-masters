using AirportTerminal;
using Microsoft.EntityFrameworkCore;
using Prometheus;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

DotNetEnv.Env.Load();

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
var dbPort = Environment.GetEnvironmentVariable("DB_PORT");

var connectionString = $"Host={dbHost};Database={dbName};Username={dbUser};Password={dbPassword};Port={dbPort}";

if (string.IsNullOrEmpty(dbHost))
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}

builder.Services
    .AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString))
    .AddScoped<INotificationService, TelegramNotificationService>();

builder.Host.UseSerilog();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpMetrics();
app.MapMetrics();

app.UseHttpsRedirection();

app.MapGet("/flights", async (ApplicationDbContext db) =>
{
    var flights = await db.Flights.ToListAsync();
    return Results.Ok(flights);
})
.WithName("GetAllFlights")
.WithOpenApi();

app.MapGet("/flights/{id}", async (int id, ApplicationDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    return flight != null ? Results.Ok(flight) : Results.NotFound();
})
.WithName("GetFlightById")
.WithOpenApi();

app.MapPost("/flights", async (Flight flight, ApplicationDbContext db, INotificationService telegramService) =>
{
    db.Flights.Add(flight);
    telegramService.SendFlightCreatedNotification(flight);
    await db.SaveChangesAsync();
    return Results.Created($"/flights/{flight.Id}", flight);
})
.WithName("CreateFlight")
.WithOpenApi();

app.MapPut("/flights/{id}", async (int id, Flight flightInput, ApplicationDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight == null) return Results.NotFound();

    flight.DepartureDateTime = flightInput.DepartureDateTime;
    flight.ArrivalDateTime = flightInput.ArrivalDateTime;
    flight.DepartureAirport = flightInput.DepartureAirport;
    flight.DestinationAirport = flightInput.DestinationAirport;
    flight.AircraftModel = flightInput.AircraftModel;
    flight.Airline = flightInput.Airline;
    flight.FlightNumber = flightInput.FlightNumber;

    await db.SaveChangesAsync();
    
    return Results.Ok(flight);
})
.WithName("UpdateFlight")
.WithOpenApi();

app.MapDelete("/flights/{id}", async (int id, ApplicationDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight == null) return Results.NotFound();

    db.Flights.Remove(flight);
    await db.SaveChangesAsync();
    
    return Results.NoContent();
})
.WithName("DeleteFlight")
.WithOpenApi();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}


app.UseCors(b => b
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

Log.Information("Starting application...");
app.Run();