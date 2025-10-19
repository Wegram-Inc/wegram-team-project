// Jupiter Token List Proxy API
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch token list from Jupiter
    const response = await fetch('https://token.jup.ag/strict');

    if (!response.ok) {
      throw new Error(`Jupiter API returned ${response.status}`);
    }

    const tokens = await response.json();

    // Return tokens with CORS headers
    return new Response(JSON.stringify({
      success: true,
      tokens,
      count: tokens.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Jupiter tokens API error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch token list',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
