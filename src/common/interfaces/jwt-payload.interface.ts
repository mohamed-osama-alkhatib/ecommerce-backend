// src/common/interfaces/jwt-payload.interface.ts

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
