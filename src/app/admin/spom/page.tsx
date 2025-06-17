"use client";
import React, { useEffect, useState, useRef } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { useRouter } from "next/navigation";

interface SpomItem {
  year: number;
  jumlah_peserta: number;
}

const API_RPC_URL = "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/get_spom_by_year";
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const insertSpom = async (payload: {
  _asal_sekolah: string;
  _cabor: string;
  _kejuaraan: string;
  _nama_lengkap: string;
  _nisn: number;
  _nomor_kejuaraan: string;
  _peringkat: string;
  _tempat: string;
  _tingkatan: string;
  _waktu: string; // ISO date string
  _year: number;
}) => {
  const res = await fetch(
    "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/insert_spom",
    {
      method: "POST",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Gagal menambah data SPOM");
};

const AdminSpomPage = () => {
  const [spomList, setSpomList] = useState<SpomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    year: "",
    nomor_kejuaraan: "",
    cabor: "",
    nama_lengkap: "",
    asal_sekolah: "",
    nisn: "",
    kejuaraan: "",
    tingkatan: "",
    tempat: "",
    waktu: "",
    peringkat: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchSpom = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_RPC_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setSpomList(Array.isArray(data) ? data : []);
    } catch {
      setSpomList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpom();
  }, []);

  // Autofocus input saat modal muncul
  useEffect(() => {
    if (showAdd && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showAdd]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (
      !form.year ||
      !form.nomor_kejuaraan ||
      !form.cabor ||
      !form.nama_lengkap ||
      !form.asal_sekolah ||
      !form.nisn ||
      !form.kejuaraan ||
      !form.tingkatan ||
      !form.tempat ||
      !form.waktu ||
      !form.peringkat
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
    setAdding(true);
    try {
      await insertSpom({
        _asal_sekolah: form.asal_sekolah,
        _cabor: form.cabor,
        _kejuaraan: form.kejuaraan,
        _nama_lengkap: form.nama_lengkap,
        _nisn: Number(form.nisn),
        _nomor_kejuaraan: form.nomor_kejuaraan,
        _peringkat: form.peringkat,
        _tempat: form.tempat,
        _tingkatan: form.tingkatan,
        _waktu: form.waktu,
        _year: Number(form.year),
      });
      setShowAdd(false);
      setForm({
        year: "",
        nomor_kejuaraan: "",
        cabor: "",
        nama_lengkap: "",
        asal_sekolah: "",
        nisn: "",
        kejuaraan: "",
        tingkatan: "",
        tempat: "",
        waktu: "",
        peringkat: "",
      });
      // Redirect ke halaman detail tahun yang baru diinput
      router.push(`/admin/spom/${form.year}`);
    } catch {
      alert("Gagal menambah data SPOM");
    }
    setAdding(false);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Daftar SPOM</h1>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
            onClick={() => setShowAdd(true)}
          >
            Tambah Data
          </button>
        </div>

        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2">Tahun</th>
              <th className="px-4 py-2">Jumlah Peserta</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            ) : spomList.length > 0 ? (
              spomList.map((spom) => (
                <tr key={spom.year} className="border-t">
                  <td className="px-4 py-2 font-semibold text-gray-700">{spom.year}</td>
                  <td className="px-4 py-2 text-center text-purple-600 font-bold">{spom.jumlah_peserta}</td>
                  <td className="px-4 py-2 text-center">
                    <a
                      href={`/admin/spom/${spom.year}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold"
                    >
                      Lihat Detail
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">Tidak ada data SPOM.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Data */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowAdd(false)}
              aria-label="Tutup"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-purple-700 text-center">
              Tambah Data SPOM
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <input
                ref={inputRef}
                type="number"
                name="year"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Tahun"
                value={form.year}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="nomor_kejuaraan"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Nomor Kejuaraan"
                value={form.nomor_kejuaraan}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="cabor"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Cabang Olahraga"
                value={form.cabor}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="nama_lengkap"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Nama Lengkap"
                value={form.nama_lengkap}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="asal_sekolah"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Asal Sekolah"
                value={form.asal_sekolah}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="number"
                name="nisn"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="NISN"
                value={form.nisn}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="kejuaraan"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Kejuaraan"
                value={form.kejuaraan}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="tingkatan"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Tingkatan"
                value={form.tingkatan}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="tempat"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Tempat"
                value={form.tempat}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="date"
                name="waktu"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Waktu"
                value={form.waktu}
                onChange={handleChange}
                disabled={adding}
              />
              <input
                type="text"
                name="peringkat"
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                placeholder="Medali"
                value={form.peringkat}
                onChange={handleChange}
                disabled={adding}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                disabled={adding}
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 font-bold"
                disabled={adding}
              >
                {adding ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpomPage;