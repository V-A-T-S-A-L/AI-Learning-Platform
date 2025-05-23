"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  title: string
  type: string
  url: string
  pages: number
}

export default function DocumentViewer({ document }: { document: Document }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < document.pages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 10)
    }
  }

  const toggleFullscreen = () => {
    const viewerElement = document.getElementById("document-viewer")

    if (!isFullscreen) {
      if (viewerElement?.requestFullscreen) {
        viewerElement.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="flex flex-col h-full bg-black border-r border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-white truncate">{document.title}</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {document.type} • {document.pages} pages
          </p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center bg-zinc-900 rounded-xl p-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="px-3 py-1 text-sm text-zinc-300 font-medium min-w-[60px] text-center">{zoom}%</div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800 rounded-xl">
              <DropdownMenuItem onClick={toggleFullscreen} className="rounded-lg">
                {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg">
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Document Display */}
      <div id="document-viewer" className="flex-1 overflow-auto bg-zinc-950 flex items-center justify-center p-6">
        <div className="relative">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className="relative bg-white shadow-2xl rounded-2xl overflow-hidden"
          >
            <img
              src={document.url || "/placeholder.svg"}
              alt={`Page ${currentPage} of ${document.title}`}
              className="max-w-full h-auto block"
            />
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full">
              Page {currentPage} of {document.pages}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center p-6 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center bg-zinc-900 rounded-2xl p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="px-6 py-2 text-sm text-zinc-300 font-medium">
            <span className="text-white font-semibold">{currentPage}</span>
            <span className="text-zinc-500"> / {document.pages}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === document.pages}
            className="h-10 w-10 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
