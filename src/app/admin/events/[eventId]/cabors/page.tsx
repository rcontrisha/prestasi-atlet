"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

interface CaborItem {
  id: number;
  name: string;
  is_held?: boolean;
  is_exhibition?: boolean;
  yk_participated?: boolean;
}

const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const BASE_URL = "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1";

const fetchCaborsByEvent = async (eventId: number): Promise<CaborItem[]> => {
  try {
    const res = await fetch(`${BASE_URL}/rpc/get_cabor_by_event`, {
      method: "POST",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id: eventId }),
    });

    if (!res.ok) throw new Error("Gagal ambil data");

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

const updateStatus = async (
  eventId: number,
  sportId: number,
  field: "is_held" | "is_exhibition" | "yk_participated",
  value: boolean
) => {
  try {
    await fetch(`${BASE_URL}/rpc/update_cabor_status`, {
      method: "POST",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id: eventId,
        sport_id: sportId,
        field_name: field,
        field_value: value,
      }),
    });
  } catch (err) {
    console.error("Gagal update status:", err);
  }
};

const fetchEventName = async (
  eventId: number
): Promise<{ name: string; year?: number }> => {
  try {
    const res = await fetch(
      `${BASE_URL}/events?id=eq.${eventId}&select=name,year`,
      {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.name) {
      return { name: data[0].name, year: data[0].year };
    }
    return { name: "" };
  } catch {
    return { name: "" };
  }
};

const StatusDropdown = ({
  value,
  onChange,
}: {
  value?: boolean;
  onChange: (val: boolean) => void;
}) => {
  // Icon dan teks
  const display = value ? (
    <span className="flex items-center gap-1">
      <span className="text-green-600 text-lg">✓</span>
      <span className="text-gray-700 font-bold">Ya</span>
    </span>
  ) : (
    <span className="flex items-center gap-1">
      <span className="text-red-600 text-lg">✗</span>
      <span className="text-gray-700 font-bold">Tidak</span>
    </span>
  );

  // Custom style for option (works in Chrome/Edge, not in Firefox/Safari)
  const optionStyle = {
    color: "#374151", // gray-700
    fontWeight: "bold" as const,
    background: "#fff",
  };

  return (
    <div className="relative inline-block w-full">
      <div
        className={`flex items-center justify-center border border-gray-300 rounded px-2 py-1 text-sm font-bold bg-white transition-colors`}
        style={{ minWidth: 70, cursor: "pointer" }}
      >
        {display}
        <select
          value={value ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          style={{ minWidth: 70 }}
        >
          <option
            value="true"
            style={{ ...optionStyle, color: "#16a34a" }} // green-600
          >
            ✓ Ya
          </option>
          <option
            value="false"
            style={{ ...optionStyle, color: "#dc2626" }} // red-600
          >
            ✗ Tidak
          </option>
        </select>
      </div>
    </div>
  );
};

const CaborsPage = () => {
  const params = useParams();
  const eventId = Number(params.eventId);
  const [cabors, setCabors] = useState<CaborItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [eventInfo, setEventInfo] = useState<{ name: string; year?: number }>({
    name: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newCaborName, setNewCaborName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [adding, setAdding] = useState(false);
  const [isHeldInput, setIsHeldInput] = useState(false);
  const [isExhibitionInput, setIsExhibitionInput] = useState(false);
  const [ykParticipatedInput, setYkParticipatedInput] = useState(false);
  const [showDelete, setShowDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetchCaborsByEvent(eventId)
      .then(setCabors)
      .finally(() => setLoading(false));
    fetchEventName(eventId).then(setEventInfo);
  }, [eventId]);

  const handleChange = async (
    sportId: number,
    field: "is_held" | "is_exhibition" | "yk_participated",
    newValue: boolean
  ) => {
    try {
      await updateStatus(eventId, sportId, field, newValue);
      setCabors((prev) =>
        prev.map((item) =>
          item.id === sportId ? { ...item, [field]: newValue } : item
        )
      );
      setNotif({ type: "success", message: "Status berhasil diupdate!" });
    } catch {
      setNotif({ type: "error", message: "Gagal update status!" });
    }
    setTimeout(() => setNotif(null), 2000);
  };

  // Fungsi untuk menambah cabor ke event via RPC
  const handleAddCabor = async () => {
    if (!newCaborName.trim()) {
      setNotif({ type: "error", message: "Nama cabor tidak boleh kosong!" });
      setTimeout(() => setNotif(null), 2000);
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(`${BASE_URL}/rpc/add_cabor_to_event`, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id_input: eventId,
          sport_name_input: newCaborName.trim(),
          is_held_input: isHeldInput,
          is_exhibition_input: isExhibitionInput,
          yk_participated_input: ykParticipatedInput,
        }),
      });
      if (!res.ok) throw new Error("Gagal menambah cabor");
      setNotif({ type: "success", message: "Cabor berhasil ditambahkan!" });
      setShowModal(false);
      setNewCaborName("");
      setIsHeldInput(false);
      setIsExhibitionInput(false);
      setYkParticipatedInput(false);
      // Refresh daftar cabor
      fetchCaborsByEvent(eventId).then(setCabors);
    } catch {
      setNotif({ type: "error", message: "Gagal menambah cabor!" });
    }
    setAdding(false);
    setTimeout(() => setNotif(null), 2000);
  };

  const deleteCabor = async (sportId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/rpc/delete_cabor_completely`, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sport_id_input: sportId,
        }),
      });
      if (!res.ok) throw new Error("Gagal menghapus cabor");
      setNotif({ type: "success", message: "Cabor berhasil dihapus!" });
      fetchCaborsByEvent(eventId).then(setCabors);
    } catch {
      setNotif({ type: "error", message: "Gagal menghapus cabor!" });
    }
    setTimeout(() => setNotif(null), 2000);
  };

  // Autofocus input saat modal muncul
  useEffect(() => {
    if (showModal && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Navbar harus di luar container utama */}
      <AdminNavbar />
      {/* Konten utama di bawah navbar */}
      <div className="p-8">
        {/* Alert Notifikasi Fixed */}
        {notif && (
          <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white text-center transition
            ${notif.type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
            style={{ minWidth: 250, maxWidth: 400 }}
          >
            {notif.message}
          </div>
        )}
        {/* Modal Add Cabor */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur background */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative z-10">
              <button
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setShowModal(false)}
                aria-label="Tutup"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 text-purple-700">
                Tambah Cabor ke Event
              </h2>
              <input
                ref={inputRef}
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-gray-800"
                placeholder="Nama Cabor"
                value={newCaborName}
                onChange={(e) => setNewCaborName(e.target.value)}
                disabled={adding}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCabor();
                }}
              />
              <div className="flex flex-col gap-2 mb-4 text-gray-800">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isHeldInput}
                    onChange={(e) => setIsHeldInput(e.target.checked)}
                    disabled={adding}
                    className="accent-purple-700 w-4 h-4"
                  />
                  <span>Diselenggarakan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isExhibitionInput}
                    onChange={(e) => setIsExhibitionInput(e.target.checked)}
                    disabled={adding}
                    className="accent-purple-700 w-4 h-4"
                  />
                  <span>Exhibition</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ykParticipatedInput}
                    onChange={(e) => setYkParticipatedInput(e.target.checked)}
                    disabled={adding}
                    className="accent-purple-700 w-4 h-4"
                  />
                  <span>YK Ikut</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                  disabled={adding}
                >
                  Batal
                </button>
                <button
                  onClick={handleAddCabor}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-bold"
                  disabled={adding}
                >
                  {adding ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-700">
              Daftar Cabang Olahraga
              {eventInfo.name
                ? ` - ${eventInfo.name}${eventInfo.year ? " " + eventInfo.year : ""}`
                : ""}
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-md transition-colors shadow-sm"
            >
              + Add Cabor
            </button>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : cabors.length > 0 ? (
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama Cabor</th>
                  <th className="px-4 py-2">Diselenggarakan</th>
                  <th className="px-4 py-2">Exhibition</th>
                  <th className="px-4 py-2">YK Ikut</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cabors.map((cabor, idx) => (
                  <tr key={cabor.id} className="border-t">
                    <td className="px-4 py-2 text-center text-gray-700">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{cabor.name}</td>
                    <td className="px-4 py-2 text-center">
                      <StatusDropdown
                        value={cabor.is_held}
                        onChange={(val) => handleChange(cabor.id, "is_held", val)}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <StatusDropdown
                        value={cabor.is_exhibition}
                        onChange={(val) =>
                          handleChange(cabor.id, "is_exhibition", val)
                        }
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <StatusDropdown
                        value={cabor.yk_participated}
                        onChange={(val) =>
                          handleChange(cabor.id, "yk_participated", val)
                        }
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-bold"
                          onClick={() =>
                            window.location.href = `/admin/events/${eventId}/cabors/${cabor.id}/medali`
                          }
                          title="Lihat Perolehan Medali"
                        >
                          Medali
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
                          onClick={() => setShowDelete({ id: cabor.id, name: cabor.name })}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              Tidak ada cabor untuk event ini.
            </p>
          )}
        </div>
        {/* Modal Konfirmasi Delete */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative z-10">
              <button
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setShowDelete(null)}
                aria-label="Tutup"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 text-red-700">
                Hapus Cabor
              </h2>
              <p className="mb-6 text-gray-800">
                Yakin ingin menghapus <span className="font-bold">{showDelete.name}</span> beserta seluruh relasinya dari event ini dan database?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDelete(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    await deleteCabor(showDelete.id);
                    setShowDelete(null);
                  }}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-bold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaborsPage;
