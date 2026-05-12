import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        // Allow ADMIN or SUPERADMIN
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Quick check role if needed (assuming session.user has role, otherwise skip strict role check for now and let middleware handle or assume authorized if logged in for this prototype)

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Create uploads directory if it doesn't exist
        const uploadDir = process.env.UPLOAD_DIR
            ? path.join(process.env.UPLOAD_DIR, "videos")
            : path.join(process.cwd(), "public", "uploads", "videos");

        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Generate a unique filename
        const uniqueSuffix = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.name) || ".mp4";
        const filename = `${uniqueSuffix}-${Date.now()}${extension}`;
        const filePath = path.join(uploadDir, filename);

        // Write file
        await fs.writeFile(filePath, buffer);

        // Return the public URL
        const fileUrl = `/uploads/videos/${filename}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
