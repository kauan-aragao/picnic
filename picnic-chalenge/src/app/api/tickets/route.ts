import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { Ticket, categorizeTicket } from "@/utils/categorize";
import { priorityScore } from "@/utils/priority";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "src", "data", "tickets.json");
    const fileContents = await readFile(dataPath, "utf-8");

    const parsed = JSON.parse(fileContents) as { tickets?: Ticket[] };
    if (!parsed.tickets) {
      return NextResponse.json(
        { error: "Malformed ticket data: 'tickets' array missing" },
        { status: 500 }
      );
    }

    const withCategory = parsed.tickets.map((ticket) => ({
      ...ticket,
      category: categorizeTicket(ticket),
    }));

    const withPriority = withCategory.map((t) => ({
      ...t,
      priority: priorityScore(t, withCategory),
    }));

    return NextResponse.json({ tickets: withPriority }, { status: 200 });
  } catch (error) {
    console.error("[API] Failed to load tickets", error);
    return NextResponse.json({ error: "Failed to load tickets" }, { status: 500 });
  }
}
