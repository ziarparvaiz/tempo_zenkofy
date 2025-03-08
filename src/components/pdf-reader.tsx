"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Clock,
  Highlighter,
  Maximize,
  Minimize,
  MoreVertical,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
  X,
} from "lucide-react";

// Mock PDF pages for demonstration
const mockPages = Array.from({ length: 10 }, (_, i) => (
  <div
    key={i}
    className="bg-white shadow-sm rounded-sm p-8 text-gray-800 min-h-[800px] flex flex-col"
  >
    <h2 className="text-2xl font-bold mb-4">Chapter {i + 1}</h2>
    <p className="mb-4">
      This is a sample page of content for the PDF reader. In a real
      implementation, this would display the actual PDF content.
    </p>
    <p className="mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor,
      nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl
      nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl
      aliquam nisl, eget ultricies nisl nisl eget nisl.
    </p>
    <p>Page {i + 1} of 10</p>
  </div>
));

// Mock notes for demonstration
const mockNotes = [
  {
    id: 1,
    page: 1,
    text: "Important concept about focus",
    color: "yellow",
    date: "2023-11-28",
  },
  {
    id: 2,
    page: 3,
    text: "Key point about habit formation",
    color: "green",
    date: "2023-11-27",
  },
  {
    id: 3,
    page: 5,
    text: "Remember this for later reference",
    color: "blue",
    date: "2023-11-26",
  },
];

// Mock bookmarks for demonstration
const mockBookmarks = [
  { id: 1, page: 2, title: "Introduction to concepts", date: "2023-11-28" },
  { id: 2, page: 7, title: "Important framework", date: "2023-11-25" },
];

export default function PdfReader() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(mockPages.length);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [notes, setNotes] = useState(mockNotes);
  const [bookmarks, setBookmarks] = useState(mockBookmarks);
  const [newNote, setNewNote] = useState("");
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("");
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
    setFocusMode(!focusMode);
    setShowSidebar(false);
  };

  // Add a new note
  const addNote = () => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: Date.now(),
        page: currentPage,
        text: newNote,
        color: "yellow",
        date: new Date().toISOString().split("T")[0],
      };
      setNotes([...notes, newNoteObj]);
      setNewNote("");
    }
  };

  // Add a new bookmark
  const addBookmark = () => {
    const title = newBookmarkTitle.trim() || `Page ${currentPage}`;
    const newBookmarkObj = {
      id: Date.now(),
      page: currentPage,
      title,
      date: new Date().toISOString().split("T")[0],
    };
    setBookmarks([...bookmarks, newBookmarkObj]);
    setNewBookmarkTitle("");
  };

  // Remove a note
  const removeNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Remove a bookmark
  const removeBookmark = (id: number) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  // Pomodoro timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning) {
      interval = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(pomodoroSeconds - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroMinutes(pomodoroMinutes - 1);
          setPomodoroSeconds(59);
        } else {
          // Timer completed
          setIsTimerRunning(false);
          alert("Pomodoro timer completed!");
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroMinutes, pomodoroSeconds]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  return (
    <div
      ref={readerRef}
      className={`flex flex-col h-screen ${focusMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Reader Header */}
      <header
        className={`flex justify-between items-center p-4 ${focusMode ? "bg-gray-800 text-white" : "bg-white border-b"}`}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard">
              <ArrowLeft size={20} />
            </a>
          </Button>
          <h1 className="text-lg font-semibold">Atomic Habits</h1>
          <Badge variant="outline">James Clear</Badge>
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
          className={`flex-1 overflow-auto p-4 ${focusMode ? "bg-gray-900" : ""}`}
        >
          <div
            className={`max-w-3xl mx-auto ${focusMode ? "bg-gray-800 text-gray-100" : ""}`}
          >
            {mockPages[currentPage - 1]}
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div
            className={`w-80 border-l overflow-auto ${focusMode ? "bg-gray-800 text-white border-gray-700" : "bg-white"}`}
          >
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note for this page..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="resize-none"
                    />
                    <Button onClick={addNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>

                  <div className="space-y-3 mt-6">
                    <h3 className="font-medium">Your Notes</h3>
                    {notes.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No notes yet. Add your first note above.
                      </p>
                    ) : (
                      notes.map((note) => (
                        <Card key={note.id} className="p-3 relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Highlighter
                                  size={14}
                                  className="text-yellow-500"
                                />
                                <span className="text-xs text-gray-500">
                                  Page {note.page}
                                </span>
                              </div>
                              <p className="text-sm">{note.text}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeNote(note.id)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {note.date}
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Bookmarks Tab */}
              <TabsContent value="bookmarks" className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Bookmark title (optional)"
                      value={newBookmarkTitle}
                      onChange={(e) => setNewBookmarkTitle(e.target.value)}
                    />
                    <Button onClick={addBookmark}>Bookmark Current Page</Button>
                  </div>

                  <div className="space-y-3 mt-6">
                    <h3 className="font-medium">Your Bookmarks</h3>
                    {bookmarks.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No bookmarks yet. Add your first bookmark above.
                      </p>
                    ) : (
                      bookmarks.map((bookmark) => (
                        <Card key={bookmark.id} className="p-3 relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Bookmark size={14} className="text-blue-500" />
                                <span className="text-xs text-gray-500">
                                  Page {bookmark.page}
                                </span>
                              </div>
                              <p className="text-sm font-medium">
                                {bookmark.title}
                              </p>
                            </div>
                            <div className="flex">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => goToPage(bookmark.page)}
                              >
                                <ArrowRight size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeBookmark(bookmark.id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {bookmark.date}
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Pomodoro Tab */}
              <TabsContent value="pomodoro" className="p-4">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-4">
                      {String(pomodoroMinutes).padStart(2, "0")}:
                      {String(pomodoroSeconds).padStart(2, "0")}
                    </div>
                    <div className="flex justify-center gap-2">
                      {!isTimerRunning ? (
                        <Button onClick={startTimer}>Start</Button>
                      ) : (
                        <Button onClick={pauseTimer} variant="outline">
                          Pause
                        </Button>
                      )}
                      <Button onClick={resetTimer} variant="outline">
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Session Length</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">5m</span>
                      <Slider
                        defaultValue={[25]}
                        min={5}
                        max={60}
                        step={5}
                        className="flex-1"
                        onValueChange={(value) => {
                          if (!isTimerRunning) {
                            setPomodoroMinutes(value[0]);
                            setPomodoroSeconds(0);
                          }
                        }}
                      />
                      <span className="text-sm">60m</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Pomodoro Technique
                    </h4>
                    <p>
                      Work focused for 25 minutes, then take a 5-minute break.
                      After 4 sessions, take a longer 15-30 minute break.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Reader Footer */}
      <footer
        className={`p-4 flex justify-between items-center ${focusMode ? "bg-gray-800 text-white" : "bg-white border-t"}`}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowLeft size={16} />
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page)) goToPage(page);
              }}
              className="w-16 text-center"
            />
            <span>of {totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowRight size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search size={16} />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings size={16} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
