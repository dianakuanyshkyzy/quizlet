"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = "https://imba-server.up.railway.app/auth/register";

      const bodyData = { name, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      const data = await res.json();
      console.log("AUTH RESPONSE:", data);

      if (!data.ok) {
        throw new Error(data.message || "Registration failed");
      }
      router.push("/main");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full">
          <h1 className="text-3xl font-bold text-[#4255FF] mb-6 text-center">
            Register
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
            />

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
            />
            <button
              type="submit"
              className="bg-[#4255FF] text-white py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200 mt-2"
            >
              Register
            </button>
          </form>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          <p className="text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#4255FF] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="text-center text-gray-400 mt-2 text-sm">
            <Link href="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </>
  );
}
