import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  const params = await context.params;
  const { code } = params;

  try {
    const links = await sql`
      SELECT id, code, url, created_at, clicks, last_clicked_at
      FROM links
      WHERE code = ${code}
    `;

    if (links.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(links[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  const params = await context.params;
  const { code } = params;

  try {
    const result = await sql`
      DELETE FROM links
      WHERE code = ${code}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  const params = await context.params;
  const { code } = params;

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "click") {
      const result = await sql`
        UPDATE links
        SET clicks = clicks + 1, last_clicked_at = NOW()
        WHERE code = ${code}
        RETURNING id
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: "Link not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Click recorded" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
