import { NextResponse, NextRequest } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.redirect(new URL('/corp/legislation', req.url));
    }

    try {
        const item = await (prisma as any).legislation.findUnique({
            where: { id }
        });

        if (item && item.url) {
            return NextResponse.redirect(item.url);
        }
    } catch (e) {
        console.error("Goto error:", e);
    }

    return NextResponse.redirect(new URL('/corp/legislation', req.url));
}
