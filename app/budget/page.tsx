import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Page = () => {
  const budgetData = [
    {
      heading: "Monthly grociers",
      desc: "Food",
      content: "spent-remaining",
      footer: "Remaining",
      spent: 700,
      amount: 1000,
    },
    {
      heading: "Online shooping",
      desc: "Shopping",
      content: "spent-remaining",
      footer: "Remaining",
      spent: 1500,
      amount: 3000,
    },
    {
      heading: "Fuel Transport",
      desc: "Transpory",
      content: "spent-remaining",
      footer: "Remaining",
      spent: 600,
      amount: 100,
    },
  ];
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="p-6">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-3xl">Budgets</h1>
          <Button className="rounded-xl px-4 py-2 shadow-md">Add Budget</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgetData.map((data, idx) => {
            const remaining = data.amount - data.spent;
            const progress = Math.min((data.spent / data.amount) * 100, 100);

            return (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="font-bold text-2xl">
                    {data.heading}
                  </CardTitle>
                  <CardDescription>{data.desc}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Spent</span>
                        <span>Total</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>{formatCurrency(data.spent)}</span>
                        <span>{formatCurrency(data.amount)}</span>
                      </div>
                      <Progress value={progress} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Remaining</p>
                      <p
                        className={`text-2xl font-bold ${
                          remaining < 0 ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {formatCurrency(remaining)}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="justify-end">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Page;
