import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { generateCode, isValidUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { url, code } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let shortCode = code;
    if (!shortCode) {
      shortCode = generateCode();
    }

    // Check if code is valid length
    if (
      shortCode.length < 6 ||
      shortCode.length > 8 ||
      !/^[A-Za-z0-9]+$/.test(shortCode)
    ) {
      return NextResponse.json(
        { error: "Code must be 6-8 alphanumeric characters" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await sql`SELECT id FROM links WHERE code = ${shortCode}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }

    // Insert new link
    const result = await sql`
      INSERT INTO links (code, url)
      VALUES (${shortCode}, ${url})
      RETURNING id, code, url, created_at, clicks, last_clicked_at
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const links = await sql`
      SELECT id, code, url, created_at, clicks, last_clicked_at
      FROM links
      ORDER BY created_at DESC
    `;
    return NextResponse.json(links);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
