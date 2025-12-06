import Link from "next/link";
import { User } from "lucide-react";

export default function Header() {
  return (
    //  7D5A50 FFE8D6
    <header className="bg-gray-50 text-[#4255FF] shadow-lg p-4 flex items-center justify-between">
      <Link href="/">
        <h1 className="text-2xl font-bold ml-4">Imba Learn</h1>
      </Link>

      <Link href="/account">
        <User className="w-7 h-7 mr-4 cursor-pointerhover:opacity-80 transition" />
      </Link>
    </header>
  );
}
