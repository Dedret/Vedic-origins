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

## Integration with checkout page
To integrate with the existing `checkout.html` page, modify the `placeOrder()` function to call the Netlify function when COD payment method is selected:

```javascript
async function placeOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    if(name === "" || phone === "" || address === "") {
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
                        city: 'City',  // Parse from address field
                        state: 'State', // Parse from address field
                        pincode: '000000' // Parse from address field
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
                alert('Order failed: ' + result.body);
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
