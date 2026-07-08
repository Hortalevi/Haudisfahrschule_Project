import { jwtVerify } from "jose";

// No "server-only" guard here: this file is imported both by Next.js server
// code (via proxy.ts) and by server.ts, our plain-Node custom server that
// runs outside Next's bundler and can't resolve the "server-only" package.
//
// Verifies the same HS256 cookie the Java backend issues (see
// backend/.../security/JwtService.java) - JWT_SECRET must match verbatim
// (UTF-8 encoded, not base64-decoded) between the two.

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is not set.");
}
const encodedKey = new TextEncoder().encode(secretKey);

export type JwtPayload = {
  userId: string;
  name: string;
  roles: string[];
};

export async function verifyJwt(token: string | undefined = ""): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
