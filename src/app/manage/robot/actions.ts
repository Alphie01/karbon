"use server";

import { prisma } from "@/lib/prisma";

const GRANTS_DB = [
    {
        id: "grant-solar-01",
        title: "Güneş Enerjisi Santrali (GES) Desteği",
        provider: "KOSGEB",
        scope: "Global",
        focus: "Energy",
        minScore: 70,
        avgAmount: "1.500.000 TL",
        grantPct: 60,
        incentivePct: 40,
        criteria: (data: any) => data.carbon?.scope2 > 100 ? 95 : 40,
        reason: "Yüksek elektrik tüketimi (Kapsam 2) tespit edildi. Yenilenebilir enerji yatırımına uygunluk yüksek."
    },
    {
        id: "grant-water-01",
        title: "Endüstriyel Su Geri Kazanım Teşviği",
        provider: "Sanayi Bakanlığı",
        scope: "National",
        focus: "Water",
        minScore: 50,
        avgAmount: "2.000.000 TL",
        grantPct: 50,
        incentivePct: 50,
        criteria: (data: any) => data.water?.grey > 50 ? 90 : 20,
        reason: "Gri su deşarjı tespit edildi, geri kazanım sistemleri ile şebeke suyu kullanımı düşürülebilir."
    },
    {
        id: "grant-muni-01",
        title: "Akıllı Şehir & Yeşil Altyapı Hibe Programı",
        provider: "Çevre ve Şehircilik Bakanlığı",
        scope: "National",
        focus: "Municipal",
        minScore: 60,
        avgAmount: "5.000.000 TL",
        grantPct: 80,
        incentivePct: 20,
        criteria: (data: any) => (data.carbon?.scope1 > 500 || data.water?.total > 1000) ? 88 : 45,
        reason: "Belediye ölçeğindeki operasyonel emisyonlar ve park/bahçe sulama yoğunluğu için ideal program."
    },
    {
        id: "grant-eu-green-01",
        title: "EU Horizon - Green Deal Innovation",
        provider: "Avrupa Birliği",
        scope: "EU",
        focus: "Innovation",
        minScore: 60,
        avgAmount: "€2.500.000",
        grantPct: 100,
        incentivePct: 0,
        criteria: (data: any) => (data.carbon?.total > 500 && data.water?.total > 1000) ? 85 : 30,
        reason: "Yüksek çevresel etki profili, AB Yeşil Mutabakat hedeflerine uygun dönüşüm projesi."
    },
    {
        id: "grant-iso-01",
        title: "ISO 14046 & 14064 Belgelendirme Desteği",
        provider: "Ticaret Bakanlığı",
        scope: "National",
        focus: "Certification",
        minScore: 80,
        avgAmount: "250.000 TL",
        grantPct: 70,
        incentivePct: 30,
        criteria: (data: any) => 100, // Always recommended
        reason: "Kurumsal ayak izi raporlaması için belgelendirme desteği."
    }
];

export async function analyzeCompanyData(companyId: string) {
    try {
        // 1. Fetch Carbon Data (Aggregate)
        const carbonEntries = await prisma.carbonEntry.findMany({
            where: { companyId }
        });

        const carbonStats = {
            scope1: 0,
            scope2: 0,
            scope3: 0,
            total: 0
        };

        carbonEntries.forEach((e: any) => {
            const val = e.calculatedEmission || 0;
            if (e.scope === "SCOPE_1") carbonStats.scope1 += val;
            else if (e.scope === "SCOPE_2") carbonStats.scope2 += val;
            else if (e.scope === "SCOPE_3") carbonStats.scope3 += val;
            carbonStats.total += val;
        });

        // 2. Fetch Water Data (Latest Report)
        const waterReport = await prisma.waterReport.findFirst({
            where: { companyId },
            orderBy: { createdAt: 'desc' }
        });

        const waterStats = {
            blue: waterReport?.blueWater || 0,
            green: waterReport?.greenWater || 0,
            grey: waterReport?.greyWater || 0,
            total: waterReport?.totalWater || 0
        };

        // 3. Match Grants
        const analysisData = { carbon: carbonStats, water: waterStats };
        const suggestions = GRANTS_DB.map(grant => {
            const score = grant.criteria(analysisData);
            // Destructure to remove the criteria function which is not serializable
            const { criteria, ...grantData } = grant;
            return {
                ...grantData,
                score,
                match: score >= grant.minScore
            };
        }).filter(g => g.match).sort((a, b) => b.score - a.score);

        return {
            success: true,
            data: {
                stats: analysisData,
                suggestions
            }
        };

    } catch (error) {
        console.error("Analysis error:", error);
        return { success: false, error: "Analiz yapılamadı." };
    }
}

export async function generateProjectDraft(grantId: string, companyId: string) {
    // Mock AI Generation
    const grant = GRANTS_DB.find(g => g.id === grantId);
    if (!grant) return { success: false, error: "Hibe bulunamadı." };

    const company = await prisma.company.findUnique({ where: { id: companyId } });

    const draftText = `
PROJE BAŞVURU TASLAĞI
--------------------------------------------------
HİBE PROGRAMI: ${grant.title} (${grant.provider})
BAŞVURU SAHİBİ: ${company?.name || "Firma Adı"}
TARİH: ${new Date().toLocaleDateString('tr-TR')}

1. PROJE ÖZETİ & GEREKÇE
Firmamız, sürdürülebilirlik hedefleri doğrultusunda çevresel etkilerini azaltmayı taahhüt etmektedir. Yapılan ön analizlerde, işletmemizin ${grant.reason.toLowerCase()} tespit edilmiştir. Bu proje ile bu etkinin azaltılması ve kaynak verimliliğinin artırılması hedeflenmektedir.

2. MEVCUT DURUM (SORUN ANALİZİ)
Şirket içi karbon/su ayak izi envanter çalışmaları sonucunda, özellikle ${grant.focus === 'Energy' ? 'enerji tüketimimizden kaynaklı karbon emisyonlarının' : grant.focus === 'Water' ? 'üretim süreçlerindeki su tüketimi ve gri su oluşumunun' : 'çevresel etkilerin'} kritik seviyede olduğu görülmüştür. Bu durum hem maliyet artışına hem de çevresel risklere yol açmaktadır.

3. PROJE HEDEFLERİ
- ${grant.focus === 'Energy' ? 'Yenilenebilir enerji kaynaklarına geçiş ile Kapsam 2 emisyonlarının %40 azaltılması.' : grant.focus === 'Water' ? 'Atık su geri kazanım tesisi ile su tüketiminin %30 düşürülmesi.' : 'Uluslararası standartlara uyum ve ihracat rekabetçiliğinin artırılması.'}
- İşletme giderlerinin düşürülmesi.
- Yeşil dönüşüm sürecinin hızlandırılması.

4. BEKLENEN ÇIKTILAR
Proje tamamlandığında yıllık karbon/su tasarrufu sağlanacak ve kurumsal sürdürülebilirlik raporlarımıza pozitif katkı sunulacaktır.
    `.trim();

    return { success: true, draft: draftText };
}
