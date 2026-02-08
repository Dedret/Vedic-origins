const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = JSON.parse(event.body || '{}');

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      // Update order status to payment_failed
      await supabase
        .from('orders')
        .update({
          status: 'payment_failed',
          razorpay_payment_id,
          razorpay_signature
        })
        .eq('id', order_id);

      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid signature', verified: false })
      };
    }

    // Signature is valid - update order to paid
    const { data: order, error: updateErr } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id,
        razorpay_signature
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verified: true,
        orderId: order.id,
        status: order.status,
        total: order.total
      })
    };
  } catch (e) {
    console.error('Payment verification error:', e);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to verify payment', details: e.message })
    };
  }
};
