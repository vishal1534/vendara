using System.Security.Cryptography;
using System.Text;

namespace IntegrationService.Services;

/// <summary>
/// Service to validate WhatsApp webhook signatures
/// Meta/Facebook requires signature verification for webhook security
/// https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
/// </summary>
public interface IWebhookSignatureValidator
{
    /// <summary>
    /// Validates the X-Hub-Signature-256 header from WhatsApp webhook
    /// </summary>
    /// <param name="payload">Raw request body as string</param>
    /// <param name="signature">The X-Hub-Signature-256 header value</param>
    /// <param name="appSecret">WhatsApp App Secret from configuration</param>
    /// <returns>True if signature is valid, false otherwise</returns>
    bool ValidateSignature(string payload, string signature, string appSecret);
}

public class WebhookSignatureValidator : IWebhookSignatureValidator
{
    public bool ValidateSignature(string payload, string signature, string appSecret)
    {
        if (string.IsNullOrEmpty(payload) || string.IsNullOrEmpty(signature) || string.IsNullOrEmpty(appSecret))
        {
            return false;
        }

        // Meta sends signature as: sha256=<hash>
        if (!signature.StartsWith("sha256=", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        // Extract the hash part (remove "sha256=" prefix)
        var receivedHash = signature.Substring(7);

        // Compute expected hash
        var expectedHash = ComputeHmacSha256(payload, appSecret);

        // Compare hashes (constant-time comparison to prevent timing attacks)
        return CryptographicOperations.FixedTimeEquals(
            Convert.FromHexString(receivedHash),
            Convert.FromHexString(expectedHash)
        );
    }

    private string ComputeHmacSha256(string payload, string secret)
    {
        var secretBytes = Encoding.UTF8.GetBytes(secret);
        var payloadBytes = Encoding.UTF8.GetBytes(payload);

        using var hmac = new HMACSHA256(secretBytes);
        var hashBytes = hmac.ComputeHash(payloadBytes);

        // Convert to lowercase hex string
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
    }
}
