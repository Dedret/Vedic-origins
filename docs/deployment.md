# Deployment Guide - Vedic Origins E-commerce

This guide will help you set up and deploy the Vedic Origins e-commerce site with OTP authentication, shopping cart, and payment integration (COD + Razorpay).

## Prerequisites

- A Netlify account
- A Supabase account
- A Razorpay account (for prepaid payments)
- Git repository access

## Table of Contents

1. [Supabase Setup](#supabase-setup)
2. [Netlify Setup](#netlify-setup)
3. [Razorpay Setup](#razorpay-setup)
4. [Local Development](#local-development)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - Name: `vedic-origins` (or your preferred name)
   - Database Password: (choose a strong password)
   - Region: (choose closest to your target audience)
4. Wait for the project to be provisioned (~2 minutes)

### Step 2: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**

2. **Email OTP Setup** (Default - Already Enabled):
   - Email Auth is enabled by default
   - Users will receive OTP via email
   - No additional configuration needed

3. **Phone OTP Setup** (Optional - Requires SMS Provider):
   - Go to **Authentication** → **Providers** → **Phone**
   - Toggle to enable Phone auth
   - Choose an SMS provider:
     - **Twilio** (Recommended):
       - Sign up at [twilio.com](https://www.twilio.com)
       - Get Account SID, Auth Token, and Phone Number
       - Enter credentials in Supabase
     - **MessageBird** (Alternative):
       - Sign up at [messagebird.com](https://www.messagebird.com)
       - Get Access Key
       - Enter in Supabase
   - Click Save

4. **Email Templates** (Optional Customization):
   - Go to **Authentication** → **Email Templates**
   - Customize the "Magic Link" template for OTP emails
   - Use your brand colors and messaging

### Step 3: Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy the entire contents of `supabase/schema.sql` from the repository
4. Click "Run" to execute the SQL
5. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `orders`, `order_items`, `products`, `profiles`

### Step 4: Get API Credentials

1. Go to **Settings** → **API**
2. Note down these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (longer secret string - keep this private!)

---

## Netlify Setup

### Step 1: Deploy to Netlify

1. **Option A: Deploy from GitHub**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings:
     - Build command: (leave empty - static site)
     - Publish directory: `/` (root)
   - Click "Deploy site"

2. **Option B: Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

### Step 2: Configure Environment Variables

1. In Netlify dashboard, go to **Site settings** → **Environment variables**

2. Add the following variables:

   **Required for All Features:**
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE=eyJhbGc... (service_role key from Supabase)
   ```

   **Required for Razorpay (Prepaid Payments):**
   ```
   RAZORPAY_KEY_ID=rzp_test_... (from Razorpay dashboard)
   RAZORPAY_KEY_SECRET=... (from Razorpay dashboard)
   ```

3. Click "Save"

4. **Important**: Redeploy your site after adding environment variables:
   - Go to **Deploys** tab
   - Click "Trigger deploy" → "Deploy site"

### Step 3: Configure Functions

Netlify Functions are automatically detected in the `netlify/functions/` directory. The following functions will be available:

- `/.netlify/functions/place-order-cod` - COD order placement
- `/.netlify/functions/create-order-prepaid` - Razorpay order creation
- `/.netlify/functions/verify-razorpay` - Payment verification

No additional configuration needed.

---

## Razorpay Setup

### Step 1: Create Razorpay Account

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Complete KYC verification (required for live payments)
3. For testing, you can use Test Mode immediately

### Step 2: Get API Keys

1. Go to **Settings** → **API Keys**
2. **Test Mode**:
   - Click "Generate Test Key"
   - Note down:
     - **Key ID**: `rzp_test_...`
     - **Key Secret**: `...` (keep secret!)
3. **Live Mode** (after KYC):
   - Click "Generate Live Key"
   - Note down:
     - **Key ID**: `rzp_live_...`
     - **Key Secret**: `...` (keep secret!)

### Step 3: Configure Razorpay

1. **Payment Methods**:
   - Go to **Settings** → **Payment Methods**
   - Enable: UPI, Cards, Net Banking, Wallets
   - Configure minimum/maximum amounts if needed

2. **Webhooks** (Optional but Recommended):
   - Go to **Settings** → **Webhooks**
   - Add webhook URL: `https://your-site.netlify.app/.netlify/functions/razorpay-webhook`
   - Select events: `payment.authorized`, `payment.failed`
   - Save secret key for webhook verification

3. **Branding**:
   - Go to **Settings** → **Branding**
   - Upload logo and customize colors to match Vedic Origins theme
   - Use brand color: `#d4af37` (gold)

### Step 4: Testing Razorpay

Use these test card details in Test Mode:

**Successful Payment:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failed Payment:**
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

---

## Local Development

### Step 1: Clone Repository

```bash
git clone https://github.com/Dedret/Vedic-origins.git
cd Vedic-origins
```

### Step 2: Install Dependencies

```bash
# Install Netlify Functions dependencies
cd netlify/functions
npm install
cd ../..

# Install root dependencies (if any)
npm install
```

### Step 3: Configure Supabase Client

1. Copy the example config:
   ```bash
   cp assets/js/config.example.js assets/js/config.js
   ```

2. Edit `assets/js/config.js` and add your Supabase credentials:
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'https://xxxxx.supabase.co',
     anonKey: 'eyJhbGc...'
   };
   ```

3. **Important**: Never commit `config.js` to git (it's in `.gitignore`)

### Step 4: Run Locally with Netlify Dev

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your Netlify site
netlify link

# Start local development server
netlify dev
```

This will:
- Serve your site at `http://localhost:8888`
- Make functions available at `http://localhost:8888/.netlify/functions/`
- Use environment variables from Netlify

### Step 5: Test Locally

1. Visit `http://localhost:8888`
2. Create a test account via OTP
3. Add products to cart
4. Test checkout with both COD and Razorpay (test mode)

---

## Testing

### Authentication Testing

**Email OTP:**
1. Go to `/login.html`
2. Select "Email" mode
3. Enter your email
4. Click "Send OTP"
5. Check your email for the 6-digit code
6. Enter code and verify

**Phone OTP** (if SMS provider configured):
1. Go to `/login.html`
2. Select "Phone" mode
3. Enter phone number (with +91 prefix)
4. Click "Send OTP"
5. Check SMS for the 6-digit code
6. Enter code and verify

### Cart & Checkout Testing

1. **Browse Products**: Visit `/products.html`
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click cart icon or visit `/cart.html`
4. **Update Quantities**: Use +/- buttons
5. **Checkout**: Click "Proceed to Checkout"
6. **Fill Details**: Enter shipping information
7. **Choose Payment**:
   - **COD**: Verify ₹200 fee is added
   - **Prepaid**: Verify no COD fee
8. **Complete Order**: Follow payment flow

### Payment Testing

**COD Orders:**
- Should create order with status `cod_pending`
- Should add ₹200 to total
- Should show success modal

**Razorpay Orders (Test Mode):**
- Should open Razorpay checkout popup
- Use test card: 4111 1111 1111 1111
- Should verify payment server-side
- Should update order status to `paid`
- Should clear cart on success

### Verify in Supabase

1. Go to Supabase **Table Editor**
2. Check `orders` table for new orders
3. Check `order_items` table for line items
4. Check `profiles` table for user profiles
5. Verify all data is correctly stored

---

## Troubleshooting

### Authentication Issues

**Problem**: "Supabase not initialized"
- **Solution**: Ensure `config.js` exists and has correct credentials
- **Check**: Browser console for detailed errors

**Problem**: OTP email not received
- **Solution**: Check spam folder
- **Check**: Supabase dashboard → Authentication → Logs for delivery status
- **Verify**: Email template is configured correctly

**Problem**: Phone OTP not working
- **Solution**: Verify SMS provider credentials in Supabase
- **Check**: Phone number format (+91 for India)
- **Note**: Requires SMS provider setup (Twilio/MessageBird)

### Cart Issues

**Problem**: Cart not persisting
- **Solution**: Check browser localStorage is enabled
- **Clear**: Old cart data and test again
- **Verify**: Cart badge updates on add/remove

**Problem**: Products not loading
- **Solution**: Check Supabase credentials
- **Verify**: Products table has data
- **Check**: Browser console for API errors

### Payment Issues

**Problem**: Razorpay not loading
- **Solution**: Verify Razorpay SDK script is loaded
- **Check**: Browser console for script errors
- **Verify**: RAZORPAY_KEY_ID is set in Netlify

**Problem**: Payment verification fails
- **Solution**: Check RAZORPAY_KEY_SECRET is correct
- **Verify**: Order exists in database
- **Check**: Netlify function logs

**Problem**: COD orders failing
- **Solution**: Verify SUPABASE_SERVICE_ROLE is set
- **Check**: Netlify function logs
- **Verify**: Schema is up to date

### Netlify Function Errors

**Check Function Logs:**
1. Go to Netlify dashboard
2. Click on your site
3. Go to **Functions** tab
4. Click on the function name
5. View recent invocations and logs

**Common Errors:**
- `TypeError: Cannot read property...` → Check environment variables
- `403 Forbidden` → Check Supabase service role key
- `Connection refused` → Check Supabase URL is correct
- `Invalid signature` → Check Razorpay secret key

---

## Security Checklist

Before going live:

- [ ] **Never** commit `config.js` or any API keys to Git
- [ ] Use **service_role** key only in Netlify Functions (server-side)
- [ ] Use **anon** key in client-side code
- [ ] Enable Row Level Security (RLS) on all Supabase tables
- [ ] Use Razorpay **live** keys for production (after KYC)
- [ ] Set up Razorpay **webhooks** for payment notifications
- [ ] Enable **HTTPS** on your custom domain (Netlify provides this)
- [ ] Test all features in **incognito/private** mode
- [ ] Review Supabase **Auth** settings and rate limits
- [ ] Set up **email verification** for new accounts (optional)

---

## Going Live

### 1. Switch to Production Razorpay Keys

1. Complete KYC in Razorpay dashboard
2. Generate Live API keys
3. Update Netlify environment variables:
   ```
   RAZORPAY_KEY_ID=rzp_live_...
   RAZORPAY_KEY_SECRET=...
   ```
4. Redeploy site

### 2. Configure Custom Domain

1. In Netlify, go to **Domain settings**
2. Add custom domain (e.g., `vedicorigins.com`)
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

### 3. Production Testing

- Test all user flows end-to-end
- Verify emails are delivered
- Test real payment with small amount
- Check all orders appear in Supabase
- Monitor Netlify function logs

### 4. Monitor & Maintain

- Set up **Sentry** or error tracking
- Monitor **Netlify Analytics**
- Review **Supabase Auth Logs** regularly
- Check **Razorpay Dashboard** for settlements
- Backup **Supabase** database regularly

---

## Support

For issues:
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Razorpay**: [razorpay.com/docs](https://razorpay.com/docs)

For repository issues:
- Create an issue on GitHub
- Include: error messages, browser console logs, Netlify function logs
