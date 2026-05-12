import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // 1. Parse Subdomain
    const appDomain = process.env.APP_DOMAIN || "beyondlimitsturkiye.tech";
    let subdomain = null;
    if (hostname.includes(appDomain)) {
        const parts = hostname.split(".");
        if (parts.length > 2) subdomain = parts[0]; // carbon.app... -> carbon
    } else if (hostname.includes("localhost")) {
        const parts = hostname.split(".");
        // localhost:3000 -> parts=['localhost:3000'] (len 1)
        // carbon.localhost:3000 -> parts=['carbon', 'localhost:3000'] (len 2)
        if (parts.length > 1) subdomain = parts[0];
    }

    // 2. Subdomain Routing
    if (subdomain === "carbon") {
        url.pathname = `/carbon${url.pathname}`;
        return NextResponse.rewrite(url);
    }
    if (subdomain === "water") {
        url.pathname = `/water${url.pathname}`;
        return NextResponse.rewrite(url);
    }
    if (subdomain === "learn") {
        url.pathname = `/learn${url.pathname}`;
        return NextResponse.rewrite(url);
    }
    if (subdomain === "legislation") {
        url.pathname = `/legislation${url.pathname}`;
        return NextResponse.rewrite(url);
    }
    if (subdomain === "robot") {
        url.pathname = `/robot${url.pathname}`;
        return NextResponse.rewrite(url);
    }
    if (subdomain === "crm") {
        // CRM subdomainini /manage yoluna aktar
        url.pathname = `/manage${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
    }
    if (subdomain === "corp") {
        // Corp subdomainini /corp yoluna aktar
        url.pathname = `/corp${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 3. Root Domain Routing (www or no subdomain)
    if (!subdomain || subdomain === "www") {
        // Special Routes that should NOT be rewritten to /home
        if (
            url.pathname.startsWith('/carbon') ||
            url.pathname.startsWith('/water') ||
            url.pathname.startsWith('/learn') ||
            url.pathname.startsWith('/legislation') ||
            url.pathname.startsWith('/robot') ||
            url.pathname.startsWith('/login') ||
            url.pathname.startsWith('/manage') ||
            url.pathname.startsWith('/corp') ||
            url.pathname.startsWith('/consultancy') ||
            url.pathname.startsWith('/api') ||
            url.pathname.startsWith('/_next') ||
            url.pathname === '/favicon.ico'
        ) {
            return NextResponse.next();
        }

        // Root / -> /home handled by src/app/page.tsx directly

        if (url.pathname.startsWith("/home")) {
            return NextResponse.next();
        }

        // For other routes (e.g. /about -> /home/about if you have that structure, otherwise just next)
        return NextResponse.next();
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|uploads|.*\\.png$|.*\\.mp4$|.*\\.webm$).*)'],
};
