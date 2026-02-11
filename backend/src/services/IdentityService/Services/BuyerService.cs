using IdentityService.Models.DTOs;
using IdentityService.Models.Entities;
using IdentityService.Repositories;
using RealServ.Shared.Domain.Exceptions;

namespace IdentityService.Services;

public interface IBuyerService
{
    Task<BuyerProfileDto> GetBuyerProfileAsync(Guid id);
    Task<BuyerProfileDto> GetBuyerProfileByUserIdAsync(Guid userId);
    Task<BuyerProfileDto> CreateBuyerProfileAsync(CreateBuyerProfileRequest request);
    Task<BuyerProfileDto> UpdateBuyerProfileAsync(Guid id, UpdateBuyerProfileRequest request);
    Task<List<DeliveryAddressDto>> GetDeliveryAddressesAsync(Guid buyerProfileId);
    Task<DeliveryAddressDto> GetDeliveryAddressAsync(Guid addressId);
    Task<DeliveryAddressDto> CreateDeliveryAddressAsync(Guid buyerProfileId, CreateDeliveryAddressRequest request);
    Task<DeliveryAddressDto> UpdateDeliveryAddressAsync(Guid addressId, UpdateDeliveryAddressRequest request);
    Task DeleteDeliveryAddressAsync(Guid addressId);
    Task SetDefaultAddressAsync(Guid buyerProfileId, Guid addressId);
}

public class BuyerService : IBuyerService
{
    private readonly IBuyerRepository _buyerRepository;
    private readonly IAddressRepository _addressRepository;
    private readonly ILogger<BuyerService> _logger;

    public BuyerService(
        IBuyerRepository buyerRepository,
        IAddressRepository addressRepository,
        ILogger<BuyerService> logger)
    {
        _buyerRepository = buyerRepository;
        _addressRepository = addressRepository;
        _logger = logger;
    }

    public async Task<BuyerProfileDto> GetBuyerProfileAsync(Guid id)
    {
        var profile = await _buyerRepository.GetByIdAsync(id);
        if (profile == null)
        {
            throw new NotFoundException("BuyerProfile", id);
        }

        return MapToBuyerProfileDto(profile);
    }

    public async Task<BuyerProfileDto> GetBuyerProfileByUserIdAsync(Guid userId)
    {
        var profile = await _buyerRepository.GetByUserIdAsync(userId);
        if (profile == null)
        {
            throw new NotFoundException("BuyerProfile for User", userId);
        }

        return MapToBuyerProfileDto(profile);
    }

    public async Task<BuyerProfileDto> CreateBuyerProfileAsync(CreateBuyerProfileRequest request)
    {
        var profile = new BuyerProfile
        {
            UserId = request.UserId,
            BusinessName = request.BusinessName,
            PreferredLanguage = request.PreferredLanguage,
            IsVerified = false
        };

        profile = await _buyerRepository.CreateAsync(profile);

        _logger.LogInformation("Buyer profile created: {ProfileId} for User: {UserId}", profile.Id, profile.UserId);

        return MapToBuyerProfileDto(profile);
    }

    public async Task<BuyerProfileDto> UpdateBuyerProfileAsync(Guid id, UpdateBuyerProfileRequest request)
    {
        var profile = await _buyerRepository.GetByIdAsync(id);
        if (profile == null)
        {
            throw new NotFoundException("BuyerProfile", id);
        }

        if (!string.IsNullOrEmpty(request.BusinessName))
        {
            profile.BusinessName = request.BusinessName;
        }

        if (!string.IsNullOrEmpty(request.PreferredLanguage))
        {
            profile.PreferredLanguage = request.PreferredLanguage;
        }

        profile = await _buyerRepository.UpdateAsync(profile);

        _logger.LogInformation("Buyer profile updated: {ProfileId}", profile.Id);

        return MapToBuyerProfileDto(profile);
    }

    public async Task<List<DeliveryAddressDto>> GetDeliveryAddressesAsync(Guid buyerProfileId)
    {
        var addresses = await _addressRepository.GetByBuyerProfileIdAsync(buyerProfileId);
        return addresses.Select(MapToDeliveryAddressDto).ToList();
    }

    public async Task<DeliveryAddressDto> GetDeliveryAddressAsync(Guid addressId)
    {
        var address = await _addressRepository.GetByIdAsync(addressId);
        if (address == null)
        {
            throw new NotFoundException("DeliveryAddress", addressId);
        }

        return MapToDeliveryAddressDto(address);
    }

    public async Task<DeliveryAddressDto> CreateDeliveryAddressAsync(Guid buyerProfileId, CreateDeliveryAddressRequest request)
    {
        // Verify buyer profile exists
        var profile = await _buyerRepository.GetByIdAsync(buyerProfileId);
        if (profile == null)
        {
            throw new NotFoundException("BuyerProfile", buyerProfileId);
        }

        var address = new DeliveryAddress
        {
            BuyerProfileId = buyerProfileId,
            Label = request.Label,
            AddressLine1 = request.AddressLine1,
            AddressLine2 = request.AddressLine2,
            City = request.City,
            State = request.State,
            Pincode = request.Pincode,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            IsDefault = request.IsDefault
        };

        address = await _addressRepository.CreateAsync(address);

        _logger.LogInformation("Delivery address created: {AddressId} for Buyer: {BuyerProfileId}", address.Id, buyerProfileId);

        return MapToDeliveryAddressDto(address);
    }

    public async Task<DeliveryAddressDto> UpdateDeliveryAddressAsync(Guid addressId, UpdateDeliveryAddressRequest request)
    {
        var address = await _addressRepository.GetByIdAsync(addressId);
        if (address == null)
        {
            throw new NotFoundException("DeliveryAddress", addressId);
        }

        if (!string.IsNullOrEmpty(request.Label))
        {
            address.Label = request.Label;
        }

        if (!string.IsNullOrEmpty(request.AddressLine1))
        {
            address.AddressLine1 = request.AddressLine1;
        }

        if (request.AddressLine2 != null)
        {
            address.AddressLine2 = request.AddressLine2;
        }

        if (!string.IsNullOrEmpty(request.City))
        {
            address.City = request.City;
        }

        if (!string.IsNullOrEmpty(request.State))
        {
            address.State = request.State;
        }

        if (!string.IsNullOrEmpty(request.Pincode))
        {
            address.Pincode = request.Pincode;
        }

        if (request.Latitude.HasValue)
        {
            address.Latitude = request.Latitude.Value;
        }

        if (request.Longitude.HasValue)
        {
            address.Longitude = request.Longitude.Value;
        }

        if (request.IsDefault.HasValue)
        {
            address.IsDefault = request.IsDefault.Value;
        }

        address = await _addressRepository.UpdateAsync(address);

        _logger.LogInformation("Delivery address updated: {AddressId}", addressId);

        return MapToDeliveryAddressDto(address);
    }

    public async Task DeleteDeliveryAddressAsync(Guid addressId)
    {
        var address = await _addressRepository.GetByIdAsync(addressId);
        if (address == null)
        {
            throw new NotFoundException("DeliveryAddress", addressId);
        }

        await _addressRepository.DeleteAsync(addressId);

        _logger.LogInformation("Delivery address deleted: {AddressId}", addressId);
    }

    public async Task SetDefaultAddressAsync(Guid buyerProfileId, Guid addressId)
    {
        await _addressRepository.SetDefaultAddressAsync(buyerProfileId, addressId);

        _logger.LogInformation("Default address set: {AddressId} for Buyer: {BuyerProfileId}", addressId, buyerProfileId);
    }

    private BuyerProfileDto MapToBuyerProfileDto(BuyerProfile profile)
    {
        return new BuyerProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            BusinessName = profile.BusinessName,
            PreferredLanguage = profile.PreferredLanguage,
            IsVerified = profile.IsVerified,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }

    private DeliveryAddressDto MapToDeliveryAddressDto(DeliveryAddress address)
    {
        return new DeliveryAddressDto
        {
            Id = address.Id,
            BuyerProfileId = address.BuyerProfileId,
            Label = address.Label,
            AddressLine1 = address.AddressLine1,
            AddressLine2 = address.AddressLine2,
            City = address.City,
            State = address.State,
            Pincode = address.Pincode,
            Latitude = address.Latitude,
            Longitude = address.Longitude,
            IsDefault = address.IsDefault,
            CreatedAt = address.CreatedAt,
            UpdatedAt = address.UpdatedAt
        };
    }
}
