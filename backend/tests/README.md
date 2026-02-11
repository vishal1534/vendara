# Tests

All test projects for the RealServ backend.

## Test Structure

```
tests/
├── unit/                    # Unit tests (fast, isolated)
│   ├── UserManagementService.Tests/
│   ├── OrderService.Tests/
│   └── PaymentService.Tests/
├── integration/             # Integration tests (DB, APIs)
│   └── IntegrationTests/
└── e2e/                     # End-to-end tests (full flows)
    └── E2ETests/
```

## Unit Tests

**Purpose**: Test individual components in isolation

**Characteristics**:
- Fast (< 1 second per test)
- No external dependencies
- Use mocks/stubs for dependencies
- High coverage target (>80%)

**Example**:
```csharp
[Fact]
public async Task RegisterUser_WithValidData_ReturnsUser()
{
    // Arrange
    var mockRepo = new Mock<IUserRepository>();
    var service = new UserService(mockRepo.Object);
    
    // Act
    var result = await service.RegisterUserAsync(request);
    
    // Assert
    result.Should().NotBeNull();
    result.Email.Should().Be(request.Email);
}
```

## Integration Tests

**Purpose**: Test service interactions (database, external APIs)

**Characteristics**:
- Slower (use real database via Testcontainers)
- Test API endpoints end-to-end
- Use WireMock for external API mocking
- Focus on critical flows

**Example**:
```csharp
[Fact]
public async Task CreateOrder_WithValidPayment_CreatesOrderAndPayment()
{
    // Arrange
    var client = _factory.CreateClient();
    
    // Act
    var response = await client.PostAsJsonAsync("/api/v1/orders", orderRequest);
    
    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Created);
    var order = await response.Content.ReadFromJsonAsync<OrderResponse>();
    order.Status.Should().Be(OrderStatus.Pending);
}
```

## E2E Tests

**Purpose**: Test complete user journeys

**Characteristics**:
- Full stack testing
- Multiple services involved
- Real external service integrations (test accounts)
- Focus on business scenarios

**Example**:
```csharp
[Fact]
public async Task BuyerOrderFlow_FromOrderToDelivery_CompletesSuccessfully()
{
    // 1. Buyer creates order
    // 2. Payment is processed (Razorpay)
    // 3. Vendor accepts order (WhatsApp)
    // 4. Delivery is completed (OTP)
    // 5. Order is marked delivered
    // 6. Vendor settlement is created
}
```

## Running Tests

```bash
# Run all tests
dotnet test

# Run unit tests only
dotnet test tests/unit/

# Run specific test project
dotnet test tests/unit/UserManagementService.Tests/

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run with detailed output
dotnet test --logger "console;verbosity=detailed"

# Run specific test
dotnet test --filter "FullyQualifiedName~RegisterUser_WithValidData"
```

## Test Frameworks & Libraries

- **xUnit** - Test framework
- **Moq** - Mocking framework
- **FluentAssertions** - Readable assertions
- **Testcontainers** - Docker containers for integration tests
- **WireMock.Net** - HTTP mocking for external APIs
- **Bogus** - Test data generation

## Code Coverage

**Target**: >80% coverage for all services

**Generate Report**:
```bash
# Install ReportGenerator
dotnet tool install -g dotnet-reportgenerator-globaltool

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Generate report
reportgenerator \
  -reports:"**/coverage.cobertura.xml" \
  -targetdir:"coverage-report" \
  -reporttypes:Html

# Open report
open coverage-report/index.html
```

## Writing Tests

### Unit Test Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **One assertion per test** (when possible)
3. **Clear test names**: `MethodName_Scenario_ExpectedResult`
4. **Mock external dependencies**
5. **Test both success and failure cases**

### Integration Test Best Practices

1. **Use Testcontainers** for databases
2. **Clean up after each test** (transaction rollback or database reset)
3. **Test API contracts** (request/response models)
4. **Mock external APIs** (Razorpay, WhatsApp, Google Maps)
5. **Focus on critical paths**

### E2E Test Best Practices

1. **Test real user journeys**
2. **Use test data** (dedicated test accounts)
3. **Keep tests independent** (can run in any order)
4. **Handle async operations** (polling, retries)
5. **Clean up test data** after run

## Continuous Integration

Tests run automatically on:
- Every PR
- Every commit to main
- Nightly builds

**CI Pipeline**:
```yaml
- Restore packages
- Build solution
- Run unit tests
- Run integration tests
- Generate coverage report
- Publish test results
```

## Next Steps

1. Create unit test projects for each service
2. Create integration test project
3. Create E2E test project
4. Set up coverage reporting
5. Integrate with CI/CD pipeline
