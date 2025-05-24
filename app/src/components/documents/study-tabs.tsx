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
	if (!document) {
		return (
			<div className="bg-black">
			</div>
		)
	}
	return (
		<div className="h-full flex flex-col bg-black">
			{/* Fixed Header */}
			<div className="flex-shrink-0 p-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
				<h2 className="text-xl font-semibold text-white">Study Materials</h2>
				<p className="text-sm text-zinc-400 mt-1">Review and learn from this document</p>
			</div>

			{/* Tabs Container - fills remaining height */}
			<Tabs defaultValue="flashcards" className="flex-1 flex flex-col min-h-0">
				{/* Fixed Tab Navigation - Always Visible */}
				<TabsList className="flex-shrink-0 grid w-full grid-cols-4 bg-zinc-950 border-b border-zinc-800 rounded-none h-14">
					<TabsTrigger
						value="flashcards"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg"
					>
						<BookOpen className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Flashcards</span>
					</TabsTrigger>
					<TabsTrigger
						value="chat"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg"
					>
						<MessageSquare className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Chat</span>
					</TabsTrigger>
					<TabsTrigger
						value="notes"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg"
					>
						<FileText className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Notes</span>
					</TabsTrigger>
					<TabsTrigger
						value="summary"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg"
					>
						<ListChecks className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Summary</span>
					</TabsTrigger>
				</TabsList>

				{/* Scrollable Tab Content */}
				<div className="flex-1 min-h-0 overflow-hidden">
					<TabsContent value="flashcards" className="h-full m-0 overflow-auto">
						<FlashcardView flashcards={flashcards} />
					</TabsContent>

					<TabsContent value="chat" className="h-full m-0 overflow-auto p-4">
						<ChatView document={document} />
					</TabsContent>

					<TabsContent value="notes" className="h-full m-0 overflow-auto p-4">
						<NotesView document={document} />
					</TabsContent>

					<TabsContent value="summary" className="h-full m-0 overflow-auto">
						<SummaryView document={document} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	)
}