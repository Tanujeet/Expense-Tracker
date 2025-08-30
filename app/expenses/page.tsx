import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const Page = () => {
  const expensesData = [
    {
      date: "2025-08-28",
      category: { name: "Groceries", color: "#10b981" },
      description: "Weekly groceries run",
      amount: -2150.5,
    },
    {
      date: "2025-08-27",
      category: { name: "Salary", color: "#22c55e" },
      description: "Monthly paycheck",
      amount: 150000.0,
    },
    {
      date: "2025-08-27",
      category: { name: "Transport", color: "#f59e0b" },
      description: "Ride sharing service to airport",
      amount: -1250.0,
    },
    {
      date: "2025-08-26",
      category: { name: "Dining Out", color: "#ef4444" },
      description: "Dinner with friends at The Place",
      amount: -3200.0,
    },
    {
      date: "2025-08-25",
      category: { name: "Utilities", color: "#3b82f6" },
      description: "Electricity & Water Bill",
      amount: -4500.25,
    },
    {
      date: "2025-08-24",
      category: { name: "Shopping", color: "#8b5cf6" },
      description: "New running shoes",
      amount: -7800.0,
    },
  ];

  const transactionData = [
    { heading: "This Month", amount: "42,000" },
    { heading: "Transactions", amount: "128" },
  ];

  return (
    <main>
      <section>
        <div className="mt-10 ml-7 flex justify-between p-3">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <Button>New Expense</Button>
        </div>
      </section>
      <section>
        <div className="p-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            {expensesData.map((datas, idx) => (
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{datas.date}</TableCell>
                  <TableCell>{datas.category.name}</TableCell>
                  <TableCell>{datas.description}</TableCell>
                  <TableCell className="text-right">{datas.amount}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-10 w-[900px]">
          {transactionData.map((trans, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="font-black text-3xl">
                  {trans.heading}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl">{trans.amount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page;
