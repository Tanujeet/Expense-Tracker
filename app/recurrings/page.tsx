import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      status: "Active",
    },
    {
      Title: "Rent",
      Interval: "Month",
      Amount: "20,000",
      date: "17/06",
      status: "Active",
    },
  ];

  return (
    <main>
      <section>
        <div className="mt-10 ml-7 flex justify-between">
          <h1 className="text-3xl  font-bold ">Recurring Expenses</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>New Recurring Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Recurring Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your recurring expense below.
                </DialogDescription>
              </DialogHeader>

              {/* {form} */}
              <div className="space-y-4">
                {/* Amount & Category */}
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="border rounded-md p-3 w-full"
                  />
                  <Select>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description & Interval */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Description"
                    className="border rounded-md p-3 w-full"
                  />
                  <Select>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div className="flex gap-4">
                  <input
                    type="date"
                    className="border rounded-md p-3 w-full"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    className="border rounded-md p-3 w-full"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
