"use client";

import { Spinner } from "@/components/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Page = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const FetchSummary = async () => {
      try {
        const res = await axiosInstance.get("/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      } finally {
        setLoading(false);
      }
    };

    FetchSummary();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A78BFA"];

  if (loading) return <Spinner />;

  const cardData = [
    { heading: "Total Spent This Month", amount: summary.totalSpentThisMonth },
    { heading: "Total Budget", amount: summary.totalBudget },
    { heading: "Remaining Balance", amount: summary.remainingBalance },
  ];

  const chartData = [
    { name: "Spent", value: summary.totalSpentThisMonth },
    { name: "Remaining", value: summary.remainingBalance },
  ];

  return (
    <main>
      {/* Summary Cards */}
      <section className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
          {cardData.map((item, idx) => (
            <div key={idx}>
              <Card>
                <CardHeader className="font-bold text-xl">
                  {item.heading}
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl">{item.amount}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Transactions + Chart */}
      <section className="mt-20">
        <div className="flex gap-7 flex-wrap">
          {/* Recent Transactions */}
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle className="font-bold text-2xl">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary.recentTransactions?.length > 0 ? (
                <ul className="space-y-4">
                  {summary.recentTransactions.map((tx: any) => (
                    <li
                      key={tx.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {tx.description || "No description"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tx.category} • {tx.type}
                        </p>
                      </div>
                      <span
                        className={`font-semibold ${
                          tx.type === "expense"
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        ₹{tx.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No transactions found.</p>
              )}
            </CardContent>
          </Card>

          {/* Spending Overview */}
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Spending Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Page;
