"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    // Redirect ke halaman admin setelah login berhasil
    window.location.href = "/admin/events";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-4">
          <img src="/favicon.ico" alt="Logo" className="h-15 w-15 mb-2" />
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-700">
            Admin Login
          </h2>
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-600">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-600">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-semibold"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}