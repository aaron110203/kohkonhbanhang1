// Cloudflare Pages Function - Serve static files
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Serve index.html for root path
  if (url.pathname === '/') {
    return context.env.ASSETS.fetch(new Request(url.origin + '/index.html'));
  }
  
  // Default behavior for other paths
  return context.env.ASSETS.fetch(context.request);
}
