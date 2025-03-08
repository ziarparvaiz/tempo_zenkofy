"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bookmark, ArrowRight, X } from "lucide-react";

interface BookmarkItem {
  id: number;
  page: number;
  title: string;
  date: string;
}

interface BookmarkManagerProps {
  pdfId: string;
  currentPage: number;
  initialBookmarks?: BookmarkItem[];
  onNavigate: (page: number) => void;
}

export default function BookmarkManager({
  pdfId,
  currentPage,
  initialBookmarks = [],
  onNavigate,
}: BookmarkManagerProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(initialBookmarks);
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from the database
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/pdf/${pdfId}/bookmarks`);

        if (response.ok) {
          const data = await response.json();
          if (data.bookmarks && Array.isArray(data.bookmarks)) {
            setBookmarks(
              data.bookmarks.map((bookmark: any) => ({
                id: bookmark.id,
                page: bookmark.page,
                title: bookmark.title,
                date: new Date(bookmark.created_at).toISOString().split("T")[0],
              })),
            );
          }
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [pdfId]);

  // Add a new bookmark
  const addBookmark = async () => {
    const title = newBookmarkTitle.trim() || `Page ${currentPage}`;

    setIsSaving(true);

    try {
      // Save bookmark to the database via API
      const response = await fetch(`/api/pdf/${pdfId}/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPage,
          title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save bookmark");
      }

      const data = await response.json();

      // Add the new bookmark to the local state
      const newBookmarkObj: BookmarkItem = {
        id: data.bookmark.id,
        page: currentPage,
        title,
        date: new Date().toISOString().split("T")[0],
      };

      setBookmarks([...bookmarks, newBookmarkObj]);
      setNewBookmarkTitle("");
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert(error instanceof Error ? error.message : "Failed to add bookmark");
    } finally {
      setIsSaving(false);
    }
  };

  // Remove a bookmark
  const removeBookmark = async (id: number) => {
    try {
      // Delete bookmark from the database via API
      const response = await fetch(
        `/api/pdf/${pdfId}/bookmarks?bookmarkId=${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }

      // Update the local state
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  // Check if current page is already bookmarked
  const isCurrentPageBookmarked = bookmarks.some(
    (bookmark) => bookmark.page === currentPage,
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Bookmark title (optional)"
          value={newBookmarkTitle}
          onChange={(e) => setNewBookmarkTitle(e.target.value)}
          disabled={isSaving || isCurrentPageBookmarked}
        />
        <Button
          onClick={addBookmark}
          disabled={isSaving || isCurrentPageBookmarked}
          className="w-full"
        >
          {isSaving
            ? "Adding..."
            : isCurrentPageBookmarked
              ? "Page Already Bookmarked"
              : "Bookmark Current Page"}
        </Button>
      </div>

      <div className="space-y-3 mt-6">
        <h3 className="font-medium">Your Bookmarks</h3>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No bookmarks yet. Add your first bookmark above.
          </p>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="p-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark size={14} className="text-blue-500" />
                      <span className="text-xs text-gray-500">
                        Page {bookmark.page}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{bookmark.title}</p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onNavigate(bookmark.page)}
                      title="Go to page"
                    >
                      <ArrowRight size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeBookmark(bookmark.id)}
                      title="Remove bookmark"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {bookmark.date}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
