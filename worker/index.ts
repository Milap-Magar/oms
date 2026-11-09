// Cloudflare Worker: forwards /api/* to the Spring Boot backend, same as server.ts
// does in development. Static files are served by Cloudflare's asset handler.

interface Env {
  API_URL: string;
  ASSETS: { fetch(req: Request): Promise<Response> };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(req);

    const base = (env.API_URL ?? "").replace(/\/$/, "");
    if (!base) {
      return Response.json({ message: "The server isn't connected yet. Please try again later." }, { status: 503 });
    }

    try {
      return await fetch(new Request(base + url.pathname + url.search, req), { redirect: "manual" });
    } catch {
      return Response.json({ message: "Can't reach the server right now. Please try again." }, { status: 502 });
    }
  },
};
