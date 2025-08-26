"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type DialogMode = "add" | "edit" | null;

const budgetSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Budget name must be at least 3 characters." }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  spent: z.coerce.number().min(0).optional(), // Not in form, but part of data
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Page = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>(null);

  const budgetData = [
    {
      heading: "Monthly groceries",
      desc: "Food",
      spent: 700,
      amount: 1000,
    },
    {
      heading: "Online shopping",
      desc: "Shopping",
      spent: 1500,
      amount: 3000,
    },
    {
      heading: "Fuel Transport",
      desc: "Transport",
      spent: 600,
      amount: 100,
    },
  ];

  const handleOpen = (type: DialogMode) => {
    setMode(type);
    setOpen(true);
  };

  function onSubmit(values: z.infer<typeof budgetSchema>) {
    console.log("Form Submitted:", values);
    setOpen(false);
  }

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-3xl">Budgets</h1>
        <Button
          className="rounded-xl px-4 py-2 shadow-md"
          onClick={() => handleOpen("add")}
        >
          Add Budget
        </Button>
      </div>

      {/* Budget Cards */}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpen("edit")}
                >
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

      {/* Dialog Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Budget" : "Edit Budget"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Create a new budget to track your spending."
                : "Make changes to your existing budget."}
            </DialogDescription>
          </DialogHeader>

          <BudgetForm onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    </main>
  );
};

function BudgetForm({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof budgetSchema>) => void;
}) {
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Budget Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g Monthly Expense" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default Page;
