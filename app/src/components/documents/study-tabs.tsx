"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MessageSquare, FileText, ListChecks } from "lucide-react"
import FlashcardView from "@/components/documents/flashcard-view"
import ChatView from "@/components/documents/chat-view"
import NotesView from "@/components/documents/notes-view"
import SummaryView from "@/components/documents/summary-view"

interface Document {
	uuid: string
	user_id: string
	file_name: string
	file_path: string
	created_at: string
	pages?: number
	type?: string
}

interface Flashcard {
	id: string
	question: string
	answer: string
	difficulty: string
	page_no: string
}

interface KeyTopic {
	topic: string;
	description: string;
	pageNumbers: number[];
	importance: 'high' | 'medium' | 'low';
}

interface LearningRecommendation {
	type: 'prerequisite' | 'follow_up' | 'practice' | 'resource';
	title: string;
	description: string;
	priority: 'high' | 'medium' | 'low';
}

interface PDFSummary {
	overallSummary: string;
	keyTopics: KeyTopic[];
	learningRecommendations: LearningRecommendation[];
	documentStats: {
		totalPages: number;
		estimatedReadingTime: number;
		difficulty: 'beginner' | 'intermediate' | 'advanced';
		category: string;
	};
	generatedAt: string;
}

export default function StudyTabs({
	document,
	flashcards,
	pdfSummary
}: {
	document: Document
	flashcards: Flashcard[]
	pdfSummary: PDFSummary
}) {
	// Return empty div if document is falsy
	if (!document) {
		return <div className="bg-black"></div>
	}

	// Ensure flashcards is an array
	const validFlashcards = Array.isArray(flashcards) ? flashcards : []

	return (
		<div className="h-full flex flex-col bg-black">
			{/* Fixed Header */}
			<div className="flex-shrink-0 p-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
				<p className="text-sm text-zinc-400 mt-2">Review and learn from this document</p>
			</div>

			{/* Tabs Container - fills remaining height */}
			<Tabs defaultValue="flashcards" className="flex-1 flex flex-col min-h-0">
				{/* Fixed Tab Navigation - Always Visible */}
				<TabsList className="flex-shrink-0 grid w-full grid-cols-4 bg-black border-zinc-800 rounded-none h-14">
					<TabsTrigger
						value="flashcards"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
					>
						<BookOpen className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Flashcards</span>
					</TabsTrigger>
					<TabsTrigger
						value="chat"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
					>
						<MessageSquare className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Chat</span>
					</TabsTrigger>
					<TabsTrigger
						value="notes"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
					>
						<FileText className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Notes</span>
					</TabsTrigger>
					<TabsTrigger
						value="summary"
						className="cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 mx-1 my-2 transition-all duration-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
					>
						<ListChecks className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Summary</span>
					</TabsTrigger>
				</TabsList>

				{/* Scrollable Tab Content */}
				<div className="flex-1 min-h-0 overflow-hidden">
					<TabsContent value="flashcards" className="h-full m-0 overflow-auto">
						<FlashcardView flashcards={validFlashcards} />
					</TabsContent>

					<TabsContent value="chat" className="h-full m-0 overflow-auto p-4">
						<ChatView document={document} />
					</TabsContent>

					<TabsContent value="notes" className="h-full m-0 overflow-auto p-4">
						<NotesView document={document} />
					</TabsContent>

					<TabsContent value="summary" className="h-full m-0 overflow-auto">
						<SummaryView summary={pdfSummary} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	)
}