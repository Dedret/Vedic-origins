const { createClient } = require('@supabase/supabase-js');

// Configuration constants
const COD_FEE = Number(process.env.COD_FEE) || 200;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

  try {
    const { items, address, phone, email, notes } = JSON.parse(event.body || '{}');

    if (!items?.length) return { statusCode: 400, body: 'No items provided' };
    const required = ['name', 'line1', 'city', 'state', 'pincode'];
    if (!address || required.some((k) => !address[k])) return { statusCode: 400, body: 'Incomplete address' };
    if (!phone) return { statusCode: 400, body: 'Phone required' };

    const currency = 'INR';
    const subtotal = items.reduce((sum, it) => sum + Number(it.price) * Number(it.qty || 1), 0);
    const total = subtotal + COD_FEE;

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        payment_method: 'cod',
        status: 'cod_pending',
        total,
        cod_fee: COD_FEE,
        currency,
        phone,
        email,
        address,
        notes
      })
      .select()
      .single();
    if (orderErr) throw orderErr;

    const lineItems = items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      name: it.name,
      price: Number(it.price),
      qty: Number(it.qty || 1),
      currency
    }));
    const { error: itemsErr } = await supabase.from('order_items').insert(lineItems);
    if (itemsErr) {
      // Cleanup: delete the order if items insertion fails
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsErr;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, status: order.status, total })
    };
  } catch (e) {
    console.error('COD order error:', e);
    return { statusCode: 500, body: 'Failed to create COD order' };
  }
};
