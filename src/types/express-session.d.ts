// src/types/express-session.d.ts
import * as session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string; // Extend session data to include userId
  }
}
declare global {
  namespace Express {
    interface Session {
      userId?: string; // Declare userId property
    }
  }
}
