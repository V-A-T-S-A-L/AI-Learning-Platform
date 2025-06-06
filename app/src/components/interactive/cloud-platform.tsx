"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, BookOpenCheck, MessageSquare, StickyNote, Cloud, ArrowRight, ListChecks } from "lucide-react"

export function CloudPlatform() {
	const [activePdf, setActivePdf] = useState<number | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [processStatus, setProcessStatus] = useState<string | null>(null)

	const handlePdfClick = (index: number) => {
		setActivePdf(index)
		setIsLoading(true)
		setProcessStatus(null)

		setTimeout(() => {
			setIsLoading(false)
			setProcessStatus("Loaded from cloud storage")
		}, 1500)
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if (!isLoading) {
				setActivePdf((prev) => {
					const next = prev === null ? 0 : (prev + 1) % 6
					return next
				})
			}
		}, 3000)

		return () => clearInterval(interval)
	}, [isLoading])

	return (
		<div className="bg-zinc-950 rounded-lg border border-zinc-600 p-6 h-full">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<Cloud className="h-5 w-5 text-purple-500" />
					<h3 className="font-medium">FlashMe Document Console</h3>
				</div>
				<div className="flex items-center gap-2 text-xs text-green-400">
					<span className="h-2 w-2 rounded-full bg-green-500"></span>
					Cloud Sync Active
				</div>
			</div>

			<div className="grid grid-cols-4 gap-4 mb-6">
				<div className="bg-gray-800/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
					<BookOpenCheck className="h-6 w-6 text-purple-400 mb-2" />
					<span className="text-xs text-gray-400">Flashcards</span>
					<span className="text-sm font-medium">Auto-Generated</span>
				</div>
				<div className="bg-gray-800/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
					<StickyNote className="h-6 w-6 text-blue-400 mb-2" />
					<span className="text-xs text-gray-400">Notes</span>
					<span className="text-sm font-medium">Saved</span>
				</div>
				<div className="bg-gray-800/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
					<MessageSquare className="h-6 w-6 text-green-400 mb-2" />
					<span className="text-xs text-gray-400">AI Chat</span>
					<span className="text-sm font-medium">Ready</span>
				</div>
				<div className="bg-gray-800/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
					<ListChecks className="h-6 w-6 text-pink-400 mb-2" />
					<span className="text-xs text-gray-400">Summary</span>
					<span className="text-sm font-medium">Auto-Generated</span>
				</div>
			</div>

			<div className="mb-2">
				<h4 className="text-sm font-medium mb-3">Your Uploaded PDFs</h4>
				<div className="grid grid-cols-3 gap-3">
					{Array.from({ length: 6 }).map((_, index) => (
						<button
							key={index}
							onClick={() => handlePdfClick(index)}
							className={`relative p-4 rounded-lg border transition-all ${activePdf === index
									? "border-purple-500 bg-purple-500/10"
									: "border-gray-700 bg-gray-800/30 hover:border-gray-600"
								}`}
						>
							<FileText
								className={`h-6 w-6 mx-auto mb-2 ${activePdf === index ? "text-purple-400" : "text-gray-400"}`}
							/>
							<span className="block text-xs text-center">PDF {index + 1}</span>
							{activePdf === index && (
								<motion.div
									className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-purple-500"
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
								/>
							)}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
