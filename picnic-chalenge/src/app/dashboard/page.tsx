"use client";
import { useEffect, useState } from "react";
import CategoryBarChart, { BarData } from "@/components/CategoryBarChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import { ALL_CATEGORIES } from "@/utils/categorize";

export default function DashboardPage() {
  const [data, setData] = useState<BarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    setLoading(true);
    fetch(`/api/analytics/categories?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        const entries = Object.entries(res.counts) as [string, number][];
        const transformed: BarData[] = entries
          .map(([id, count]) => {
            const cat = ALL_CATEGORIES.find((c) => c.id === id);
            return { label: cat?.en ?? id, value: count };
          })
          .sort((a, b) => b.value - a.value);
        setData(transformed);
        setLoading(false);
      });
  }, [from, to]);

  return (
    <main className="p-6 sm:p-10 max-w-5xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tickets by Category</h1>

      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex flex-col text-sm">
          <label>From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex flex-col text-sm">
          <label>To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1" />
        </div>
      </div>

      {!loading && data.length ? (
        <>
          <CategoryBarChart data={data} />
          <CategoryPieChart data={data} />

          <table className="mt-6 w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-right">Count</th>
                <th className="p-2 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => {
                const total = data.reduce((acc, x) => acc + x.value, 0);
                const pct = ((d.value / total) * 100).toFixed(1);
                return (
                  <tr key={d.label} className="border-t">
                    <td className="p-2">{d.label}</td>
                    <td className="p-2 text-right">{d.value}</td>
                    <td className="p-2 text-right">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : loading ? (
        <p>Loading…</p>
      ) : (
        <p className="mt-6 text-gray-600">No tickets for selected date range.</p>
      )}
    </main>
  );
}
