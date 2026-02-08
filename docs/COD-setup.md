# COD orders via Netlify Functions + Supabase

## Environment variables (Netlify)
- `SUPABASE_URL`: Your Supabase Project URL (looks like `https://xxxx.supabase.co`). See screenshots ![image5](image5).
- `SUPABASE_SERVICE_ROLE`: Your Secret key (listed under API Keys → Secret keys, starts with `sb_secret_…`). See screenshots ![image2](image2) and ![image3](image3).

## Deploy
1. Merge this PR.
2. In Netlify site settings → Environment variables, add the two variables above. See ![image1](image1) for the Netlify UI.
3. Deploy the site. The function will be available at `/.netlify/functions/place-order-cod`.

## Supabase schema
Run the SQL in `supabase/schema.sql` once in Supabase → SQL Editor to create `orders` and `order_items` tables.

## Test the function
Send a POST to `/.netlify/functions/place-order-cod` with JSON:
```json
{
  "items": [{ "product_id": "cow-ghee-1l", "name": "A2 Gir Cow Ghee (1L)", "price": 4000, "qty": 1 }],
  "address": { "name": "Customer", "line1": "Street 1", "city": "City", "state": "State", "pincode": "400001" },
  "phone": "9999999999",
  "email": "customer@example.com",
  "notes": "Leave at gate"
}
```
Response:
```json
{ "orderId": "uuid-here", "status": "cod_pending", "total": 4200 }
```

## Thank You Page
A thank-you page (`thank-you.html`) is included for displaying order confirmation. After a successful COD order, users are redirected to this page with the order ID in the URL query parameter.

The client-side helper automatically redirects to `thank-you.html?order=<orderId>` after a successful order placement.

## Client-side helper
A ready-to-use client-side helper is available at `assets/js/cod-order.js`. This file contains the `placeCodOrder()` function that handles calling the Netlify function and redirecting to the thank-you page.

To use it, include the script in your checkout page:
```html
<script src="assets/js/cod-order.js"></script>
```

Then call it from your checkout button (see the example usage comments in the file).

## Integration with checkout page
To integrate with the existing `checkout.html` page, you'll need to:

1. **Add separate form fields** for city, state, and pincode in checkout.html
2. **Include the client-side helper** `<script src="assets/js/cod-order.js"></script>` in checkout.html
3. **Modify the `placeOrder()` function** to call the helper when COD payment method is selected

Example integration code:

```javascript
async function placeOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    // Add these new fields to checkout.html:
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    
    if(name === "" || phone === "" || address === "" || city === "" || state === "" || pincode === "") {
        alert("Please fill all details first!");
        return;
    }
    
    if(currentMethod === 'cod') {
        // Call the Netlify function for COD orders
        try {
            const response = await fetch('/.netlify/functions/place-order-cod', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{ 
                        product_id: 'cow-ghee-1l', 
                        name: productName, 
                        price: basePrice, 
                        qty: 1 
                    }],
                    address: {
                        name: name,
                        line1: address,
                        city: city,
                        state: state,
                        pincode: pincode
                    },
                    phone: phone,
                    notes: ''
                })
            });
            
            const result = await response.json();
            if(response.ok) {
                alert(`✅ ORDER PLACED!\nOrder ID: ${result.orderId}\nAmount: ₹${result.total}`);
                window.location.href = 'index.html';
            } else {
                alert('Order failed: ' + (result.error || 'Unknown error'));
            }
        } catch(e) {
            alert('Error placing order: ' + e.message);
        }
    } else {
        // Handle UPI payment (existing logic)
        alert(`UPI payment for ₹${finalAmount}`);
    }
}
```
