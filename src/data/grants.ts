export type Grant = {
    id: string;
    title: string;
    organization: string;
    description: string;
    category: "Arg-Ge" | "İhracat" | "Dijitalleşme" | "Enerji" | "İstihdam" | "Genel";
    minAmount: number;
    maxAmount: number;
    currency: "TL" | "USD" | "EUR";
    matchRate: number; // Percentage (e.g., 60 means 60% updated)
    deadline?: string;
    sectors: string[]; // e.g., ["Bilişim", "Üretim", "Tarım", "All"]
    minEmployee?: number;
    maxEmployee?: number;
    scope: "National" | "EU" | "Global";
    details: {
        purpose: string;
        eligibleApplicants: string[]; // Who can apply
        coverage: string; // What expenses are covered
        applicationDeadline?: string;
    };
};

export const grants: Grant[] = [
    // --- National Grants (Türkiye) ---
    {
        id: "kosgeb-ileri-girisimci",
        title: "İleri Girişimci Destek Programı",
        organization: "KOSGEB",
        description: "Teknoloji odaklı iş fikirlerinin hayata geçirilmesi için verilen kuruluşu ve performans desteği.",
        category: "Genel",
        minAmount: 100000,
        maxAmount: 2000000,
        currency: "TL",
        matchRate: 75,
        sectors: ["Bilişim", "Üretim", "Teknoloji"],
        maxEmployee: 50,
        scope: "National",
        details: {
            purpose: "Ülkemizin stratejik öncelikleri doğrultusunda belirlenen sektörlerde girişimciliğin desteklenmesi ve sürdürülebilir işletmelerin kurulması.",
            eligibleApplicants: ["Yeni girişimciler", "Teknoloji odaklı iş fikri olanlar", "Son 1 yıl içinde şahıs işletmesi kurmuş olanlar"],
            coverage: "Makine-teçhizat giderleri, yazılım lisans bedelleri, personel giderleri, kira ve ofis donanım giderleri.",
            applicationDeadline: "Sürekli Açık"
        }
    },
    {
        id: "tubitak-1501",
        title: "1501 - Sanayi Ar-Ge Projeleri Destekleme Programı",
        organization: "TÜBİTAK",
        description: "KOBİ'lerin Ar-Ge çalışmalarını teşvik etmek amacıyla projelere verilen hibe desteği.",
        category: "Arg-Ge",
        minAmount: 500000,
        maxAmount: 10000000,
        currency: "TL",
        matchRate: 75,
        sectors: ["All"],
        maxEmployee: 250,
        scope: "National",
        details: {
            purpose: "KOBİ'lerin araştırma-teknoloji geliştirme ve yenilikçilik kapasitelerinin artırılması.",
            eligibleApplicants: ["KOBİ ölçeğindeki tüm işletmeler", "Sektör kısıtlaması olmaksızın Ar-Ge projesi olan firmalar"],
            coverage: "Personel giderleri, alet/teçhizat/yazılım giderleri, malzeme alımları, danışmanlık hizmetleri.",
            applicationDeadline: "Dönemsel Çağrılı"
        }
    },
    {
        id: "ticaret-bakanligi-ihracat",
        title: "Pazara Giriş Belgeleri Desteği",
        organization: "Ticaret Bakanlığı",
        description: "Şirketlerin yurt dışı pazarlara girmek için almaları gereken kalite ve çevre belgelerine ilişkin giderlerin karşılanması.",
        category: "İhracat",
        minAmount: 50000,
        maxAmount: 4000000,
        currency: "TL",
        matchRate: 50,
        sectors: ["All"],
        scope: "National",
        details: {
            purpose: "Şirketlerin uluslararası pazarlarda rekabet gücünü artırmak için gerekli akreditasyon ve belgelerin temini.",
            eligibleApplicants: ["İhracat yapmayı hedefleyen tüm sermaye şirketleri"],
            coverage: "ISO, CE, FDA vb. kalite ve güvenlik sertifikalarının başvuru ve inceleme ücretleri.",
            applicationDeadline: "Sürekli Açık"
        }
    },
    {
        id: "kosgeb-kobi-gel",
        title: "KOBİGEL - KOBİ Gelişim Destek Programı",
        organization: "KOSGEB",
        description: "KOBİ'lerin dijitalleşme ve rekabet güçlerini artırmaya yönelik projelerine verilen destek.",
        category: "Dijitalleşme",
        minAmount: 200000,
        maxAmount: 2000000,
        currency: "TL",
        matchRate: 60,
        sectors: ["Üretim", "Bilişim"],
        scope: "National",
        details: {
            purpose: "İmalat sanayi KOBİ'lerinin dijitalleşme düzeylerinin artırılması ve teknolojik altyapılarının güçlendirilmesi.",
            eligibleApplicants: ["İmalat sektöründeki KOBİ'ler", "Yazılım sektöründeki KOBİ'ler"],
            coverage: "Donanım, yazılım, hizmet alımı ve personel giderleri.",
            applicationDeadline: "Çağrı Usulü"
        }
    },
    {
        id: "turkwal-yesil-donusum",
        title: "Yeşil Dönüşüm Hibe Programı",
        organization: "Kalkınma Ajansı",
        description: "İşletmelerin enerji verimliliği ve karbon ayak izini azaltmaya yönelik yatırımları için.",
        category: "Enerji",
        minAmount: 1000000,
        maxAmount: 5000000,
        currency: "TL",
        matchRate: 80,
        sectors: ["Üretim", "Turizm", "Tarım"],
        scope: "National",
        details: {
            purpose: "İşletmelerin çevresel sürdürülebilirlik hedeflerine ulaşması ve enerji maliyetlerinin düşürülmesi.",
            eligibleApplicants: ["Sanayi sicil belgesine sahip üretim işletmeleri", "Turizm tesisleri"],
            coverage: "Güneş enerjisi santralleri (GES), atık yönetimi sistemleri, enerji verimli motorlar.",
            applicationDeadline: "Sürekli Açık"
        }
    },
    {
        id: "iskur-istihdam",
        title: "İşbaşı Eğitim Programı",
        organization: "İŞKUR",
        description: "Nitelikli personel istihdamını artırmak amacıyla işverenlere sağlanan maaş ve sigorta desteği.",
        category: "İstihdam",
        minAmount: 17002,
        maxAmount: 200000,
        currency: "TL",
        matchRate: 100,
        sectors: ["All"],
        scope: "National",
        details: {
            purpose: "Mesleki deneyimi olmayan kişilerin işbaşında eğitilerek istihdam edilebilirliğinin artırılması.",
            eligibleApplicants: ["En az 2 sigortalı çalışanı olan tüm işyerleri"],
            coverage: "Katılımcı zaruri gideri (maaş), genel sağlık sigortası, iş kazası sigortası.",
            applicationDeadline: "Sürekli Açık"
        }
    },

    // --- EU & International Grants ---
    {
        id: "horizon-europe-eic",
        title: "EIC Accelerator (Horizon Europe)",
        organization: "European Commission",
        description: "Çığır açan inovasyonlara ve ölçeklenebilir girişimlere (Start-up & KOBİ) yönelik büyük çaplı fonlama.",
        category: "Arg-Ge",
        minAmount: 500000,
        maxAmount: 2500000, // Grant part only, equity is more
        currency: "EUR",
        matchRate: 70,
        sectors: ["Teknoloji", "Bilişim", "Üretim", "Sağlık", "Enerji"],
        scope: "EU",
        details: {
            purpose: "Avrupa'nın stratejik özerkliğini güçlendirecek derin teknoloji (deep-tech) girişimlerini küresel pazara taşımak.",
            eligibleApplicants: ["Yüksek risk/yüksek potansiyele sahip Start-up ve KOBİ'ler"],
            coverage: "Teknoloji geliştirme, prototipleme, pilot üretim ve ticarileştirme faaliyetleri.",
            applicationDeadline: "Yılda 3-4 kesim tarihi (Cut-off dates)"
        }
    },
    {
        id: "erasmus-plus-ka2",
        title: "Erasmus+ KA2 - Stratejik Ortaklıklar",
        organization: "European Commission",
        description: "Eğitimde dijitalleşme, mesleki eğitim ve kurumsal kapasite geliştirmeye yönelik işbirlikleri.",
        category: "Dijitalleşme",
        minAmount: 30000,
        maxAmount: 250000,
        currency: "EUR",
        matchRate: 100,
        sectors: ["Eğitim", "Turizm", "Bilişim"],
        scope: "EU",
        details: {
            purpose: "Kurumlar arası işbirliğini artırarak yenilikçi eğitim metotlarının ve dijital çözümlerin geliştirilmesi.",
            eligibleApplicants: ["Eğitim kurumları", "STK'lar", "Şirketler", "Kamu kurumları"],
            coverage: "Proje yönetimi, uluslararası toplantılar, fikri çıktı geliştirme, çoğaltıcı etkinlikler.",
            applicationDeadline: "Yılda 1 kez (Genelde Mart/Ekim)"
        }
    },
    {
        id: "eu-green-deal-innovation",
        title: "Green Deal Innovation Call",
        organization: "European Commission",
        description: "Avrupa Yeşil Mutabakatı hedeflerine katkı sağlayan yeşil teknolojiler ve sürdürülebilir çözümler için.",
        category: "Enerji",
        minAmount: 1000000,
        maxAmount: 5000000,
        currency: "EUR",
        matchRate: 60,
        sectors: ["Enerji", "Tarım", "Üretim", "Ulaşım"],
        scope: "EU",
        details: {
            purpose: "Karbon nötr bir Avrupa için temiz enerji, sürdürülebilir tarım ve döngüsel ekonomi projelerinin desteklenmesi.",
            eligibleApplicants: ["Konsorsiyumlar (Sanayi, KOBİ, Araştırma Kuruluşları)"],
            coverage: "Pilot tesis kurulumu, demonstrasyon faaliyetleri, teknoloji validasyonu.",
            applicationDeadline: "Çağrı bazlı"
        }
    },
    {
        id: "cost-actions",
        title: "COST Actions (Bilim ve Teknoloji)",
        organization: "COST Association",
        description: "Araştırmacılar arasında uluslararası ağ kurmayı destekleyen, toplantı ve çalıştay fonlaması.",
        category: "Arg-Ge",
        minAmount: 5000,
        maxAmount: 100000,
        currency: "EUR",
        matchRate: 100,
        sectors: ["All"],
        scope: "Global",
        details: {
            purpose: "Bilimsel ve teknolojik konularda çalışan araştırmacıların ağ oluşturmasını (networking) sağlamak.",
            eligibleApplicants: ["Akademisyenler", "Araştırmacılar", "Sanayi kuruluşları"],
            coverage: "Toplantı katılım giderleri, kısa süreli bilimsel ziyaretler, eğitim okulları.",
            applicationDeadline: "Sürekli Açık (Tarih bazlı toplama)"
        }
    }
];
