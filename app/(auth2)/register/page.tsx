"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import loginImage from "../../../components/images/log.jpeg";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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
        throw new Error(data.message || "Authentication failed");
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginImage.src})` }}
        ></div>

        <div className="absolute inset-0 mt-18 items-center justify-center ">
          <h1 className="text-black text-4xl md:text-5xl font-bold text-center px-4">
            join imba,
            <br /> be imba.
          </h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between bg-white px-8 w-full">
        <div className="flex gap-4 mb-8 items-center justify-center pt-10">
          <Link
            href="/login"
            className="px-4 py-2 font-semibold text-gray-500 hover:text-[#4255FF]"
          >
            Login
          </Link>
          <span className="px-4 py-2 font-semibold text-[#4255FF] border-b-2 border-[#4255FF]">
            Sign Up
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-[#4255FF] mb-8 text-center">
              Create an Account
            </h1>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="p-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
              />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="p-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
              />

              <input
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="p-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
              />
              <button
                type="submit"
                className="bg-[#4255FF] text-white py-4 rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
              >
                Sign Up
              </button>
            </form>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>

        <div className="p-6 text-center text-gray-400 text-sm">
          <Link href="/">← Back to Main page</Link>
        </div>
      </div>
    </div>
  );
}
