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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

// ------------------ Types ------------------
type Budget = {
  id: string;
  name: string;
  limit: number;
  category: { id: string; name: string };
  amount: number;
  spent: number;
};

type DialogMode = "add" | "edit";

// ------------------ Zod Schema ------------------
const budgetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  spent: z.coerce.number().min(0).default(0),
});

// ------------------ Main Component ------------------
export default function BudgetDashboard() {
  const queryClient = useQueryClient();

  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const res = await axiosInstance.get("/budgets");
      return res.data;
    },
  });

  const { data: categories } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return res.data;
    },
  });

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // ------------------ Mutations ------------------
  const saveBudgetMutation = useMutation({
    mutationFn: async (budget: z.infer<typeof budgetSchema>) => {
      if (budget.id) {
        // Edit (PUT)
        return axiosInstance.put(`/budgets/${budget.id}`, {
          name: budget.name,
          limit: budget.amount,
          categoryId: budget.category,
        });
      } else {
        // Add (POST)
        return axiosInstance.post("/budgets", {
          name: budget.name,
          limit: budget.amount,
          categoryId: budget.category,
          startDate: new Date(),
          endDate: new Date(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });

      setOpen(false);
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  // ------------------ Handlers ------------------
  const handleOpen = (type: DialogMode, budget?: Budget) => {
    setMode(type);
    if (type === "edit" && budget) {
      setSelectedBudget(budget);
    } else {
      setSelectedBudget(null);
    }
    setOpen(true);
  };

  const onSubmit = (values: z.infer<typeof budgetSchema>) => {
    saveBudgetMutation.mutate(values);
  };

  if (isLoading) return <div>Loading budgets...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button onClick={() => handleOpen("add")}>+ Add Budget</Button>
      </div>

      {/* Budget List */}
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
                <CardDescription>{budget.category.name}</CardDescription>
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
                  onClick={() => handleOpen("edit", budget)}
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => deleteBudgetMutation.mutate(budget.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Budget" : "Edit Budget"}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm
            onSubmit={onSubmit}
            categories={categories ?? []}
            budget={selectedBudget}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ------------------ Budget Form ------------------
function BudgetForm({
  onSubmit,
  categories,
  budget,
}: {
  onSubmit: (values: z.infer<typeof budgetSchema>) => void;
  categories: { id: string; name: string }[];
  budget: Budget | null;
}) {
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
    },
  });

  // reset form when budget (edit mode) changes
  useEffect(() => {
    if (budget) {
      form.reset({
        id: budget.id,
        name: budget.name,
        amount: budget.limit,
        category: budget.category.id,
        spent: budget.spent,
      });
    } else {
      form.reset({
        name: "",
        amount: 0,
        category: "",
        spent: 0,
      });
    }
  }, [budget, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monthly Groceries" {...field} />
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
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Budget
        </Button>
      </form>
    </Form>
  );
}

// ------------------ Utils ------------------
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
