// SEO Sitemap Generator for Belgrade Times
// Generates XML sitemaps for search engines using built-in Deno APIs

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Get site URL from request
    const url = new URL(req.url);
    const baseUrl = `https://${url.hostname}`;
    
    // Fetch published articles
    const articlesResponse = await fetch(`${supabaseUrl}/rest/v1/articles?select=slug,updated_at&status=eq.published&order=updated_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!articlesResponse.ok) {
      throw new Error('Failed to fetch articles');
    }

    const articles = await articlesResponse.json();

    // Fetch categories
    const categoriesResponse = await fetch(`${supabaseUrl}/rest/v1/categories?select=slug&is_active=eq.true`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    let categories = [];
    if (categoriesResponse.ok) {
      categories = await categoriesResponse.json();
    }

    // Current date for static pages
    const today = new Date().toISOString().split('T')[0];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <priority>0.6</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
    <changefreq>weekly</changefreq>
  </url>
  
  <!-- Categories -->
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
  
  <!-- Articles -->
  ${articles.map(article => `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${article.updated_at.split('T')[0]}</lastmod>
    <priority>0.9</priority>
    <changefreq>monthly</changefreq>
  </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to generate sitemap',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});