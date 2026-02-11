FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy shared projects
COPY ["src/shared/RealServ.Shared.Domain.csproj", "shared/RealServ.Shared.Domain/"]
COPY ["src/shared/RealServ.Shared.Application.csproj", "shared/RealServ.Shared.Application/"]
COPY ["src/shared/RealServ.Shared.Observability.csproj", "shared/RealServ.Shared.Observability/"]

# Copy service project
COPY ["src/services/CatalogService/CatalogService.csproj", "services/CatalogService/"]

# Restore dependencies
RUN dotnet restore "services/CatalogService/CatalogService.csproj"

# Copy everything else
COPY src/shared/ shared/
COPY src/services/CatalogService/ services/CatalogService/

WORKDIR "/src/services/CatalogService"
RUN dotnet build "CatalogService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CatalogService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CatalogService.dll"]
