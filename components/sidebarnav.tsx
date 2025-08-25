"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebarnav = () => {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Budget", href: "/budget" },
    { label: "Expenses", href: "/expenses" },
    { label: "Recurring", href: "/recurrings" },
    { label: "Categories", href: "/categories" },
  ];

  return (
    <aside className="flex justify-between w-[250px] flex-col border-r-2 border-black py-6 px-4">
      <div>
        <nav className="flex flex-col gap-7">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-sm ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebarnav;
