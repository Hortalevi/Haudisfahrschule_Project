import { EventEmitter } from "node:events";

// Cross-request pub/sub for instructor-dashboard live updates. Works because
// the app runs as one persistent Node process (custom server.ts + `ws`), not
// serverless functions — see server.ts for the WebSocket relay that forwards
// these events to connected browser clients.
export type RealtimeEvent =
  | { type: "course.updated"; slug: string }
  | { type: "courseDate.created" | "courseDate.updated" | "courseDate.deleted"; id: string; courseSlug: string }
  | { type: "registration.created"; registration: unknown; courseDateId: string }
  | { type: "registration.updated"; registrationId: string; courseDateId: string };

const globalForEmitter = globalThis as unknown as { realtimeEmitter?: EventEmitter };

export const realtimeEmitter = globalForEmitter.realtimeEmitter ?? new EventEmitter();
globalForEmitter.realtimeEmitter = realtimeEmitter;
realtimeEmitter.setMaxListeners(0);

export function broadcast(event: RealtimeEvent) {
  realtimeEmitter.emit("event", event);
}
