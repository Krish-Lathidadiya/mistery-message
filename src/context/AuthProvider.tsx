"use client";

// allows you to manage and access the user's authentication session across your Next.js application.
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
