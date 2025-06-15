// lib/api.ts

const BASE_URL = 'https://myxbovlmtuhelgnlzpqt.supabase.co/rest/v1';
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const HEADERS = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

export async function fetchEventYears() {
  const res = await fetch(`${BASE_URL}/events?select=id,year`, { headers: HEADERS });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchYearsByEventName(eventName: string) {
  const res = await fetch(`${BASE_URL}/rpc/get_years_by_event_name`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ event_name_input: eventName }),
  });
  if (!res.ok) throw new Error('Failed to fetch years');
  return res.json();
}

export async function fetchSports(eventName: string) {
  const res = await fetch(`${BASE_URL}/sports_by_event_name?event_name=eq.${eventName}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error('Failed to fetch sports');
  return res.json();
}

export async function fetchMedali(eventTitle: string, selectedSport: string) {
  const url =
    selectedSport === 'all'
      ? `${BASE_URL}/rpc/rekap_medali_by_event`
      : `${BASE_URL}/rekap_medali_per_cabor_per_tahun?sport_id=eq.${selectedSport}&event_name=eq.${eventTitle}`;

  const options =
    selectedSport === 'all'
      ? {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({ event_name_input: eventTitle }),
        }
      : { headers: HEADERS };

  const res = await fetch(url, options);
  if (!res.ok) throw new Error('Failed to fetch medali');
  return res.json();
}

export async function fetchChartData(eventTitle: string, medalType: string, selectedSport: string) {
  const res = await fetch(`${BASE_URL}/rpc/rekap_medali_dynamic`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      type: medalType,
      sport_id_input: selectedSport,
      event_name_input: eventTitle,
    }),
  });

  if (!res.ok) throw new Error('Failed to fetch chart data');
  return res.json();
}

export async function fetchKlasemen(eventId: number) {
  const res = await fetch(`${BASE_URL}/rpc/rekap_medali_klasemen_by_event`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ event_id_input: eventId }),
  });

  if (!res.ok) throw new Error('Failed to fetch klasemen');
  return res.json();
}
