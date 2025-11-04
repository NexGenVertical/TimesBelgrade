// Health Check Edge Function for Belgrade Times
// Monitors application backend status using built-in Deno APIs

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Perform health checks
    const healthChecks = {
      timestamp: new Date().toISOString(),
      database: { status: 'unknown' },
      storage: { status: 'unknown' },
      articles: { status: 'unknown' },
      users: { status: 'unknown' },
      configuration: { status: supabaseUrl ? 'configured' : 'missing' }
    };

    // Test database connectivity
    try {
      const dbResponse = await fetch(`${supabaseUrl}/rest/v1/site_settings?select=count&limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      healthChecks.database.status = dbResponse.ok ? 'healthy' : 'error';
    } catch (error) {
      healthChecks.database.status = 'error';
    }

    // Check articles count
    try {
      const articlesResponse = await fetch(`${supabaseUrl}/rest/v1/articles?select=id&status=eq.published`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      });
      if (articlesResponse.ok) {
        const contentRange = articlesResponse.headers.get('content-range');
        const count = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : 0;
        healthChecks.articles.status = 'healthy';
        healthChecks.articles.count = count;
      } else {
        healthChecks.articles.status = 'error';
      }
    } catch (error) {
      healthChecks.articles.status = 'error';
    }

    // Check users count
    try {
      const usersResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      });
      if (usersResponse.ok) {
        const contentRange = usersResponse.headers.get('content-range');
        const count = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : 0;
        healthChecks.users.status = 'healthy';
        healthChecks.users.count = count;
      } else {
        healthChecks.users.status = 'error';
      }
    } catch (error) {
      healthChecks.users.status = 'error';
    }

    // Check storage buckets
    try {
      const storageResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (storageResponse.ok) {
        const buckets = await storageResponse.json();
        healthChecks.storage.status = 'healthy';
        healthChecks.storage.buckets = buckets?.length || 0;
      } else {
        healthChecks.storage.status = 'error';
      }
    } catch (error) {
      healthChecks.storage.status = 'error';
    }

    // Overall status
    const allHealthy = Object.values(healthChecks).every(check => {
      if (typeof check === 'object' && check.status) {
        return check.status === 'healthy' || check.status === 'configured';
      }
      return true;
    });

    const statusCode = allHealthy ? 200 : 503;

    return new Response(JSON.stringify({
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks: healthChecks,
      version: '1.0.0'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});