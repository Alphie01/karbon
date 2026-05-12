"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const LeadSchema = z.object({
    name: z.string().min(2),
    contactPerson: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    source: z.string().optional(),
    status: z.string(),
    notes: z.string().optional(),
});

export async function createLead(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        contactPerson: formData.get("contactPerson"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        source: formData.get("source"),
        status: formData.get("status"),
        notes: formData.get("notes"),
    };

    const validated = LeadSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, error: validated.error.flatten() };
    }

    await prisma.lead.create({
        data: validated.data,
    });

    revalidatePath("//crm");
    redirect("//crm");
}

export async function addActivity(leadId: string, formData: FormData) {
    const subject = formData.get("subject") as string;
    const type = formData.get("type") as string;
    const notes = formData.get("notes") as string;
    const dateStr = formData.get("date") as string;
    const durationStr = formData.get("duration") as string;
    const location = formData.get("location") as string;

    await prisma.activity.create({
        data: {
            leadId,
            subject,
            type,
            notes,
            date: new Date(dateStr),
            duration: durationStr ? parseInt(durationStr) : 30,
            location: location || null,
        }
    });

    revalidatePath(`//crm/leads/${leadId}`);
    revalidatePath(`//crm/calendar`);
}

export async function createFinancialRecord(formData: FormData) {
    const type = formData.get("type") as string;
    const category = formData.get("category") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;

    await prisma.financialRecord.create({
        data: {
            type,
            category,
            amount,
            description,
            date: new Date(dateStr),
        }
    });

    revalidatePath("//crm/finance");
}

export async function createProposal(leadId: string, formData: FormData) {
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const currency = formData.get("currency") as string;
    const status = formData.get("status") as string;
    const validUntilStr = formData.get("validUntil") as string;

    await prisma.proposal.create({
        data: {
            leadId,
            title,
            amount,
            currency,
            status,
            validUntil: validUntilStr ? new Date(validUntilStr) : null,
        }
    });

    revalidatePath(`//crm/leads/${leadId}`);
}
