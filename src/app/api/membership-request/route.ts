import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const requestSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    contactName: z.string().min(2, "Contact name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validation = requestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation Failed", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { companyName, contactName, email, phone, message } = validation.data;

        const request = await prisma.membershipRequest.create({
            data: {
                companyName,
                contactName,
                email,
                phone,
                message,
            }
        });

        // TODO: Send email notification to Admin here (using Resend, Nodemailer, etc.)

        return NextResponse.json({ success: true, request }, { status: 201 });
    } catch (error) {
        console.error("Membership Request Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
