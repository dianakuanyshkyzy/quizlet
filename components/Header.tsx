"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserData {
  data: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://imba-server.up.railway.app/users/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-gray-50 text-[#4255FF] shadow-lg p-4 flex items-center justify-between">
      <Link href="/">
        <h1 className="text-2xl font-bold ml-4">Imba Learn</h1>
      </Link>

      <div className="flex items-center gap-3 mr-4">
        <Link
          href="/account"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <Avatar className="size-12 border border-gray-300">
            <AvatarImage src={user?.data.avatar} alt={user?.data.name} />
            <AvatarFallback>
              {user ? getInitials(user.data.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
