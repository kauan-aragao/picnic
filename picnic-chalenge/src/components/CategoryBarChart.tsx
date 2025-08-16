"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface BarData {
  label: string;
  value: number;
}

export default function CategoryBarChart({ data }: { data: BarData[] }) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "45%", borderRadius: 4 },
    },
    xaxis: {
      categories: data.map((d) => d.label),
      labels: { rotate: -45 },
    },
    dataLabels: { enabled: false },
    yaxis: { title: { text: "Tickets" } },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} tickets`,
      },
    },
  };

  const series = [
    {
      name: "Tickets",
      data: data.map((d) => d.value),
    },
  ];

  return (
    <div className="w-full" role="img" aria-label="Bar chart of ticket count by category">
      <ReactApexChart options={{ ...options, chart: { ...options.chart, width: "100%" } }} series={series} type="bar" height={300} />
    </div>
  );
}
