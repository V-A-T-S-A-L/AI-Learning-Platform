"use client"

import { notFound } from "next/navigation"
import DocumentViewer from "@/components/documents/document-viewer"
import StudyTabs from "@/components/documents/study-tabs"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { PDFProvider } from "@/contexts/pdf-context"
import { useUser } from "@/contexts/UserContext"

interface FileData {
	uuid: string
	user_id: string
	file_name: string
	file_path: string
	created_at: string
}

interface Flashcard {
	id: string
	question: string
	answer: string
	page_no: string // Changed to string for consistency with Supabase and other components
	difficulty: string
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

// Utility function to convert PDF to base64
async function pdfToBase64(file: Blob | null): Promise<string> {
	if (!file) {
		throw new Error("File is null or undefined")
	}

	console.log("Converting file to base64, file type:", file.type, "size:", file.size)

	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			try {
				const result = reader.result as string
				if (!result) {
					reject(new Error("FileReader result is null"))
					return
				}
				const base64 = result.split(',')[1]
				if (!base64) {
					reject(new Error("Failed to extract base64 data"))
					return
				}
				console.log("Base64 conversion successful")
				resolve(base64)
			} catch (error) {
				reject(error)
			}
		}
		reader.onerror = () => {
			reject(new Error("FileReader error: " + (reader.error?.message || "Unknown error")))
		}
		reader.readAsDataURL(file)
	})
}

// Function to generate flashcards using Gemini AI
async function generateFlashcardsWithGemini(pdfBase64: string): Promise<Flashcard[]> {
	try {
		const response = await fetch('/api/generate-flashcards', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pdfBase64: pdfBase64
			})
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		// Ensure each flashcard has an id
		const flashcards = (data.flashcards || []).map((card: Flashcard) => ({
			...card,
			id: card.id || uuidv4(), // Generate id if not provided by API
			page_no: String(card.page_no), // Ensure page_no is a string
		}))
		return flashcards
	} catch (error) {
		console.error('Error generating flashcards:', error)
		throw error
	}
}

// Function to generate PDF summary using Gemini AI
async function generatePDFSummaryWithGemini(pdfBase64: string): Promise<PDFSummary> {
	try {
		const response = await fetch('/api/generate-summary', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pdfBase64: pdfBase64
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// Validate and normalize the response
		const summary: PDFSummary = {
			overallSummary: data.overallSummary || '',
			keyTopics: (data.keyTopics || []).map((topic: any) => ({
				topic: topic.topic || '',
				description: topic.description || '',
				pageNumbers: Array.isArray(topic.pageNumbers) ? topic.pageNumbers : [],
				importance: ['high', 'medium', 'low'].includes(topic.importance) ? topic.importance : 'medium'
			})),
			learningRecommendations: (data.learningRecommendations || []).map((rec: any) => ({
				type: ['prerequisite', 'follow_up', 'practice', 'resource'].includes(rec.type) ? rec.type : 'resource',
				title: rec.title || '',
				description: rec.description || '',
				priority: ['high', 'medium', 'low'].includes(rec.priority) ? rec.priority : 'medium'
			})),
			documentStats: {
				totalPages: data.documentStats?.totalPages || 0,
				estimatedReadingTime: data.documentStats?.estimatedReadingTime || 0,
				difficulty: ['beginner', 'intermediate', 'advanced'].includes(data.documentStats?.difficulty)
					? data.documentStats.difficulty : 'intermediate',
				category: data.documentStats?.category || 'General'
			},
			generatedAt: new Date().toISOString()
		};

		return summary;
	} catch (error) {
		console.error('Error generating PDF summary:', error);
		throw error;
	}
}

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
	const [fileData, setFileData] = useState<FileData | null>(null)
	const [flashcards, setFlashcards] = useState<Flashcard[]>([])
	const [pdfSummary, setPdfSummary] = useState<PDFSummary | null>(null)
	const [loading, setLoading] = useState(false)
	const [summaryLoading, setSummaryLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { user } = useUser()
	const user_id = user?.id

	useEffect(() => {
		if (!user_id) return
		
		const fetchDataAndGenerateFlashcards = async () => {
			const { id: docId } = await params

			if (!docId) {
				console.log("No docId provided")
				setError("No document ID provided")
				return
			}

			try {
				console.log("Fetching file data for docId:", docId)

				const { data: fileData, error: fileError } = await supabase
					.from("user_files")
					.select("*")
					.eq("id", docId)
					.eq("user_id", user_id)
					.single()

				console.log("Fetch file result:", { fileData, fileError })

				if (fileError) {
					console.error("Error fetching file data:", fileError.message)
					setError("Failed to fetch file data: " + fileError.message)
					return
				}

				if (!fileData) {
					console.error("No file data found")
					setError("No file found with the given ID")
					return
				}

				console.log("File data loaded successfully:", fileData)
				setFileData(fileData)

				// Check for existing flashcards
				console.log("Checking for existing flashcards for file_id:", docId)
				const { data: existingFlashcards, error: flashcardError } = await supabase
					.from("gen_flashcard")
					.select("id, question, answer, page_no, difficulty, created_at")
					.eq("file_id", docId)

				console.log("Existing flashcards result:", { existingFlashcards, flashcardError })

				if (flashcardError) {
					console.error("Error fetching flashcards:", flashcardError.message)
					setError("Failed to fetch flashcards: " + flashcardError.message)
					return
				}

				// Check for existing summary - use array query to avoid .single() errors
				console.log("Checking for existing summary for file_id:", docId)
				const { data: existingSummaries, error: summaryError } = await supabase
					.from("pdf_summaries")
					.select("*")
					.eq("file_id", docId);

				console.log("Existing summary result:", { existingSummaries, summaryError, count: existingSummaries?.length })

				let existingSummary = null;
				if (existingSummaries && existingSummaries.length > 0) {
					existingSummary = existingSummaries[0]; // Get the first (should be only) summary
					console.log("Found existing summary:", existingSummary);
					setPdfSummary(JSON.parse(existingSummary.summary_data));
				} else {
					console.log("No existing summary found");
				}

				// If we have both existing flashcards and summary, no need to process PDF
				if (existingFlashcards && existingFlashcards.length > 0 && existingSummary) {
					console.log("Found existing flashcards and summary, skipping generation")
					const normalizedFlashcards = existingFlashcards.map(card => ({
						id: card.id,
						question: card.question,
						answer: card.answer,
						page_no: String(card.page_no), // Ensure string for consistency
						difficulty: card.difficulty || 'medium'
					}))
					setFlashcards(normalizedFlashcards)
					return
				}

				if (!fileData.file_path) {
					console.log("No file_path in data:", fileData)
					setError("File path not found in database")
					return
				}

				// Set existing flashcards if available
				if (existingFlashcards && existingFlashcards.length > 0) {
					console.log("Setting existing flashcards")
					const normalizedFlashcards = existingFlashcards.map(card => ({
						id: card.id,
						question: card.question,
						answer: card.answer,
						page_no: String(card.page_no),
						difficulty: card.difficulty || 'medium'
					}))
					setFlashcards(normalizedFlashcards)
				}

				// Determine what needs to be generated
				const needsFlashcards = !existingFlashcards || existingFlashcards.length === 0
				const needsSummary = !existingSummary

				console.log("Content generation needs:", { 
					needsFlashcards, 
					needsSummary,
					hasExistingFlashcards: !!(existingFlashcards && existingFlashcards.length > 0),
					hasExistingSummary: !!existingSummary
				})

				// Only proceed if we actually need to generate something
				if (!needsFlashcards && !needsSummary) {
					console.log("All content already exists, skipping generation")
					return
				}

				// Download and process PDF only if needed
				console.log("Starting content generation for:", fileData.file_path)
				if (needsFlashcards) setLoading(true)
				if (needsSummary) setSummaryLoading(true)
				setError(null)

				console.log("Downloading PDF from storage...")
				const { data: pdfBlob, error: downloadError } = await supabase.storage
					.from('files')
					.download(fileData.file_path)

				console.log("Download result:", { pdfBlob, downloadError })

				if (downloadError) {
					throw new Error(`Failed to download PDF: ${downloadError.message}`)
				}

				if (!pdfBlob) {
					throw new Error("PDF blob is null or undefined")
				}

				console.log("PDF blob size:", pdfBlob.size, "bytes")

				console.log("Converting PDF to base64...")
				const pdfBase64 = await pdfToBase64(pdfBlob)
				console.log("Base64 conversion successful, length:", pdfBase64.length)

				// Generate flashcards if needed
				if (needsFlashcards) {
					console.log("Generating flashcards with Gemini...")
					const generatedFlashcards = await generateFlashcardsWithGemini(pdfBase64)
					console.log("Generated flashcards:", generatedFlashcards)

					const flashcardsToSave = generatedFlashcards.map(card => ({
						id: card.id,
						file_id: docId,
						user_id: fileData.user_id,
						question: card.question,
						answer: card.answer,
						page_no: card.page_no,
						difficulty: card.difficulty || 'medium',
						created_at: new Date().toISOString()
					}))

					console.log("Saving flashcards to Supabase:", flashcardsToSave)
					const { error: insertError } = await supabase
						.from("gen_flashcard")
						.insert(flashcardsToSave)

					if (insertError) {
						console.error("Error saving flashcards:", insertError.message)
						setError("Failed to save flashcards: " + insertError.message)
						return
					}

					setFlashcards(generatedFlashcards)
					setLoading(false)
				}

				// Generate summary if needed
				if (needsSummary) {
					console.log("Generating new summary...")
					const summary = await generatePDFSummaryWithGemini(pdfBase64)

					// Save summary to database
					const summaryToSave = {
						id: uuidv4(),
						file_id: docId,
						user_id: user_id,
						summary_data: JSON.stringify(summary),
						created_at: new Date().toISOString()
					};

					console.log("Saving summary to database:", summaryToSave);
					const { error: insertError } = await supabase
						.from("pdf_summaries")
						.insert(summaryToSave);

					if (insertError) {
						console.error("Error saving summary:", insertError);
						// Still set the summary even if saving fails
					} else {
						console.log("Summary saved successfully");
					}

					setPdfSummary(summary)
					setSummaryLoading(false)
				}

			} catch (err) {
				console.error("Error in process:", err)
				setError(err instanceof Error ? err.message : "Failed to process document")
			} finally {
				setLoading(false)
				setSummaryLoading(false)
			}
		}

		fetchDataAndGenerateFlashcards()
	}, [params, user_id]) // Added params to dependency array for safety

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen bg-black text-white">
				<div className="text-center">
					<h2 className="text-red-500 text-xl font-bold mb-2">Error</h2>
					<p>{error}</p>
				</div>
			</div>
		)
	}

	return (
		<PDFProvider>
			<div className="flex flex-col lg:flex-row h-screen bg-black">
				<div className="lg:w-1/2 h-full">
					<DocumentViewer document={fileData} />
				</div>
				<div className="lg:w-1/2 h-full">
					{loading || summaryLoading ? (
						<div className="flex items-center justify-center h-full text-white">
							<div className="text-center">
								<div className="m-auto animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
								<p>
									{loading && summaryLoading
										? "Processing document..."
										: loading
											? "Generating flashcards..."
											: "Generating summary..."}
								</p>
							</div>
						</div>
					) : (
						<StudyTabs
							document={fileData}
							flashcards={flashcards}
							pdfSummary={pdfSummary}
						/>
					)}
				</div>
			</div>
		</PDFProvider>
	)
}