using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using CatalogService.Repositories;
using Microsoft.AspNetCore.Mvc;
using RealServ.Shared.Application.Models;

namespace CatalogService.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(
        ICategoryRepository categoryRepository,
        ILogger<CategoriesController> logger)
    {
        _categoryRepository = categoryRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetCategories(
        [FromQuery] CategoryType? type = null,
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            var categories = await _categoryRepository.GetAllAsync(type, includeInactive);

            var dtos = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Type = c.Type,
                DisplayOrder = c.DisplayOrder,
                ParentCategoryId = c.ParentCategoryId,
                ParentCategoryName = c.ParentCategory?.Name,
                IconUrl = c.IconUrl,
                IsActive = c.IsActive
            }).ToList();

            return Ok(new ApiResponse<List<CategoryDto>>
            {
                Success = true,
                Data = dtos
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return StatusCode(500, new ApiResponse<List<CategoryDto>>
            {
                Success = false,
                Message = "An error occurred while retrieving categories",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> GetCategory(Guid id)
    {
        try
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound(new ApiResponse<CategoryDto>
                {
                    Success = false,
                    Message = "Category not found"
                });
            }

            var dto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Type = category.Type,
                DisplayOrder = category.DisplayOrder,
                ParentCategoryId = category.ParentCategoryId,
                ParentCategoryName = category.ParentCategory?.Name,
                IconUrl = category.IconUrl,
                IsActive = category.IsActive
            };

            return Ok(new ApiResponse<CategoryDto>
            {
                Success = true,
                Data = dto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category {Id}", id);
            return StatusCode(500, new ApiResponse<CategoryDto>
            {
                Success = false,
                Message = "An error occurred",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        try
        {
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description,
                Type = request.Type,
                ParentCategoryId = request.ParentCategoryId,
                IconUrl = request.IconUrl,
                DisplayOrder = request.DisplayOrder,
                IsActive = true
            };

            var created = await _categoryRepository.CreateAsync(category);

            var dto = new CategoryDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                Type = created.Type,
                DisplayOrder = created.DisplayOrder,
                ParentCategoryId = created.ParentCategoryId,
                IconUrl = created.IconUrl,
                IsActive = created.IsActive
            };

            _logger.LogInformation("Created category: {CategoryId} - {CategoryName}", created.Id, created.Name);

            return CreatedAtAction(nameof(GetCategory), new { id = created.Id }, new ApiResponse<CategoryDto>
            {
                Success = true,
                Message = "Category created successfully",
                Data = dto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category");
            return StatusCode(500, new ApiResponse<CategoryDto>
            {
                Success = false,
                Message = "An error occurred",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}
