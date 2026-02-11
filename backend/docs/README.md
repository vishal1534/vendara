# Documentation

Comprehensive documentation for RealServ backend.

## Structure

```
docs/
├── architecture/       # Architecture documentation
├── api/                # API documentation and specs
├── deployment/         # Deployment guides
├── development/        # Development guides
├── planning/           # Implementation plans
└── runbooks/           # Operational runbooks
```

## Quick Links

### Architecture
- [Backend Architecture Plan](architecture/backend-architecture-plan.md) - Complete technical architecture (77 pages)
- [System Overview](architecture/system-overview.md) - High-level system design
- [Microservices Design](architecture/microservices-design.md) - Service boundaries and contracts

### Planning
- [Implementation Plan](planning/implementation-plan.md) - 15-week roadmap (62 pages)
- [Week-by-Week Plan](planning/week-by-week.md) - Detailed weekly breakdown
- [Sprint Planning](planning/sprint-planning.md) - Sprint templates and ceremonies

### Development
- [Getting Started](development/getting-started.md) - Developer setup guide
- [Coding Standards](development/coding-standards.md) - Code style and conventions
- [Testing Guide](development/testing-guide.md) - Testing strategies

### API Documentation
- [API Overview](api/README.md) - API design principles
- [OpenAPI Specs](api/openapi/) - Swagger/OpenAPI specifications
- [Postman Collections](api/postman/) - API testing collections

### Deployment
- [Deployment Guide](deployment/README.md) - How to deploy services
- [AWS Setup](deployment/aws-setup.md) - AWS infrastructure setup
- [CI/CD Pipeline](deployment/cicd-pipeline.md) - GitHub Actions workflows

### Runbooks
- [Service Down](runbooks/service-down.md) - What to do when service is down
- [Payment Webhook Failure](runbooks/payment-webhook-failure.md) - Handling Razorpay webhook issues
- [Database High CPU](runbooks/database-high-cpu.md) - Database performance troubleshooting

## Documentation Standards

### Writing Guidelines

1. **Clear and Concise** - Use simple language
2. **Code Examples** - Include practical examples
3. **Up-to-Date** - Update docs with code changes
4. **Searchable** - Use clear headings and structure
5. **Visual** - Include diagrams where helpful

### Markdown Format

- Use `#` for main headings
- Use `##` for sections
- Use `###` for subsections
- Use code blocks with language highlighting
- Use tables for structured data
- Use bullet points for lists

### Diagrams

Tools for creating diagrams:
- **draw.io** - Architecture diagrams
- **Mermaid** - Flowcharts and sequence diagrams
- **PlantUML** - UML diagrams

## Contributing to Docs

1. Create docs in appropriate folder
2. Add link to this README
3. Follow markdown format guidelines
4. Include date and version
5. Create PR for review

## Need Help?

- **Architecture Questions** - Check architecture docs or ask Tech Lead
- **API Questions** - Check API docs or Swagger UI
- **Deployment Questions** - Check deployment guide or ask DevOps
- **Development Questions** - Check development guide or ask team

## External Resources

- [.NET Documentation](https://docs.microsoft.com/dotnet)
- [ASP.NET Core](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [AWS Documentation](https://docs.aws.amazon.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
