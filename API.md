# Change if needed
BASE_URL="http://localhost:4000/api"
JWT_TOKEN="<JWT_TOKEN>"

# --------
# Health
# --------
curl -s "$BASE_URL/health" \
  -H "Content-Type: application/json"

# --------
# Catalog
# --------
curl -s "$BASE_URL/catalog/brands" \
  -H "Content-Type: application/json"

# brandId required (MongoDB ObjectId)
# Get it from: GET /api/catalog/brands
curl -s "$BASE_URL/catalog/models?brandId=<brandId>" \
  -H "Content-Type: application/json"

# modelId required (MongoDB ObjectId)
# Get it from: GET /api/catalog/models?brandId=...
curl -s "$BASE_URL/catalog/variants?modelId=<modelId>" \
  -H "Content-Type: application/json"

curl -s "$BASE_URL/catalog/structure" \
  -H "Content-Type: application/json"

# --------
# Auth - OTP
# --------
curl -s "$BASE_URL/auth/otp/request" \
  -H "Content-Type: application/json" \
  -d "{ \"phone\": \"9876543210\" }"

curl -s "$BASE_URL/auth/otp/verify" \
  -H "Content-Type: application/json" \
  -d "{ \"phone\": \"9876543210\", \"otp\": \"123456\" }"

# --------
# Auth - Email/Password
# --------
curl -s "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d "{ \"name\": \"John\", \"email\": \"john@example.com\", \"phone\": \"9876543210\", \"password\": \"secret123\" }"

curl -s "$BASE_URL/auth/email/login" \
  -H "Content-Type: application/json" \
  -d "{ \"email\": \"john@example.com\", \"password\": \"secret123\" }"

# --------
# Auth - Me
# --------
curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

curl -s "$BASE_URL/auth/me" \
  -X PATCH \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{ \"name\": \"John\" }"

# --------
# Pricing (Sell estimate)
# --------
curl -s "$BASE_URL/pricing/estimate" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Apple",
    "model": "iPhone 12",
    "ram": "4GB",
    "storage": "128GB",
    "screenCondition": "Good",
    "bodyCondition": "Fair",
    "batteryHealth": "80% - 89%",
    "accessories": "Original charger only"
  }'

# --------
# Orders (Sell Phone)
# --------
curl -s "$BASE_URL/orders" \
  -X POST \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Apple",
    "model": "iPhone 12",
    "ram": "4GB",
    "storage": "128GB",
    "screen": "Good",
    "body": "Fair",
    "battery": "80% - 89%",
    "accessories": "Original charger only",
    "pickupDate": "2026-04-01",
    "pickupTime": "12:00 PM – 3:00 PM",
    "address": { "label": "Home", "line1": "123 Main St", "city": "Delhi", "state": "", "pincode": "110001" },
    "payMethod": "UPI"
  }'

curl -s "$BASE_URL/orders" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# orderId required
curl -s "$BASE_URL/orders/<orderId>/payment" \
  -X PATCH \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payMethod": "UPI",
    "paymentDetails": { "upiId": "name@upi" }
  }'

# --------
# Addresses
# --------
curl -s "$BASE_URL/addresses" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

curl -s "$BASE_URL/addresses" \
  -X POST \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{ \"label\": \"Home\", \"line1\": \"123 Main St\", \"city\": \"Delhi\", \"state\": \"\", \"pincode\": \"110001\" }"

# addressId required
curl -s "$BASE_URL/addresses/<addressId>" \
  -X DELETE \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# --------
# Admin (role=admin)
# --------
# status optional
curl -s "$BASE_URL/admin/orders?status=Request%20Submitted" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# orderId required
curl -s "$BASE_URL/admin/orders/<orderId>" \
  -X PATCH \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Pickup Scheduled" }'

curl -s "$BASE_URL/admin/orders/<orderId>" \
  -X DELETE \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# catalog
curl -s "$BASE_URL/admin/catalog" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# variantId required
curl -s "$BASE_URL/admin/catalog/variants/<variantId>" \
  -X PATCH \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "priceDelta": 250 }'