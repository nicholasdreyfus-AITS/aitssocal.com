// AITS AI Risk Scan — Cloudflare Worker API proxy
// ---------------------------------------------------------------------------
// Deploy at workers.cloudflare.com. Set secret: ANTHROPIC_API_KEY = <your key>.
// The deployed Worker URL is the PROXY_URL used in public/scan.html.
//
// 2026-06-18: model updated from "claude-sonnet-4-20250514" (RETIRED 2026-06-15,
// which caused the scan to return blank/inconclusive reports) to the current
// "claude-sonnet-4-6". Also: added aits.llc to CORS, and now propagate upstream
// errors as non-200 so the funnel shows a real error instead of an empty report.
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    // CORS: allow the production domain, www, the old domain (during the
    // aitssocal.com -> aits.llc transition), and local dev on port 3000.
    const allowedOrigins = [
      "https://aits.llc",
      "https://www.aits.llc",
      "https://aitssocal.com",
      "https://www.aitssocal.com",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
    ];

    const origin = request.headers.get("Origin") || "";
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: body.messages,
        }),
      });

      const data = await upstream.json();

      // If Anthropic returned an error (e.g. a retired model, bad key, rate
      // limit), surface it as a non-200 so the funnel's catch shows "try again"
      // rather than silently rendering an empty report from missing content.
      if (!upstream.ok || data.type === "error" || !Array.isArray(data.content)) {
        const message =
          (data && data.error && data.error.message) || "Upstream AI error";
        return new Response(JSON.stringify({ error: message }), {
          status: upstream.ok ? 502 : upstream.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
