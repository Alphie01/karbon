import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InteractiveCoursePlayer from "../../../../components/corp/InteractiveCoursePlayer";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const session = await auth();
    const userEmail = session?.user?.email;

    let userAttentionLevel: string | null = null;
    if (userEmail) {
        const dbUser = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { attentionLevel: true }
        });

        if (!dbUser?.attentionLevel) {
            redirect("/corp/academy/questionnaire");
        }

        userAttentionLevel = dbUser.attentionLevel;
    }
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            videos: {
                orderBy: { createdAt: 'asc' },
                include: {
                    quizzes: {
                        orderBy: { timestamp: 'asc' }
                    }
                }
            }
        }
    });

    if (!course) {
        notFound();
    }

    // Filter videos: show if video has NO attentionLevel (null) OR if it matches user's attentionLevel
    const filteredVideos = course.videos.filter(v => {
        if (!v.attentionLevel) return true; // GENEL video
        if (v.attentionLevel === userAttentionLevel) return true; // Match found
        return false;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <Link href="/corp/academy" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-green transition-colors">
                <ChevronLeft size={16} className="mr-1" /> Tüm Eğitimlere Dön
            </Link>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h1>
                        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{course.description}</p>
                    </div>
                    {userAttentionLevel && (
                        <div className="shrink-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 transition-colors">
                            <Info size={16} /> Odak Profiliniz: {userAttentionLevel}
                        </div>
                    )}
                </div>
            </div>

            {filteredVideos.length > 0 ? (
                <InteractiveCoursePlayer videos={filteredVideos} />
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">
                        {course.videos.length > 0
                            ? "Odak profilinize (Attention Level) uygun bir video henüz bu kursta bulunmuyor."
                            : "Bu kursa henüz video eklenmemiş."}
                    </p>
                </div>
            )}
        </div>
    );
}
