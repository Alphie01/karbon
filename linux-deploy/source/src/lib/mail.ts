import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";
import { simpleParser, ParsedMail } from "mailparser";

// We use the external server IP for both since Next.js runs locally on dev machine but needs to connect to the VPS
// In production on the same VPS, localhost would be fine, but the external IP works universally for this CRM.
const MAIL_HOST = process.env.MAIL_HOST || "mail.beyondlimitsturkiye.tech";
const MAIL_USER = process.env.MAIL_USER || "info";
const MAIL_PASS = process.env.MAIL_PASS || "Q4EQWknaAuhm26g";

// 1. SMTP Transport for Sending
export const sendEmail = async (to: string, subject: string, html: string, fromName = "Beyond Limits Türkiye") => {
    try {
        const transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: 587,
            secure: false, // TLS upgrades automatically via STARTTLS, but we can also use 25
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Test connection
        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"${fromName}" <info@beyondlimitsturkiye.tech>`,
            to,
            subject,
            html
        });

        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("Email send error:", error);
        return { success: false, error: error.message };
    }
};

export type EmailMessage = {
    uid: number;
    subject: string;
    from: string;
    date: Date;
    snippet: string;
    html: string;
    isRead: boolean;
};

// 2. IMAP Client for Reading
export const getInbox = async (limit = 20): Promise<EmailMessage[]> => {
    const client = new ImapFlow({
        host: MAIL_HOST,
        port: 143,
        secure: false, // Port 143 plain text. Dovecot is configured to allow it.
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        },
        logger: false as any,
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        const lock = await client.getMailboxLock('INBOX');
        const messages: EmailMessage[] = [];

        try {
            // Fetch the last 'limit' messages by sequence numbers
            const status = await client.status('INBOX', { messages: true });
            const total = status.messages || 0;
            if (total === 0) return [];

            const start = Math.max(1, total - limit + 1);
            const range = `${start}:*`;

            for await (const msg of client.fetch(range, { source: true, uid: true, flags: true })) {
                if (!msg.source) continue;
                const parsed: ParsedMail = await simpleParser(msg.source);
                messages.push({
                    uid: msg.uid,
                    subject: parsed.subject || "(Başlıksız)",
                    from: parsed.from?.text || "Bilinmeyen Gönderici",
                    date: parsed.date || new Date(),
                    snippet: parsed.text ? parsed.text.substring(0, 100) + "..." : "Sadece HTML içerik...",
                    html: parsed.html || parsed.textAsHtml || parsed.text || "",
                    isRead: !!msg.flags?.has('\\Seen')
                });
            }
        } finally {
            lock.release();
        }

        await client.logout();

        // Return latest emails first
        return messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("IMAP Fetch Error:", error);
        return [];
    }
};

export const markAsRead = async (uid: number) => {
    const client = new ImapFlow({
        host: MAIL_HOST,
        port: 143,
        secure: false,
        auth: { user: MAIL_USER, pass: MAIL_PASS },
        logger: false as any,
        tls: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const lock = await client.getMailboxLock('INBOX');
        try {
            await client.messageFlagsAdd({ uid }, ['\\Seen'], { uid: true });
        } finally {
            lock.release();
        }
        await client.logout();
        return { success: true };
    } catch (e) {
        return { success: false };
    }
};

export const deleteEmail = async (uid: number) => {
    const client = new ImapFlow({
        host: MAIL_HOST,
        port: 143,
        secure: false,
        auth: { user: MAIL_USER, pass: MAIL_PASS },
        logger: false as any,
        tls: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const lock = await client.getMailboxLock('INBOX');
        try {
            await client.messageFlagsAdd({ uid }, ['\\Deleted'], { uid: true });
            await client.mailboxClose(); // Expunges deleted messages
        } finally {
            lock.release();
        }
        await client.logout();
        return { success: true };
    } catch (e) {
        return { success: false };
    }
};
