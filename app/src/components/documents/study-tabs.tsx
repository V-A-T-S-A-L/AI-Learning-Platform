"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MessageSquare, FileText, ListChecks } from "lucide-react"
import FlashcardView from "@/components/documents/flashcard-view"
import ChatView from "@/components/documents/chat-view"
import NotesView from "@/components/documents/notes-view"
import SummaryView from "@/components/documents/summary-view"

interface Document {
  id: string
  title: string
  type: string
  url: string
  pages: number
}

interface Flashcard {
  id: string
  question: string
  answer: string
  difficulty: string
}

export default function StudyTabs({
  document,
  flashcards,
}: {
  document: Document
  flashcards: Flashcard[]
}) {
  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white">Study Materials</h2>
        <p className="text-sm text-zinc-400 mt-1">Review and learn from this document</p>
      </div>

      <Tabs defaultValue="flashcards" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 bg-zinc-950 border-b border-zinc-800 rounded-none h-14">
          <TabsTrigger
            value="flashcards"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg rounded-xl mx-1 my-2 transition-all duration-200"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Flashcards</span>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg rounded-xl mx-1 my-2 transition-all duration-200"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg rounded-xl mx-1 my-2 transition-all duration-200"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg rounded-xl mx-1 my-2 transition-all duration-200"
          >
            <ListChecks className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="flex-1 m-0">
          <FlashcardView flashcards={flashcards} />
        </TabsContent>

        <TabsContent value="chat" className="flex-1 m-0">
          <ChatView document={document} />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 m-0">
          <NotesView document={document} />
        </TabsContent>

        <TabsContent value="summary" className="flex-1 m-0">
          <SummaryView document={document} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
