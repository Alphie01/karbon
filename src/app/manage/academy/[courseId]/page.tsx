import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CourseVideoManager from "@/components/admin/CourseVideoManager";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    
    if (!courseId) {
        notFound();
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

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Link href="/manage/academy" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-green transition-colors">
                <ChevronLeft size={16} className="mr-1" /> Kurs Kütüphanesine Dön
            </Link>

            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center md:items-start">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-32 h-32 object-cover rounded-xl shadow-sm" />
                ) : (
                    <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-800/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-3xl shadow-sm">
                        {course.title.substring(0, 2).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 text-center md:text-left">
                    <span className="bg-brand-green/20 text-brand-green text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">
                        {course.category}
                    </span>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">{course.description || "Açıklama bulunmuyor."}</p>
                </div>
            </div>

            <CourseVideoManager courseId={course.id} initialVideos={course.videos} />
        </div>
    );
}
