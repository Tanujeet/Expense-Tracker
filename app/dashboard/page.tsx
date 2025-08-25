"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Page = () => {
  const data = [
    { heading: "Total spent this month", amount: 2000 },
    { heading: "Total budget", amount: 25000 },
    { heading: "Remaining balance", amount: 20000 },
  ];
  const datas = [
    { name: "Food", value: 400 },
    { name: "Rent", value: 300 },
    { name: "Shopping", value: 300 },
    { name: "Transport", value: 200 },
    { name: "Entertainment", value: 100 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A78BFA"];
  return (
    <main>
      <section className="mt-10">
        <div className="grid grid-cols-3 gap-6 mt-7">
          {data.map((datas, idx) => (
            <div key={idx}>
              <Card>
                <CardHeader className="font-bold text-xl">
                  {datas.heading}
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl">{datas.amount}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-20">
        <div className="flex gap-7">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle className="font-bold text-2xl">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
          </Card>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datas} // ✅ chart ka sahi dataset
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datas.map((entry, index) => (
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
