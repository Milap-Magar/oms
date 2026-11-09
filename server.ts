import index from "./index.html";

// Spring Boot backend. Requests to /api/* are forwarded here, so the browser
// only ever talks to one origin (no CORS setup needed during development).
const API_URL = (process.env.API_URL ?? "http://localhost:8080").replace(/\/$/, "");
const isProd = process.env.NODE_ENV === "production";

async function proxyToApi(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const target = API_URL + url.pathname + url.search;
  const headers = new Headers(req.headers);
  headers.delete("host");
  try {
    return await fetch(target, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
      redirect: "manual",
    });
  } catch {
    return Response.json(
      { message: `Backend is not reachable at ${API_URL}. Is Spring Boot running?` },
      { status: 502 },
    );
  }
}

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3001),
  routes: {
    "/api/*": proxyToApi,
    // Single-page app: every other path (/, /login, /register, /dashboard...) serves the app.
    "/*": index,
  },
  development: !isProd && { hmr: true, console: true },
});

console.log(`Ordiva running at ${server.url}  (API → ${API_URL})`);
