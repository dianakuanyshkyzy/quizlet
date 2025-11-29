"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email === fakeUser.email && password === fakeUser.password) {
  //     router.push("/main");
  //   } else {
  //     setError("Invalid email or password");
  //   }
  // };
  const [name, setName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const url = isSignup
        ? "https://imba-server.up.railway.app/auth/register"
        : "https://imba-server.up.railway.app/auth/login";
  
      const bodyData = isSignup
        ? { name, email, password }
        : { email, password };
  
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
      router.push("/main");
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full">
          <h1 className="text-3xl font-bold text-[#4255FF] mb-6 text-center">
            {isSignup ? "Sign Up" : "Login"}
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
              />
            )}

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
                setPassword(e.target.value), setError("");
              }}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
            />
            <button
              type="submit"
              className="bg-[#4255FF] text-white py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200 mt-2"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

          <p className="text-center text-gray-500 mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="text-[#4255FF] font-semibold hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>

          <p className="text-center text-gray-400 mt-2 text-sm">
            <Link href="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </>
  );
}
