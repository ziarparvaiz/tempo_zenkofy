import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Tag,
  BarChart4,
  Focus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />
        <div className="relative container mx-auto px-4">
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Enhance Your Reading Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Zenkofy provides powerful features to organize your PDFs and
              improve your reading focus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Library Dashboard",
                description:
                  "Clean grid/list view of uploaded PDFs with status indicators, tags, and quick-access sorting options",
              },
              {
                icon: <Focus className="w-6 h-6" />,
                title: "Focus Mode Reader",
                description:
                  "Distraction-free reading interface with highlighting, note-taking, and integrated Pomodoro timer",
              },
              {
                icon: <Tag className="w-6 h-6" />,
                title: "Organization System",
                description:
                  "Tagging, custom libraries, and reading status tracking (In Reading, To Be Read, Done)",
              },
              {
                icon: <BarChart4 className="w-6 h-6" />,
                title: "Reading Analytics",
                description:
                  "Visual representation of reading habits including pages read, completion rates, and reading streaks",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Pomodoro Timer",
                description:
                  "Built-in focus timer to help you maintain concentration during reading sessions",
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Minimalist UI",
                description:
                  "Clean aesthetic with emphasis on typography and whitespace for a pleasant reading experience",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Zenkofy Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple workflow designed to enhance your reading experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your PDFs</h3>
              <p className="text-gray-600">
                Add your PDF books to your personal library with metadata and
                tags
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Organize Your Collection
              </h3>
              <p className="text-gray-600">
                Sort, filter, and categorize your PDFs with our intuitive
                organization system
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Read with Focus</h3>
              <p className="text-gray-600">
                Enjoy distraction-free reading with our Focus Mode and track
                your progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Books Read</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Happy Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-blue-100">Reading Efficiency Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your reading needs. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Reading Experience?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who have enhanced their reading with
            Zenkofy.
          </p>
          <Link
            href={user ? "/dashboard" : "/sign-up"}
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {user ? "Go to Your Library" : "Get Started Now"}
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
