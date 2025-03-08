"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "../../supabase/supabase";

interface ReadingProgressProps {
  pdfId: string;
  initialProgress?: number;
  totalPages: number;
  currentPage: number;
}

export default function ReadingProgress({
  pdfId,
  initialProgress = 0,
  totalPages,
  currentPage,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update progress when current page changes
  useEffect(() => {
    const newProgress = Math.round((currentPage / totalPages) * 100);
    if (newProgress > progress) {
      setProgress(newProgress);
    }
  }, [currentPage, totalPages, progress]);

  // Auto-save progress every 30 seconds if changed
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (progress > initialProgress) {
        await saveProgress();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [progress, initialProgress]);

  // Save progress to database
  const saveProgress = async () => {
    try {
      setIsSaving(true);

      // Use the API endpoint instead of direct Supabase call
      const response = await fetch(`/api/pdf/${pdfId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          progress: progress,
          last_read: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Reading Progress</span>
        <span className="text-sm">{progress}%</span>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          {lastSaved && <span>Last saved: {formatTime(lastSaved)}</span>}
          <Button
            size="sm"
            variant="outline"
            onClick={saveProgress}
            disabled={isSaving || progress === initialProgress}
            className="h-7 px-2 text-xs"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
