# Contributing to RealServ Backend

Thank you for contributing to RealServ Backend!

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/realserv-backend.git
   cd realserv-backend/backend
   ```
3. **Set up development environment**
   - See `docs/development/getting-started.md`

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

### 2. Make Your Changes

- Write clean, maintainable code
- Follow coding standards (see `.editorconfig`)
- Add unit tests for new code
- Update documentation as needed

### 3. Run Tests

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test tests/unit/UserManagementService.Tests/
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add user registration endpoint"
```

**Commit Message Format**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build/tooling changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Standards

### C# Coding Style

- Use **PascalCase** for class names and public members
- Use **camelCase** for private fields and local variables
- Use **file-scoped namespaces** (C# 10+)
- Use **4 spaces** for indentation
- Follow `.editorconfig` rules

**Example**:
```csharp
namespace UserManagementService.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IUserRepository userRepository,
        ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<UserDto> GetUserByIdAsync(Guid userId)
    {
        _logger.LogInformation("Getting user {UserId}", userId);
        var user = await _userRepository.GetByIdAsync(userId);
        return user?.ToDto();
    }
}
```

### Testing Standards

- **Unit tests**: Test individual components in isolation
- **Integration tests**: Test API endpoints end-to-end
- **Test naming**: `MethodName_Scenario_ExpectedResult`
- **AAA pattern**: Arrange, Act, Assert

**Example**:
```csharp
[Fact]
public async Task GetUserById_WithValidId_ReturnsUser()
{
    // Arrange
    var userId = Guid.NewGuid();
    var mockRepo = new Mock<IUserRepository>();
    mockRepo.Setup(r => r.GetByIdAsync(userId))
        .ReturnsAsync(new User { Id = userId });
    var service = new UserService(mockRepo.Object, Mock.Of<ILogger<UserService>>());

    // Act
    var result = await service.GetUserByIdAsync(userId);

    // Assert
    result.Should().NotBeNull();
    result.Id.Should().Be(userId);
}
```

## Pull Request Guidelines

### Before Creating PR

- [ ] All tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] Branch is up-to-date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests passing locally
```

### Review Process

1. **Automated checks** run (CI/CD)
2. **Code review** by at least 1 team member
3. **Approval** required before merge
4. **Squash and merge** to main

## Architecture Guidelines

### Service Structure

Each service should follow Clean Architecture:

```
ServiceName/
├── Controllers/        # API endpoints
├── Services/           # Business logic
├── Repositories/       # Data access
├── Models/
│   ├── Entities/       # Domain entities
│   ├── DTOs/           # Data transfer objects
│   ├── Requests/       # API request models
│   └── Responses/      # API response models
├── Data/               # DbContext, migrations
├── Middleware/         # Custom middleware
├── Extensions/         # DI extensions
├── Configuration/      # Settings classes
└── Validators/         # FluentValidation validators
```

### Dependency Rules

- **Controllers** depend on **Services**
- **Services** depend on **Repositories**
- **Repositories** depend on **Data**
- **Shared libraries** can be used by all layers

### API Design

- Use RESTful conventions
- Version APIs (`/api/v1/`)
- Use proper HTTP verbs (GET, POST, PUT, DELETE)
- Return appropriate status codes
- Include Swagger documentation

**Example**:
```csharp
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }
}
```

## Documentation

### Update Documentation When

- Adding new API endpoints
- Changing service behavior
- Adding new configuration
- Updating dependencies
- Changing deployment process

### Documentation Locations

- **API docs**: `docs/api/`
- **Architecture docs**: `docs/architecture/`
- **Runbooks**: `docs/runbooks/`
- **Code comments**: Use XML comments for public APIs

## Questions?

- **Slack**: #backend-dev
- **Email**: backend@realserv.com
- **Tech Lead**: [Name]

## License

By contributing, you agree that your contributions will be licensed under the project's license.
