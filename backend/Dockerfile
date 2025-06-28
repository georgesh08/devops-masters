FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY . ./src/
WORKDIR /app/src

RUN dotnet restore
RUN dotnet publish -c Release -o /publish


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app
COPY --from=build /publish .

EXPOSE 5126

ENTRYPOINT ["dotnet", "AirportTerminal.dll"]
