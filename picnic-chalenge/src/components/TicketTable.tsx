"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useMemo } from "react";
import { categorizeTicket } from "@/utils/categorize";

export interface Ticket {
  subject: string;
  requester: { name: string; email: string };
  created_at: string;
  comment?: { body: string };
  comments?: { body: string }[];
  category?: { id: string; en: string };
}

interface Props {
  tickets: Ticket[];
  filterIds: string[];
}

export default function TicketTable({ tickets, filterIds }: Props) {
  const rows = useMemo(() => {
    const sorted = [...tickets].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    if (filterIds.length === 0) return sorted;
    return sorted.filter((t) => filterIds.includes((t.category ?? categorizeTicket(t)).id));
  }, [tickets, filterIds]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((ticket, idx) => {
          const cat = ticket.category ?? categorizeTicket(ticket);
          return (
            <TableRow key={idx}>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.requester.name}</TableCell>
              <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{cat.en}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
