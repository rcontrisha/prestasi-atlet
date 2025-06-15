"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataItem {
  year: number;
  total_target: number;
  total_earned: number;
}

interface MedalLineChartProps {
  data: DataItem[];
}

const MedalLineChart: React.FC<MedalLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" padding={{ left: 30, right: 30 }} />
        <YAxis allowDecimals={false} padding={{ top: 30 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_target" stroke="#8884d8" name="Target" />
        <Line type="monotone" dataKey="total_earned" stroke="#82ca9d" name="Perolehan" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MedalLineChart;
