import { auth } from "@/auth";
import { BookOpen, FileVideo, Clock, ExternalLink, ChevronRight } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

async function getCourses() {
    return await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        include: { videos: true }
    });
}

export default async function CorpAcademyPage() {
    const session = await auth();

    // Check if user has taken the questionnaire
    const userEmail = session?.user?.email;
    if (userEmail) {
        const dbUser = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { attentionLevel: true }
        });

        if (!dbUser?.attentionLevel) {
            redirect("/corp/academy/questionnaire");
        }
    }

    const courses = await getCourses();

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Sürdürülebilirlik <span className="text-brand-green">Akademisi</span>
                </h1>
                <p className="text-slate-500 flex items-center justify-between">
                    <span>Gezegenimiz ve işiniz için değer yaratın. Uzmanlık kursları, videolar ve interaktif eğitimler.</span>
                    <Link href="/corp/academy/questionnaire" className="text-sm text-brand-green hover:underline flex items-center gap-1">
                        <BookOpen size={16} /> Odak Testimi Yenile
                    </Link>
                </p>
            </div>

            {courses.length > 0 ? (
                <div className="space-y-12">
                    {/* Course Grid */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <BookOpen size={20} className="text-brand-navy dark:text-white" /> Tüm Kurslar
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <Link
                                    href={`/corp/academy/${course.id}`}
                                    key={course.id}
                                    className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-green dark:hover:border-brand-green transition-all hover:shadow-lg"
                                >
                                    <div className="aspect-video bg-emerald-50 dark:bg-emerald-900/10 relative group-hover:opacity-90 transition-opacity flex items-center justify-center">
                                        {course.thumbnail ? (
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <FileVideo className="text-emerald-400 h-16 w-16 opacity-50" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                                {course.category}
                                            </span>
                                            <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                <FileVideo size={12} /> {course.videos.length} Bölüm
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="flex items-center justify-between font-bold text-slate-900 dark:text-white group-hover:text-brand-green transition-colors text-xl mb-2">
                                            {course.title} <ChevronRight size={20} className="text-slate-300 group-hover:text-brand-green group-hover:translate-x-1 transition-transform" />
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                                            {course.description || "Bu kurs hakkında henüz bir açıklama girilmemiş."}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <BookOpen className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Henüz Kurs Eklenmemiş</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                        Eğitim kurslarımız hazırlanıyor. Çok yakında burada bulabilirsiniz.
                    </p>
                </div>
            )}
        </div>
    );
}
