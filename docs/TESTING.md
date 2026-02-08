# Testing Instructions - Vedic Origins

This document provides step-by-step testing instructions for all features implemented in the Vedic Origins e-commerce platform.

## Prerequisites

Before testing:
1. Supabase project is set up with schema.sql executed
2. Netlify site is deployed with environment variables configured
3. `config.js` is created locally (from config.example.js) with Supabase credentials
4. Razorpay test mode is active

## Test Plan

### 1. Authentication Testing

#### 1.1 Email OTP Login

**Test Case:** User can login with email OTP

1. Open the site and click "Login" or navigate to `/login.html`
2. Verify "Email" tab is selected by default (highlighted in gold)
3. Enter a valid email address
4. Click "SEND OTP"
5. **Expected:** 
   - Button shows "Sending..." with spinner
   - Success message appears
   - Form transitions to OTP entry (6 boxes)
   - Email shows OTP sent message
6. Check your email for 6-digit OTP
7. Enter the 6-digit code (one digit per box)
8. **Expected:** Auto-focus moves to next box
9. Click "VERIFY & PROCEED"
10. **Expected:**
    - Shows "Verifying..." with spinner
    - Success message appears
    - Redirects to `/profile.html` (or saved redirect URL)
    - User stays logged in (session created)

**Test Case:** Invalid OTP handling

1. Follow steps 1-6 above
2. Enter incorrect OTP code
3. **Expected:**
   - Error message "Invalid OTP"
   - Boxes turn red and shake
   - Boxes clear after 0.5 seconds
   - Can try again

#### 1.2 Phone OTP Login

**Test Case:** User can login with phone OTP (requires SMS provider setup)

1. Navigate to `/login.html`
2. Click "Phone" tab
3. **Expected:** Phone input appears with +91 prefix
4. Enter 10-digit mobile number (no spaces)
5. Click "SEND OTP"
6. **Expected:** SMS received with 6-digit code
7. Enter code and verify
8. **Expected:** Same as email OTP success flow

**Note:** Phone OTP requires Twilio/MessageBird configuration in Supabase

#### 1.3 Auth Gate Testing

**Test Case:** Unauthenticated users are redirected

1. Open incognito/private browser window
2. Try to access protected pages directly:
   - `/profile.html`
   - `/cart.html`
   - `/products.html`
   - `/checkout.html`
3. **Expected:** 
   - Immediately redirected to `/login.html`
   - After login, redirected back to intended page

**Test Case:** Public pages remain accessible

1. Without logging in, access:
   - `/` or `/index.html`
   - `/login.html`
   - Static assets (CSS, JS, images)
2. **Expected:** No redirect, pages load normally

### 2. Profile Management Testing

#### 2.1 View Profile

**Test Case:** User can view their profile

1. Login successfully
2. Navigate to `/profile.html`
3. **Expected:**
   - Header shows greeting with user name/email
   - Contact info displayed
   - Profile section shows name, email, phone
   - Orders section loads (may be empty initially)

#### 2.2 Edit Profile

**Test Case:** User can edit profile details

1. On profile page, click "Edit Profile"
2. **Expected:**
   - Form appears with current values populated
   - Email and phone are read-only (grayed out)
   - Name field is editable
   - Address fields are editable
3. Update the following:
   - Name: "John Doe"
   - Landmark: "Near ABC Mall"
   - Area: "MG Road"
   - City: "Mumbai"
   - State: "Maharashtra"
   - Pincode: "400001"
4. Click "Save Changes"
5. **Expected:**
   - Shows loading overlay
   - Success alert appears
   - Form closes, returns to view mode
   - Updated values visible
6. Verify in Supabase:
   - Go to Table Editor → profiles
   - Find your user record
   - Confirm values updated

#### 2.3 View Orders

**Test Case:** Orders display correctly (after placing test order)

1. Place at least one test order (see Checkout Testing)
2. Go to `/profile.html`
3. **Expected:**
   - Order cards appear in "Your Orders" section
   - Shows: date, status, product name, price, payment method
   - "View Details" button available
   - Most recent orders first

### 3. Products & Cart Testing

#### 3.1 Browse Products

**Test Case:** Products load from Supabase

1. Login and navigate to `/products.html`
2. **Expected:**
   - Shows loading spinner initially
   - Products grid loads with 8 products (4 cow, 4 buffalo)
   - Each card shows: image, name, description, MRP, sale price, discount badge
   - "Add to Cart" button on each

**Test Case:** Filter products

1. On products page, click filter tabs
2. Test "All Products" - shows all 8 products
3. Click "Cow Ghee" - shows only 4 cow products
4. Click "Buffalo Ghee" - shows only 4 buffalo products
5. **Expected:** Grid updates instantly, active tab highlighted in gold

#### 3.2 Add to Cart

**Test Case:** Add products from products page

1. On `/products.html`, click "ADD TO CART" on any product
2. **Expected:**
   - Button turns green, text changes to "ADDED!"
   - Cart badge (top right) increments
   - Cart icon animates (bounce)
   - Button reverts after 1.5 seconds

**Test Case:** Add product from home page

1. Navigate to `/index.html`
2. Select product type (Cow/Buffalo)
3. Select quantity
4. Click "ADD TO CART"
5. **Expected:**
   - Button turns green
   - Confirmation prompt: "Product added to cart! Go to cart now?"
   - If Yes → redirect to `/cart.html`
   - If No → stay on page

#### 3.3 View Cart

**Test Case:** Cart displays items correctly

1. Add 2-3 different products to cart
2. Navigate to `/cart.html`
3. **Expected:**
   - Each item shows: image, name, price, quantity controls, subtotal
   - Can increment/decrement quantity
   - Can remove items
   - Summary shows: item count, subtotal, total
   - "Proceed to Checkout" button

**Test Case:** Empty cart

1. Remove all items from cart
2. **Expected:**
   - Shows empty cart message with icon
   - "Browse Products" button appears
   - No checkout button

#### 3.4 Update Cart

**Test Case:** Modify quantities

1. In cart, click "+" button on an item
2. **Expected:** Quantity increases, subtotal updates
3. Click "-" button
4. **Expected:** Quantity decreases
5. Try decrementing to 0
6. **Expected:** Confirmation prompt to remove item

**Test Case:** Remove item

1. Click "Remove" button
2. **Expected:**
   - Confirmation prompt
   - If confirmed, item removed
   - Summary recalculates
   - Page updates

### 4. Checkout Testing

#### 4.1 COD Checkout

**Test Case:** Complete COD order

1. Add items to cart
2. Go to checkout (click "Proceed to Checkout")
3. **Expected:**
   - Cart items listed with quantities and prices
   - Payment method: COD selected by default OR allow toggle
   - Subtotal shown
   - COD fee (₹200) shown in red
   - Grand total = subtotal + 200

4. Fill in shipping details:
   - Name: "Test User"
   - Mobile: "9876543210"
   - Email: "test@example.com" (optional)
   - Landmark: "Near Temple"
   - Area: "MG Road"
   - City: "Mumbai"
   - Pincode: "400001"
   - Notes: "Leave at gate" (optional)

5. Select "Cash on Delivery (COD)" if not already selected
6. **Expected:** COD fee badge shows "+₹200 Fee"

7. Click "CONFIRM ORDER"
8. **Expected:**
   - Button shows "Processing..." with spinner
   - Professional modal appears:
     * Success icon (✓)
     * Title: "Order Placed Successfully!"
     * Customer name
     * Order ID (UUID)
     * Amount (includes COD fee)
     * Payment mode: "COD"
   - Two buttons: "Close" and "Go to Thank You Page"

9. Click "Go to Thank You Page"
10. **Expected:** Redirects to `/thank-you.html?order=<uuid>`

11. Verify in Supabase:
    - Table Editor → orders
    - Find order with matching ID
    - Status: "cod_pending"
    - Payment_method: "cod"
    - Total includes COD fee
    - Address JSON populated
    - Table Editor → order_items
    - Items linked to order

12. Check cart:
    - **Expected:** Cart is now empty

#### 4.2 Razorpay Prepaid Checkout

**Test Case:** Complete prepaid order

1. Add items to cart, go to checkout
2. Fill shipping details (as in COD test)
3. Select "Pay Online (Prepaid)"
4. **Expected:**
   - Prepaid option highlighted
   - No COD fee shown
   - Total = subtotal only
   - Badge shows "No COD Fee"

5. Click "CONFIRM ORDER"
6. **Expected:**
   - Razorpay checkout popup opens
   - Shows order details, amount
   - Brand color: gold (#d4af37)

7. In Razorpay popup, use test card:
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: 12/25
   - Name: Test User

8. Complete payment
9. **Expected:**
   - Popup closes
   - Modal appears with success message
   - Order ID shown
   - Payment mode: "Prepaid (Online)"
   - Cart cleared

10. Verify in Supabase:
    - orders table: status = "paid"
    - razorpay_order_id populated
    - razorpay_payment_id populated
    - razorpay_signature populated
    - No COD fee

**Test Case:** Failed payment

1. Repeat steps 1-6 above
2. Use failed test card: 4000 0000 0000 0002
3. **Expected:**
   - Payment fails in Razorpay
   - Error message shown
   - Order created with status "payment_failed"
   - Cart NOT cleared (can retry)

**Test Case:** Cancel payment

1. Repeat steps 1-6
2. Close Razorpay popup (cancel)
3. **Expected:**
   - Error message: "Payment cancelled"
   - Button re-enabled
   - Can try again

### 5. Cross-Feature Testing

#### 5.1 Session Persistence

**Test Case:** User stays logged in across pages

1. Login successfully
2. Navigate between pages:
   - Home → Products → Cart → Profile → Checkout
3. **Expected:** No login prompts, session maintained
4. Close browser
5. Reopen and visit site
6. **Expected:** 
   - Short-term sessions may expire
   - Long-term tokens should maintain login (Supabase default)

#### 5.2 Cart Persistence

**Test Case:** Cart survives page reload

1. Add items to cart
2. Reload page
3. **Expected:** Cart badge shows same count
4. Visit `/cart.html`
5. **Expected:** Items still present

**Test Case:** Cart persists across logout

1. Add items to cart
2. Logout
3. Login with different account
4. **Expected:** Cart from previous session still present (localStorage is browser-wide)

**Note:** For production, consider clearing cart on logout or scoping to user ID

#### 5.3 Mobile Responsiveness

**Test Case:** Mobile layout works

1. Open site on mobile device OR use browser dev tools
2. Set viewport to 375px width (iPhone size)
3. Test all pages:
   - Home: sidebar menu works, hero looks good
   - Login: form is usable
   - Products: grid stacks vertically
   - Cart: items display well
   - Checkout: form fields stack
   - Profile: cards are mobile-friendly

4. **Expected:**
   - No horizontal scroll
   - All buttons are tappable (minimum 44x44px)
   - Text is readable
   - Hamburger menu works

### 6. Error Handling Testing

#### 6.1 Network Errors

**Test Case:** Handle Supabase connection failure

1. In config.js, set invalid SUPABASE_URL
2. Try to login
3. **Expected:** User-friendly error message

**Test Case:** Handle Netlify Function failure

1. Disconnect internet
2. Try to place order
3. **Expected:** Network error message

#### 6.2 Validation Errors

**Test Case:** Form validation works

1. On checkout, leave required fields empty
2. Click "CONFIRM ORDER"
3. **Expected:**
   - Inline validation errors appear
   - Fields highlighted in red
   - Specific error messages

2. Enter invalid data:
   - Phone: "123" (too short)
   - Email: "notanemail"
   - Pincode: "12" (too short)
3. **Expected:** Validation errors for each

### 7. Acceptance Criteria Validation

✅ **Login is required before accessing protected pages**
- Test: Access /profile.html without login → redirected to /login.html

✅ **login.html works with OTP**
- Test: Complete email OTP flow → successful login

✅ **Profile page reads/writes user data to Supabase (with RLS)**
- Test: Edit profile → data saves to Supabase
- Test: Check Supabase directly → only own profile visible

✅ **Cart supports multiple items and passes them to checkout**
- Test: Add 3 products → all appear in checkout

✅ **COD and Razorpay prepaid both work end to end**
- Test: Complete COD order → order in Supabase
- Test: Complete Razorpay order → order verified

✅ **Modal is professional and accessible; no window.alert usage**
- Test: Complete order → modal appears (not alert)
- Test: Press ESC → modal closes
- Test: Tab navigation → works within modal

✅ **Netlify deploy preview works**
- Test: Deploy to Netlify → site loads

✅ **Supabase shows orders and profiles**
- Test: Check Table Editor → data appears

## Troubleshooting Common Issues

### "Supabase not initialized"
- Check config.js exists and has correct values
- Verify Supabase CDN script is loading

### "Payment verification failed"
- Check RAZORPAY_KEY_SECRET in Netlify
- Verify order ID matches

### "Profile not found"
- Run schema.sql trigger creation
- Manually insert profile record

### Cart not updating
- Check browser localStorage is enabled
- Clear localStorage and test

### OTP not received
- Check spam folder
- Verify email provider settings in Supabase
- For phone: check SMS provider credentials

## Test Data Summary

**Test Email:** Use your real email for testing  
**Test Phone:** +91 followed by 10 digits (if SMS configured)

**Razorpay Test Cards:**
- Success: 4111 1111 1111 1111
- Fail: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

**Test Address:**
- Landmark: Near ABC Mall
- Area: MG Road, Sector 5
- City: Mumbai
- State: Maharashtra
- Pincode: 400001

## Sign-off Checklist

Before considering testing complete:

- [ ] Email OTP login works
- [ ] Phone OTP login works (if SMS configured) OR documented as not configured
- [ ] Auth gate redirects unauthenticated users
- [ ] Profile can be viewed and edited
- [ ] Products load from Supabase
- [ ] Cart add/remove/update works
- [ ] COD checkout completes successfully
- [ ] Razorpay checkout completes successfully
- [ ] Orders appear in Supabase
- [ ] Profiles have RLS working
- [ ] Modal appears (no window.alert)
- [ ] Mobile layout looks good
- [ ] All forms validate properly
- [ ] Error messages are user-friendly
- [ ] Netlify deployment successful
- [ ] Environment variables configured
- [ ] Documentation reviewed

---

**Testing completed by:** _______________  
**Date:** _______________  
**Notes:** _______________
