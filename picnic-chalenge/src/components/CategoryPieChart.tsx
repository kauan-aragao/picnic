"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { BarData } from "./CategoryBarChart";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CategoryPieChart({ data }: { data: BarData[] }) {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 320,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    labels: data.map((d) => d.label),
    legend: { position: "bottom" },
    dataLabels: {
      formatter: (percent: number) => `${percent.toFixed(1)}%`,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} tickets`,
      },
    },
  };

  const series = data.map((d) => d.value);

  return (
    <div className="w-full max-w-md mx-auto" role="img" aria-label="Donut chart of ticket percentage by category">
      <ReactApexChart options={{ ...options, chart: { ...options.chart, width: "100%" } }} series={series} type="donut" height={320} />
    </div>
  );
}
