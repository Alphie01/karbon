export type ResourceType = "video" | "article" | "document";

export type EducationResource = {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    url: string; // YouTube link or Article URL
    duration?: string; // e.g. "12 dk"
    thumbnail?: string;
};

export type EducationCategory = {
    id: string;
    title: string;
    description: string;
    resources: EducationResource[];
};

export const educationData: EducationCategory[] = [
    {
        id: "sustainability-101",
        title: "Sürdürülebilirlik Temelleri",
        description: "Temel kavramlar ve neden önemli olduğu hakkında giriş dersleri.",
        resources: [
            {
                id: "intro-video",
                title: "Sürdürülebilirlik Nedir?",
                description: "Gezegenimizi korumak için temel kavramlara hızlı bir bakış.",
                type: "video",
                url: "https://www.youtube.com/watch?v=kZIrIQDf1nQ", // Placeholder
                duration: "5 dk",
                thumbnail: "https://images.unsplash.com/photo-1542601906990-24d4c1647f0e?w=800&q=80",
            },
            {
                id: "carbon-cycle",
                title: "Karbon Döngüsü ve İklim Değişikliği",
                description: "Karbon emisyonlarının iklim üzerindeki etkisini anlayın.",
                type: "article",
                url: "/learn/article/carbon-cycle",
                duration: "10 dk okuma",
                thumbnail: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
            }
        ]
    },
    {
        id: "green-business",
        title: "Yeşil İşletmeler İçin Rehber",
        description: "Şirketler için sürdürülebilir dönüşüm stratejileri.",
        resources: [
            {
                id: "green-office",
                title: "Ofiste Enerji Tasarrufu",
                description: "İş yerinde basit önlemlerle büyük tasarruf sağlayın.",
                type: "video",
                url: "https://www.youtube.com/watch?v=placeholder2",
                duration: "15 dk",
                thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
            }
        ]
    }
];
