using Telegram.Bot;

namespace AirportTerminal;

public class TelegramNotificationService : INotificationService
{
    private readonly TelegramBotClient botClient;
    private readonly ILogger<TelegramNotificationService> logger;
    
    public TelegramNotificationService(ILogger<TelegramNotificationService> logger)
    {
        var botToken = Environment.GetEnvironmentVariable("TELEGRAM_BOT_TOKEN");
        this.logger = logger;
        
        if (string.IsNullOrEmpty(botToken))
        {
            throw new InvalidOperationException("Telegram bot token not configured");
        }
        
        botClient = new TelegramBotClient(botToken);
    }
    
    public void SendFlightCreatedNotification(Flight flight)
    {
        try
        {
            var chatId = Environment.GetEnvironmentVariable("TELEGRAM_CHAT_ID");
            
            if (string.IsNullOrEmpty(chatId))
            {
                logger.LogWarning("Telegram ChatId not configured, skipping notification");
                return;
            }

            var message = FormatFlightMessage(flight);
            
            botClient.SendMessage (
                chatId: chatId,
                text: message,
                parseMode: Telegram.Bot.Types.Enums.ParseMode.Html
            );
            
            logger.LogInformation("Flight notification sent successfully for flight {FlightId}", flight.Id);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send flight notification for flight {FlightId}", flight.Id);
        }
    }
    
    private string FormatFlightMessage(Flight flight)
    {
        return $"""
                ✈️ <b>Новый рейс создан!</b>

                📋 <b>ID:</b> {flight.Id}
                🛫 <b>Откуда:</b> {flight.DepartureAirport}
                🛬 <b>Куда:</b> {flight.DestinationAirport}
                📅 <b>Дата вылета:</b> {flight.DepartureDateTime:dd.MM.yyyy HH:mm}
                🏢 <b>Авиакомпания:</b> {flight.Airline}

                <i>Время создания: {DateTime.Now:dd.MM.yyyy HH:mm}</i>
                """;
    }
}