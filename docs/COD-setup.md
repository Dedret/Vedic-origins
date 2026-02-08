# COD orders via Netlify Functions + Supabase

## Environment variables (Netlify)
- `SUPABASE_URL`: Your Supabase Project URL (looks like `https://xxxx.supabase.co`). See screenshots ![image5](image5).
- `SUPABASE_SERVICE_ROLE`: Your Secret key (listed under API Keys → Secret keys, starts with `sb_secret_…`). See screenshots ![image6](image6) and ![image7](image7).

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

## Client-side integration
See `checkout-cod-client.js` for a reference implementation of calling the function from the checkout page.
