import { ColumnDef } from "@tanstack/react-table";
import { Ticket } from "@/components/TicketTable";
import { categorizeTicket } from "@/utils/categorize";

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.subject,
  },
  {
    accessorKey: "requester",
    header: "Requester",
    cell: ({ row }) => row.original.requester.name,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const cat = row.original.category ?? categorizeTicket(row.original);
      return cat.en;
    },
  },
];
