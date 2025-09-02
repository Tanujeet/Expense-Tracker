import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const recurringExpenseData = [
    {
      Title: "Rent",
      Interval: "Month",
      Amount: "20,000",
      date: "17/06",
      status: "Active",
    },
    {
      Title: "Rent",
      Interval: "Month",
      Amount: "20,000",
      date: "17/06",
      status: "Actove",
    },
    {
      Title: "Rent",
      Interval: "Month",
      Amount: "20,000",
      date: "17/06",
      status: "Actove",
    },
  ];

  return (
    <main>
      <section>
        <div className="mt-10 ml-7 flex justify-between">
          <h1 className="text-3xl  font-bold ">Recurring Expenses</h1>
          <Button>New Recurring Expense</Button>
        </div>
        <div className="mt-6 space-y-3">
          {recurringExpenseData.map((datas, idx) => (
            <Card
              key={idx}
              className="hover:text-white hover:bg-black hover:scale-102 hover:transition-all 2s"
            >
              <CardHeader className="flex justify-between items-center">
                {/* Left side */}
                <div>
                  <CardTitle>{datas.Title}</CardTitle>
                  <CardDescription>{datas.Interval}</CardDescription>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 text-sm">
                  <p className="font-semibold">₹{datas.Amount}</p>
                  <p className="text-muted-foreground">{datas.date}</p>
                  <p
                    className={`font-medium ${
                      datas.status === "Paid"
                        ? "text-green-600"
                        : datas.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {datas.status}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page;
