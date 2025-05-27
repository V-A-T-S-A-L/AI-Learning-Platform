"use client"

import { useState } from "react"
import { Save, FileText } from "lucide-react"

interface Document {
	uuid: string
	user_id: string
	file_name: string
	file_path: string
	created_at: string
	pages?: number
	type?: string
}

export default function NotesView({ document }: { document: Document }) {
	const [notes, setNotes] = useState("")
	const [isSaving, setIsSaving] = useState(false)
	const [lastSaved, setLastSaved] = useState<Date | null>(null)

	const handleSaveNotes = () => {
		setIsSaving(true)

		// Simulate saving delay
		setTimeout(() => {
			// Note: In a real app, you'd save to a database here
			// localStorage won't work in Claude.ai artifacts
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
						<p className="text-sm text-zinc-400">Take notes as you study "{document.file_name}"</p>
					</div>
				</div>
				<div className="flex items-center space-x-3">
					{lastSaved && (
						<span className="text-xs text-zinc-500">
							Last saved at {formatLastSaved()}
						</span>
					)}
					<button
						onClick={handleSaveNotes}
						disabled={isSaving}
						className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-6 py-2 shadow-lg transition-colors text-white flex items-center"
					>
						<Save className="h-4 w-4 mr-2" />
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>

			<textarea
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
				placeholder="Start typing your notes here..."
				className="flex-1 resize-none bg-zinc-950 border border-zinc-800 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder:text-zinc-500 rounded-2xl p-6 text-base leading-relaxed"
			/>
		</div>
	)
}