# PexiPay Admin Credentials

## 🔐 Super Admin Account

**Email:** `admin@pexipay.com`  
**Password:** `SuperAdmin123!`  
**Role:** ADMIN  
**User ID:** `cmi8perqr00000zmt7vkdu6uq`

---

## 🏢 Test Super-Merchant Account

**Email:** `supermerchant@test.com`  
**Password:** `SuperMerchant123!`  
**Role:** SUPER_MERCHANT  
**Super Merchant ID:** `cmi8petew00010zmt8jst1x7z`

---

## 🛍️ Test Merchant Account

**Email:** `merchant@test.com`  
**Password:** `Merchant123!`  
**Role:** MERCHANT  
**Merchant ID:** `cmi8pevkt00030zmtdvltvtwp`  
**Parent Super-Merchant:** Test Super Merchant

---

## ⚠️ Security Notes

- **DO NOT commit this file to version control**
- Change all passwords in production
- These are test accounts for development only
- Update JWT_SECRET and other secrets in `.env` before deployment

---

## 🚀 Quick Start

### Test Login Endpoints (use POST method)

1. **Login as Admin:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@pexipay.com","password":"SuperAdmin123!"}'
   ```

2. **Login as Super-Merchant:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"supermerchant@test.com","password":"SuperMerchant123!"}'
   ```

3. **Login as Merchant:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"merchant@test.com","password":"Merchant123!"}'
   ```

### Browser Testing

Use the browser console or a tool like Postman/Insomnia:

```javascript
// Test admin login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@pexipay.com',
    password: 'SuperAdmin123!'
  })
})
.then(r => r.json())
.then(console.log)
```

**Note:** The API only accepts POST requests. GET requests will return 405 Method Not Allowed.

---

Generated on: November 21, 2025
