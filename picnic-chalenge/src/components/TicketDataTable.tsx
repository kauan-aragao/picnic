/* eslint-disable */
// @ts-nocheck
"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { categorizeTicket } from "@/utils/categorize";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { ALL_CATEGORIES } from "@/utils/categorize";
import { format } from "date-fns";

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-300 text-black",
  low: "bg-green-500 text-white",
};

export interface Ticket {
  subject: string;
  requester: { name: string; email: string };
  created_at: string;
  category?: { id: string; en: string };
  comment?: { body: string };
  comments?: { body: string }[];
  priority: { score: number; level: string };
}

const columns: ColumnDef<Ticket>[] = [
  {
    id: "priority",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => row.priority.score,
    cell: ({ row }) => {
      const lvl = row.original.priority.level;
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[lvl]}`.trim()}>
          {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
        </span>
      );
    },
    sortingFn: (a, b) => b.original.priority.score - a.original.priority.score,
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Subject <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.subject,
  },
  {
    accessorKey: "requester",
    header: "Requester",
    cell: ({ row }) => row.original.requester.name,
    sortingFn: (a, b) =>
      (a.original.requester.name ?? "").localeCompare(b.original.requester.name ?? ""),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    sortingFn: (a, b) =>
      new Date(a.original.created_at).getTime() - new Date(b.original.created_at).getTime(),
  },
  {
    id: "category",
    header: "Category",
    accessorFn: (row) => (row.category ?? categorizeTicket(row)).en,
    cell: ({ row }) => {
      const cat = row.original.category ?? categorizeTicket(row.original);
      return (
        <span className="inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800">
          {cat.en}
        </span>
      );
    },
  },
];

interface Props {
  tickets: Ticket[];
}

export default function TicketDataTable({ tickets }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedCats, setSelectedCats] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>([]);
  const [selectedRequesters, setSelectedRequesters] = React.useState<string[]>([]);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);

  const requesterOptions = React.useMemo(() => {
    const set = new Set(tickets.map((t) => t.requester.name));
    return Array.from(set).sort().map((n) => ({ label: n, value: n }));
  }, [tickets]);

  const data = React.useMemo(() => {
    let d = tickets;
    if (selectedCats.length) {
      d = d.filter((t) => selectedCats.includes((t.category ?? categorizeTicket(t)).id));
    }
    if (selectedPriorities.length) {
      d = d.filter((t) => selectedPriorities.includes(t.priority.level));
    }
    if (selectedRequesters.length) {
      d = d.filter((t) => selectedRequesters.includes(t.requester.name));
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      d = d.filter((t) => new Date(t.created_at) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      d = d.filter((t) => new Date(t.created_at) <= to);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      d = d.filter((t) =>
        (
          t.subject +
          " " +
          t.requester.name +
          " " +
          (t.comment?.body ?? "")
        ).toLowerCase().includes(s)
      );
    }
    return d.sort((a, b) => b.priority.score - a.priority.score);
  }, [tickets, selectedCats, selectedPriorities, selectedRequesters, dateFrom, dateTo, search]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      sorting: [{ id: "priority", desc: true }],
    },
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-2">
        Showing {data.length} of {tickets.length} tickets
      </div>
      <div className="flex items-center py-4 gap-4 flex-wrap">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56"
        />
        <MultiSelect
          options={ALL_CATEGORIES.map((c) => ({ label: c.en, value: c.id }))}
          value={selectedCats}
          onChange={setSelectedCats}
          placeholder="Categories"
          className="w-56"
        />
        <MultiSelect
          options={requesterOptions}
          value={selectedRequesters}
          onChange={setSelectedRequesters}
          placeholder="Requesters"
          className="w-56"
        />
        <MultiSelect
          options={[
            { label: "Critical", value: "critical" },
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ]}
          value={selectedPriorities}
          onChange={setSelectedPriorities}
          placeholder="Priority"
          className="w-48"
        />
        <div className="flex items-center gap-1 text-sm">
          <span>From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
          <span>to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow key={row.id} onClick={() => setSelectedTicket(row.original)} className="cursor-pointer hover:bg-gray-100">
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4 flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            {[5,10,25,50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="focus:outline-none"
          >
            Previous
          </Button>
          <Button variant="outline" size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="focus:outline-none"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedTicket} onClose={() => setSelectedTicket(null)}>
        {selectedTicket && (
          <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-lg font-semibold break-words pr-4 max-w-[80%]">{selectedTicket.subject}</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none flex-shrink-0 text-2xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              <p>
                <strong>Requester:</strong> {selectedTicket.requester.name} ({selectedTicket.requester.email})
              </p>
              <p>
                <strong>Date:</strong> {format(new Date(selectedTicket.created_at), "HH:mm dd/MM/yyyy")}
              </p>
              <p>
                <strong>Category:</strong> {(selectedTicket.category ?? categorizeTicket(selectedTicket)).en}
              </p>
              <p>
                <strong>Priority:</strong> {selectedTicket.priority.level} (score {selectedTicket.priority.score.toFixed(2)})
              </p>
            </div>

            {selectedTicket.comments && selectedTicket.comments.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Comments</h3>
                {selectedTicket.comments.map((c, idx) => (
                  <div key={idx} className="border rounded-md p-2 bg-gray-50">
                    <div className="text-xs text-gray-600 mb-1">{c.author?.role ?? "user"} · {c.author?.name ?? ""}</div>
                    <pre className="whitespace-pre-wrap">
                      {c.body}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
