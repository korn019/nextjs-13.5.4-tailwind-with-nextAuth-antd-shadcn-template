import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { User } from "./types";

declare module "next-auth" {
  interface Session {
    user: user;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
  interface User {
    user: user;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: date;
  }
}
