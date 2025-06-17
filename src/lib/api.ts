export interface MedaliData {
  total_emas: number;
  total_perak: number;
  total_perunggu: number;
  total_seluruh: number;
}

export interface MedalStat {
  year: number;
  total_target: number;
  total_earned: number;
}

export interface Sport {
  id: number;
  name: string;
}

export interface KlasemenItem {
  region: string;
  emas: number;
  perak: number;
  perunggu: number;
  total: number;
  peringkat: number;
}

export const fetchMedali = async (
  eventTitle: string,
  selectedSport: string
): Promise<MedaliData | null> => {
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

  const res = await fetch(url, options);
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) return data[0];
  return null;
};

export const fetchSports = async (
  eventTitle: string
): Promise<Sport[]> => {
  const res = await fetch(
    `https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/sports_by_event_name?event_name=eq.${eventTitle}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    }
  );
  return res.json();
};

export const fetchChartData = async (
  medalType: string,
  selectedSport: string,
  eventTitle: string
): Promise<MedalStat[]> => {
  const res = await fetch(
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
  );
  return res.json();
};

export const fetchYears = async (
  eventTitle: string
): Promise<{ id: number; year: number }[]> => {
  const res = await fetch(
    `https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1/rpc/get_years_by_event_name`,
    {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_name_input: eventTitle }),
    }
  );
  return res.json();
};

export const fetchKlasemenByEvent = async (
  eventId: number
): Promise<KlasemenItem[]> => {
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
  return res.json();
};