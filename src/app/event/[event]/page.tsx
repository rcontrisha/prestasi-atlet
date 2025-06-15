"use client";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useParams } from "next/navigation";
import CardGrid from "@/components/card-grid";
import { Component as NavbarComponent } from "@/components/navbar";
import MedalLineChart from "@/components/medal-line-chart";

interface MedaliData {
  total_emas: number;
  total_perak: number;
  total_perunggu: number;
  total_seluruh: number;
}

interface MedalStat {
  year: number;
  total_target: number;
  total_earned: number;
}

interface Sport {
  id: number;
  name: string;
}

interface KlasemenItem {
  region: string;
  emas: number;
  perak: number;
  perunggu: number;
  total: number;
  peringkat: number;
}

const EventPage = () => {
  const { event } = useParams(); // ambil slug dari URL
  const eventSlug = typeof event === "string" ? event : "unknown";

  const [medali, setMedali] = useState<MedaliData | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [medalType, setMedalType] = useState("all");
  const [chartData, setChartData] = useState<MedalStat[]>([]);
  const [klasemen, setKlasemen] = useState<KlasemenItem[]>([]);
  const [eventYears, setEventYears] = useState<{ id: number; year: number }[]>(
    []
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Event metadata map (bisa dipisah ke file kalau banyak)
  const eventNames: Record<string, string> = {
    popda: "POPDA",
    peparpeda: "PEPARPEDA",
    kko: "KKO",
    o2sn_prov: "O2SN PROVINSI",
    o2sn_nasional: "O2SN NASIONAL",
  };

  const eventTitle = eventNames[eventSlug.toLowerCase()] || "Event";

  // Fetch total medali
  useEffect(() => {
    const fetchMedali = async () => {
      const headers = {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      };

      const url =
        selectedSport === "all"
          ? `https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/rekap_medali_by_event`
          : `https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rekap_medali_per_cabor_per_tahun?sport_id=eq.${selectedSport}&event_name=eq.${eventTitle}`;

      const options =
        selectedSport === "all"
          ? {
              method: "POST",
              headers,
              body: JSON.stringify({ event_name_input: eventTitle }),
            }
          : { headers };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        if (data.length > 0) setMedali(data[0]);
        else setMedali(null);
      } catch (err) {
        console.error("Fetch medali error:", err);
      }
    };

    if (eventTitle !== "Event") fetchMedali();
  }, [selectedSport, eventTitle]);

  useEffect(() => {
    setMedalType("all");
  }, [selectedSport]);

  // Fetch sports
  useEffect(() => {
    fetch(
      `https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/sports_by_event_name?event_name=eq.${eventTitle}`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setSports(data))
      .catch((err) => console.error("Fetch sports error:", err));
  }, []);

  // Fetch grafik
  useEffect(() => {
    fetch(
      "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/rekap_medali_dynamic",
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: medalType,
          sport_id_input: selectedSport,
          event_name_input: eventTitle,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((item: MedalStat) => ({
            year: item.year,
            total_target: item.total_target,
            total_earned: item.total_earned,
          }));
          setChartData(formatted);
        }
      })
      .catch((err) => console.error("Chart fetch error:", err));
  }, [medalType, selectedSport]);

  useEffect(() => {
    const fetchYears = async (eventName: string) => {
      try {
        const res = await fetch(
          `https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/get_years_by_event_name`,
          {
            method: "POST",
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ event_name_input: eventName }),
          }
        );

        const data = await res.json();
        if (Array.isArray(data)) {
          setEventYears(data);
          if (data.length > 0) {
            setSelectedYear(data[data.length - 1].id); // default: terbaru
          }
        } else {
          console.warn("Invalid response for event years:", data);
        }
      } catch (err) {
        console.error("Fetch event years error:", err);
      }
    };

    // ✅ Panggil fungsi fetch-nya
    fetchYears(eventTitle);
  }, [eventTitle]); // ← atau tambahkan dependensi yang sesuai

  const fetchKlasemenByEvent = async (eventId: number) => {
    try {
      const res = await fetch(
        "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/rekap_medali_klasemen_by_event",
        {
          method: "POST",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_id_input: eventId }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error("Fetch klasemen error:", error);
        return;
      }

      const data = await res.json();
      setKlasemen(data);
    } catch (err) {
      console.error("Fetch klasemen error:", err);
    }
  };

  // ✅ Trigger fetch klasemen saat selectedYear berubah
  useEffect(() => {
    if (selectedYear !== null) {
      fetchKlasemenByEvent(selectedYear);
    }
  }, [selectedYear]);

  // Fetch klasemen
  useEffect(() => {
    if (!selectedYear) return;
    fetch(
      "https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/rekap_medali_klasemen_by_event",
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id_input: selectedYear }),
      }
    )
      .then((res) => res.json())
      .then((data) => setKlasemen(data))
      .catch((err) => console.error("Klasemen error:", err));
  }, [selectedYear]);

  // Cards
  const cards = medali
    ? [
        {
          image: "/images/total.png",
          title: "Total Medali",
          description: `${medali.total_seluruh}`,
          type: "all",
        },
        {
          image: "/images/emas.png",
          title: "Medali Emas",
          description: `${medali.total_emas}`,
          type: "emas",
        },
        {
          image: "/images/perak.png",
          title: "Medali Perak",
          description: `${medali.total_perak}`,
          type: "perak",
        },
        {
          image: "/images/perunggu.png",
          title: "Medali Perunggu",
          description: `${medali.total_perunggu}`,
          type: "perunggu",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white">
      <NavbarComponent title={eventTitle} />
      <hr className="border border-gray-700 mt-2" />
      <main className="p-4 text-gray-800">
        <div className="bg-gray-100 p-6 flex flex-wrap justify-center gap-5">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <div
                key={index}
                onClick={() => setMedalType(card.type)}
                className="cursor-pointer"
              >
                <CardGrid {...card} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Loading data medali...</p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-[3fr_2fr] grid-rows-[1fr_5fr] gap-4 p-4 bg-gray-100 rounded-lg">
          <div className="row-span-2 bg-white rounded-xl shadow-md p-4 flex items-center justify-center">
            <MedalLineChart data={chartData} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="filter"
                className="font-bold text-base text-gray-700"
              >
                Cabang Olahraga
              </label>
              <Dropdown
                label={
                  sports.find((s) => s.id.toString() === selectedSport)?.name ||
                  "Semua"
                }
                dismissOnClick={true}
                className="custom-dropdown text-primary-purple font-bold"
              >
                <div className="dropdown-scroll-wrapper">
                  {[
                    { id: "all", name: "Semua" },
                    ...sports.map((s) => ({
                      id: s.id.toString(),
                      name: s.name,
                    })),
                  ].map((sport) => (
                    <DropdownItem
                      key={sport.id}
                      onClick={() => setSelectedSport(sport.id)}
                      className="dropdown-item-custom"
                    >
                      {sport.name}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>
          </div>

          <div className="mt-2 bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Klasemen Akhir {eventNames[eventSlug.toLowerCase()]}
              </h2>
              <Dropdown
                label={
                  eventYears.find((e) => e.id === selectedYear)?.year ||
                  "Pilih Tahun"
                }
                dismissOnClick={true}
                className="custom-dropdown font-bold"
              >
                <div className="max-h-60 overflow-y-auto custom-scroll bg-white text-gray-800">
                  {eventYears.map((event) => (
                    <DropdownItem
                      key={event.id}
                      onClick={() => {
                        setSelectedYear(event.id);
                      }}
                      className="dropdown-item-custom"
                    >
                      {event.year}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            <div className="overflow-auto rounded-md">
              <table className="w-full text-sm text-left text-gray-600 bg-white rounded-lg">
                <thead className="text-xs uppercase bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Kabupaten/Kota</th>
                    <th className="px-4 py-2">Emas</th>
                    <th className="px-4 py-2">Perak</th>
                    <th className="px-4 py-2">Perunggu</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {klasemen.length > 0 ? (
                    klasemen.map((row: KlasemenItem) => (
                      <tr key={row.region}>
                        <td className="px-4 py-2">{row.region}</td>
                        <td className="px-4 py-2">{row.emas}</td>
                        <td className="px-4 py-2">{row.perak}</td>
                        <td className="px-4 py-2">{row.perunggu}</td>
                        <td className="px-4 py-2">{row.total}</td>
                        <td className="px-4 py-2">{row.peringkat}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        Tidak ada data klasemen.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventPage;
