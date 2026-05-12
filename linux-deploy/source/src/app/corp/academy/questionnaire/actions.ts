"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitQuestionnaire(formData: FormData) {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return { error: "Oturum bulunamadı." };
    }

    // 1. Calculate Score
    const q1 = parseInt(formData.get("q1") as string || "0");
    const q2 = parseInt(formData.get("q2") as string || "0");
    const q3 = parseInt(formData.get("q3") as string || "0");
    const q4 = parseInt(formData.get("q4") as string || "0");
    const q5 = parseInt(formData.get("q5") as string || "0");
    const q6 = parseInt(formData.get("q6") as string || "0");
    const q7 = parseInt(formData.get("q7") as string || "0");
    const q8 = parseInt(formData.get("q8") as string || "0");
    const q9 = parseInt(formData.get("q9") as string || "0");
    const q10 = parseInt(formData.get("q10") as string || "0");

    // Max score = 1000
    const totalScore = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10;

    // 2. Determine Tag
    let attentionLevel = "MEDIUM";
    if (totalScore < 450) {
        attentionLevel = "LOW";
    } else if (totalScore >= 750) {
        attentionLevel = "HIGH";
    }

    // 3. Update User
    try {
        await prisma.user.update({
            where: { email: userEmail },
            data: {
                attentionLevel,
                attentionTestDate: new Date()
            }
        });

        revalidatePath("/corp/academy");
    } catch (error) {
        console.error("Error updating test results:", error);
        return { error: "Sonuçlar kaydedilemedi." };
    }

    // Redirect user back to the academy page upon completion
    redirect("/corp/academy");
}

export async function resetQuestionnaire() {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) return { error: "Oturum bulunamadı." };

    try {
        await prisma.user.update({
            where: { email: userEmail },
            data: {
                attentionLevel: null,
                attentionTestDate: null
            }
        });

        revalidatePath("/corp/academy");
        return { success: true };
    } catch (error) {
        console.error("Error resetting test results:", error);
        return { error: "Sıfırlama başarısız." };
    }
}
