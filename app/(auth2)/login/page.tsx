"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import loginImage from "../../../components/images/log.jpeg";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/hooks/useAuth";

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuthentication } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    login.mutate(
      { email, password },
      {
        onSuccess: async () => {
          await checkAuthentication();
          router.push("/dashboard");
        },
        onError: (err: Error) => {
          setError(err.message);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginImage.src})` }}
        ></div>

        <div className="absolute inset-0 mt-18 items-center justify-center ">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-4">
            learn with imba,
            <br /> be imba.
          </h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between bg-white px-8 w-full">
        <div className="flex gap-4 mb-8 items-center justify-center pt-10">
          <span className="px-4 py-2 font-semibold text-[#4255FF] border-b-2 border-[#4255FF]">
            Login
          </span>
          <Link
            href="/register"
            className="px-4 py-2 font-semibold text-gray-500 hover:text-[#4255FF]"
          >
            Sign Up
          </Link>
        </div>

        {/* Middle: form */}
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-[#4255FF] mb-8 text-center">
              Welcome back!
            </h1>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="pl-4 py-7 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7D5A50]"
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="pl-4 py-7 pr-12 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7D5A50] w-full"
                />
                <Button
                  variant={"ghost"}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <Button
                variant={"default"}
                type="submit"
                className="bg-[#4255FF] h-12 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-transform duration-200 cl"
              >
                Login
              </Button>
            </form>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>

        {/* Bottom links */}
        <div className="p-6 text-center text-gray-400 text-sm">
          <Link href="/">← Back to Main page</Link>
        </div>
      </div>
    </div>
  );
}
