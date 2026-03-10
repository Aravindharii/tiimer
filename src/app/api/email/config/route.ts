import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const configPath = path.join(process.cwd(), 'src/data/emailConfig.json');

export async function GET() {
    try {
        const fileContents = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(fileContents);
        return NextResponse.json(config);
    } catch (error) {
        console.error('Error reading email config:', error);
        return NextResponse.json({ error: 'Failed to read configuration' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newConfig = await request.json();
        await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), 'utf8');
        return NextResponse.json({ success: true, message: 'Configuration updated successfully' });
    } catch (error) {
        console.error('Error updating email config:', error);
        return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
    }
}
