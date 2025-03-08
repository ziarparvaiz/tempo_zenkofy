"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Highlighter, X } from "lucide-react";
import { supabase } from "../../supabase/supabase";

interface Note {
  id: number;
  page: number;
  text: string;
  color: string;
  date: string;
}

interface NoteTakingProps {
  pdfId: string;
  currentPage: number;
  initialNotes?: Note[];
}

export default function NoteTaking({
  pdfId,
  currentPage,
  initialNotes = [],
}: NoteTakingProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from the database
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/pdf/${pdfId}/notes`);

        if (response.ok) {
          const data = await response.json();
          if (data.notes && Array.isArray(data.notes)) {
            setNotes(
              data.notes.map((note: any) => ({
                id: note.id,
                page: note.page,
                text: note.text,
                color: note.color,
                date: new Date(note.created_at).toISOString().split("T")[0],
              })),
            );
          }
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [pdfId]);

  // Add a new note
  const addNote = async () => {
    if (!newNote.trim()) return;

    setIsSaving(true);

    try {
      // Save note to the database via API
      const response = await fetch(`/api/pdf/${pdfId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPage,
          text: newNote,
          color: "yellow",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const data = await response.json();

      // Add the new note to the local state
      const newNoteObj: Note = {
        id: data.note.id,
        page: currentPage,
        text: newNote,
        color: "yellow",
        date: new Date().toISOString().split("T")[0],
      };

      setNotes([...notes, newNoteObj]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Remove a note
  const removeNote = async (id: number) => {
    try {
      // Delete note from the database via API
      const response = await fetch(`/api/pdf/${pdfId}/notes?noteId=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      // Update the local state
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error removing note:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note for this page..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="resize-none"
        />
        <Button onClick={addNote} disabled={!newNote.trim() || isSaving}>
          {isSaving ? "Adding..." : "Add Note"}
        </Button>
      </div>

      <div className="space-y-3 mt-6">
        <h3 className="font-medium">Your Notes</h3>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">
            No notes yet. Add your first note above.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card key={note.id} className="p-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Highlighter size={14} className="text-yellow-500" />
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
                <div className="text-xs text-gray-500 mt-2">{note.date}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
