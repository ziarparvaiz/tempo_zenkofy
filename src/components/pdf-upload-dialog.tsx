"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Upload,
  X,
  Tag as TagIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

export default function PdfUploadDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setAuthor("");
    setTags([]);
    setCurrentTag("");
    setUploadStatus({ type: null, message: "" });
  };

  const handleClose = () => {
    if (!isUploading) {
      setIsOpen(false);
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title) return;

    try {
      setIsUploading(true);
      setUploadStatus({ type: null, message: "" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("author", author);
      formData.append("tags", JSON.stringify(tags));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload PDF");
      }

      setUploadStatus({
        type: "success",
        message: "PDF uploaded successfully!",
      });

      // Close dialog and refresh the page after a short delay
      setTimeout(() => {
        handleClose();
        router.refresh(); // Refresh the page to show the new PDF
      }, 1500);
    } catch (error: any) {
      setUploadStatus({
        type: "error",
        message: error.message || "An error occurred during upload",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add PDF</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogDescription>
            Add a new PDF to your library. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="bg-blue-100 p-2 rounded">
                    <Upload size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  className="h-8 w-8"
                  disabled={isUploading}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer text-blue-600 hover:underline"
                  >
                    <span>Click to upload</span>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </label>
                  <span> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">
                  PDF files only (max 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
              disabled={isUploading}
            />
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              disabled={isUploading}
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <TagIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tags and press Enter"
                  className="pl-10"
                  disabled={isUploading}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!currentTag.trim() || isUploading}
              >
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 ml-1"
                      disabled={isUploading}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Upload Status */}
          {uploadStatus.type && (
            <div
              className={`p-3 rounded-md flex items-center gap-2 ${uploadStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {uploadStatus.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{uploadStatus.message}</span>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || !title || isUploading}
              className="relative"
            >
              {isUploading && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              {isUploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
