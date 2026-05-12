"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// -------------------------
// COURSE ACTIONS
// -------------------------
export async function addCourse(formData: FormData) {
    const session = await auth();
    const userRoles = (session?.user as any)?.roles || "";

    if (!userRoles.includes("SUPER_ADMIN") && !userRoles.includes("ADMIN")) {
        return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const category = formData.get("category") as string || "Genel";

    try {
        await prisma.course.create({
            data: {
                title,
                description: description || null,
                thumbnail: thumbnail || null,
                category,
            },
        });

        revalidatePath("/manage/academy");
        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error adding course:", error);
        return { error: "Failed to add course" };
    }
}

export async function deleteCourse(id: string) {
    const session = await auth();
    const userRoles = (session?.user as any)?.roles || "";

    if (!userRoles.includes("SUPER_ADMIN")) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.course.delete({
            where: { id },
        });

        revalidatePath("/manage/academy");
        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error deleting course:", error);
        return { error: "Failed to delete course" };
    }
}

export async function getCourses() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                videos: {
                    include: { quizzes: true }
                }
            }
        });
        return { success: true, courses };
    } catch (error) {
        return { error: "Failed to fetch courses" };
    }
}


// -------------------------
// VIDEO ACTIONS
// -------------------------
export async function addVideo(formData: FormData) {
    const session = await auth();
    const userRoles = (session?.user as any)?.roles || "";

    if (!userRoles.includes("SUPER_ADMIN") && !userRoles.includes("ADMIN")) {
        return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const courseId = formData.get("courseId") as string; // Linking to Course
    const attentionLevel = formData.get("attentionLevel") as string;

    try {
        await prisma.video.create({
            data: {
                title,
                description: description || null,
                url,
                courseId: courseId || null,
                attentionLevel: attentionLevel === "GENEL" ? null : attentionLevel,
            },
        });

        revalidatePath("/manage/academy");
        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error adding video:", error);
        return { error: "Failed to add video" };
    }
}

export async function updateVideo(formData: FormData) {
    const session = await auth();
    const userRoles = (session?.user as any)?.roles || "";

    if (!userRoles.includes("SUPER_ADMIN") && !userRoles.includes("ADMIN")) {
        return { error: "Unauthorized" };
    }

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const attentionLevel = formData.get("attentionLevel") as string;

    try {
        await prisma.video.update({
            where: { id },
            data: {
                title,
                attentionLevel: attentionLevel === "GENEL" ? null : attentionLevel,
            },
        });

        revalidatePath("/manage/academy");
        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error updating video:", error);
        return { error: "Failed to update video" };
    }
}

export async function deleteVideo(id: string) {
    const session = await auth();
    const userRoles = (session?.user as any)?.roles || "";

    if (!userRoles.includes("SUPER_ADMIN")) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.video.delete({
            where: { id },
        });

        revalidatePath("/manage/academy");
        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error deleting video:", error);
        return { error: "Failed to delete video" };
    }
}

// Keep generic getVideos if needed for legacy pages
export async function getVideos() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
            include: { quizzes: true }
        });
        return { success: true, videos };
    } catch (error) {
        return { error: "Failed to fetch videos" };
    }
}


// -------------------------
// QUIZ ACTIONS
// -------------------------
export async function addQuizQuestion(formData: FormData) {
    const session = await auth();
    const userRoles = (session?.user as any)?.roles || "";

    if (!userRoles.includes("SUPER_ADMIN") && !userRoles.includes("ADMIN")) {
        return { error: "Unauthorized" };
    }

    const videoId = formData.get("videoId") as string;
    const timestamp = parseInt(formData.get("timestamp") as string, 10);
    const questionText = formData.get("questionText") as string;
    const optionsStr = formData.get("options") as string; // JSON array string
    const correctOptionIdx = parseInt(formData.get("correctOptionIdx") as string, 10);

    try {
        await prisma.quizQuestion.create({
            data: {
                videoId,
                timestamp,
                questionText,
                options: optionsStr, // Should be '["Yes", "No"]'
                correctOptionIdx,
            },
        });

        revalidatePath("/manage/academy");
        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error adding quiz:", error);
        return { error: "Failed to add quiz question" };
    }
}

export async function deleteQuizQuestion(id: string) {
    const session = await auth();
    const userRoles = (session?.user as any)?.roles || "";

    if (!userRoles.includes("SUPER_ADMIN")) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.quizQuestion.delete({
            where: { id },
        });

        revalidatePath("/manage/academy");
        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return { error: "Failed to delete quiz question" };
    }
}
