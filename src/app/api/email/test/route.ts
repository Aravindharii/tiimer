import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { to, subject, text } = await request.json();

        if (!to) {
            return NextResponse.json({ error: 'Recipient address required' }, { status: 400 });
        }

        // You should use environment variables for real credentials
        // process.env.SMTP_USER, process.env.SMTP_PASS
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your preferred service
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
                    ${subject || 'Test Email from Relocation App'}
                </h2>
                
                <div style="color: #334155; font-size: 16px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 30px;">
                    ${text || 'This is a test email to confirm the system works.'}
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b; font-size: 12px; margin: 0;">
                        This is an auto-generated message from your Relocation Automation System.
                    </p>
                    <p style="color: #ef4444; font-size: 12px; font-weight: bold; margin: 5px 0 0 0;">
                        PLEASE DO NOT REPLY TO THIS EMAIL – From: Odivakanna
                    </p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject: subject || 'Test Email from Relocation App',
            text: text || 'This is a test email to confirm the system works.',
            html: htmlTemplate,
        };

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("SMTP credentials are missing, logging email instead:", mailOptions);
            return NextResponse.json({ success: true, message: 'Simulated email sent successfully (check terminal) - Missing credentials in .env' });
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        return NextResponse.json({ success: true, message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Error sending test email:', error);
        // Return a descriptive error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Failed to send email: ${errorMessage}` }, { status: 500 });
    }
}
