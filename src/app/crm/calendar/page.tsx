import { prisma } from "@/lib/prisma";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Toplantı Takvimi | CRM",
};

export default async function CalendarPage({ searchParams }: { searchParams: { month?: string, year?: string } }) {
    const date = new Date();
    const currentMonth = searchParams.month ? parseInt(searchParams.month) : date.getMonth();
    const currentYear = searchParams.year ? parseInt(searchParams.year) : date.getFullYear();

    // Calculate start and end of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Fetch activities for this month
    const activities = await prisma.activity.findMany({
        where: {
            date: {
                gte: new Date(currentYear, currentMonth, 1),
                lte: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
            },
            type: 'MEETING' // Only show meetings in calendar for now
        },
        include: {
            lead: true
        },
        orderBy: {
            date: 'asc'
        }
    });

    // Calendar Grid Logic
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start (0=Mon, 6=Sun)

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon /> Toplantı Takvimi
                    </h1>
                    <p className="text-slate-500 text-sm">Toplantı ve etkinliklerinizi takip edin.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/crm/leads" className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-700 transition-colors">
                        Yeni Toplantı Ekle
                    </Link>
                    <a href={`/api/crm/calendar/export`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                        <Download size={16} /> iCal İndir (.ics)
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div className="font-bold text-lg text-slate-700">
                        {monthNames[currentMonth]} {currentYear}
                    </div>
                    <div className="flex gap-2">
                        <Link href={`?month=${prevMonth}&year=${prevYear}`} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </Link>
                        <Link href={`?month=${nextMonth}&year=${nextYear}`} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 text-center py-2">
                    <div>Pazartesi</div>
                    <div>Salı</div>
                    <div>Çarşamba</div>
                    <div>Perşembe</div>
                    <div>Cuma</div>
                    <div>Cumartesi</div>
                    <div>Pazar</div>
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 auto-rows-[120px]">
                    {days.map((day, index) => {
                        if (day === null) return <div key={`empty-${index}`} className="bg-slate-50 border-r border-b border-slate-100"></div>;

                        const dateObj = new Date(currentYear, currentMonth, day);
                        const dayActivities = activities.filter(a => a.date.getDate() === day);

                        return (
                            <div key={day} className="border-r border-b border-slate-100 p-2 relative group hover:bg-slate-50 transition-colors">
                                <span className={`text-sm font-medium block mb-1 ${dateObj.toDateString() === new Date().toDateString() ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'
                                    }`}>
                                    {day}
                                </span>

                                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                    {dayActivities.map(activity => (
                                        <Link key={activity.id} href={`//crm/leads/${activity.leadId}`} title={`${activity.subject}\nSüre: ${activity.duration} dk\nKonum: ${activity.location || 'Belirtilmemiş'}`} className="block text-xs bg-purple-100 text-purple-700 p-1.5 rounded hover:bg-purple-200 transition-colors">
                                            <div className="font-bold truncate">{activity.date.getHours()}:{activity.date.getMinutes().toString().padStart(2, '0')} - {activity.subject}</div>
                                            {activity.location && <div className="text-[10px] opacity-75 truncate">{activity.location}</div>}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
