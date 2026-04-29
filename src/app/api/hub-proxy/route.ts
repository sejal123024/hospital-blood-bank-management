import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, apiKey } = body;
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Clean up URL
    const baseUrl = url.replace(/\/+$/, "");

    const headers: Record<string, string> = { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Try standard endpoint
    console.log(`[Hub Proxy] Attempting to fetch: ${baseUrl}/api/beds`);
    let res = await fetch(`${baseUrl}/api/beds`, { 
      method: "GET", 
      headers,
      cache: "no-store" 
    });
    
    // Fallback for strict Vercel static deployments without clean URLs
    if (res.status === 404) {
      console.log(`[Hub Proxy] 404 on clean URL, trying fallback: ${baseUrl}/api/beds.js`);
      res = await fetch(`${baseUrl}/api/beds.js`, { 
        method: "GET", 
        headers,
        cache: "no-store" 
      });
    }

    if (!res.ok) {
      console.log(`[Hub Proxy] Failed. Final status: ${res.status} for ${baseUrl}`);
      return NextResponse.json(
        { error: `Hospital API (${baseUrl}) responded with status ${res.status}` }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Hub Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to reach hospital API", details: error.message }, 
      { status: 500 }
    );
  }
}
