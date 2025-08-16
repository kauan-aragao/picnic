import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { Ticket, categorizeTicket } from "@/utils/categorize";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const from = fromStr ? new Date(fromStr) : null;
    const to = toStr ? new Date(toStr) : null;

    const dataPath = path.join(process.cwd(), "src", "data", "tickets.json");
    const fileContents = await readFile(dataPath, "utf-8");
    const parsed = JSON.parse(fileContents) as { tickets: Ticket[] };

    const filtered = parsed.tickets.filter((t) => {
      const created = new Date(t.created_at);
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });

    const counts: Record<string, number> = {};
    for (const t of filtered) {
      const cat = categorizeTicket(t);
      counts[cat.id] = (counts[cat.id] || 0) + 1;
    }

    return NextResponse.json({ counts }, { status: 200 });
  } catch (e) {
    console.error("/api/analytics/categories error", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
