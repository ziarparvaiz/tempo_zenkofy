import Link from "next/link";
import { ArrowUpRight, Check, BookOpen } from "lucide-react";
import Image from "next/image";
import { createClient } from "../../supabase/server";

export default async function Hero() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Zenkofy: Your Personal
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block mt-2">
                PDF Reading Platform
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              A minimalist yet powerful reading platform for PDF books with
              advanced organization and focus features to enhance your digital
              reading experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                {user ? "Go to Library" : "Get Started Free"}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-16 relative">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80"
                  alt="PDF Reader Interface"
                  width={1200}
                  height={675}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transform rotate-3">
                <span className="font-medium">Focus Mode</span>
              </div>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Distraction-free reading</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Advanced organization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Reading analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
