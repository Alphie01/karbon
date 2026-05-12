import { prisma } from "@/lib/prisma";
import { ArrowLeft, Plus, Calendar, Mail, Phone, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { addActivity } from "../../actions";
import { redirect } from "next/navigation";
import ActivityForm from "./ActivityForm";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            activities: {
                orderBy: { date: 'desc' },
            },
            proposals: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!lead) {
        redirect("//crm");
    }

    async function handleAddActivity(formData: FormData) {
        "use server";
        if (lead) {
            await addActivity(lead.id, formData);
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Link href="//crm" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={16} />
                Listeye Dön
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Taraf: Bilgiler */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="mb-4">
                            <h1 className="text-xl font-bold text-slate-900">{lead.name}</h1>
                            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                lead.status === 'WON' ? 'bg-green-100 text-green-700' :
                                    lead.status === 'LOST' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {lead.status}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm text-slate-600">
                            {lead.contactPerson && (
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-slate-400" />
                                    {lead.contactPerson}
                                </div>
                            )}
                            {lead.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400" />
                                    <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                                </div>
                            )}
                            {lead.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-slate-400" />
                                    <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
                                </div>
                            )}
                        </div>

                        {lead.source && (
                            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                                Kaynak: <span className="font-medium text-slate-700">{lead.source}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sağ Taraf: Zaman Çizelgesi ve Aktiviteler */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Aktivite Ekleme Formu */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Plus size={18} />
                            Aktivite / Not Ekle
                        </h3>
                        <ActivityForm action={handleAddActivity} />
                    </div>

                    {/* Zaman Çizelgesi */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900">Geçmiş Aktiviteler</h3>
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pl-6 pb-2">
                            {lead.activities.map((activity) => (
                                <div key={activity.id} className="relative">
                                    <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white ${activity.type === 'MEETING' ? 'bg-purple-500' :
                                        activity.type === 'CALL' ? 'bg-blue-500' :
                                            activity.type === 'EMAIL' ? 'bg-orange-500' :
                                                'bg-gray-500'
                                        }`}></div>
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${activity.type === 'MEETING' ? 'bg-purple-100 text-purple-700' :
                                                activity.type === 'CALL' ? 'bg-blue-100 text-blue-700' :
                                                    activity.type === 'EMAIL' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {activity.type === 'MEETING' ? 'Toplantı' :
                                                    activity.type === 'CALL' ? 'Arama' :
                                                        activity.type === 'EMAIL' ? 'E-posta' : 'Not'}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(activity.date).toLocaleString("tr-TR")}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-slate-800 text-sm">{activity.subject}</h4>
                                        {activity.notes && (
                                            <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap">{activity.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {lead.activities.length === 0 && (
                                <div className="text-sm text-slate-500 italic">Henüz bir aktivite girişi yapılmamış.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
