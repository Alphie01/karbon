"use server";

import { prisma } from "@/lib/prisma";import { revalidatePath } from "next/cache";


export async function approveRequest(id: string) {
    try {
        await prisma.membershipRequest.update({
            where: { id },
            data: { status: "APPROVED" }
        });
        revalidatePath("/manage");
    } catch (error) {
        console.error("Approve Error:", error);
    }
}

export async function rejectRequest(id: string) {
    try {
        await prisma.membershipRequest.update({
            where: { id },
            data: { status: "REJECTED" }
        });
        revalidatePath("/manage");
    } catch (error) {
        console.error("Reject Error:", error);
    }
}

export async function deleteRequest(id: string) {
    try {
        await prisma.membershipRequest.delete({
            where: { id }
        });
        revalidatePath("/manage");
    } catch (error) {
        console.error("Delete Error:", error);
    }
}
