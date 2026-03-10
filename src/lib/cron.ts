import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

const configPath = path.join(process.cwd(), 'src/data/emailConfig.json');

async function checkAndSendEmails() {
    console.log('[Cron] Checking for scheduled emails...', new Date().toISOString());
    try {
        const fileContents = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(fileContents);
        const { recipientEmail, emails } = config;

        if (!recipientEmail) {
            console.log('[Cron] No recipient email configured.');
            return;
        }

        const todayDateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let updated = false;

        for (const email of emails) {
            if (email.date === todayDateStr && !email.sent) {
                console.log(`[Cron] Found scheduled email to send today: "${email.subject}"`);
                await sendScheduledEmail(recipientEmail, email.subject, email.body);
                email.sent = true;
                updated = true;
            }
        }

        if (updated) {
            await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
            console.log('[Cron] Config updated with sent status.');
        }

    } catch (error) {
        console.error('[Cron Error] Failed to process scheduled emails:', error);
    }
}

async function sendScheduledEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred service
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER || '"Relocation Admin" <noreply@example.com>',
        to,
        subject,
        text,
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("[Cron] SMTP credentials missing. Simulating email send:", mailOptions);
        return;
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('[Cron] Scheduled Email sent: ' + info.response);
    } catch (error) {
        console.error('[Cron] Error sending scheduled email:', error);
    }
}


export function startCronJobs() {
    console.log('[Cron] Initializing cron job to run daily at 9:00 AM...');
    // Run at 09:00 AM every day
    // For testing, you could use '* * * * *' to run every minute
    cron.schedule('0 9 * * *', checkAndSendEmails);
}
