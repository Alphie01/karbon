"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";import { revalidatePath } from "next/cache";


// Create a new support ticket
export async function createTicket(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const priority = formData.get("priority") as string || "MEDIUM";

    if (!subject || !message) {
        return { success: false, error: "Konu ve mesaj alanları zorunludur." };
    }

    try {
        await prisma.supportTicket.create({
            data: {
                userId: session.user.id,
                companyId: session.user.companyId,
                subject,
                message,
                priority,
                status: "OPEN"
            }
        });

        revalidatePath("/corp/support");
        revalidatePath("/manage/support");
        return { success: true };
    } catch (error) {
        console.error("Create Ticket Error:", error);
        return { success: false, error: "Bir hata oluştu." };
    }
}

// Get tickets for the current user
export async function getUserTickets() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const tickets = await prisma.supportTicket.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return tickets;
    } catch (error) {
        console.error("Get User Tickets Error:", error);
        return [];
    }
}

// Admin: Get all tickets
export async function getAllTickets() {
    const session = await auth();
    // In a real app, verify admin role here

    try {
        const tickets = await prisma.supportTicket.findMany({
            include: {
                user: {
                    select: { name: true, email: true, companyName: true }
                },
                company: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return tickets;
    } catch (error) {
        console.error("Get All Tickets Error:", error);
        return [];
    }
}

// Admin: Update ticket status
export async function updateTicketStatus(ticketId: string, newStatus: string) {
    try {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status: newStatus }
        });

        revalidatePath("/manage/support");
        revalidatePath("/corp/support");
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, error: "Güncelleme hatası." };
    }
}
