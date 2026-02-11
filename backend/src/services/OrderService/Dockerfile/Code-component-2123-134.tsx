# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["src/services/OrderService/OrderService.csproj", "src/services/OrderService/"]
COPY ["src/shared/RealServ.Shared.Domain.csproj", "src/shared/"]
COPY ["src/shared/RealServ.Shared.Application.csproj", "src/shared/"]
COPY ["src/shared/RealServ.Shared.Observability.csproj", "src/shared/"]
RUN dotnet restore "src/services/OrderService/OrderService.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/services/OrderService"
RUN dotnet build "OrderService.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "OrderService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OrderService.dll"]
