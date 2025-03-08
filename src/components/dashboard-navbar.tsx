"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, BookOpen, BarChart4, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span>Zenkofy</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <BookOpen className="h-4 w-4" />
            <span>Library</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <BarChart4 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/dashboard" className="w-full">
                  My Library
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#" className="w-full">
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
