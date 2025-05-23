"use client"

import { notFound, useParams } from "next/navigation"
import DocumentViewer from "@/components/documents/document-viewer"
import StudyTabs from "@/components/documents/study-tabs"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"

// Mock flashcards data
const flashcards = [
	{
		id: "1",
		question: "What is supervised learning?",
		answer:
			"Supervised learning is a type of machine learning where the model is trained on labeled data. The algorithm learns to map input features to the correct output based on example input-output pairs.",
		difficulty: "medium",
	},
	{
		id: "2",
		question: "Explain the difference between classification and regression.",
		answer:
			"Classification predicts discrete class labels or categories, while regression predicts continuous values. For example, predicting whether an email is spam (classification) versus predicting house prices (regression).",
		difficulty: "hard",
	},
	{
		id: "3",
		question: "What is overfitting in machine learning?",
		answer:
			"Overfitting occurs when a model learns the training data too well, including its noise and outliers. This results in poor generalization to new, unseen data. The model essentially memorizes the training examples rather than learning the underlying patterns.",
		difficulty: "medium",
	},
	{
		id: "4",
		question: "What is gradient descent?",
		answer:
			"Gradient descent is an optimization algorithm used to minimize the cost function in machine learning models. It works by iteratively adjusting parameters in the direction of the steepest decrease of the cost function.",
		difficulty: "hard",
	},
	{
		id: "5",
		question: "What is the bias-variance tradeoff?",
		answer:
			"The bias-variance tradeoff is the balance between a model's ability to fit the training data (low bias) and its ability to generalize to new data (low variance). High-complexity models tend to have low bias but high variance, while simpler models have higher bias but lower variance.",
		difficulty: "hard",
	},
]

interface FileData {
	uuid: string
	user_id: string
	file_name: string
	file_path: string
	created_at: string
}

export default function DocumentPage({ params }: { params: { id: string } }) {
	//const document = documents.find((doc) => doc.id === params.id)
	const docId = params.id;

	const [fileData, setFileData] = useState<FileData | null>(null)
	const [fileUrl, setFileUrl] = useState<string | null>(null)
	const [numPages, setNumPages] = useState<number | null>(null)

	useEffect(() => {
		const fetchFileData = async () => {
			const { data, error } = await supabase
				.from("user_files")
				.select("*")
				.eq("id", docId)
				.single()

			if (error) {
				console.error("Error fetching file data:", error.message)
				return
			}

			setFileData(data)
		}

		if (docId) fetchFileData()
	}, [docId, supabase])

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-black">
			<div className="lg:w-1/2 h-full">
				<DocumentViewer document={fileData} />
			</div>
			<div className="lg:w-1/2 h-full">
				<StudyTabs document={fileData} flashcards={flashcards} />
			</div>
		</div>
	)
}
