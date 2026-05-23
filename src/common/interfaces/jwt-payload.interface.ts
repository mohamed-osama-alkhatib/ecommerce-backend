// src/common/interfaces/jwt-payload.interface.ts

export interface JwtPayload {
  id: number;
  phoneNumber: string;
  role: string;
}

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
