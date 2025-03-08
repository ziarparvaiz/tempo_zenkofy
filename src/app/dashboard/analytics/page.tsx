import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  BarChart4,
  TrendingUp,
  Calendar,
  Clock,
  BookMarked,
  ArrowUpRight,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
  Bookmark,
  Timer,
  BookText,
  LineChart,
  PieChart,
  BarChart,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Mock reading data
const mockReadingData = {
  totalPagesRead: 1245,
  totalBooksCompleted: 8,
  averagePagesPerDay: 42,
  readingStreak: 15,
  timeSpentReading: 87, // hours
  completionRate: 78, // percentage
  monthlyProgress: [
    { month: "Jan", pages: 120 },
    { month: "Feb", pages: 150 },
    { month: "Mar", pages: 180 },
    { month: "Apr", pages: 200 },
    { month: "May", pages: 160 },
    { month: "Jun", pages: 140 },
    { month: "Jul", pages: 130 },
    { month: "Aug", pages: 110 },
    { month: "Sep", pages: 90 },
    { month: "Oct", pages: 120 },
    { month: "Nov", pages: 150 },
    { month: "Dec", pages: 180 },
  ],
  recentActivity: [
    { date: "2023-11-28", book: "Atomic Habits", pages: 15, time: 45 },
    {
      date: "2023-11-27",
      book: "Thinking, Fast and Slow",
      pages: 20,
      time: 60,
    },
    { date: "2023-11-26", book: "Atomic Habits", pages: 18, time: 50 },
    {
      date: "2023-11-24",
      book: "Thinking, Fast and Slow",
      pages: 12,
      time: 35,
    },
    { date: "2023-11-23", book: "Atomic Habits", pages: 22, time: 65 },
  ],
  topBooks: [
    { title: "Atomic Habits", pages: 320, timeSpent: 8.5, progress: 100 },
    {
      title: "Thinking, Fast and Slow",
      pages: 499,
      timeSpent: 12.3,
      progress: 67,
    },
    { title: "Deep Work", pages: 296, timeSpent: 6.8, progress: 100 },
    {
      title: "The Psychology of Money",
      pages: 256,
      timeSpent: 5.2,
      progress: 100,
    },
    { title: "Sapiens", pages: 443, timeSpent: 10.1, progress: 78 },
  ],
  weeklyActivity: [
    { day: "Mon", pages: 25, time: 45 },
    { day: "Tue", pages: 32, time: 60 },
    { day: "Wed", pages: 18, time: 30 },
    { day: "Thu", pages: 42, time: 75 },
    { day: "Fri", pages: 30, time: 55 },
    { day: "Sat", pages: 50, time: 90 },
    { day: "Sun", pages: 22, time: 40 },
  ],
};

function OverviewCard({
  title,
  value,
  icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && trendValue && (
            <div
              className={`flex items-center text-xs ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}
            >
              {trend === "up" ? (
                <ChevronUp className="h-4 w-4" />
              ) : trend === "down" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DataTable({
  data,
  columns,
}: {
  data: any[];
  columns: { header: string; accessor: string; className?: string }[];
}) {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-4 border-b bg-muted/50 p-2">
        {columns.map((column, i) => (
          <div key={i} className={column.className || ""}>
            <div className="flex items-center gap-2 text-sm font-medium">
              {column.header}
            </div>
          </div>
        ))}
      </div>
      <div className="divide-y">
        {data.map((row, i) => (
          <div key={i} className="grid grid-cols-4 items-center p-2">
            {columns.map((column, j) => (
              <div key={j} className={column.className || ""}>
                {column.accessor === "progress" ? (
                  <div className="flex items-center gap-2">
                    <Progress
                      value={row[column.accessor]}
                      className="h-2 w-full"
                    />
                    <span className="text-xs">{row[column.accessor]}%</span>
                  </div>
                ) : (
                  <div className="text-sm">{row[column.accessor]}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Reading Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Track your reading habits and progress
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 Days
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <OverviewCard
              title="Total Pages Read"
              value={mockReadingData.totalPagesRead.toString()}
              icon={<BookText className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              trendValue="+12% from last month"
            />
            <OverviewCard
              title="Books Completed"
              value={mockReadingData.totalBooksCompleted.toString()}
              icon={<BookMarked className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              trendValue="+2 from last month"
            />
            <OverviewCard
              title="Reading Streak"
              value={`${mockReadingData.readingStreak} days`}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              trend="neutral"
              trendValue="Same as last week"
            />
            <OverviewCard
              title="Time Spent Reading"
              value={`${mockReadingData.timeSpentReading} hours`}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              trendValue="+5.2 hours from last month"
            />
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Reading Progress */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0">
                  <CardTitle>Reading Progress</CardTitle>
                  <CardDescription>Pages read per month</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <LineChart className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="h-full w-full flex items-end gap-2">
                    {mockReadingData.monthlyProgress.map((month) => (
                      <div
                        key={month.month}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="w-full bg-black dark:bg-white rounded-t-sm"
                          style={{ height: `${(month.pages / 200) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-2">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reading Habits */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Reading Habits</CardTitle>
                <CardDescription>When you read the most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-black dark:bg-white"></div>
                      <span className="text-sm">Morning</span>
                    </div>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                      <span className="text-sm">Afternoon</span>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-500"></div>
                      <span className="text-sm">Evening</span>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-700 dark:bg-gray-300"></div>
                      <span className="text-sm">Night</span>
                    </div>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium mb-2">Best Reading Day</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Saturday</span>
                    </div>
                    <span className="text-sm font-medium">50 pages avg.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Books & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Books */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Books</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <span className="text-sm">View All</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Your most read books</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={mockReadingData.topBooks}
                  columns={[
                    {
                      header: "Book",
                      accessor: "title",
                      className: "col-span-1",
                    },
                    {
                      header: "Pages",
                      accessor: "pages",
                      className: "col-span-1 text-right",
                    },
                    {
                      header: "Time (hrs)",
                      accessor: "timeSpent",
                      className: "col-span-1 text-right",
                    },
                    {
                      header: "Progress",
                      accessor: "progress",
                      className: "col-span-1",
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <span className="text-sm">View All</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Your latest reading sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockReadingData.recentActivity
                    .slice(0, 4)
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between"
                      >
                        <div className="flex gap-4">
                          <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {activity.book}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {activity.pages} pages
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time} minutes
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>
                  Your reading activity for the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium mb-4">
                      Pages Read by Day
                    </h3>
                    <div className="h-[200px] w-full flex items-end gap-2">
                      {mockReadingData.weeklyActivity.map((day) => (
                        <div
                          key={day.day}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="w-full bg-black dark:bg-white rounded-t-sm"
                            style={{ height: `${(day.pages / 50) * 100}%` }}
                          ></div>
                          <span className="text-xs mt-2">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-4">
                      Time Spent by Day (minutes)
                    </h3>
                    <div className="h-[200px] w-full flex items-end gap-2">
                      {mockReadingData.weeklyActivity.map((day) => (
                        <div
                          key={day.day}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="w-full bg-gray-500 dark:bg-gray-400 rounded-t-sm"
                            style={{ height: `${(day.time / 90) * 100}%` }}
                          ></div>
                          <span className="text-xs mt-2">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
