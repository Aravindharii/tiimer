import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const flightIata = searchParams.get("flight_iata");

    if (!flightIata) {
        return NextResponse.json({ error: "flight_iata required" }, { status: 400 });
    }

    const url = `https://aerodatabox.p.rapidapi.com/flights/iata/${flightIata}`;

    try {
        const res = await fetch(url, {
            headers: {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Flight not found or not active yet." },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ data: Array.isArray(data) ? data : [data] });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch flight data" },
            { status: 500 }
        );
    }
}
