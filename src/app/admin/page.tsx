"use client";
import React from "react";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";

const AdminLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <AdminNavbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">Admin Dashboard</h1>
          <p className="mb-8 text-gray-600">
            Selamat datang di halaman admin. Silakan pilih menu di bawah untuk mengelola data.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/admin/events"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Kelola Event
            </Link>
            <Link
              href="/admin/spom"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Kelola SPOM
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLandingPage;