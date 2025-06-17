"use client";

import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, Spinner } from "flowbite-react";
import { Component as NavbarComponent } from "../../components/navbar";

const eventTitle = "SPOM";
const supabaseUrl = "https://myxbovlmtuhelgnlzpqt.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
  "Content-Type": "application/json",
};

interface SpomItem {
  id: number;
  nama_lengkap: string;
  cabor: string;
  kejuaraan: string;
  asal_sekolah: string;
  peringkat: string;
}

// ⛏️ External Fetchers
const fetchSpomData = async (
  search: string,
  cabor: string,
  page: number,
  perPage: number
): Promise<SpomItem[]> => {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_spom_data`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      search: search.trim() === "" ? null : search,
      cabor_filter: cabor.trim() === "" ? null : cabor,
      limit_value: perPage,
      offset_value: (page - 1) * perPage,
    }),
  });

  return res.ok ? res.json() : [];
};

const fetchSpomCount = async (
  search: string,
  cabor: string
): Promise<number> => {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_spom_count`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      search: search.trim() === "" ? null : search,
      cabor_filter: cabor.trim() === "" ? null : cabor,
    }),
  });

  const result = await res.json();
  return typeof result === "number" ? result : 0;
};

const fetchCabors = async (): Promise<string[]> => {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_spom_sports`, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });

  const result = await res.json();
  return Array.isArray(result)
    ? result.map((c: { cabor: string }) => c.cabor)
    : [];
};

// 💥 Main Component
export default function SpomView() {
  const [data, setData] = useState<SpomItem[]>([]);
  const [cabors, setCabors] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterCabor, setFilterCabor] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, count] = await Promise.all([
        fetchSpomData(search, filterCabor, currentPage, perPage),
        fetchSpomCount(search, filterCabor),
      ]);

      setData(Array.isArray(items) ? items : []);
      setTotalItems(count);
    } catch (err) {
      console.error("Load SPOM failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCabors().then(setCabors).catch(console.error);
  }, []);

  useEffect(() => {
    loadData();
  }, [search, filterCabor, currentPage, perPage]);

  return (
    <div className="min-h-screen bg-white">
      <NavbarComponent title={eventTitle} />
      <hr className="border-none h-[1px] bg-gray-800 mt-1 rounded" />

      <main className="p-8 text-gray-800">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-6">
            {/* Search Input */}
            <div className="relative w-full sm:w-1/3">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari Nama..."
                value={search}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500 font-medium shadow-sm transition"
              />
            </div>

            {/* Filter Dropdown */}
            <Dropdown
              label={filterCabor || "Semua Cabor"}
              dismissOnClick
              className="custom-dropdown text-primary-purple font-bold"
            >
              <div className="dropdown-scroll-wrapper">
                {[
                  { id: "", name: "Semua Cabor" },
                  ...cabors.map((c) => ({ id: c, name: c })),
                ].map((cabor) => (
                  <DropdownItem
                    key={cabor.id}
                    onClick={() => {
                      setCurrentPage(1);
                      setFilterCabor(cabor.id);
                    }}
                    className="dropdown-item-custom"
                  >
                    {cabor.name}
                  </DropdownItem>
                ))}
              </div>
            </Dropdown>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size="xl" />
            </div>
          ) : (
            <div className="overflow-auto rounded-md border border-gray-200 bg-white">
              <table className="w-full text-sm text-left text-gray-600 rounded-lg">
                <thead className="text-xs uppercase bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Cabor</th>
                    <th className="px-4 py-2">Kejuaraan</th>
                    <th className="px-4 py-2">Sekolah</th>
                    <th className="px-4 py-2">Medali</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-2">
                          {(currentPage - 1) * perPage + index + 1}
                        </td>
                        <td className="px-4 py-2">{item.nama_lengkap}</td>
                        <td className="px-4 py-2">{item.cabor}</td>
                        <td className="px-4 py-2">{item.kejuaraan}</td>
                        <td className="px-4 py-2">{item.asal_sekolah}</td>
                        <td className="px-4 py-2">{item.peringkat}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-4 text-gray-500"
                      >
                        Tidak ada data ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="w-full mt-6">
            {/* Custom Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Navigasi Tengah */}
              <div className="flex items-center gap-2 w-fit mx-auto">
                {/* Tombol Prev */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    currentPage === 1
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-black text-white hover:opacity-80"
                  }`}
                >
                  &#x276E;
                </button>

                {/* Input Nomor Halaman */}
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (!isNaN(page) && page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                  className="w-10 h-8 text-center border border-gray-400 rounded-lg text-black font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* Tombol Next */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-black text-white hover:opacity-80"
                  }`}
                >
                  &#x276F;
                </button>

                {/* Label */}
                <span className="text-black text-sm ml-2">
                  of {totalPages} pages
                </span>
              </div>

              {/* Items Per Page di Kanan */}
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <span>Showing</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setPerPage(Number(e.target.value));
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  {[10, 15, 25, 50].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span>items per page</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
