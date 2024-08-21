import { Message } from "@/models/User.model";
import "next-auth";
import { DefaultSession } from "next-auth";

// Declare a global interface for ApiResponse
declare global {
  interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Message[];
  }
}

// Extend the NextAuth User interface to include custom fields
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

// This ensures that the file is treated as a module by TypeScript.
export {};
