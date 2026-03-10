"use client";

import { useEffect, useState } from 'react';

type EmailConfig = {
    id: number;
    date: string;
    subject: string;
    body: string;
    sent: boolean;
};

type ConfigData = {
    recipientEmail: string;
    emails: EmailConfig[];
};

export default function RelocationDashboard() {
    const [config, setConfig] = useState<ConfigData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/email/config');
            const data = await res.json();
            setConfig(data);
        } catch (error) {
            console.error('Failed to fetch config', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/email/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Configuration saved successfully!');
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('Error saving configuration.');
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        if (!config?.recipientEmail) {
            setMessage('Please set a recipient email first and save.');
            return;
        }
        setTesting(true);
        setMessage('');
        try {
            const res = await fetch('/api/email/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: config.recipientEmail,
                    subject: 'Test Email: Relocation Automation Works',
                    text: 'This is a test to verify your automation setup is functioning.'
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message || 'Test email sent!');
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('Error sending test email.');
        } finally {
            setTesting(false);
        }
    };

    const updateEmail = (index: number, field: keyof EmailConfig, value: string) => {
        if (!config) return;
        const newEmails = [...config.emails];
        newEmails[index] = { ...newEmails[index], [field]: value };
        setConfig({ ...config, emails: newEmails });
    };

    if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

    if (!config) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Failed to load config.</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        Relocation Reminders automation
                    </h1>
                    <p className="mt-2 text-slate-400">Manage automated emails before your travel date.</p>
                </div>

                {message && (
                    <div className="p-4 rounded-md bg-slate-800 border border-slate-700 text-sm">
                        {message}
                    </div>
                )}

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 text-white">General Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Recipient Email</label>
                            <input
                                type="email"
                                value={config.recipientEmail}
                                onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
                                className="w-full bg-slate-800 border-slate-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white px-3 py-2 border outline-none"
                                placeholder="e.g., you@example.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Scheduled Emails</h2>
                    {config.emails.map((email, index) => (
                        <div key={email.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                            {email.sent && (
                                <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-bl-lg font-medium border-b border-l border-green-500/20">
                                    Status: Sent
                                </div>
                            )}
                            <h3 className="text-lg font-medium text-white mb-4">Email {index + 1}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Send Date</label>
                                    <input
                                        type="date"
                                        value={email.date}
                                        onChange={(e) => updateEmail(index, 'date', e.target.value)}
                                        className="w-full sm:w-auto bg-slate-800 border-slate-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white px-3 py-2 border outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={email.subject}
                                        onChange={(e) => updateEmail(index, 'subject', e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white px-3 py-2 border outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Body</label>
                                    <textarea
                                        rows={6}
                                        value={email.body}
                                        onChange={(e) => updateEmail(index, 'body', e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white px-3 py-2 border outline-none font-sans"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                    <button
                        onClick={handleTestEmail}
                        disabled={testing}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                        {testing ? 'Sending...' : 'Send Test Email'}
                    </button>
                </div>
            </div>
        </div>
    );
}
