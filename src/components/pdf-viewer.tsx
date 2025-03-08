"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Maximize,
  Minimize,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
} from "lucide-react";

interface PdfViewerProps {
  pdfUrl?: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function PdfViewer({
  pdfUrl = "",
  initialPage = 1,
  onPageChange,
}: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // PDF.js objects
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  useEffect(() => {
    // Load PDF.js dynamically
    const loadPdfJs = async () => {
      try {
        // In a real implementation, you would load PDF.js here
        // For now, we'll simulate loading a PDF
        setIsLoading(false);
        setTotalPages(10); // Mock 10 pages
      } catch (err: any) {
        setError(err.message || "Failed to load PDF viewer");
        setIsLoading(false);
      }
    };

    loadPdfJs();
  }, []);

  useEffect(() => {
    if (pdfUrl) {
      // In a real implementation, you would load the PDF here
      console.log("Loading PDF from URL:", pdfUrl);
      // For now, we'll just simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [pdfUrl]);

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (onPageChange) onPageChange(page);
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
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

  // Handle zoom in/out
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  // Render mock PDF page
  const renderMockPage = () => {
    return (
      <div className="bg-white shadow-sm rounded-sm p-8 text-gray-800 min-h-[800px] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Chapter {currentPage}</h2>
        <p className="mb-4">
          This is a sample page of content for the PDF reader. In a real
          implementation, this would display the actual PDF content.
        </p>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
          ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
          tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
        </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-2">Error loading PDF</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      className={`flex flex-col h-screen ${focusMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Viewer Header */}
      <header
        className={`flex justify-between items-center p-4 ${focusMode ? "bg-gray-800 text-white" : "bg-white border-b"}`}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard">
              <ArrowLeft size={20} />
            </a>
          </Button>
          <h1 className="text-lg font-semibold">PDF Viewer</h1>
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
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <canvas ref={canvasRef} className="hidden"></canvas>
            {renderMockPage()}
          </div>
        </div>
      </div>

      {/* Viewer Footer */}
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
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <span className="text-sm font-bold">-</span>
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            title="Zoom In"
          >
            <span className="text-sm font-bold">+</span>
          </Button>
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
