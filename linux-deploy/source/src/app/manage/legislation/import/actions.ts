"use server";

import { loginToForum, fetchTopics, fetchTopicContent, CrawlerTopic } from "@/services/crawler";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function authenticateAndList(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { success: false, error: "Kullanıcı adı ve şifre gereklidir." };
    }

    // 1. Login
    const loginRes = await loginToForum(username, password);
    if (!loginRes.success) {
        return { success: false, error: loginRes.error || "Giriş yapılamadı" };
    }

    // 2. Fetch Topics
    try {
        const topics = await fetchTopics(loginRes.cookies);
        return { success: true, topics, cookies: loginRes.cookies };
    } catch (e: any) {
        return { success: false, error: "Konular getirilemedi: " + e.message };
    }
}

export async function importSelectedTopics(selectedTopics: CrawlerTopic[], cookies: string) {
    let successCount = 0;
    let failCount = 0;

    for (const topic of selectedTopics) {
        try {
            // Check if exists
            const existing = await (prisma as any).legislation.findFirst({
                where: { url: topic.url }
            });

            if (existing) {
                // Skip or Update? Let's skip to avoid overwriting edits
                // Or maybe update if we want to sync?
                // For now, let's skip but count as success or 'skipped'
                continue;
            }

            // Fetch Content
            const details = await fetchTopicContent(topic.url, cookies);

            if (details) {
                await (prisma as any).legislation.create({
                    data: {
                        title: topic.title,
                        category: topic.category, // e.g. "Çevre Teknolojileri"
                        date: details.date || topic.date,
                        url: topic.url,
                        summary: topic.author ? `Yazar: ${topic.author}` : "",
                        // content: details.content // We don't have a content field in schema yet? 
                        // Wait, looking at schema.prisma step 4756:
                        // model Legislation { ... content String? ... }
                        // customFactors, waterReports etc.
                        // Legislation model has field 'content String?'. Yes.
                        content: details.content
                    }
                });
                successCount++;
            } else {
                failCount++;
            }

        } catch (e) {
            console.error(`Error importing topic ${topic.url}:`, e);
            failCount++;
        }
    }

    revalidatePath("/manage/legislation");
    revalidatePath("/corp/legislation");

    return { success: true, imported: successCount, failed: failCount };
}
