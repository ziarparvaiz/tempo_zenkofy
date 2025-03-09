import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCircle, Bell, Eye, Moon, Sun, Palette, Clock } from "lucide-react";

export default async function SettingsPage() {
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
      <main className="w-full bg-gray-50 dark:bg-black min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-500 mt-1">
              Customize your reading experience
            </p>
          </header>

          {/* Settings Tabs */}
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="reading">Reading</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-200 rounded-full p-6">
                      <UserCircle className="h-12 w-12 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        defaultValue={user.user_metadata?.full_name || ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={user.email} disabled />
                    </div>

                    <div className="pt-4">
                      <Button>Update Profile</Button>
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium mb-4">Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input id="current-password" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input id="confirm-password" type="password" />
                      </div>

                      <div className="pt-2">
                        <Button>Change Password</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how Zenkofy looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark themes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-5 w-5 text-gray-500" />
                        <Switch id="dark-mode" />
                        <Moon className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Color Theme</Label>
                    <div className="flex gap-3">
                      {[
                        { name: "Blue", color: "bg-blue-500" },
                        { name: "Purple", color: "bg-purple-500" },
                        { name: "Green", color: "bg-green-500" },
                        { name: "Red", color: "bg-red-500" },
                        { name: "Gray", color: "bg-gray-500" },
                      ].map((theme) => (
                        <div key={theme.name} className="text-center">
                          <div
                            className={`${theme.color} h-10 w-10 rounded-full mx-auto mb-2 cursor-pointer border-2 border-transparent hover:border-gray-300`}
                          ></div>
                          <span className="text-xs">{theme.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Font Size</Label>
                        <p className="text-sm text-muted-foreground">
                          Adjust the text size for reading
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">A</span>
                      <Slider
                        defaultValue={[16]}
                        min={12}
                        max={24}
                        step={1}
                        className="w-[200px]"
                      />
                      <span className="text-lg font-bold">A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reading Settings */}
            <TabsContent value="reading">
              <Card>
                <CardHeader>
                  <CardTitle>Reading Settings</CardTitle>
                  <CardDescription>
                    Customize your reading experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Focus Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable distraction-free reading by default
                        </p>
                      </div>
                      <Switch id="focus-mode" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Page Numbers</Label>
                        <p className="text-sm text-muted-foreground">
                          Display page numbers while reading
                        </p>
                      </div>
                      <Switch id="page-numbers" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Default Pomodoro Timer
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Set your preferred Pomodoro session length
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select defaultValue="25">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="25">25 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Auto-save Highlights
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically save text highlights
                        </p>
                      </div>
                      <Switch id="auto-save" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Reading Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get reminders to continue your reading
                        </p>
                      </div>
                      <Switch id="reading-reminders" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Weekly Progress Reports
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly summaries of your reading activity
                        </p>
                      </div>
                      <Switch id="weekly-reports" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Features</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new Zenkofy features
                        </p>
                      </div>
                      <Switch id="new-features" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
