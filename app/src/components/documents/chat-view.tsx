"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"

interface Document {
	uuid: string
	user_id: string
	file_name: string
	file_path: string
	created_at: string
}

interface Message {
	id: string
	role: "user" | "assistant"
	content: string
	timestamp: Date
}

export default function ChatView({ document }: { document: Document }) {

	if (!document) return (
		<div className="flex items-center justify-center h-screen bg-black">
			<div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
		</div>
	)

	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			role: "assistant",
			content: `Hello! I'm your AI learning assistant for "${document.file_name}". Ask me any questions about this document, and I'll help you understand the content better.`,
			timestamp: new Date(),
		},
	])
	const [input, setInput] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	const handleSendMessage = () => {
		if (!input.trim()) return

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setInput("")
		setIsLoading(true)

		// Simulate AI response
		setTimeout(() => {
			const responses = [
				"Based on the document, this concept refers to the process of training a model with labeled data where the algorithm learns to map inputs to outputs.",
				"The document explains this as an iterative optimization algorithm used to minimize the cost function in machine learning models.",
				"According to the text, this is a fundamental trade-off in machine learning between how well a model fits the training data versus how well it generalizes to new data.",
				"This is described in the document as a technique to prevent models from memorizing the training data by adding regularization terms.",
				"The document mentions this as a method for evaluating model performance by splitting data into training and testing sets.",
			]

			const assistantMessage: Message = {
				id: Date.now().toString(),
				role: "assistant",
				content: responses[Math.floor(Math.random() * responses.length)],
				timestamp: new Date(),
			}

			setMessages((prev) => [...prev, assistantMessage])
			setIsLoading(false)
		}, 1500)
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	}

	return (
		<div className="h-full flex flex-col bg-black">
			{/* Replace ScrollArea with native div */}
			<div className="flex-1 p-6 overflow-y-auto">
				<div className="space-y-6">
					{messages.map((message) => (
						<div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
							<div className={`flex max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
								<div
									className={`flex items-center justify-center h-10 w-10 rounded-2xl flex-shrink-0 ${message.role === "user" ? "bg-purple-600 ml-3" : "bg-zinc-800 mr-3"
										}`}
								>
									{message.role === "user" ? (
										<User className="h-5 w-5 text-white" />
									) : (
										<Bot className="h-5 w-5 text-white" />
									)}
								</div>
								<div
									className={`rounded-3xl px-6 py-4 shadow-lg ${message.role === "user"
											? "bg-purple-600 text-white"
											: "bg-zinc-900 text-zinc-200 border border-zinc-800"
										}`}
								>
									<div className="text-sm leading-relaxed">{message.content}</div>
									<div className={`text-xs mt-2 ${message.role === "user" ? "text-purple-200" : "text-zinc-500"}`}>
										{formatTime(message.timestamp)}
									</div>
								</div>
							</div>
						</div>
					))}
					{isLoading && (
						<div className="flex justify-start">
							<div className="flex flex-row">
								<div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-zinc-800 mr-3">
									<Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
								</div>
								<div className="rounded-3xl px-6 py-4 bg-zinc-900 border border-zinc-800">
									<div className="flex space-x-2">
										<div
											className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce"
											style={{ animationDelay: "0ms" }}
										></div>
										<div
											className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce"
											style={{ animationDelay: "150ms" }}
										></div>
										<div
											className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce"
											style={{ animationDelay: "300ms" }}
										></div>
									</div>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className="p-6 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
				<div className="flex space-x-3">
					{/* Replace Input with native input */}
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault()
								handleSendMessage()
							}
						}}
						placeholder="Ask a question about this document..."
						className="flex-1 bg-zinc-900 border border-zinc-700 focus:ring-2 focus:ring-purple-500 focus:outline-none rounded-2xl px-6 py-3 text-white placeholder:text-zinc-500"
					/>
					{/* Replace Button with native button */}
					<button
						onClick={handleSendMessage}
						disabled={isLoading || !input.trim()}
						className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-6 py-3 shadow-lg transition-colors"
					>
						<Send className="h-5 w-5 text-white" />
					</button>
				</div>
			</div>
		</div>
	)
}