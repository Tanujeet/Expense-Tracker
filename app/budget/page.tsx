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
import { axiosInstance } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type DialogMode = "add" | "edit" | null;

type Budget = {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
};

const budgetSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Budget name must be at least 3 characters." }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  spent: z.coerce.number().min(0).optional(),
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
  const queryClient = useQueryClient();

  // ✅ Budgets
  const { data: budgets } = useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const res = await axiosInstance.get("/budgets");
      return res.data.map((b: any) => ({
        id: b.id,
        name: b.name,
        amount: b.limit, // backend field -> frontend field
        spent: b.spent ?? 0,
        category: b.category?.name ?? "",
      }));
    },
  });

  // ✅ Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return res.data;
    },
  });

  // ✅ Add Budget mutation
  const addBudgetMutation = useMutation({
    mutationFn: async (newBudget: z.infer<typeof budgetSchema>) => {
      const res = await axiosInstance.post("/budgets", {
        categoryId: newBudget.category, // 👈 this is id
        limit: newBudget.amount, // backend expects limit
        startDate: new Date(),
        endDate: new Date(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setOpen(false);
    },
  });

  const handleOpen = (type: DialogMode) => {
    setMode(type);
    setOpen(true);
  };

  function onSubmit(values: z.infer<typeof budgetSchema>) {
    addBudgetMutation.mutate({
      name: values.name,
      amount: values.amount,
      category: values.category, // 👈 id
      spent: values.spent ?? 0,
    });
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
        {budgets?.map((budget, idx) => {
          const remaining = budget.amount - budget.spent;
          const progress = Math.min((budget.spent / budget.amount) * 100, 100);

          return (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  {budget.name}
                </CardTitle>
                <CardDescription>{budget.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Spent</span>
                      <span>Total</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>{formatCurrency(budget.spent)}</span>
                      <span>{formatCurrency(budget.amount)}</span>
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

          <BudgetForm onSubmit={onSubmit} categories={categories ?? []} />
        </DialogContent>
      </Dialog>
    </main>
  );
};

function BudgetForm({
  onSubmit,
  categories,
}: {
  onSubmit: (values: z.infer<typeof budgetSchema>) => void;
  categories: any[];
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
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default Page;
