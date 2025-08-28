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

const Page = () => {
  return (
    <main>
      <section>
        <div className="mt-10 ml-7 flex justify-between">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <Button>Add New Expense</Button>
        </div>
      </section>
    </main>
  );
};

export default Page;
