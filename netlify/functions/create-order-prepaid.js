const { createClient } = require('@supabase/supabase-js');
const Razorpay = require('razorpay');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  try {
    const { items, address, phone, email, notes, user_id } = JSON.parse(event.body || '{}');

    // Validate inputs
    if (!items?.length) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No items provided' })
      };
    }

    const required = ['name', 'line1', 'city', 'state', 'pincode'];
    if (!address || required.some((k) => !address[k])) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Incomplete address' })
      };
    }

    if (!phone) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Phone required' })
      };
    }

    const currency = 'INR';
    const subtotal = items.reduce((sum, it) => sum + Number(it.price) * Number(it.qty || 1), 0);
    const total = subtotal; // No COD fee for prepaid

    // Create order in Supabase first
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user_id || null,
        payment_method: 'prepaid',
        status: 'pending_payment',
        total,
        cod_fee: 0,
        currency,
        phone,
        email,
        address,
        notes
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Convert to paise
      currency: currency,
      receipt: order.id,
      notes: {
        order_id: order.id,
        customer_phone: phone,
        customer_email: email || ''
      }
    });

    // Update order with Razorpay order ID
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq('id', order.id);

    if (updateErr) throw updateErr;

    // Insert order items
    const lineItems = items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      name: it.name,
      price: Number(it.price),
      qty: Number(it.qty || 1),
      currency
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(lineItems);

    if (itemsErr) throw itemsErr;

    // Return success with Razorpay details
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        rzpOrderId: razorpayOrder.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: currency,
        total: total
      })
    };
  } catch (e) {
    console.error('Prepaid order creation error:', e);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to create prepaid order', details: e.message })
    };
  }
};
