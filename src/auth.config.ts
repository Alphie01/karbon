import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [], // Providers are configured in auth.ts
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.roles = (user as any).roles;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.allowedModules = (user as any).allowedModules;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.companyId = (user as any).companyId;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.companyName = (user as any).companyName;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).roles = token.roles;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).allowedModules = token.allowedModules;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).companyId = token.companyId;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).companyName = token.companyName as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userRoles = (auth?.user as any)?.roles || "";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const allowedModulesStr = (auth?.user as any)?.allowedModules || "";
            const allowedModules = allowedModulesStr.split(",");
            const hasFullAccess = allowedModules.includes("ALL") || userRoles.includes("SUPER_ADMIN") || userRoles.includes("CORP_ADMIN");

            const checkAccess = (moduleCode: string) => {
                if (hasFullAccess) return true;
                return allowedModules.includes(moduleCode);
            };

            // 1. Strict Module Access Control (Authenticated Users)
            if (isLoggedIn) {
                if (nextUrl.pathname.startsWith('/corp/carbon') && !checkAccess("CARBON")) return Response.redirect(new URL("/access-denied", nextUrl));
                if (nextUrl.pathname.startsWith('/corp/water') && !checkAccess("WATER")) return Response.redirect(new URL("/access-denied", nextUrl));
                if (nextUrl.pathname.startsWith('/corp/robot') && !checkAccess("INCENTIVES")) return Response.redirect(new URL("/access-denied", nextUrl));
            }

            // 2. Login Protection for Corp and Admin Routes
            const isOnProtected =
                nextUrl.pathname.startsWith('/corp') ||
                nextUrl.pathname.startsWith('/manage');

            if (isOnProtected) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            // Redirect logged-in users away from login page to dashboard
            if (isLoggedIn) {
                if (nextUrl.pathname.startsWith('/login')) {
                    if (userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN")) {
                        return Response.redirect(new URL("/manage", nextUrl));
                    } else {
                        return Response.redirect(new URL("/corp/dashboard", nextUrl));
                    }
                }

                // Redirect public module pages to authenticated corp equivalents
                if (nextUrl.pathname === '/carbon') return Response.redirect(new URL("/corp/carbon", nextUrl));
                if (nextUrl.pathname === '/water') return Response.redirect(new URL("/corp/water", nextUrl));
                if (nextUrl.pathname === '/robot') return Response.redirect(new URL("/corp/robot", nextUrl));
            }

            // 3. Admin Route Protection
            if (nextUrl.pathname.startsWith('/manage')) {
                if (isLoggedIn && (userRoles.includes("SUPER_ADMIN") || userRoles.includes("CORP_ADMIN"))) return true;
                return Response.redirect(new URL("/access-denied", nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
