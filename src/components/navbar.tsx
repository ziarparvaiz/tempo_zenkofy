import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { BookOpen, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import { ThemeToggle } from "./theme-toggle";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-xl font-bold flex items-center gap-2"
        >
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span>Zenkofy</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Resources
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Button>My Library</Button>
              </Link>
              <ThemeToggle />
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Sign Up
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
