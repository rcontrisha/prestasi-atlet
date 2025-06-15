'use client';

import React from "react";
import { Navbar, NavbarBrand } from "flowbite-react";
import Link from "next/link";

interface NavbarProps {
  title?: string;
}

export function Component({ title }: NavbarProps) {
  return (
    <Navbar fluid className="!bg-transparent !text-black border-none shadow-none pt-4">
      <NavbarBrand>
        <img src="/favicon.ico" className="ml-3 mr-6 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          {title || "Dashboard"}
        </span>
      </NavbarBrand>

      <div className="ml-auto mr-4">
        <Link href="/spom" className="mr-5 text-md font-large font-semibold text-gray-600">
          SPOM 2024
        </Link>
        <Link href="/" className="text-md font-large font-semibold text-gray-600">
          Beranda
        </Link>
      </div>
    </Navbar>
  );
}
