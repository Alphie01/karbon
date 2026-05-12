
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const videos = [
        {
            title: "Karbon Ayak İzi Nedir?",
            description: "Karbon ayak izinin temel kavramları ve hesaplama yöntemleri.",
            url: "https://www.youtube.com/embed/8q7_aV8eLUE", // Placeholder
            category: "carbon",
            thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "Su Ayak İzi Nedir?",
            description: "Su tüketiminizin çevresel etkilerini anlamak.",
            url: "https://www.youtube.com/embed/b1f-G6v3voA", // Placeholder
            category: "water",
            thumbnail: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "Biz Kimiz? | Beyond Limits",
            description: "Şirketimizin vizyonu, misyonu ve sürdürülebilirlik hedefleri.",
            url: "https://www.youtube.com/embed/lxO-6rlihkam", // Placeholder
            category: "intro",
            thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
        },
    ];

    for (const video of videos) {
        await (prisma as any).video.create({
            data: video,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
