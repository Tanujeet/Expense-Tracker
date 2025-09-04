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
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
const Page = () => {
  // use States
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [interval, setInterval] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recurringExpenses, setRecurringExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // Api Calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/recurring");
        setRecurringExpenses(res.data);
      } catch (e) {
        console.error("Failed to fetch recurring expenses", e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data); // ✅ directly categories array set kar
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };
    loadCategories();
  }, []);

  const handleSave = async () => {
    try {
      const res = await axiosInstance.post("/recurring", {
        amount: parseFloat(amount),
        categoryId,
        description,
        interval,
        startDate,
        endDate: endDate || null,
      });
      console.log("✅ Saved:", res.data);

      setRecurringExpenses((prev) => [...prev, res.data]);
      setAmount("");
      setCategoryId("");
      setDescription("");
      setInterval("");
      setStartDate("");
      setEndDate("");

      setOpen(false);
    } catch (e) {
      console.error("❌ Error saving expense:", e);
    }
  };

  return (
    <main>
      <section>
        <div className="mt-10 ml-7 flex justify-between">
          <h1 className="text-3xl  font-bold ">Recurring Expenses</h1>
          <Dialog open={open} onOpenChange={setOpen}>
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
                  <Select onValueChange={setCategoryId} value={categoryId}>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
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
          {recurringExpenses.map((datas, idx) => (
            <Card
              key={idx}
              className="hover:text-white hover:bg-black hover:scale-102 hover:transition-all"
            >
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {datas.description || datas.category?.name}
                  </CardTitle>
                  <CardDescription>{datas.interval}</CardDescription>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <p className="font-semibold">₹{datas.amount}</p>
                  <p className="text-muted-foreground">
                    {new Date(datas.startDate).toLocaleDateString()}
                  </p>
                  <p className="font-medium text-green-600">Active</p>
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
