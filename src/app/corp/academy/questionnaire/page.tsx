"use client";

import { Brain, Clock, Focus, PlayCircle, Loader2, BookOpen, Eye, Headphones, Target, Zap, Coffee, BarChart } from "lucide-react";
import { submitQuestionnaire } from "./actions";
import { useState } from "react";

export default function QuestionnairePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <div className="max-w-3xl mx-auto space-y-8  py-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-4 bg-brand-green/10 text-brand-green rounded-2xl mb-4">
                    <Brain size={48} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Odak ve Algı Profilinizi Çıkaralım</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Size en uygun eğitim deneyimini sunabilmek için çalışma alışkanlıklarınızı tanımamız gerekiyor.
                    Lütfen aşağıdaki 10 kısa soruyu kendinize en uygun şekilde yanıtlayın.
                </p>
            </div>

            <form action={(formData) => {
                setIsSubmitting(true);
                submitQuestionnaire(formData);
            }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-12">

                {/* Soru 1 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="text-blue-500" />
                        1. İdeal bir öğrenme videosu sizin için ne kadar sürmeli?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q1" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white mb-2">Çok Kısa (1-3 Dk)</div>
                                <div className="text-sm text-slate-500">Hızlıca hap bilgi almak isterim.</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q1" value="60" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white mb-2">Orta (5-10 Dk)</div>
                                <div className="text-sm text-slate-500">Normal süreli bir özet yeterlidir.</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q1" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white mb-2">Uzun (15+ Dk)</div>
                                <div className="text-sm text-slate-500">Konunun tüm detaylarını öğrenmek isterim.</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 2 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Focus className="text-emerald-500" />
                        2. Yeni bir konuyu öğrenirken hangi yöntem sizi daha çok konuya çeker?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q2" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white mb-2">Sürekli Görsel ve Aksiyon</div>
                                <div className="text-sm text-slate-500">Ekranda değişen görseller ve hareketli bir anlatım dikkatimi canlı tutar.</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q2" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white mb-2">Derinlemesine ve Sabit Anlatım</div>
                                <div className="text-sm text-slate-500">Daha akademik, durağan ancak bol istatistik ve detaya inen anlatımlar.</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 3 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <PlayCircle className="text-purple-500" />
                        3. Video izlerken sıkılmadan odaklandığınız maksimum süre ne kadardır?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q3" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">5 Dakikadan Az</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q3" value="60" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">10-15 Dakika Arası</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q3" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Yarım Saat ve Üzeri</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 4 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="text-orange-500" />
                        4. Öğrenirken not alır mısınız?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q4" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Evet, detaylı notlar alırım</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q4" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Hayır, sadece dinlerim/izlerim</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 5 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Eye className="text-pink-500" />
                        5. Bir toplantıda ya da derste dikkatiniz genelde ne zaman dağılmaya başlar?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q5" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-pink-500 peer-checked:bg-pink-50 dark:peer-checked:bg-pink-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">İlk 10 dakika içinde</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q5" value="60" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-pink-500 peer-checked:bg-pink-50 dark:peer-checked:bg-pink-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Yarım saat sonra</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q5" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-pink-500 peer-checked:bg-pink-50 dark:peer-checked:bg-pink-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">1 saatten önce kolay kolay dağılmaz</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 6 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Headphones className="text-sky-500" />
                        6. Eğitim videolarını izlerken arka planda başka bir işle (e-posta cevaplamak vb.) meşgul olur musunuz?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q6" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Sık sık başka işler yaparım (Multitasking)</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q6" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Hayır, tamamen videoya odaklanırım</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 7 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Target className="text-red-500" />
                        7. Karmaşık bir problemle karşılaştığınızda yaklaşımınız nasıldır?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q7" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white text-sm">Pratik bir özet ve hızlı bir çözüm metodu ararım</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q7" value="60" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white text-sm">Zamanım varsa detaylandırırım, yoksa es geçerim</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q7" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white text-sm">Kök nedenine inip her detayını en ince ayrıntısına kadar analiz ederim</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 8 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="text-yellow-500" />
                        8. Makale veya rapor okurken ne derece detaylara takılırsınız?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q8" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 dark:peer-checked:bg-yellow-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Genellikle özet kısımlarını (Executive Summary) veya sadece başlıkları okurum</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q8" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 dark:peer-checked:bg-yellow-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Sonuna kadar tüm içeriği atlamadan okurum</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 9 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart className="text-indigo-500" />
                        9. Eğitim sırasında test / quiz karşınıza çıkması motivasyonunuzu nasıl etkiler?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q9" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Araya giren testler akışı bozar, sevmem</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q9" value="60" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Az sayıda kısa soru ilgimi canlı tutar</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q9" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Her bilginin ardından test edilmek pekiştirmemi sağlar</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Soru 10 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Coffee className="text-amber-600" />
                        10. Yeni şeyler öğrenirken çalışma ortamınız nasıldır?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="q10" value="30" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Genellikle ofis içinde, sesli ve bölünebildiğim bir ortamda</div>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="q10" value="100" className="peer sr-only" required />
                            <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-900/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center h-full">
                                <div className="font-bold text-slate-900 dark:text-white">Sessiz, yalıtılmış, tamamen odaklanabildiğim bir alanda</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-brand-navy hover:bg-opacity-90 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin" /> Sonuç Hesaplanıyor...</>
                        ) : (
                            "Analizi Tamamla ve Bana Uygun Videoları Göster"
                        )}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                        Test sonucunuz profilinize kaydedilir ve istediğiniz zaman ayarlardan sıfırlayabilirsiniz.
                    </p>
                </div>

            </form>
        </div>
    );
}
