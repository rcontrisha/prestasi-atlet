"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

interface MedalStat {
  id: number;
  medal_type: string;
  target: number;
  earned: number;
}

const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const BASE_URL = "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1";

const fetchMedalStats = async (
  eventId: number,
  sportId: number
): Promise<MedalStat[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/rpc/get_medal_stats_by_event_sport`,
      {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id_input: eventId,
          sport_id_input: sportId,
        }),
      }
    );
    if (!res.ok) throw new Error("Gagal mengambil data medali");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const fetchEventInfoAndCabor = async (
  eventId: number,
  caborId: number
): Promise<{ eventName: string; year?: number; caborName: string }> => {
  try {
    // Fetch event info
    const eventRes = await fetch(
      `${BASE_URL}/events?id=eq.${eventId}&select=name,year`,
      {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    const eventData = await eventRes.json();
    const eventName =
      Array.isArray(eventData) && eventData[0]?.name
        ? eventData[0].name
        : "";
    const year =
      Array.isArray(eventData) && eventData[0]?.year
        ? eventData[0].year
        : undefined;

    // Fetch cabor info
    const caborRes = await fetch(
      `${BASE_URL}/sports?id=eq.${caborId}&select=name`,
      {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    const caborData = await caborRes.json();
    const caborName =
      Array.isArray(caborData) && caborData[0]?.name
        ? caborData[0].name
        : "";

    return { eventName, year, caborName };
  } catch {
    return { eventName: "", caborName: "" };
  }
};

// Fungsi update medal (target/earned)
const updateMedalStat = async (
  medalId: number,
  target: number,
  earned: number
) => {
  const res = await fetch(`${BASE_URL}/medal_stats?id=eq.${medalId}`, {
    method: "PATCH",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target, earned }),
  });
  if (!res.ok) throw new Error("Gagal update medali");
};

const createMedalStat = async (
  eventId: number,
  caborId: number,
  medalType: string,
  target: number,
  earned: number
) => {
  const res = await fetch(`${BASE_URL}/medal_stats`, {
    method: "POST",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_id: eventId,
      sport_id: caborId,
      medal_type: medalType,
      target,
      earned,
    }),
  });
  if (!res.ok) throw new Error("Gagal menambah medali");
};

const MedalPage = () => {
  const params = useParams();
  const eventId = Number(params.eventId);
  const caborId = Number(params.caborId);

  const [medals, setMedals] = useState<MedalStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<{
    eventName: string;
    year?: number;
    caborName: string;
  }>({
    eventName: "",
    caborName: "",
  });

  // Modal state
  const [showEdit, setShowEdit] = useState<MedalStat | null>(null);
  const [editTarget, setEditTarget] = useState<number | "">("");
  const [editEarned, setEditEarned] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Modal tambah state
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState("emas");
  const [addTarget, setAddTarget] = useState<number | "">("");
  const [addEarned, setAddEarned] = useState<number | "">("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!eventId || !caborId) return;
    setLoading(true);
    fetchMedalStats(eventId, caborId)
      .then(setMedals)
      .finally(() => setLoading(false));
    fetchEventInfoAndCabor(eventId, caborId).then(setInfo);
  }, [eventId, caborId]);

  // Autofocus input saat modal muncul
  useEffect(() => {
    if (showEdit && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showEdit]);

  // Modal handler
  const openEditModal = (medal: MedalStat) => {
    setShowEdit(medal);
    setEditTarget(medal.target); // set initial value langsung dari data sekarang
    setEditEarned(medal.earned); // set initial value langsung dari data sekarang
  };

  const handleSave = async () => {
    if (!showEdit) return;
    setSaving(true);
    try {
      await updateMedalStat(
        showEdit.id,
        editTarget === "" ? showEdit.target : Number(editTarget),
        editEarned === "" ? showEdit.earned : Number(editEarned)
      );
      setShowEdit(null);
      // Refresh data
      setLoading(true);
      fetchMedalStats(eventId, caborId)
        .then(setMedals)
        .finally(() => setLoading(false));
    } catch {
      alert("Gagal update medali");
    }
    setSaving(false);
  };

  const handleAddMedal = async () => {
    if (!addType || addTarget === "" || addEarned === "") return;
    setAdding(true);
    try {
      await createMedalStat(eventId, caborId, addType, Number(addTarget), Number(addEarned));
      setShowAdd(false);
      setAddType("emas");
      setAddTarget("");
      setAddEarned("");
      setLoading(true);
      fetchMedalStats(eventId, caborId)
        .then(setMedals)
        .finally(() => setLoading(false));
    } catch {
      alert("Gagal menambah medali");
    }
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Navbar harus di luar container utama */}
      <AdminNavbar />
      {/* Konten utama di bawah navbar, tidak justify-center */}
      <div className="flex flex-col items-center mt-8">
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-10 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-700 mb-2 text-left">
            Daftar Perolehan Medali
          </h1>
          <div className="text-gray-700 text-lg font-semibold text-left mb-6">
            {info.eventName}
            {info.year ? ` ${info.year}` : ""}
            {info.caborName ? (
              <span className="block text-base font-normal text-gray-500 text-left">
                Cabang Olahraga:{" "}
                <span className="font-semibold text-gray-700">
                  {info.caborName}
                </span>
              </span>
            ) : null}
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : medals.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex justify-end mb-2">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded transition"
                  onClick={() => setShowAdd(true)}
                >
                  Tambah Data
                </button>
              </div>
              <table className="w-full table-auto border">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-2">Tipe Medali</th>
                    <th className="px-4 py-2">Target</th>
                    <th className="px-4 py-2">Tercapai</th>
                    <th className="px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {medals.map((medal) => (
                    <tr key={medal.id} className="border-t">
                      <td className="px-4 py-2 text-center font-bold capitalize text-gray-700">
                        {medal.medal_type}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700">
                        {medal.target === null || medal.target === undefined ? "-" : medal.target}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700">
                        {medal.earned === null || medal.earned === undefined ? "-" : medal.earned}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-bold"
                          onClick={() => openEditModal(medal)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-center text-gray-500 mb-4">
                Tidak ada data medali untuk cabor ini.
              </p>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded transition"
                onClick={() => setShowAdd(true)}
              >
                Tambah Medali
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Medali */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative z-10">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowAdd(false)}
              aria-label="Tutup"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-purple-700 text-center">
              Tambah Medali
            </h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 font-semibold">
                Tipe Medali
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                value={addType}
                onChange={(e) => setAddType(e.target.value)}
                disabled={adding}
              >
                <option value="emas">Emas</option>
                <option value="perak">Perak</option>
                <option value="perunggu">Perunggu</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 font-semibold">
                Target
              </label>
              <input
                type="number"
                min={0}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                value={addTarget}
                onChange={(e) => setAddTarget(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={adding}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-gray-700 font-semibold">
                Tercapai
              </label>
              <input
                type="number"
                min={0}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                value={addEarned}
                onChange={(e) => setAddEarned(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={adding}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                disabled={adding}
              >
                Batal
              </button>
              <button
                onClick={handleAddMedal}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 font-bold"
                disabled={adding}
              >
                {adding ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative z-10">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowEdit(null)}
              aria-label="Tutup"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-purple-700 text-center">
              Edit Medali {showEdit.medal_type}
            </h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 font-semibold">
                Target
              </label>
              <input
                ref={inputRef}
                type="number"
                min={0}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={saving}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-gray-700 font-semibold">
                Tercapai
              </label>
              <input
                type="number"
                min={0}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                value={editEarned}
                onChange={(e) => setEditEarned(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={saving}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEdit(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                disabled={saving}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 font-bold"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedalPage;