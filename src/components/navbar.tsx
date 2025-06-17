'use client';

import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, Dropdown, DropdownItem } from "flowbite-react";
import Link from "next/link";

interface NavbarProps {
  title?: string;
}

interface SpomYear {
  year: number;
}

export function Component({ title }: NavbarProps) {
  const [spomYears, setSpomYears] = useState<SpomYear[]>([]);

  useEffect(() => {
    // Fetch daftar tahun SPOM (selain 2024)
    fetch("https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/get_spom_by_year", {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSpomYears(
            data
              .filter((item) => item.year !== 2024)
              .map((item) => ({ year: item.year }))
          );
        }
      });
  }, []);

  return (
    <Navbar fluid className="!bg-transparent !text-black border-none shadow-none pt-4">
      <NavbarBrand>
        <img src="/favicon.ico" className="ml-3 mr-6 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          {title || "Dashboard"}
        </span>
      </NavbarBrand>

      <div className="ml-auto mr-4 flex items-center gap-2 relative">
        <Link
          href="/spom-2024"
          className="mr-5 text-md font-large font-semibold text-gray-600"
        >
          SPOM 2024
        </Link>
        <Dropdown
          label={<span className="text-md font-large font-semibold text-gray-600">SPOM</span>}
          inline
          dismissOnClick={true}
          className="custom-dropdown text-primary-purple font-bold"
        >
          <div className="dropdown-scroll-wrapper">
            {spomYears.length === 0 ? (
              <div className="px-4 py-2 text-gray-400 text-sm">Tidak ada tahun lain</div>
            ) : (
              spomYears.map((item) => (
          <DropdownItem
            key={item.year}
            onClick={() => window.location.href = `/spom/${item.year}`}
            className="dropdown-item-custom"
          >
            SPOM {item.year}
          </DropdownItem>
              ))
            )}
          </div>
        </Dropdown>
        <Link
          href="/"
          className="ml-3 text-md font-large font-semibold text-gray-600"
        >
          Beranda
        </Link>
      </div>
    </Navbar>
  );
}
