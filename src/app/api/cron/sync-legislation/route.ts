import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kullanıcının özellikle istediği ana başlıklar
const ALLOWED_CATEGORIES = [
    "KANUNLAR",
    "YÖNETMELİKLER",
    "TEBLİĞLER",
    "GENELGELER",
    "USUL VE ESASLAR",
    "YÖNERGELER"
];

export async function GET() {
    try {
        console.log("Fetching legislation data for specific green category titles...");
        const { data } = await axios.get('https://www.cevremuhendisligi.org/index.php/cevre-aktuel/cevre-mevzuati');
        const $ = cheerio.load(data);

        let container = $('div[itemprop="articleBody"]');
        if (!container.length) {
            container = $('.item-page');
            if (!container.length) container = $('body');
        }

        const items: { title: string, url: string, category: string }[] = [];
        let currentCategory = "Genel";

        container.find('*').each((i, el) => {
            const hasLinks = $(el).find('a').length > 0;
            const text = $(el).text().trim().replace(/\s+/g, ' ');

            if (!hasLinks && text.length > 2 && text.length < 50) {
                const style = $(el).attr('style') || "";
                const isGreen = style.includes('008000') || style.includes('green') || style.includes('#008000') || style.includes('rgb(0, 128, 0)');

                const tagName = $(el).prop('tagName') || "";
                const colorAttr = $(el).attr('color') || "";
                const isFontGreen = tagName.toLowerCase() === 'font' && (colorAttr === '#008000' || colorAttr === 'green');

                if (isGreen || isFontGreen) {
                    const normalizedText = text.toUpperCase();
                    if (ALLOWED_CATEGORIES.includes(normalizedText)) {
                        console.log("Bulunan Yeşil Kategori: ", normalizedText);
                        currentCategory = normalizedText;
                    }
                }
            }

            const nodeTagName = $(el).prop('tagName') || "";
            if (nodeTagName.toLowerCase() === 'a') {
                const href = $(el).attr('href');
                const title = $(el).text().trim();

                if (href && href.startsWith('http') && title.length > 5 && !items.some(k => k.url === href)) {
                    if (ALLOWED_CATEGORIES.includes(currentCategory)) {
                        items.push({
                            title: title,
                            url: href,
                            category: currentCategory
                        });
                    }
                }
            }
        });

        // Deduplicate items based on URL
        const uniqueItems = Array.from(new Map(items.map(item => [item.url, item])).values());

        console.log(`Found ${uniqueItems.length} unique legislation items.`);

        let addedCount = 0;
        let categoryCount = 0;

        // Upsert categories
        const categories = Array.from(new Set(uniqueItems.map(i => i.category)));
        for (const catName of categories) {
            try {
                await (prisma as any).legislationCategory.upsert({
                    where: { name: catName },
                    update: {},
                    create: { name: catName, description: `${catName} ile ilgili güncel mevzuat.` }
                });
                categoryCount++;
            } catch (err) {
                console.error(`Error upserting category ${catName}:`, err);
            }
        }

        // Upsert legislation
        for (const item of uniqueItems) {
            try {
                // Determine sourceUrl (same as url)
                const existing = await (prisma as any).legislation.findFirst({
                    where: { url: item.url }
                });

                if (!existing) {
                    await (prisma as any).legislation.create({
                        data: {
                            title: item.title,
                            category: item.category,
                            url: item.url,
                            sourceUrl: item.url,
                            date: new Date().toLocaleDateString('tr-TR')
                        }
                    });
                    addedCount++;
                } else {
                    // Update category if it was missing or different
                    if (existing.category !== item.category) {
                        await (prisma as any).legislation.update({
                            where: { id: existing.id },
                            data: { category: item.category }
                        });
                    }
                }
            } catch (err) {
                console.error(`Error saving item ${item.title}:`, err);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Scraping completed. Extracted ${uniqueItems.length} items. Added ${addedCount} new items.`,
            addedCount,
            totalFound: uniqueItems.length
        });

    } catch (error: any) {
        console.error("Sync Legislation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to sync" }, { status: 500 });
    }
}
