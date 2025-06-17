"use client";
import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

interface EventItem {
  id: number;
  name: string;
  year: number;
  location: string;
  total_cabor: number;
}

const API_RPC_URL = "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/get_event_with_cabor_count";
const API_EVENTS_URL = "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/events";
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const AdminEventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", year: "", location: "" });
  const [adding, setAdding] = useState(false);

  const fetchEvents = async () => {
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
      let data = await res.json();
      // Urutkan berdasarkan nama event (A-Z)
      data = Array.isArray(data)
        ? data.sort((a, b) => a.name.localeCompare(b.name))
        : [];
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    const { name, year, location } = newEvent;
    if (!name || !year || !location) return;

    setAdding(true);
    try {
      await fetch(API_EVENTS_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name,
          year: parseInt(year),
          location,
        }),
      });

      setShowAdd(false);
      setNewEvent({ name: "", year: "", location: "" });
      fetchEvents();
    } catch (err) {
      console.error("Error tambah event:", err);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Kelola Event</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
          >
            Add Event
          </button>
        </div>

        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2">Nama Event</th>
              <th className="px-4 py-2">Tahun</th>
              <th className="px-4 py-2">Total Cabor</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            ) : events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="px-4 py-2 font-semibold text-gray-700">{event.name}</td>
                  <td className="px-4 py-2 font-semibold text-gray-700">{event.year}</td>
                  <td className="px-4 py-2 text-center text-purple-600 font-bold">{event.total_cabor}</td>
                  <td className="px-4 py-2 text-center">
                    <a
                      href={`/admin/events/${event.id}/cabors`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Lihat Cabor
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">Tidak ada event.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal Tambah Event */}
        {showAdd && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4">Tambah Event Baru</h2>
              {["Nama Event", "Tahun", "Lokasi"].map((label, i) => (
                <div key={label} className="mb-3">
                  <label className="block mb-1 text-sm">{label}</label>
                  <input
                    type={label === "Tahun" ? "number" : "text"}
                    className="w-full border rounded px-3 py-2"
                    value={
                      i === 0 ? newEvent.name : i === 1 ? newEvent.year : newEvent.location
                    }
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        [i === 0 ? "name" : i === 1 ? "year" : "location"]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  disabled={adding}
                >
                  Batal
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                  disabled={adding}
                >
                  {adding ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage;
