import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const address = typeof body?.address === "string" ? body.address.trim() : "";

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const query = new URLSearchParams({
    q: `${address}, Polska`,
    format: "jsonv2",
    limit: "1",
    countrycodes: "pl",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DostepneMiasto/1.0 (map geocoding)",
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 502 });
  }

  const results = await response.json();
  const result = results[0];

  if (!result) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  return NextResponse.json({ lat: Number(result.lat), lng: Number(result.lon) });
}