import 'express-session';
import { UserProps } from '@domain/entities/User';

declare module 'express-session' {
  interface SessionData {
    token?: string;
    userId?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: UserProps;
      file?: Express.Multer.File;
      session?: SessionData;
    }
  }
}

export {};