import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveCompanyId } from "@/lib/company-auth";
import { Workflow, Leaf, Droplets, Link as LinkIcon, Unlink, Trash2, Save, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { updateBusinessProcess, deleteBusinessProcess, linkCarbonEntryToProcess, unlinkCarbonEntry, linkWaterProcessToBusinessProcess, unlinkWaterProcess, addEquipment, deleteEquipment, toggleIoTStatus } from "../actions";
import { Cpu, Power, Server } from "lucide-react";
import { IoTTicker } from "./IoTTicker";
import { redirect } from "next/navigation";

async function getProcessDetails(id: string, companyId: string) {
    const process = await prisma.businessProcess.findUnique({
        where: companyId === "ALL" ? { id } : { id, companyId },
        include: {
            carbonEntries: true,
            waterProcesses: true,
            equipments: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    return process;
}

async function getUnlinkedData(companyId: string) {
    const carbonEntries = await prisma.carbonEntry.findMany({
        where: companyId === "ALL" ? { businessProcessId: null } : { companyId, businessProcessId: null },
        orderBy: { date: 'desc' },
        take: 100 // Limit for performance
    });

    const waterProcesses = await prisma.waterProcess.findMany({
        where: companyId === "ALL" ? { businessProcessId: null } : {
            report: { companyId }, // Access via relation
            businessProcessId: null
        },
        orderBy: { date: 'desc' },
        take: 100
    });

    return { carbonEntries, waterProcesses };
}

export default async function AnalysisDetailPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const session = await auth();
    const user = session?.user;

    if (!user) return null;

    const companyId = await getEffectiveCompanyId(user, searchParams);

    if (!companyId) {
        return <div className="p-8 text-center text-amber-600">Firma seçiniz.</div>;
    }

    const process = await getProcessDetails(params.id, companyId);

    if (!process) {
        return <div className="p-8 text-center">Süreç bulunamadı.</div>;
    }

    const unlinked = await getUnlinkedData(companyId);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8  pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/corp/analysis${searchParams?.companyId ? `?companyId=${searchParams.companyId}` : ''}`} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Workflow className="text-brand-navy dark:text-brand-green" />
                        {process.title}
                    </h1>
                    <p className="text-sm text-slate-500">Süreç Detayları ve Veri Eşleştirme</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Edit Form */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                            <Save size={18} className="text-blue-500" /> Temel Bilgiler
                        </h3>
                        <form action={updateBusinessProcess.bind(null, process.id)} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">Süreç Adı</label>
                                <input name="title" defaultValue={process.title} className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">Açıklama</label>
                                <textarea name="description" defaultValue={process.description || ""} rows={4} className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
                            </div>
                            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Güncelle</button>
                        </form>

                        <div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6">
                            <form action={async () => {
                                "use server";
                                await deleteBusinessProcess(process.id);
                                redirect("/corp/analysis" + (searchParams?.companyId ? `?companyId=${searchParams.companyId}` : ''));
                            }}>
                                <button className="w-full py-2 text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <Trash2 size={16} /> Süreci Sil
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Linked Data */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Carbon Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                            <Leaf size={18} className="text-green-500" /> Karbon Ayak İzi Verileri
                        </h3>

                        {/* Linked Carbon List */}
                        <div className="space-y-2 mb-6">
                            {process.carbonEntries.length === 0 && <p className="text-sm text-slate-400 italic">Eşleşmiş veri yok.</p>}
                            {process.carbonEntries.map((entry: any) => (
                                <div key={entry.id} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">{entry.activity}</div>
                                        <div className="text-xs text-slate-500">{entry.amount} {entry.unit} | {entry.date}</div>
                                    </div>
                                    <form action={unlinkCarbonEntry.bind(null, entry.id, process.id)}>
                                        <button className="p-2 text-slate-400 hover:text-red-500 rounded tooltip" title="Bağı Kaldır">
                                            <Unlink size={16} />
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                            <h4 className="text-sm font-semibold text-slate-500 mb-3">Eşleşmemiş Verileri Ekle</h4>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                {unlinked.carbonEntries.map((entry: any) => (
                                    <form key={entry.id} action={linkCarbonEntryToProcess.bind(null, process.id, entry.id)} className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded group">
                                        <div className="text-sm">
                                            <span className="font-medium">{entry.activity}</span>
                                            <span className="text-slate-400 mx-2">•</span>
                                            <span className="text-slate-500">{entry.amount} {entry.unit}</span>
                                        </div>
                                        <button className="p-1 px-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-brand-navy hover:text-white transition-colors text-xs flex items-center gap-1">
                                            <LinkIcon size={12} /> Ekle
                                        </button>
                                    </form>
                                ))}
                                {unlinked.carbonEntries.length === 0 && <p className="text-xs text-slate-400">Tüm veriler eşleştirilmiş.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Water Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                            <Droplets size={18} className="text-blue-500" /> Su Ayak İzi Süreçleri
                        </h3>

                        {/* Linked Water List */}
                        <div className="space-y-2 mb-6">
                            {process.waterProcesses.length === 0 && <p className="text-sm text-slate-400 italic">Eşleşmiş veri yok.</p>}
                            {process.waterProcesses.map((proc: any) => (
                                <div key={proc.id} className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">{proc.name}</div>
                                        <div className="text-xs text-slate-500">Girdi: {proc.input}, Çıktı: {proc.output} | {proc.date}</div>
                                    </div>
                                    <form action={unlinkWaterProcess.bind(null, proc.id, process.id)}>
                                        <button className="p-2 text-slate-400 hover:text-red-500 rounded tooltip" title="Bağı Kaldır">
                                            <Unlink size={16} />
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                            <h4 className="text-sm font-semibold text-slate-500 mb-3">Eşleşmemiş Süreçleri Ekle</h4>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                {unlinked.waterProcesses.map((proc: any) => (
                                    <form key={proc.id} action={linkWaterProcessToBusinessProcess.bind(null, process.id, proc.id)} className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded group">
                                        <div className="text-sm">
                                            <span className="font-medium">{proc.name}</span>
                                            <span className="text-slate-400 mx-2">•</span>
                                            <span className="text-slate-500">Net: {proc.input - proc.output} m³</span>
                                        </div>
                                        <button className="p-1 px-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-brand-navy hover:text-white transition-colors text-xs flex items-center gap-1">
                                            <LinkIcon size={12} /> Ekle
                                        </button>
                                    </form>
                                ))}
                                {unlinked.waterProcesses.length === 0 && <p className="text-xs text-slate-400">Tüm veriler eşleştirilmiş.</p>}
                            </div>
                        </div>
                        {/* Equipment & IoT Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Cpu size={18} className="text-purple-500" /> Kullanılan Araç & Cihazlar (IoT Entegrasyonu)
                                </h3>
                                <span className="text-xs bg-brand-navy/10 text-brand-navy dark:bg-brand-green/10 dark:text-brand-green px-2 py-1 rounded font-medium">Demo Modülü</span>
                            </div>

                            {/* Equipment List */}
                            <div className="space-y-3 mb-8">
                                {process.equipments.length === 0 && <p className="text-sm text-slate-400 italic">Henüz cihaz eklenmemiş.</p>}
                                {process.equipments.map((eq: any) => (
                                    <div key={eq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${eq.iotStatus === 'ONLINE' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                                <Server size={20} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                    {eq.name}
                                                    {eq.hasIoT && (
                                                        <span className={`text-[10px] px-1.5 py-0.5 border rounded-full font-semibold ${eq.iotStatus === 'ONLINE' ? 'border-green-500 text-green-600 dark:text-green-400 animate-pulse' : 'border-slate-400 text-slate-500'}`}>
                                                            {eq.iotStatus}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500 capitalize">{eq.type.toLowerCase()} | Baz Tüketim: {eq.currentDraw} {eq.unit}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* IoT Ticker (Simulated) */}
                                            {eq.hasIoT && eq.iotStatus === 'ONLINE' && (
                                                <IoTTicker baseDraw={eq.currentDraw} unit={eq.unit} />
                                            )}

                                            {eq.hasIoT && (
                                                <form action={toggleIoTStatus.bind(null, eq.id, eq.iotStatus, process.id)}>
                                                    <button className={`p-2 rounded tooltip ${eq.iotStatus === 'ONLINE' ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/40' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`} title={eq.iotStatus === 'ONLINE' ? "Kapat" : "Aç"}>
                                                        <Power size={18} />
                                                    </button>
                                                </form>
                                            )}
                                            <form action={deleteEquipment.bind(null, eq.id, process.id)}>
                                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded tooltip" title="Cihazı Sil">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Equipment Form */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">Yeni Cihaz / Araç Ekle</h4>
                                <form action={addEquipment.bind(null, process.id)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                                    <div className="lg:col-span-4">
                                        <label className="text-xs font-medium text-slate-500 block mb-1">Cihaz/Araç Adı</label>
                                        <input name="name" required placeholder="örn: Ana Jeneratör (Dizel)" className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm" />
                                    </div>
                                    <div className="lg:col-span-3">
                                        <label className="text-xs font-medium text-slate-500 block mb-1">Kategori</label>
                                        <select name="type" className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm">
                                            <option value="GENERATOR">Jeneratör</option>
                                            <option value="MACHINE">Fabrika Makinesi</option>
                                            <option value="VEHICLE">Araç / Forklift</option>
                                            <option value="SENSOR">Sensör (Diğer)</option>
                                            <option value="OTHER">Diğer</option>
                                        </select>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <label className="text-xs font-medium text-slate-500 block mb-1">Baz Tüketim (kW/L)</label>
                                        <input name="currentDraw" type="number" step="0.01" required defaultValue={0} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm" />
                                    </div>
                                    <div className="lg:col-span-3 flex items-center justify-between gap-4 p-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="hasIoT" defaultChecked className="w-4 h-4 rounded text-brand-navy focus:ring-brand-navy border-slate-300" />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">IoT Takibi</span>
                                        </label>
                                        <button type="submit" className="px-4 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white dark:bg-brand-green dark:hover:bg-brand-green/90 dark:text-brand-navy rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                                            Ekle
                                        </button>
                                    </div>
                                </form>
                                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                    * IoT Takibi açık olan cihazlar canlı veri akışı (simülasyon) sağlar. Bu özellik ileride eklenecek gerçek IoT cihazları içindir.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
