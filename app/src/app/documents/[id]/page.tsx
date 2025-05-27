"use client"

import { notFound, useParams } from "next/navigation"
import DocumentViewer from "@/components/documents/document-viewer"
import StudyTabs from "@/components/documents/study-tabs"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { PDFProvider } from "@/contexts/pdf-context"

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
	page_no: number
	difficulty?: string
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
			reject(new Error("FileReader error: " + reader.error?.message))
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
		return data.flashcards || []
	} catch (error) {
		console.error('Error generating flashcards:', error)
		throw error
	}
}

export default function DocumentPage({ params }: { params: { id: string } }) {
	const docId = params.id

	const [fileData, setFileData] = useState<FileData | null>(null)
	const [flashcards, setFlashcards] = useState<Flashcard[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Fetch file data and generate flashcards
	useEffect(() => {
		const fetchDataAndGenerateFlashcards = async () => {
			if (!docId) {
				console.log("No docId provided")
				return
			}

			try {
				// Step 1: Fetch file data from Supabase
				console.log("Fetching file data for docId:", docId)

				const { data, error } = await supabase
					.from("user_files")
					.select("*")
					.eq("id", docId)
					.single()

				console.log("Fetch result:", { data, error })

				if (error) {
					console.error("Error fetching file data:", error.message)
					setError("Failed to fetch file data: " + error.message)
					return
				}

				if (!data) {
					console.error("No file data found")
					setError("No file found with the given ID")
					return
				}

				console.log("File data loaded successfully:", data)
				setFileData(data)

				// Step 2: Generate flashcards immediately after fetching data
				if (!data.file_path) {
					console.log("No file_path in data:", data)
					setError("File path not found in database")
					return
				}

				console.log("Starting flashcard generation for:", data.file_path)
				setLoading(true)
				setError(null)

				// Download PDF from Supabase storage
				console.log("Downloading PDF from storage...")
				const { data: pdfBlob, error: downloadError } = await supabase.storage
					.from('files') // Replace with your actual bucket name
					.download(data.file_path)

				console.log("Download result:", { pdfBlob, downloadError })

				if (downloadError) {
					throw new Error(`Failed to download PDF: ${downloadError.message}`)
				}

				if (!pdfBlob) {
					throw new Error("PDF blob is null or undefined")
				}

				console.log("PDF blob size:", pdfBlob.size, "bytes")

				// Convert PDF to base64
				console.log("Converting PDF to base64...")
				const pdfBase64 = await pdfToBase64(pdfBlob)
				console.log("Base64 conversion successful, length:", pdfBase64.length)

				// Generate flashcards using Gemini
				console.log("Generating flashcards with Gemini...")
				const generatedFlashcards = await generateFlashcardsWithGemini(pdfBase64)
				console.log("Generated flashcards:", generatedFlashcards)
				setFlashcards(generatedFlashcards)

			} catch (err) {
				console.error("Error in process:", err)
				setError(err instanceof Error ? err.message : "Failed to process document")
			} finally {
				setLoading(false)
			}
		}

		fetchDataAndGenerateFlashcards()
	}, [docId])

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen bg-black text-white">
				<div className="text-center">
					<h2 className="text-xl font-bold mb-2">Error</h2>
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
					{loading ? (
						<div className="flex items-center justify-center h-full text-white">
							<div className="text-center">
								<div className="m-auto animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
								<p>Generating flashcards...</p>
							</div>
						</div>
					) : (
						<StudyTabs document={fileData} flashcards={flashcards} />
					)}
				</div>
			</div>
		</PDFProvider>
	)
}