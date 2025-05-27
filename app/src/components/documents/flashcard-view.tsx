"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, Shuffle, ArrowUpDown, Funnel, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { usePDF } from "@/contexts/pdf-context"

interface Flashcard {
  id: string
  question: string
  answer: string
  difficulty: string
  page_no: string
}

type SortOption = 'difficulty-asc' | 'difficulty-desc' | 'page-asc' | 'page-desc' | 'none'
type FilterOption = 'all' | 'easy' | 'medium' | 'hard'

export default function FlashcardView({ flashcards }: { flashcards: Flashcard[] }) {
  const params = useParams();
  const docId = params?.id as string;

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [flipped, setFlipped] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set())

  const { setCurrentPage } = usePDF();

  // Filter and sort flashcards
  const processedFlashcards = useMemo(() => {
    let filtered = [...flashcards]

    // Apply filter
    if (filterOption !== 'all') {
      filtered = filtered.filter(card => card.difficulty.toLowerCase() === filterOption)
    }

    // Apply sort
    if (sortOption !== 'none') {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'difficulty-asc':
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 }
            return (difficultyOrder[a.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 0) -
              (difficultyOrder[b.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 0)
          case 'difficulty-desc':
            const difficultyOrderDesc = { 'hard': 1, 'medium': 2, 'easy': 3 }
            return (difficultyOrderDesc[a.difficulty.toLowerCase() as keyof typeof difficultyOrderDesc] || 0) -
              (difficultyOrderDesc[b.difficulty.toLowerCase() as keyof typeof difficultyOrderDesc] || 0)
          case 'page-asc':
            return parseInt(a.page_no) - parseInt(b.page_no)
          case 'page-desc':
            return parseInt(b.page_no) - parseInt(a.page_no)
          default:
            return 0
        }
      })
    }

    return filtered
  }, [flashcards, sortOption, filterOption])

  const currentCard = processedFlashcards[currentIndex]
  const progress = processedFlashcards.length > 0 ? Math.round(((currentIndex + 1) / processedFlashcards.length) * 100) : 0

  // Reset current index when filters/sorts change
  useEffect(() => {
    setCurrentIndex(0)
    setFlipped(false)
  }, [sortOption, filterOption])

  const handlePageClick = (pageNumber: string) => {
    setCurrentPage(parseInt(pageNumber));
  };

  const handlePrevCard = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev === 0 ? processedFlashcards.length - 1 : prev - 1))
  }

  const handleNextCard = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev === processedFlashcards.length - 1 ? 0 : prev + 1))
  }

  const toggleFlip = () => {
    setFlipped(!flipped)
  }

  const resetProgress = () => {
    setCurrentIndex(0)
    setFlipped(false)
  }

  const shuffleCards = () => {
    // This would require a more complex implementation to truly shuffle
    // For now, we'll just reset and change sort to none
    setSortOption('none')
    setCurrentIndex(0)
    setFlipped(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'difficulty-asc': return 'Difficulty (Easy → Hard)'
      case 'difficulty-desc': return 'Difficulty (Hard → Easy)'
      case 'page-asc': return 'Page Number (Low → High)'
      case 'page-desc': return 'Page Number (High → Low)'
      default: return 'None'
    }
  }

  const getFilterLabel = (option: FilterOption) => {
    switch (option) {
      case 'all': return 'All Cards'
      case 'easy': return 'Easy Cards'
      case 'medium': return 'Medium Cards'
      case 'hard': return 'Hard Cards'
      default: return 'All Cards'
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
  }, [currentIndex, flipped, processedFlashcards.length])

  return (
    <div className="h-full flex flex-col bg-black p-6">
      {/* First Header with Progress (from first return) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">Study Progress</h3>
          <div className="flex items-center space-x-4">
            <Progress value={progress} className="flex-1 h-2 bg-zinc-900 rounded-full" />
            <span className="text-sm text-zinc-400 font-medium min-w-[80px]">
              {currentIndex + 1} / {processedFlashcards.length} cards
            </span>
          </div>
          {(filterOption !== 'all' || sortOption !== 'none') && (
            <div className="mt-2 flex items-center space-x-2">
              {filterOption !== 'all' && (
                <Badge className="bg-blue-600 text-white">
                  {getFilterLabel(filterOption)}
                </Badge>
              )}
              {sortOption !== 'none' && (
                <Badge className="bg-green-600 text-white">
                  {getSortLabel(sortOption)}
                </Badge>
              )}
            </div>
          )}
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
            onClick={shuffleCards}
            className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
              <DropdownMenuItem
                onClick={() => setSortOption('none')}
                className={`text-zinc-300 hover:bg-zinc-800 hover:text-white ${sortOption === 'none' ? 'bg-zinc-800 text-white' : ''}`}
              >
                None
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem
                onClick={() => setSortOption('difficulty-asc')}
                className={`text-zinc-300 hover:bg-zinc-800 hover:text-white ${sortOption === 'difficulty-asc' ? 'bg-zinc-800 text-white' : ''}`}
              >
                Difficulty (Easy → Hard)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption('difficulty-desc')}
                className={`text-zinc-300 hover:bg-zinc-800 hover:text-white ${sortOption === 'difficulty-desc' ? 'bg-zinc-800 text-white' : ''}`}
              >
                Difficulty (Hard → Easy)
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem
                onClick={() => setSortOption('page-asc')}
                className={`text-zinc-300 hover:bg-zinc-800 hover:text-white ${sortOption === 'page-asc' ? 'bg-zinc-800 text-white' : ''}`}
              >
                Page Number (Low → High)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption('page-desc')}
                className={`text-zinc-300 hover:bg-zinc-800 hover:text-white ${sortOption === 'page-desc' ? 'bg-zinc-800 text-white' : ''}`}
              >
                Page Number (High → Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Funnel className="h-4 w-4 mr-2" />
                {getFilterLabel(filterOption)}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
              <DropdownMenuItem
                onClick={() => setFilterOption('all')}
                className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                All Cards ({flashcards.length})
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterOption('easy')}
                className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Easy ({flashcards.filter(c => c.difficulty.toLowerCase() === 'easy').length})
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterOption('medium')}
                className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Medium ({flashcards.filter(c => c.difficulty.toLowerCase() === 'medium').length})
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterOption('hard')}
                className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Hard ({flashcards.filter(c => c.difficulty.toLowerCase() === 'hard').length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* No flashcards case (from first return) */}
      {(!flashcards || flashcards.length === 0 || !currentCard) && (
        <div className="h-full flex flex-col items-center justify-center bg-black p-6 text-white">
          <p className="text-lg font-semibold">No flashcards available</p>
          <p className="text-sm text-zinc-400 mt-2">Please generate flashcards for this document.</p>
        </div>
      )}

      {/* No cards match filter case (from first return) */}
      {processedFlashcards.length === 0 && !(!flashcards || flashcards.length === 0 || !currentCard) && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Funnel className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No cards match your filter</h3>
            <p className="text-zinc-400 mb-4">Try selecting a different filter or clear all filters to see all cards.</p>
            <Button
              onClick={() => setFilterOption('all')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Show All Cards
            </Button>
          </div>
        </div>
      )}

      {/* Second Header with Progress (from second return) */}
      {!(processedFlashcards.length === 0 || !flashcards || flashcards.length === 0 || !currentCard) && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Study Progress</h3>
            <div className="flex items-center space-x-4">
              <Progress value={progress} className="flex-1 h-3 bg-zinc-900 rounded-full" />
              <span className="text-sm text-zinc-400 font-medium min-w-[80px]">
                {currentIndex + 1} / {flashcards.length} cards
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-6">
            <Button
              variant="outline"
              size="sm"
              onClick={resetProgress}
              className="rounded-xl border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shuffleCards}
              className="rounded-xl border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>
      )}

      {/* Flashcard (from both returns, merged) */}
      {!(processedFlashcards.length === 0 || !flashcards || flashcards.length === 0 || !currentCard) && (
        <div className="flex-1 flex items-center justify-center">
          <Card
            className={`w-full max-w-2xl mx-auto bg-zinc-950 border-zinc-800 shadow-2xl cursor-pointer transition-all duration-500 rounded-3xl overflow-hidden ${flipped ? "bg-zinc-900" : ""}`}
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
                  <h3 className="text-xl font-semibold text-emerald-400 mb-4">Answer</h3>
                  <p className="text-zinc-300 text-lg leading-relaxed">{currentCard.answer}</p>
                  <p
                    className="mt-5 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-600 duration-300 bg-zinc-700 w-fit text-center m-auto p-1 rounded-lg cursor-pointer"
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
      )}

      {/* Controls (from second return) */}
      {!(processedFlashcards.length === 0 || !flashcards || flashcards.length === 0 || !currentCard) && (
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
                <span> / {processedFlashcards.length}</span>
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
      )}
    </div>
  )
}