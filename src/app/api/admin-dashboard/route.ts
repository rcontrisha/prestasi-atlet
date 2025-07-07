import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  // Total Event
  const { count: totalEvent } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  // Total Cabor
  const { count: totalCabor } = await supabase
    .from("sports")
    .select("*", { count: "exact", head: true });

  // Total Medali
  const { data: medalStats } = await supabase
    .from("medal_stats")
    .select("earned");
  const totalMedali = medalStats
    ? medalStats.reduce((sum, m) => sum + (m.earned || 0), 0)
    : 0;

  // Total Peserta SPOM
  const { count: totalSpom } = await supabase
    .from("spom")
    .select("*", { count: "exact", head: true });
  const { count: totalSpom2024 } = await supabase
    .from("spom_2024")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    totalEvent: totalEvent || 0,
    totalCabor: totalCabor || 0,
    totalMedali,
    totalPesertaSpom: (totalSpom || 0) + (totalSpom2024 || 0),
  });
}