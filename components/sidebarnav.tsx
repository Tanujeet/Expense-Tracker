import Link from "next/link";

const Sidebarnav = () => {
  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Budget", href: "/budget" },
    { label: "Expenses", href: "/expenses" },
  ];
  return (
    <aside className="flex justify-between w-[250px] flex-col">
      <div>
        <nav className="flex flex-col gap-7">
          {links.map((link, idx) => (
            <Link key={idx} href={link.href} className="">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebarnav;
