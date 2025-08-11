import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      phone_number?: string | null;
      phone_number_verified?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: string;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean;
  }
}
