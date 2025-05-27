"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useParams } from "next/navigation"
import { usePDF } from "@/contexts/pdf-context"

interface Flashcard {
	id: string
	question: string
	answer: string
	difficulty: string
	page_no: string
}

export default function FlashcardView({ flashcards }: { flashcards: Flashcard[] }) {

	const params = useParams();
	const docId = params?.id as string;

	const [currentIndex, setCurrentIndex] = useState<number>(0)
	const [flipped, setFlipped] = useState(false)

	const currentCard = flashcards[currentIndex]
	const progress = Math.round(((currentIndex + 1) / flashcards.length) * 100)

	const { setCurrentPage } = usePDF();

	const handlePageClick = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const handlePrevCard = () => {
		setFlipped(false)
		setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1))
	}

	const handleNextCard = () => {
		setFlipped(false)
		setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1))
	}

	const toggleFlip = () => {
		setFlipped(!flipped)
	}

	const resetProgress = () => {
		setCurrentIndex(0)
		setFlipped(false)
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "bg-emerald-600 hover:bg-emerald-700 text-white"
			case "medium":
				return "bg-amber-600 hover:bg-amber-700 text-white"
			case "hard":
				return "bg-red-600 hover:bg-red-700 text-white"
			default:
				return "bg-zinc-600 hover:bg-zinc-700 text-white"
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') {
				handleNextCard()
			} else if (e.key === 'ArrowLeft') {
				handlePrevCard()
			} else if (e.key === ' ') {
				e.preventDefault() // prevent spacebar from scrolling
				toggleFlip()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [currentIndex, flipped]) // dependencies


	return (
		<div className="h-full flex flex-col bg-black p-6">
			{/* Header with Progress */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex-1">
					<div className="flex items-center">
						<h3 className="text-lg font-semibold text-white mb-2">Study Progress</h3>
						{currentIndex + 1 == flashcards.length && (
							<p className="text-sm font-semibold ml-3 text-green-300 mb-2">Completed!!</p>
						)}
					</div>
					<div className="flex items-center space-x-4">
						<Progress value={progress} className="flex-1 h-2 bg-zinc-900 rounded-full" />
						<span className="text-sm text-zinc-400 font-medium min-w-[80px]">
							{currentIndex + 1} / {flashcards.length} cards
						</span>
					</div>
				</div>
				<div className="flex items-center space-x-2 ml-6">
					<Button
						variant="ghost"
						size="sm"
						onClick={resetProgress}
						className="rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white"
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						Reset
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
					>
						<Shuffle className="h-4 w-4 mr-2" />
						Shuffle
					</Button>
				</div>
			</div>

			{/* Flashcard */}
			<div className="flex-1 flex items-center justify-center">
				<Card
					className={`w-full max-w-2xl mx-auto bg-zinc-950 border-zinc-800 shadow-2xl cursor-pointer transition-all duration-500 rounded-3xl overflow-hidden ${flipped ? "bg-zinc-900" : ""
						}`}
					onClick={toggleFlip}
					style={{
						perspective: "1000px",
						height: "400px",
					}}
				>
					<div
						style={{
							transformStyle: "preserve-3d",
							transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
							transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
							height: "100%",
							position: "relative",
						}}
					>
						{/* Front of card */}
						<div
							style={{
								backfaceVisibility: "hidden",
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								padding: "2rem",
							}}
						>
							<div className="absolute top-6 right-6">
								<Badge className={`${getDifficultyColor(currentCard.difficulty)} rounded-full px-3 py-1`}>
									{currentCard.difficulty}
								</Badge>
							</div>
							<div className="text-center">
								{/* <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-2xl mb-6">
									<span className="text-white font-bold text-lg">Q</span>
								</div> */}
								<h3 className="text-xl font-semibold text-white mb-4">Question</h3>
								<p className="text-zinc-300 text-lg leading-relaxed">{currentCard.question}</p>
							</div>
							<div className="absolute bottom-6 left-0 right-0 text-center">
								<p className="text-sm text-zinc-500">Click to reveal answer</p>
							</div>
						</div>

						{/* Back of card */}
						<div
							style={{
								backfaceVisibility: "hidden",
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								padding: "2rem",
								transform: "rotateY(180deg)",
							}}
						>
							<div className="text-center">
								{/* <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-2xl mb-6">
									<span className="text-white font-bold text-lg">A</span>
								</div> */}
								<h3 className="text-xl font-semibold text-emerald-400 mb-4">Answer</h3>
								<p className="text-zinc-300 text-lg leading-relaxed">{currentCard.answer}</p>
								<p
									className="mt-5 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-600 duration-300 bg-zinc-700 w-fit text-center m-auto p-1 rounded-lg"
									onClick={(e) => {
										e.stopPropagation()
										handlePageClick(currentCard.page_no)
									}}
								>
									Page no. {currentCard.page_no}
								</p>
							</div>
						</div>
					</div>
				</Card>
			</div>

			{/* Controls */}
			<div className="mt-8 flex flex-col space-y-6">
				<div className="flex justify-center">
					<div className="flex items-center bg-zinc-950 rounded-2xl p-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={handlePrevCard}
							className="h-12 w-12 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>

						<div className="px-6 py-2 text-sm text-zinc-400 font-medium">
							<span className="text-white font-semibold">{currentIndex + 1}</span>
							<span> / {flashcards.length}</span>
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={handleNextCard}
							className="h-12 w-12 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
