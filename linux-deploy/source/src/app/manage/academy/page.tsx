import { getCourses, addCourse, deleteCourse } from "../video-actions";
import { FileVideo, Plus, Trash2, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default async function AdminAcademyPage() {
    const res = await getCourses();
    const courses = res.courses || [];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Eğitim Kursları Yönetimi</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Course Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sticky top-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Plus className="text-brand-green" /> Yeni Kurs Ekle
                        </h2>
                        <form action={addCourse as any} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kurs Başlığı</label>
                                <input name="title" required className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Örn: ISO 14064 Karbon Eğitimi" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                                <select name="category" className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                                    <option value="Karbon">Karbon</option>
                                    <option value="Su">Su</option>
                                    <option value="Mevzuat">Mevzuat</option>
                                    <option value="Genel">Genel</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kapak Görseli URL (İsteğe bağlı)</label>
                                <input name="thumbnail" className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Açıklama</label>
                                <textarea name="description" rows={3} className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Kurs hakkında kısa bilgi..." />
                            </div>
                            <button type="submit" className="w-full bg-brand-navy text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium">
                                Kursu Oluştur
                            </button>
                        </form>
                    </div>
                </div>

                {/* Course List */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileVideo className="text-brand-green" /> Kurs Kütüphanesi
                            </h2>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold">{courses.length} Kurs</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {courses.map((course: any) => (
                                <div key={course.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="h-16 w-16 bg-brand-green/10 text-brand-green rounded-full flex-shrink-0 flex items-center justify-center">
                                        <FileVideo size={28} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                {course.category}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(course.createdAt).toLocaleDateString("tr-TR")}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">{course.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{course.videos?.length || 0} Video Yüklü</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <form action={deleteCourse.bind(null, course.id) as any}>
                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Kursu Sil">
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                        <Link href={`/manage/academy/${course.id}`}>
                                            <div className="flex items-center gap-1 p-2 px-3 bg-brand-navy text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                                                İçeriği Yönet <ChevronRight size={16} />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {courses.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    Henüz kurs oluşturulmamış. Yeni bir kurs ekleyerek başlayın.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
