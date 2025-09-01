"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axios";

const Page = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const transactionData = [
    { heading: "This Month", amount: "42,000" },
    { heading: "Transactions", amount: "128" },
  ];

  // Backend Api Calls //
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

  useEffect(() => {
    const getExpense = async () => {
      try {
        const res = await axiosInstance.get("/expenses");
        setExpenses(res.data);
      } catch (e) {
        console.error("Failed to fetch expenses", e);
      } finally {
        setLoading(false);
      }
    };
    getExpense();
  }, []);

  // 🔹 Form State
  const [newExpense, setNewExpense] = useState({
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  // 🔹 Submit Handler
  const handleAddExpense = async () => {
    if (
      !newExpense.date ||
      !newExpense.category ||
      !newExpense.description ||
      !newExpense.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axiosInstance.post("/expenses", {
        date: newExpense.date,
        categoryId: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
      });

      setExpenses([res.data, ...expenses]);
      setNewExpense({ date: "", category: "", description: "", amount: "" });
      setOpen(false);
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  return (
    <main>
      <section>
        <div className="mt-10 ml-7 flex justify-between p-3">
          <h1 className="text-3xl font-bold">Expenses</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>New Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Fill in the details of your expense below.
                </DialogDescription>
              </DialogHeader>

              {/* Expense Form */}
              <div className="flex flex-col gap-4 mt-4">
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="border rounded-md p-2"
                />
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="border rounded-md p-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="border rounded-md p-2"
                />
                <textarea
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  className="border rounded-md p-2"
                />
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section>
        <div className="p-10">
          <Table className="w-full border border-gray-300 rounded-xl text-base overflow-hidden">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[120px] p-3 font-semibold text-gray-700">
                  Date
                </TableHead>
                <TableHead className="p-3 font-semibold text-gray-700">
                  Category
                </TableHead>
                <TableHead className="p-3 font-semibold text-gray-700">
                  Description
                </TableHead>
                <TableHead className="p-3 font-semibold text-gray-700 text-right">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {expenses.map((datas, idx) => (
                <TableRow
                  key={idx}
                  className="transition-all duration-300 cursor-pointer hover:bg-black hover:[&>*]:text-white"
                >
                  <TableCell className="p-3 font-medium text-gray-800">
                    {new Date(datas.date).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell className="p-3">
                    <span
                      className="px-2 py-1 rounded-md text-white text-sm font-medium"
                      style={{
                        backgroundColor: datas.category?.color || "#3b82f6",
                      }}
                    >
                      {datas.category?.name}
                    </span>
                  </TableCell>
                  <TableCell className="p-3 text-gray-700">
                    {datas.description}
                  </TableCell>
                  <TableCell
                    className={`p-3 text-right font-semibold ${
                      datas.amount < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {datas.amount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-10 lg:w-[900px] lg:ml-10 2xl:w-[1500px] 2xl:ml-10 ">
          {transactionData.map((trans, idx) => (
            <Card
              key={idx}
              className="transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer hover:bg-black hover:text-white"
            >
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
