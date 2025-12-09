"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
    //  7D5A50 FFE8D6

    <header className="bg-gray-50 text-[#4255FF] shadow-lg p-4 flex items-center justify-between">
      <Link href="/">
        <h1 className="text-2xl font-bold ml-4">Imba Learn</h1>
      </Link>

      <Link
        href="/account"
        className="flex items-center gap-3 mr-4 hover:opacity-80 transition"
      >
        <Avatar className="size-12 border border-gray-300">
          <AvatarImage src={user?.data.avatar} alt={user?.data.name} />
          <AvatarFallback>
            {user ? getInitials(user.data.name) : "U"}
          </AvatarFallback>
        </Avatar>
        {/* {user && (
          <span className="font-medium hidden sm:block">{user.data.name}</span>
        )} */}
      </Link>
    </header>
  );
}
