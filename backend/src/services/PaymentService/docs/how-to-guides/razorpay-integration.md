---
title: Razorpay Integration Guide - Payment Service
service: Payment Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
estimated_time: 15 minutes
---

# Razorpay Integration Guide

**Service:** Payment Service  
**Category:** How-To Guide  
**Estimated Time:** 15 minutes  
**Last Updated:** January 11, 2026

> **Goal:** Set up Razorpay payment gateway integration for RealServ Payment Service.

---

## Prerequisites

- RealServ Payment Service installed
- PostgreSQL and Redis running
- Domain name (for production webhooks)
- Bank account details (for live mode)

---

## Step 1: Create Razorpay Account

### Sign Up (2 minutes)

1. Go to https://dashboard.razorpay.com/signup
2. Fill in details:
   - Email address
   - Password
   - Business name: "RealServ"
   - Business type: "Marketplace"
3. Verify email address
4. Complete KYC (for live mode later)

**✅ Result:** You now have a Razorpay test account.

---

## Step 2: Get API Credentials

### Generate Test API Keys (2 minutes)

1. Log in to Razorpay Dashboard
2. Navigate to **Settings → API Keys**
3. Click **Generate Test Keys**
4. Copy the credentials:
   ```
   Key ID: rzp_test_XXXXXXXXXXXX
   Key Secret: YYYYYYYYYYYYYYYY
   ```

**⚠️ Important:** Never commit these keys to source control!

### Add to Environment Variables

```bash
# Development (.env file)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
```

```bash
# Production (AWS Secrets Manager)
aws secretsmanager create-secret \
  --name realserv/payment/razorpay-key-id \
  --secret-string "rzp_live_XXXXXXXXXXXX"

aws secretsmanager create-secret \
  --name realserv/payment/razorpay-key-secret \
  --secret-string "YYYYYYYYYYYYYYYY"
```

---

## Step 3: Configure Webhooks

### Create Webhook (3 minutes)

1. In Razorpay Dashboard, go to **Settings → Webhooks**
2. Click **Create Webhook**
3. Fill in details:
   - **Webhook URL:** 
     - Development: `https://YOUR_NGROK_URL/api/v1/webhooks/razorpay`
     - Production: `https://api.realserv.com/payment/api/v1/webhooks/razorpay`
   - **Alert Email:** `backend@realserv.com`
   - **Active Events:** Select these:
     - ✅ `payment.captured`
     - ✅ `payment.failed`
     - ✅ `refund.processed`
     - ✅ `refund.failed`
4. Click **Create Webhook**
5. Copy the **Webhook Secret** shown

### Add Webhook Secret to Environment

```bash
RAZORPAY_WEBHOOK_SECRET=whsec_ZZZZZZZZZZZZZZZZ
```

**✅ Result:** Razorpay will now send webhook events to your service.

---

## Step 4: Test Payment Flow

### Start Service (1 minute)

```bash
# Set environment variables
export RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
export RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
export RAZORPAY_WEBHOOK_SECRET=whsec_ZZZZZZZZZZZZZZZZ

# Run service
dotnet run
```

### Test Payment Creation (2 minutes)

```bash
# Create payment order
curl -X POST http://localhost:5007/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "buyerId": "buyer-uuid",
    "vendorId": "vendor-uuid",
    "amount": 100.00,
    "currency": "INR",
    "paymentMethod": "online"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "razorpayOrderId": "order_XXXXX",
    "amount": 100.00,
    "paymentStatus": "pending"
  }
}
```

---

## Step 5: Frontend Integration

### Install Razorpay SDK (2 minutes)

```html
<!-- Add to your HTML -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Implement Payment Flow (3 minutes)

```javascript
// Step 1: Create payment order (backend)
const createPayment = async () => {
  const response = await fetch('/api/v1/payments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${firebaseToken}`
    },
    body: JSON.stringify({
      orderId: orderDetails.id,
      buyerId: currentUser.id,
      vendorId: orderDetails.vendorId,
      amount: orderDetails.total,
      currency: 'INR',
      paymentMethod: 'online'
    })
  });

  const { data: payment } = await response.json();
  return payment;
};

// Step 2: Open Razorpay checkout
const initiatePayment = async () => {
  const payment = await createPayment();

  const options = {
    key: 'rzp_test_XXXXXXXXXXXX', // Your key ID
    amount: payment.amount * 100, // Amount in paise
    currency: payment.currency,
    order_id: payment.razorpayOrderId,
    name: 'RealServ',
    description: `Order #${orderDetails.orderNumber}`,
    image: 'https://realserv.com/logo.png',
    handler: async function (response) {
      // Step 3: Verify payment signature
      await verifyPayment(response);
    },
    prefill: {
      name: currentUser.fullName,
      email: currentUser.email,
      contact: currentUser.phoneNumber
    },
    theme: {
      color: '#2C5530' // RealServ brand color
    }
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
};

// Step 3: Verify payment
const verifyPayment = async (response) => {
  const verifyResponse = await fetch('/api/v1/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${firebaseToken}`
    },
    body: JSON.stringify({
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    })
  });

  const { data } = await verifyResponse.json();
  
  if (data.paymentStatus === 'success') {
    alert('Payment successful!');
    window.location.href = '/orders/' + data.orderId;
  }
};

// Trigger payment
document.getElementById('pay-button').addEventListener('click', initiatePayment);
```

---

## Step 6: Test Webhook Delivery (Local Development)

### Install ngrok (1 minute)

```bash
# macOS
brew install ngrok

# Linux
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
```

### Expose Local Service (1 minute)

```bash
ngrok http 5007
```

**Output:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:5007
```

### Update Razorpay Webhook URL

1. Copy ngrok URL: `https://abc123.ngrok.io`
2. Go to Razorpay Dashboard → Settings → Webhooks
3. Edit webhook
4. Update URL: `https://abc123.ngrok.io/api/v1/webhooks/razorpay`
5. Save

### Test Webhook

1. Create and complete a test payment
2. Check webhook logs:
   ```bash
   curl -X GET http://localhost:5007/api/v1/webhooks \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

**✅ Result:** Webhooks are now being received and processed.

---

## Step 7: Test with Razorpay Test Cards

### Test Successful Payment

```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/26)
CVV: Any 3 digits (e.g., 123)
```

### Test Failed Payment

```
Card Number: 4111 1111 1111 1112
Expiry: Any future date
CVV: Any 3 digits
```

### Test UPI

```
UPI ID: success@razorpay
```

---

## Step 8: Go Live Checklist

### Before Going Live

- [ ] Complete KYC in Razorpay Dashboard
- [ ] Add bank account for settlements
- [ ] Generate live API keys (`rzp_live_XXXXX`)
- [ ] Update production environment variables
- [ ] Update webhook URL to production domain
- [ ] Test in live mode with small amount (₹1)
- [ ] Enable payment methods (UPI, cards, net banking, wallets)
- [ ] Configure settlement frequency (T+3 or T+7 days)
- [ ] Set up email notifications
- [ ] Review pricing and fees

### Generate Live Keys

1. Complete KYC verification
2. Navigate to **Settings → API Keys**
3. Switch to **Live Mode**
4. Click **Generate Live Keys**
5. Securely store in AWS Secrets Manager

### Update Production Configuration

```bash
# Production environment variables
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY_LIVE
RAZORPAY_WEBHOOK_SECRET=whsec_ZZZZZZZZZZZZZZZZ_LIVE
```

---

## Razorpay Pricing (India)

### Transaction Fees
- **Domestic Cards:** 2% + GST
- **International Cards:** 3% + GST
- **UPI:** 0% (Free for transactions < ₹2,000)
- **Net Banking:** 2% + GST
- **Wallets:** 2% + GST

### Settlement Time
- **Standard:** T+3 days (free)
- **Instant:** T+0 (additional 1% fee)

---

## Common Issues

### Issue: Payment not created

**Solution:**
```bash
# Verify credentials
curl -u rzp_test_YOUR_KEY:YOUR_SECRET \
  https://api.razorpay.com/v1/payments
```

### Issue: Signature verification failed

**Solution:**
```csharp
// Ensure correct signature calculation
var message = $"{orderId}|{paymentId}"; // No spaces!
var signature = HMAC_SHA256(message, keySecret);
```

### Issue: Webhooks not received

**Solution:**
- Check webhook URL is correct and accessible
- Verify webhook secret matches
- Check firewall allows Razorpay IPs

---

## Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **Razorpay Status:** https://status.razorpay.com/
- **Razorpay Support:** support@razorpay.com

---

## Next Steps

- [Deploy to Production](./deploy-to-production.md)
- [API Reference](../../API_REFERENCE.md)
- [Troubleshooting](../reference/troubleshooting.md)

---

**Document Status:** ✅ Complete  
**Estimated Time:** 15 minutes  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
