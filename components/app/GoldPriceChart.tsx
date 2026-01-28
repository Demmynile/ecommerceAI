"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Loader2, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Period = 7 | 30 | 90 | 365;

interface GoldPriceChartProps {
  defaultPeriod?: Period;
  currency?: string;
}

export function GoldPriceChart({
  defaultPeriod = 30,
  currency = "USD",
}: GoldPriceChartProps) {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/gold/history?days=${period}`);
        if (!response.ok) throw new Error("Failed to fetch history");

        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError("Unable to load chart data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [period]);

  const periods: { value: Period; label: string }[] = [
    { value: 7, label: "7D" },
    { value: 30, label: "1M" },
    { value: 90, label: "3M" },
    { value: 365, label: "1Y" },
  ];

  // Calculate price change
  const priceChange =
    data.length > 0
      ? ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-zinc-500" />
            <CardTitle>Gold Price History</CardTitle>
          </div>
          <div className="flex gap-1">
            {periods.map((p) => (
              <Button
                key={p.value}
                variant={period === p.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
        {!loading && !error && (
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`font-semibold ${
                priceChange >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
            <span className="text-zinc-500">over {period} days</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : error ? (
          <div className="flex h-[300px] items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={["dataMin - 50", "dataMax + 50"]}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                formatter={(value: any) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
