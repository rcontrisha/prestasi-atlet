"use client";

import React from "react";
import { Navbar, NavbarBrand } from "flowbite-react";
import Link from "next/link";

const AdminNavbar: React.FC = () => (
  <Navbar
    fluid
    className="!bg-white !text-black border-b border-gray-100 shadow-sm pt-4 mb-8"
  >
    <NavbarBrand>
      <img src="/favicon.ico" className="ml-3 mr-6 h-6 sm:h-9" alt="Logo" />
      <span className="self-center whitespace-nowrap text-xl font-bold text-gray-700">
        Admin Dashboard
      </span>
    </NavbarBrand>
    <div className="ml-auto mr-4 flex gap-6 items-center">
      <Link
        href="/admin/events"
        className="text-md font-semibold text-gray-700 hover:text-purple-800 transition"
      >
        Event
      </Link>
      <Link
        href="/admin/spom"
        className="text-md font-semibold text-gray-700 hover:text-purple-800 transition"
      >
        SPOM
      </Link>
      <Link
        href="/admin"
        className="text-md font-semibold text-gray-700 hover:text-purple-800 transition"
      >
        Beranda
      </Link>
    </div>
  </Navbar>
);

export default AdminNavbar;