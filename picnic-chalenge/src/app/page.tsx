"use client";
import { useEffect, useState } from "react";
import TicketDataTable from "@/components/TicketDataTable";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets));
  }, []);

  return (
    <main className="p-6 sm:p-10 mx-auto flex flex-col gap-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
      <Card className="w-full">
        <TicketDataTable tickets={tickets} />
      </Card>
    </main>
  );
}
