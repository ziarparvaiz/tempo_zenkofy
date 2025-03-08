"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Maximize,
  Minimize,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import PdfViewer from "./pdf-viewer";
import NoteTaking from "./note-taking";
import BookmarkManager from "./bookmark-manager";
import PomodoroTimer from "./pomodoro-timer";
import ReadingProgress from "./reading-progress";

interface EnhancedPdfReaderProps {
  pdfId: string;
  pdfUrl: string;
  title?: string;
  author?: string;
  initialProgress?: number;
}

export default function EnhancedPdfReader({
  pdfId,
  pdfUrl,
  title = "PDF Document",
  author = "",
  initialProgress = 0,
}: EnhancedPdfReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Mock value, would be set by PDF viewer
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle focus mode toggle
  const toggleFocusMode = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    if (newFocusMode) {
      setShowSidebar(false);
      // Request fullscreen when entering focus mode
      if (!document.fullscreenElement) {
        readerRef.current?.requestFullscreen().catch((err) => {
          console.log("Error attempting to enable fullscreen:", err);
        });
      }
    }
  };

  // Auto-enable focus mode on initial load
  useEffect(() => {
    // Short delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      setFocusMode(true);
      setShowSidebar(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={readerRef}
      className={`flex flex-col h-screen ${focusMode ? "bg-black" : "bg-gray-100 dark:bg-gray-950"}`}
      data-focus-mode={focusMode ? "true" : "false"}
    >
      {/* Reader Header */}
      <header
        className={`flex justify-between items-center p-4 ${focusMode ? "bg-black text-white" : "bg-white dark:bg-black border-b dark:border-gray-800 dark:text-white"}`}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard">
              <ArrowLeft size={20} />
            </a>
          </Button>
          <h1 className="text-lg font-semibold">{title}</h1>
          {author && <Badge variant="outline">{author}</Badge>}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className={showSidebar ? "bg-gray-100" : ""}
          >
            {showSidebar ? <PanelRight size={20} /> : <PanelLeft size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFocusMode}
            className={focusMode ? "bg-gray-700" : ""}
          >
            <BookOpen size={20} />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer */}
        <div
          className={`flex-1 overflow-auto ${focusMode ? "bg-black" : "dark:bg-gray-950"}`}
        >
          <PdfViewer
            pdfUrl={pdfUrl}
            initialPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div
            className={`w-80 border-l overflow-auto ${focusMode ? "bg-black text-white border-gray-800" : "bg-white dark:bg-black dark:text-white dark:border-gray-800"}`}
          >
            <div className="p-4">
              <ReadingProgress
                pdfId={pdfId}
                initialProgress={initialProgress}
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </div>

            <Tabs defaultValue="notes">
              <TabsList className="w-full">
                <TabsTrigger value="notes" className="flex-1">
                  Notes
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex-1">
                  Bookmarks
                </TabsTrigger>
                <TabsTrigger value="pomodoro" className="flex-1">
                  Pomodoro
                </TabsTrigger>
              </TabsList>

              {/* Notes Tab */}
              <TabsContent value="notes" className="p-4">
                <NoteTaking pdfId={pdfId} currentPage={currentPage} />
              </TabsContent>

              {/* Bookmarks Tab */}
              <TabsContent value="bookmarks" className="p-4">
                <BookmarkManager
                  pdfId={pdfId}
                  currentPage={currentPage}
                  onNavigate={handlePageChange}
                />
              </TabsContent>

              {/* Pomodoro Tab */}
              <TabsContent value="pomodoro" className="p-4">
                <PomodoroTimer />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
