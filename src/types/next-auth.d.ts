import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            companyId?: string | null
            companyName?: string | null
            roles?: string
            allowedModules?: string
        } & DefaultSession["user"]
    }

    interface User {
        companyId?: string | null
        companyName?: string | null
        roles?: string
        allowedModules?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        companyId?: string | null
        companyName?: string | null
        roles?: string
        allowedModules?: string
    }
}
