import axios from 'axios';
import * as cheerio from 'cheerio';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import iconv from 'iconv-lite';

const BASE_URL = 'https://www.cevremuhendisligi.org';
const LOGIN_URL = `${BASE_URL}/index.php/cb-login`;

// Create a cookie jar
const jar = new CookieJar();
// Setup axios with cookie support
const client = wrapper(axios.create({ jar }));

export interface CrawlerTopic {
    url: string;
    title: string;
    date: string;
    author: string;
    category: string;
    summary?: string;
}

export interface CrawlerAuth {
    success: boolean;
    cookies?: string;
    error?: string;
}

// Map Section IDs to Names
const SECTIONS: Record<string, string> = {
    '9': 'Çevre Teknolojileri',
    '28': 'Kalite & Çevre Yönetimi',
    '34': 'Mühendislik Kaynakları'
};

// Section URLs (based on ID)
// Note: The specific URLs might need to be dynamic or we can just use the ID if the forum supports it.
// Looking at forum_source.html, links are like: /index.php/forum-76/9--cevre-muhendisligi--cevre-teknolojileri-
// But we can probably access via /index.php/forum-76/view/category/catid-9 (standard Joomla/Kunena) or just crawl the known links.
// Let's use the links found in the HTML source if possible, or construct them.
// The HTML source showed:
// Cat 9: /index.php/forum-76/9--cevre-muhendisligi--cevre-teknolojileri-
// Cat 28: /index.php/forum-76/28--cevre-muhendisligi--kalite-a-cevre-yonetim-sistemleri-
// Cat 34: /index.php/forum-76/34--cevre-muhendisligi--muhendislik-kaynaklari-

const SECTION_URLS: Record<string, string> = {
    '9': '/index.php/forum-76/9--cevre-muhendisligi--cevre-teknolojileri-',
    '28': '/index.php/forum-76/28--cevre-muhendisligi--kalite-a-cevre-yonetim-sistemleri-',
    '34': '/index.php/forum-76/34--cevre-muhendisligi--muhendislik-kaynaklari-'
};

export async function loginToForum(username: string, password: string): Promise<CrawlerAuth> {
    try {
        // 1. Get the login page to get any tokens if needed (though the form seems simple)
        // The form has a hidden field: name="2d57e54acfa3dc171a36747c5c50471e" value="1" (CSRF?)
        // We might need to fetch the page first to scrape this token.

        // Let's fetch the main page or login page first
        const initialRes = await client.get(BASE_URL);
        const $ = cheerio.load(initialRes.data);

        // Find the login form and hidden fields
        const loginForm = $('form#login-form');
        const hiddenInputs = loginForm.find('input[type="hidden"]');

        const textDecoder = new TextDecoder('iso-8859-9'); // Just in case, but axios usually handles utf8

        const params = new URLSearchParams();
        hiddenInputs.each((i, el) => {
            const name = $(el).attr('name');
            const value = $(el).attr('value');
            if (name && value) params.append(name, value);
        });

        params.append('username', username);
        params.append('passwd', password);
        params.append('remember', 'yes');
        params.append('Submit', ''); // Button

        // Post to login
        const loginRes = await client.post(LOGIN_URL, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': BASE_URL
            },
            maxRedirects: 5
        });

        // Check if login successful
        // Joomla session cookies are often random 32-char hex strings
        const cookies = await jar.getCookies(BASE_URL);
        const joomlaSessionPattern = /^[a-f0-9]{32}$/i;

        const sessionCookie = cookies.find(c =>
            c.key.includes('session') ||
            c.key.includes('joomla') ||
            joomlaSessionPattern.test(c.key)
        );

        // Also check response body for logout link to be sure
        const respBody = loginRes.data?.toString() || "";
        const isLogged = respBody.includes('Oturumu Kapat') || respBody.includes('Çıkış') || respBody.includes('Logout');

        if (!sessionCookie && !isLogged) {
            console.warn("Login failed check: No session cookie or logout link found in response.");
            return { success: false, error: 'Oturum açma başarısız (Giriş bilgilerinizi kontrol edin)' };
        }

        return {
            success: true,
            cookies: JSON.stringify(jar.toJSON())
        };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


export async function fetchTopics(serializedCookies: string | undefined): Promise<CrawlerTopic[]> {
    if (serializedCookies) {
        try {
            const cookieJson = JSON.parse(serializedCookies);
            jar.removeAllCookiesSync();
            const cookiesToSet = cookieJson.cookies || (Array.isArray(cookieJson) ? cookieJson : []);

            cookiesToSet.forEach((c: any) => {
                const cookieStr = `${c.key}=${c.value}; Domain=${c.domain || 'www.cevremuhendisligi.org'}; Path=${c.path || '/'}`;
                jar.setCookieSync(cookieStr, BASE_URL);
            });
        } catch (e) {
            console.error("Error parsing serialized cookies:", e);
        }
    }

    const allTopics: CrawlerTopic[] = [];

    // Helper to fetch a URL and return cheerio instance
    const fetchHtml = async (url: string) => {
        try {
            const res = await client.get(url, { responseType: 'arraybuffer' });
            return cheerio.load(res.data.toString('utf-8'));
        } catch (e) {
            console.error(`Error fetching ${url}:`, e);
            return null;
        }
    };

    // Recursive crawler function
    const crawlCategory = async (catUrl: string, sectionName: string) => {
        const $ = await fetchHtml(catUrl);
        if (!$) return;

        // 1. Check for Sub-Categories
        // Selector: tr.category > td.span8 > div > h3 > a
        const subCats: string[] = [];
        $('tr.category').each((i, el) => {
            // Check if this row is a wrapper for a sub-category link or a topic
            // In category_9.html, sub-categories are in tr.category.
            // In subcategory_10.html, topics are ALSO in tr.category (and tr.category-stickymsg).
            // Distinction:
            // Sub-category rows usually have "h3 > a" for title.
            // Topic rows usually have "div.krow > a.topictitle".

            const subCatLink = $(el).find('td.span8 > div > h3 > a').attr('href');
            if (subCatLink) {
                subCats.push(subCatLink.startsWith('/') ? `${BASE_URL}${subCatLink}` : subCatLink);
            }
        });

        // If we found sub-categories, recurse (BFS/DFS)
        // But usually forums are just 1 level deep here (Section -> Sub-Cat -> Topics).
        // We'll process sub-categories if found.
        if (subCats.length > 0) {
            for (const subUrl of subCats) {
                await crawlCategory(subUrl, sectionName); // Recurse
            }
            // If this page *also* has topics (mixed), we should process them too.
        }

        // 2. Process Topics on this page
        // Selector: tr.category, tr.category-stickymsg
        const topicRows = $('tr.category, tr.category-stickymsg');
        topicRows.each((i, el) => {
            const titleLink = $(el).find('div.krow > a.topictitle');
            if (titleLink.length === 0) return; // Not a topic row (might be a sub-cat row we already handled)

            const title = titleLink.text().trim();
            const url = titleLink.attr('href') || '';
            const fullUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;

            // Author Selector: div.started > span.kwho-user (or -admin)
            const authorElem = $(el).find('div.started > span[class^="kwho-"]');
            const author = authorElem.text().trim();

            // Filter
            if (author.toLowerCase().includes('cevremuhendisi')) {
                allTopics.push({
                    url: fullUrl,
                    title,
                    date: $(el).find('div.started').first().text().trim(), // Raw date text, parsed later
                    author,
                    category: sectionName
                });
            }
        });
    };

    // Parallel fetch for main Sections
    await Promise.all(
        Object.entries(SECTION_URLS).map(([id, url]) => crawlCategory(`${BASE_URL}${url}`, SECTIONS[id]))
    );

    return allTopics;
}

export async function fetchTopicContent(url: string, serializedCookies: string | undefined): Promise<{ content: string, date: string } | null> {
    if (serializedCookies) {
        try {
            const cookieJson = JSON.parse(serializedCookies);
            jar.removeAllCookiesSync();
            const cookiesToSet = cookieJson.cookies || (Array.isArray(cookieJson) ? cookieJson : []);

            cookiesToSet.forEach((c: any) => {
                const cookieStr = `${c.key}=${c.value}; Domain=${c.domain || 'www.cevremuhendisligi.org'}; Path=${c.path || '/'}`;
                jar.setCookieSync(cookieStr, BASE_URL);
            });
        } catch (e) {
            console.error("Error parsing serialized cookies:", e);
        }
    }

    try {
        const res = await client.get(url, { responseType: 'arraybuffer' });
        const html = res.data.toString('utf-8');
        const $ = cheerio.load(html);

        // Kunena Message Structure
        // div.kmsgbody -> div.kmsgtext
        // We only want the FIRST message (the topic starter).
        // Usually elements are id="kpost-message-XXXX"

        const firstMessage = $('.kmsgbody .kmsgtext').first();
        let content = firstMessage.html() || '';

        // Clean up content
        // Remove scripts, styles
        // content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");

        // Extract date of first message
        const date = $('.kmsgdate').first().text().trim() || new Date().toISOString();

        return { content, date };

    } catch (e) {
        console.error(`Error fetching topic ${url}:`, e);
        return null;
    }
}
