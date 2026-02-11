# Use the official .NET 8 SDK image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy shared libraries
COPY ["src/shared/RealServ.Shared.Domain/RealServ.Shared.Domain.csproj", "shared/RealServ.Shared.Domain/"]
COPY ["src/shared/RealServ.Shared.Application/RealServ.Shared.Application.csproj", "shared/RealServ.Shared.Application/"]

# Copy service project
COPY ["src/services/IdentityService/IdentityService.csproj", "services/IdentityService/"]

# Restore dependencies
RUN dotnet restore "services/IdentityService/IdentityService.csproj"

# Copy everything else
COPY src/ .

# Build the project
WORKDIR "/src/services/IdentityService"
RUN dotnet build "IdentityService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IdentityService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.dll"]
