"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { FaMedal, FaTrophy, FaUserFriends } from "react-icons/fa";
import { MdSports } from "react-icons/md";
import { fetchDashboardStats, DashboardStats } from "@/lib/api";

const AdminLandingPage = () => {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchDashboardStats()
			.then(setStats)
			.finally(() => setLoading(false));
	}, []);

	const statList = [
		{
			icon: <FaTrophy className="text-yellow-500 text-3xl" />,
			label: "Total Event",
			value: stats?.totalEvent ?? "-",
			color: "bg-yellow-100",
		},
		{
			icon: <MdSports className="text-blue-500 text-3xl" />,
			label: "Total Cabor",
			value: stats?.totalCabor ?? "-",
			color: "bg-blue-100",
		},
		{
			icon: <FaMedal className="text-purple-600 text-3xl" />,
			label: "Total Medali",
			value: stats?.totalMedali ?? "-",
			color: "bg-purple-100",
		},
		{
			icon: <FaUserFriends className="text-green-600 text-3xl" />,
			label: "Total Peserta SPOM",
			value: stats?.totalPesertaSpom ?? "-",
			color: "bg-green-100",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
			<AdminNavbar />
			<div className="flex flex-col items-center justify-center min-h-[80vh]">
				<div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl text-center">
					<h1 className="text-3xl font-bold text-purple-700 mb-2">
						Admin Dashboard
					</h1>
					<p className="mb-8 text-gray-600">
						Selamat datang di halaman admin. Berikut ringkasan data sistem:
					</p>
					<div className="grid grid-cols-2 gap-6 mb-8">
						{statList.map((stat, idx) => (
							<div
								key={idx}
								className={`flex flex-col items-center justify-center rounded-lg p-5 ${stat.color} shadow`}
							>
								{stat.icon}
								<div className="text-2xl font-bold mt-2 text-gray-600">
									{loading ? (
										<span className="animate-pulse">...</span>
									) : (
										stat.value
									)}
								</div>
								<div className="text-gray-700">{stat.label}</div>
							</div>
						))}
					</div>
					<div className="flex flex-col md:flex-row gap-4 justify-center">
						<Link
							href="/admin/events"
							className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded transition"
						>
							Kelola Event
						</Link>
						<Link
							href="/admin/spom"
							className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
						>
							Kelola SPOM
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function ProtectedAdminPage() {
	return (
		<AdminProtectedRoute>
			<AdminLandingPage />
		</AdminProtectedRoute>
	);
}