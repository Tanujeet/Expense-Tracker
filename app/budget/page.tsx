import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <main className="p-6">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-3xl">Budgets</h1>
          <Button className="rounded-xl px-4 py-2 shadow-md">Add Budget</Button>
        </div>
      </section>
    </main>
  );
};

export default Page;
