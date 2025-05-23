"use client"

import { useState, useEffect } from "react"
import { Save, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Document {
  id: string
  title: string
  type: string
  url: string
  pages: number
}

export default function NotesView({ document }: { document: Document }) {
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load saved notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${document.id}`)
    if (savedNotes) {
      setNotes(savedNotes)
      setLastSaved(new Date())
    }
  }, [document.id])

  const handleSaveNotes = () => {
    setIsSaving(true)

    // Simulate saving delay
    setTimeout(() => {
      localStorage.setItem(`notes-${document.id}`, notes)
      setLastSaved(new Date())
      setIsSaving(false)
    }, 800)
  }

  const formatLastSaved = () => {
    if (!lastSaved) return ""

    return lastSaved.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-full flex flex-col bg-black p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-zinc-900 rounded-2xl mr-3">
            <FileText className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Your Notes</h3>
            <p className="text-sm text-zinc-400">Take notes as you study this document</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {lastSaved && <span className="text-xs text-zinc-500">Last saved at {formatLastSaved()}</span>}
          <Button
            onClick={handleSaveNotes}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 rounded-2xl px-6 py-2 shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Start typing your notes here..."
        className="flex-1 resize-none bg-zinc-950 border-zinc-800 focus-visible:ring-purple-500 text-white placeholder:text-zinc-500 rounded-2xl p-6 text-base leading-relaxed"
      />
    </div>
  )
}
