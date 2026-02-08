# Vedic Origins - E-commerce Platform

A modern JAMstack e-commerce website for selling premium Bilona Ghee with OTP-based authentication, shopping cart, and integrated payment solutions (COD + Razorpay).

## 🌟 Features

### Authentication
- **OTP-based Login** via Supabase Auth
  - Email OTP (default)
  - Phone OTP via SMS (when configured)
- **Protected Routes** with client-side auth gate
- **Session Management** with automatic redirects

### Shopping Experience
- **Product Catalog** fetched from Supabase
  - Cow Ghee variants (250ml, 500ml, 750ml, 1L)
  - Buffalo Ghee variants (250ml, 500ml, 750ml, 1L)
- **Shopping Cart**
  - Add/Remove items
  - Update quantities
  - Persistent storage (localStorage)
  - Real-time cart badge
- **Smooth Checkout** with address management

### Payment Integration
- **Cash on Delivery (COD)**
  - ₹200 handling fee
  - Order confirmation via professional modal
- **Razorpay Prepaid Payments**
  - UPI, Cards, Net Banking, Wallets
  - Server-side signature verification
  - No COD fee
  - Test and Live mode support

### User Profile
- **Profile Management**
  - Edit name and details
  - Default shipping address
  - View order history
- **Order Tracking**
  - Order status display
  - Payment method indicator

### Professional UI/UX
- **Mobile-First Design**
- **Smooth Animations**
- **Accessible Modals**
- **Loading States**
- **Error Handling**

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- Netlify account
- Supabase account
- Razorpay account (for prepaid)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dedret/Vedic-origins.git
   cd Vedic-origins
   ```

2. Install dependencies:
   ```bash
   cd netlify/functions
   npm install
   cd ../..
   ```

3. Configure Supabase:
   ```bash
   cp assets/js/config.example.js assets/js/config.js
   # Edit config.js with your Supabase credentials
   ```

4. Set up database:
   - Run SQL from `supabase/schema.sql` in Supabase SQL Editor

5. Configure environment variables in Netlify:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE=your_service_role_key
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

6. Run locally:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify dev
   ```

## 📁 Project Structure

```
Vedic-origins/
├── assets/
│   ├── css/
│   │   └── modal.css
│   └── js/
│       ├── auth.js
│       ├── cart.js
│       ├── products.js
│       ├── profile.js
│       └── require-auth.js
├── netlify/functions/
│   ├── create-order-prepaid.js
│   ├── place-order-cod.js
│   └── verify-razorpay.js
├── supabase/
│   └── schema.sql
├── docs/
│   └── deployment.md
├── index.html
├── login.html
├── products.html
├── cart.html
├── checkout.html
└── profile.html
```

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- Server-side payment verification
- Environment variables for secrets
- HTTPS only
- No credentials in Git

## 🧪 Testing

### Razorpay Test Cards

**Success:** `4111 1111 1111 1111`  
**Failed:** `4000 0000 0000 0002`

CVV: Any 3 digits  
Expiry: Any future date

## 📚 Documentation

- [Deployment Guide](docs/deployment.md) - Complete setup instructions
- [COD Setup](docs/COD-setup.md) - Cash on Delivery configuration

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Netlify Functions
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (OTP)
- **Payments:** Razorpay
- **Hosting:** Netlify

## 📝 License

Private and proprietary.

---

For detailed setup instructions, see [docs/deployment.md](docs/deployment.md)
