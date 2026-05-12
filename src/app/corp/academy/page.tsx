import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, FileVideo, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getCourses() {
    return await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        include: { videos: true },
    });
}

const CATEGORY_STYLE: Record<string, string> = {
    "Karbon": "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
    "Su": "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    "Mevzuat": "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400",
    "ESG": "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
};

export default async function CorpAcademyPage() {
    const session = await auth();

    const userEmail = session?.user?.email;
    if (userEmail) {
        const dbUser = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { attentionLevel: true },
        });
        if (!dbUser?.attentionLevel) {
            redirect("/corp/academy/questionnaire");
        }
    }

    const courses = await getCourses();

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Sürdürülebilirlik Akademisi</h1>
                    <p className="text-sm text-slate-500">Uzmanlık kursları, interaktif videolar ve değerlendirmeler.</p>
                </div>
                <Link
                    href="/corp/academy/questionnaire"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-lg hover:border-emerald-400 transition-colors flex-shrink-0"
                >
                    <BookOpen size={14} /> Odak Testimi Yenile
                </Link>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/corp/academy/${course.id}`}
                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-emerald-400 dark:hover:border-emerald-600/50 transition-colors flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="aspect-video bg-slate-50 dark:bg-slate-800 relative flex items-center justify-center">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <FileVideo size={32} className="text-slate-300 dark:text-slate-600" />
                                )}
                                {/* Overlay with chapter count */}
                                <div className="absolute bottom-2 right-2">
                                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-semibold px-2 py-1 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                                        <FileVideo size={10} /> {course.videos.length} Bölüm
                                    </span>
                                </div>
                                {course.category && (
                                    <div className="absolute top-2 left-2">
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${CATEGORY_STYLE[course.category] || "bg-slate-100 dark:bg-slate-800 text-slate-600"}`}>
                                            {course.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
                                    {course.title}
                                </h3>
                                {course.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                                        {course.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-end mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                                        Kursa Git <ArrowRight size={11} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <BookOpen className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
                    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">Henüz Kurs Eklenmemiş</h3>
                    <p className="text-sm text-slate-400 mt-1">Eğitim içerikleri yakında burada yayınlanacak.</p>
                </div>
            )}
        </div>
    );
}
