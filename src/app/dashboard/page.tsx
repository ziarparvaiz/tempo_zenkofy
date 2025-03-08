import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  BookOpen,
  Plus,
  Search,
  Grid3X3,
  List,
  Filter,
  Tag,
  Clock,
  BarChart4,
} from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import PdfUploadDialog from "@/components/pdf-upload-dialog";

// Fetch PDFs from the database
async function fetchPdfs(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching PDFs:", error);
    return [];
  }

  return data || [];
}

// Fallback mock data for PDFs if database is empty
const mockPdfs = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    cover_url:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    status: "reading",
    progress: 45,
    last_read: "2023-11-28",
    tags: ["productivity", "self-help"],
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    cover_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    status: "to-read",
    progress: 0,
    last_read: null,
    tags: ["productivity", "focus"],
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover_url:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&q=80",
    status: "completed",
    progress: 100,
    last_read: "2023-10-15",
    tags: ["finance", "psychology"],
  },
  {
    id: "4",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover_url:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80",
    status: "reading",
    progress: 67,
    last_read: "2023-11-25",
    tags: ["psychology", "decision-making"],
  },
  {
    id: "5",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    cover_url:
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=500&q=80",
    status: "to-read",
    progress: 0,
    last_read: null,
    tags: ["design", "psychology"],
  },
  {
    id: "6",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    cover_url:
      "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=500&q=80",
    status: "completed",
    progress: 100,
    last_read: "2023-09-10",
    tags: ["history", "anthropology"],
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    reading: {
      label: "Reading",
      className:
        "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700",
    },
    "to-read": {
      label: "To Read",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    completed: {
      label: "Completed",
      className:
        "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig["to-read"];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

// Progress bar component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className="bg-black dark:bg-white h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

// PDF Card component for grid view
function PdfCard({ pdf }: { pdf: any }) {
  return (
    <Link href={`/dashboard/pdf/${pdf.id}`} className="block" prefetch={false}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={
              pdf.cover_url ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80"
            }
            alt={pdf.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <StatusBadge status={pdf.status} />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{pdf.title}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {pdf.author || "Unknown Author"}
          </p>

          {pdf.progress > 0 && pdf.progress < 100 && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{pdf.progress}%</span>
              </div>
              <ProgressBar progress={pdf.progress} />
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1">
            {(pdf.tags || []).map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// PDF List Item component for list view
function PdfListItem({ pdf }: { pdf: any }) {
  return (
    <Link href={`/dashboard/pdf/${pdf.id}`} className="block" prefetch={false}>
      <div className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
        <div className="relative w-12 h-16 overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={
              pdf.cover_url ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80"
            }
            alt={pdf.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold line-clamp-1">{pdf.title}</h3>
          <p className="text-sm text-gray-500">
            {pdf.author || "Unknown Author"}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="hidden md:flex gap-1">
            {(pdf.tags || []).slice(0, 2).map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <StatusBadge status={pdf.status} />
        </div>
      </div>
    </Link>
  );
}

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's PDFs from the database
  let pdfs = await fetchPdfs(user.id);

  // If no PDFs found, use mock data for demonstration
  if (pdfs.length === 0) {
    pdfs = mockPdfs;
  }

  // Calculate reading stats
  const readingCount = pdfs.filter((pdf) => pdf.status === "reading").length;
  const completedCount = pdfs.filter(
    (pdf) => pdf.status === "completed",
  ).length;
  const toReadCount = pdfs.filter((pdf) => pdf.status === "to-read").length;

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Library</h1>
              <p className="text-gray-500 mt-1">
                Manage and organize your PDF collection
              </p>
            </div>
            <div className="flex gap-3">
              <PdfUploadDialog />
            </div>
          </header>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search by title, author, or tags..."
                  className="pl-10 w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span className="hidden md:inline">Filters</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Tag size={16} />
                  <span className="hidden md:inline">Tags</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Reading Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Currently Reading
                  </p>
                  <p className="text-2xl font-bold">{readingCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-full">
                  <BarChart4 className="h-6 w-6 text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To Be Read
                  </p>
                  <p className="text-2xl font-bold">{toReadCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PDF Library Section */}
          <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold">PDF Library</h2>
              <Tabs defaultValue="grid">
                <TabsList>
                  <TabsTrigger value="grid" className="flex items-center gap-1">
                    <Grid3X3 size={16} />
                    <span className="hidden md:inline">Grid</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <List size={16} />
                    <span className="hidden md:inline">List</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs defaultValue="grid" className="w-full">
              <TabsContent value="grid" className="p-4">
                {pdfs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No PDFs found. Upload your first PDF to get started.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {pdfs.map((pdf) => (
                      <PdfCard key={pdf.id} pdf={pdf} />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="list">
                {pdfs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No PDFs found. Upload your first PDF to get started.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {pdfs.map((pdf) => (
                      <PdfListItem key={pdf.id} pdf={pdf} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
