import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const data = [
    { heading: "Total spent this month", amount: 2000 },
    { heading: "Total budget", amount: 25000 },
    { heading: "Remaining balance", amount: 20000 },
  ];
  return (
    <main>
      <section>
        <div className="grid grid-cols-3 gap-6 mt-7">
          {data.map((datas, idx) => (
            <div key={idx}>
              <Card>
                <CardHeader className="font-bold text-xl">
                  {datas.heading}
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl">{datas.amount}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <div className="flex">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle className="font-bold text-2xl">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Page;
