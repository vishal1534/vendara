# C# Client Example

Simple .NET client for RealServ Catalog Service.

## Prerequisites

- .NET 8 SDK

## Run

```bash
dotnet run
```

## Usage

```csharp
var client = new RealServCatalogClient("http://localhost:5000");

// Get all materials
var materials = await client.GetMaterialsAsync();

// Search materials
var results = await client.SearchMaterialsAsync("cement", minPrice: 400, maxPrice: 500);

// Get catalog stats
var stats = await client.GetCatalogStatsAsync();
```
