# Python Client Example

Python client for RealServ Catalog Service.

## Prerequisites

- Python 3.8+

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
python example.py
```

## Usage

```python
from realserv_catalog_client import CatalogClient

client = CatalogClient('http://localhost:5000')

# Get all materials
materials = client.get_materials()

# Search materials
results = client.search_materials(search_term='cement', min_price=400, max_price=500)

# Get stats
stats = client.get_catalog_stats()
```
