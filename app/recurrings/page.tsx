"use client";

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
import { useState } from "react";
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

  // use States
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [interval, setInterval] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = async () => {
    try {
    } catch (e) {}
  };

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
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="border rounded-md p-3 w-full"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Select onValueChange={setCategoryId}>
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Select onValueChange={setInterval}>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-md p-3 w-full"
                  />

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-md p-3 w-full"
                  />
                </div>
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>
                Save Expense
              </Button>
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
