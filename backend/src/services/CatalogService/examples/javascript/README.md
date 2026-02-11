# JavaScript Client Example

Node.js client for RealServ Catalog Service.

## Prerequisites

- Node.js 18+

## Setup

```bash
npm install
```

## Run

```bash
node example.js
```

## Usage

```javascript
const CatalogClient = require('./realserv-catalog-client');

const client = new CatalogClient('http://localhost:5000');

// Get all materials
const materials = await client.getMaterials();

// Search materials
const results = await client.searchMaterials({ searchTerm: 'cement', minPrice: 400 });

// Get stats
const stats = await client.getCatalogStats();
```
