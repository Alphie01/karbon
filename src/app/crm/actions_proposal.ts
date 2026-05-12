"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProposalWithItems(formData: FormData) {
    const leadId = formData.get("leadId") as string;
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const currency = formData.get("currency") as string;
    const taxRate = parseFloat(formData.get("taxRate") as string);
    const validUntilStr = formData.get("validUntil") as string;
    const terms = formData.get("terms") as string;
    const itemsJson = formData.get("items") as string;

    const items = JSON.parse(itemsJson);

    const proposal = await prisma.proposal.create({
        data: {
            leadId,
            title,
            amount,
            currency,
            taxRate,
            terms,
            status: "DRAFT",
            validUntil: validUntilStr ? new Date(validUntilStr) : null,
            items: {
                create: items.map((item: any) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.quantity * item.unitPrice
                }))
            }
        }
    });

    revalidatePath("//crm/proposals");
    redirect(`//crm/proposals/${proposal.id}`);
}

export async function updateProposalStatus(proposalId: string, status: string) {
    await prisma.proposal.update({
        where: { id: proposalId },
        data: { status }
    });
    revalidatePath("//crm/proposals");
    revalidatePath(`//crm/proposals/${proposalId}`);
}

export async function deleteProposal(proposalId: string) {
    await prisma.proposal.delete({
        where: { id: proposalId }
    });
    revalidatePath("//crm/proposals");
    redirect("//crm/proposals");
}
