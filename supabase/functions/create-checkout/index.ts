import Stripe from 'https://esm.sh/stripe@14?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const PRICE_ID = Deno.env.get('STRIPE_PRICE_ID') ?? 'price_1TUXfN09yuQ91nkjAuyItghK';
const SUCCESS_URL = 'https://brandpricing.netlify.app?subscribed=true';
const CANCEL_URL = 'https://brandpricing.netlify.app?canceled=true';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, user_email } = await req.json();

    if (!user_id || !user_email) {
      throw new Error('user_id e user_email são obrigatórios');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user_email,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      metadata: { supabase_user_id: user_id },
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Erro ao criar checkout:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
