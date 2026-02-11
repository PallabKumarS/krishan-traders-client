import type { JwtPayload } from "jsonwebtoken";

declare global {
  interface Request {
    user: JwtPayload;
  }
}
