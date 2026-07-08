import "dotenv/config";
import { createServer } from "node:http";
import next from "next";
import { WebSocketServer, type WebSocket } from "ws";
import { verifyJwt } from "@/lib/jwt";
import { realtimeEmitter, broadcast, type RealtimeEvent } from "@/lib/realtime";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const WS_PATH = "/api/ws/dashboard";
const REALTIME_INGEST_PATH = "/api/internal/realtime";

function readSessionCookie(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === "session") return rest.join("=");
  }
  return undefined;
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    if (req.method === "POST" && req.url === REALTIME_INGEST_PATH) {
      handleRealtimeIngest(req, res);
      return;
    }
    handle(req, res);
  });

  // The Java backend calls this after mutating courses/course-dates/registrations
  // (see RealtimeNotifier.java) so the dashboard's WebSocket relay below can push
  // a live refresh, authenticated with a shared secret rather than a user session.
  function handleRealtimeIngest(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) {
    const expectedSecret = process.env.INTERNAL_REALTIME_SECRET;
    if (!expectedSecret || req.headers["x-internal-secret"] !== expectedSecret) {
      res.writeHead(401).end();
      return;
    }
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        broadcast(JSON.parse(body) as RealtimeEvent);
        res.writeHead(204).end();
      } catch {
        res.writeHead(400).end();
      }
    });
  }

  const wss = new WebSocketServer({ noServer: true });
  const clients = new Set<WebSocket>();

  realtimeEmitter.on("event", (event) => {
    const payload = JSON.stringify(event);
    for (const client of clients) {
      if (client.readyState === client.OPEN) client.send(payload);
    }
  });

  httpServer.on("upgrade", async (req, socket, head) => {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    if (pathname !== WS_PATH) return; // let Next's own upgrade handling (HMR) take it

    const session = await verifyJwt(readSessionCookie(req.headers.cookie));
    if (!session?.userId) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      clients.add(ws);
      ws.on("close", () => clients.delete(ws));
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
    console.log(`> Realtime WebSocket relay on ${WS_PATH}`);
  });
});
