import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const activities = await prisma.activity.findMany({
        where: {
            type: 'MEETING'
        },
        include: {
            lead: true
        }
    });

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EcoPilot//CRM//TR\n";

    activities.forEach(activity => {
        const startDate = activity.date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        const endDate = new Date(activity.date.getTime() + (activity.duration * 60000)).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${activity.id}\n`;
        icsContent += `DTSTAMP:${startDate}\n`;
        icsContent += `DTSTART:${startDate}\n`;
        icsContent += `DTEND:${endDate}\n`;
        icsContent += `SUMMARY:${activity.subject} (${activity.lead.name})\n`;
        icsContent += `DESCRIPTION:${activity.notes || ""}\n`;
        if (activity.location) icsContent += `LOCATION:${activity.location}\n`;
        icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    return new NextResponse(icsContent, {
        headers: {
            "Content-Type": "text/calendar",
            "Content-Disposition": "attachment; filename=calendar.ics",
        },
    });
}
