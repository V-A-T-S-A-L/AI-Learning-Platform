import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '../ui/button';

// Your existing interfaces
interface Document {
	uuid: string;
	user_id: string;
	file_name: string;
	file_path: string;
	created_at: string;
	pages?: number;
	type?: string;
}

interface Flashcard {
	id: string;
	question: string;
	answer: string;
	difficulty: string;
	page_no: string;
	star: boolean;
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

interface PDFExportOptions {
	includeDocumentInfo: boolean;
	includeFlashcards: boolean;
	includeSummary: boolean;
	flashcardOptions: {
		includeStarredOnly: boolean;
		includeDifficulty: boolean;
		includePageNumbers: boolean;
		difficultyFilter?: string[];
	};
	summaryOptions: {
		includeOverallSummary: boolean;
		includeKeyTopics: boolean;
		includeLearningRecommendations: boolean;
		includeDocumentStats: boolean;
		topicImportanceFilter?: ('high' | 'medium' | 'low')[];
		recommendationTypeFilter?: ('prerequisite' | 'follow_up' | 'practice' | 'resource')[];
	};
}

interface PDFGeneratorProps {
	document: Document;
	flashcards: Flashcard[];
	summary: PDFSummary;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
	document,
	flashcards,
	summary
}) => {
	const [exportOptions, setExportOptions] = useState<PDFExportOptions>({
		includeDocumentInfo: true,
		includeFlashcards: true,
		includeSummary: true,
		flashcardOptions: {
			includeStarredOnly: false,
			includeDifficulty: true,
			includePageNumbers: true,
			difficultyFilter: ['easy', 'medium', 'hard']
		},
		summaryOptions: {
			includeOverallSummary: true,
			includeKeyTopics: true,
			includeLearningRecommendations: true,
			includeDocumentStats: true,
			topicImportanceFilter: ['high', 'medium', 'low'],
			recommendationTypeFilter: ['prerequisite', 'follow_up', 'practice', 'resource']
		}
	});

	const [isGenerating, setIsGenerating] = useState(false);

	const updateExportOptions = (path: string[], value: any) => {
		setExportOptions(prev => {
			const newOptions = { ...prev };
			let current: any = newOptions;

			for (let i = 0; i < path.length - 1; i++) {
				current = current[path[i]];
			}

			current[path[path.length - 1]] = value;
			return newOptions;
		});
	};

	const generatePDF = async () => {
		setIsGenerating(true);

		try {
			const pdf = new jsPDF('p', 'mm', 'a4');
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const margin = 20;
			let yPosition = margin;

			// Helper function to add text with word wrap
			const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
				pdf.setFontSize(fontSize);
				if (isBold) {
					pdf.setFont('helvetica', 'bold');
				} else {
					pdf.setFont('helvetica', 'normal');
				}

				const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);

				// Check if we need a new page
				if (yPosition + (lines.length * fontSize * 0.35) > pageHeight - margin) {
					pdf.addPage();
					yPosition = margin;
				}

				pdf.text(lines, margin, yPosition);
				yPosition += lines.length * fontSize * 0.35 + 5;
			};

			// Add title
			addText(`Export: ${document.file_name}`, 20, true);
			yPosition += 10;

			// Document Information
			if (exportOptions.includeDocumentInfo) {
				addText('Document Information', 16, true);
				addText(`File Name: ${document.file_name}`);
				addText(`Created: ${new Date(document.created_at).toLocaleDateString()}`);
				if (document.pages) addText(`Pages: ${document.pages}`);
				if (document.type) addText(`Type: ${document.type}`);
				yPosition += 10;
			}

			// Flashcards Section
			if (exportOptions.includeFlashcards && flashcards.length > 0) {
				addText('Flashcards', 16, true);

				let filteredFlashcards = flashcards;

				// Apply filters
				if (exportOptions.flashcardOptions.includeStarredOnly) {
					filteredFlashcards = filteredFlashcards.filter(card => card.star);
				}

				if (exportOptions.flashcardOptions.difficultyFilter) {
					filteredFlashcards = filteredFlashcards.filter(card =>
						exportOptions.flashcardOptions.difficultyFilter!.includes(card.difficulty.toLowerCase())
					);
				}

				filteredFlashcards.forEach((card, index) => {
					addText(`Card ${index + 1}`, 14, true);
					addText(`Q: ${card.question}`);
					addText(`A: ${card.answer}`);

					if (exportOptions.flashcardOptions.includeDifficulty) {
						addText(`Difficulty: ${card.difficulty}`);
					}

					if (exportOptions.flashcardOptions.includePageNumbers) {
						addText(`Page: ${card.page_no}`);
					}

					if (card.star) {
						addText('⭐ Starred', 10);
					}

					yPosition += 5;
				});

				yPosition += 10;
			}

			// Summary Section
			if (exportOptions.includeSummary) {
				addText('Summary', 16, true);

				// Overall Summary
				if (exportOptions.summaryOptions.includeOverallSummary) {
					addText('Overall Summary', 14, true);
					addText(summary.overallSummary);
					yPosition += 10;
				}

				// Key Topics
				if (exportOptions.summaryOptions.includeKeyTopics && summary.keyTopics.length > 0) {
					addText('Key Topics', 14, true);

					let filteredTopics = summary.keyTopics;
					if (exportOptions.summaryOptions.topicImportanceFilter) {
						filteredTopics = filteredTopics.filter(topic =>
							exportOptions.summaryOptions.topicImportanceFilter!.includes(topic.importance)
						);
					}

					filteredTopics.forEach(topic => {
						addText(`• ${topic.topic} (${topic.importance.toUpperCase()})`, 12, true);
						addText(`  ${topic.description}`);
						addText(`  Pages: ${topic.pageNumbers.join(', ')}`);
						yPosition += 3;
					});

					yPosition += 10;
				}

				// Learning Recommendations
				if (exportOptions.summaryOptions.includeLearningRecommendations && summary.learningRecommendations.length > 0) {
					addText('Learning Recommendations', 14, true);

					let filteredRecommendations = summary.learningRecommendations;
					if (exportOptions.summaryOptions.recommendationTypeFilter) {
						filteredRecommendations = filteredRecommendations.filter(rec =>
							exportOptions.summaryOptions.recommendationTypeFilter!.includes(rec.type)
						);
					}

					filteredRecommendations.forEach(rec => {
						addText(`• ${rec.title} (${rec.type.toUpperCase()}) - Priority: ${rec.priority.toUpperCase()}`, 12, true);
						addText(`  ${rec.description}`);
						yPosition += 3;
					});

					yPosition += 10;
				}

				// Document Stats
				if (exportOptions.summaryOptions.includeDocumentStats) {
					addText('Document Statistics', 14, true);
					addText(`Total Pages: ${summary.documentStats.totalPages}`);
					addText(`Estimated Reading Time: ${summary.documentStats.estimatedReadingTime} minutes`);
					addText(`Difficulty Level: ${summary.documentStats.difficulty}`);
					addText(`Category: ${summary.documentStats.category}`);
					addText(`Generated: ${new Date(summary.generatedAt).toLocaleDateString()}`);
				}
			}

			// Save the PDF
			const fileName = `${document.file_name.replace(/\.[^/.]+$/, '')}_export.pdf`;
			pdf.save(fileName);

		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Error generating PDF. Please try again.');
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-black text-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold mb-6">PDF Export Options</h2>

			{/* Document Info Options */}
			<div className="mb-6">
				<label className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={exportOptions.includeDocumentInfo}
						onChange={(e) => updateExportOptions(['includeDocumentInfo'], e.target.checked)}
						className="w-4 h-4"
					/>
					<span className="font-semibold">Include Document Information</span>
				</label>
			</div>

			{/* Flashcards Options */}
			<div className="mb-6">
				<label className="flex items-center space-x-2 mb-3">
					<input
						type="checkbox"
						checked={exportOptions.includeFlashcards}
						onChange={(e) => updateExportOptions(['includeFlashcards'], e.target.checked)}
						className="w-4 h-4"
					/>
					<span className="font-semibold">Include Flashcards</span>
				</label>

				{exportOptions.includeFlashcards && (
					<div className="ml-6 space-y-2">
						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={exportOptions.flashcardOptions.includeStarredOnly}
								onChange={(e) => updateExportOptions(['flashcardOptions', 'includeStarredOnly'], e.target.checked)}
								className="w-4 h-4"
							/>
							<span>Include starred cards only</span>
						</label>

						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={exportOptions.flashcardOptions.includeDifficulty}
								onChange={(e) => updateExportOptions(['flashcardOptions', 'includeDifficulty'], e.target.checked)}
								className="w-4 h-4"
							/>
							<span>Include difficulty level</span>
						</label>

						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={exportOptions.flashcardOptions.includePageNumbers}
								onChange={(e) => updateExportOptions(['flashcardOptions', 'includePageNumbers'], e.target.checked)}
								className="w-4 h-4"
							/>
							<span>Include page numbers</span>
						</label>

						<div>
							<span className="block mb-2">Difficulty Filter:</span>
							<div className="flex space-x-4">
								{['easy', 'medium', 'hard'].map(difficulty => (
									<label key={difficulty} className="flex items-center space-x-1">
										<input
											type="checkbox"
											checked={exportOptions.flashcardOptions.difficultyFilter?.includes(difficulty)}
											onChange={(e) => {
												const current = exportOptions.flashcardOptions.difficultyFilter || [];
												const updated = e.target.checked
													? [...current, difficulty]
													: current.filter(d => d !== difficulty);
												updateExportOptions(['flashcardOptions', 'difficultyFilter'], updated);
											}}
											className="w-4 h-4"
										/>
										<span className="capitalize">{difficulty}</span>
									</label>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Summary Options */}
			<div className="mb-6">
				<label className="flex items-center space-x-2 mb-3">
					<input
						type="checkbox"
						checked={exportOptions.includeSummary}
						onChange={(e) => updateExportOptions(['includeSummary'], e.target.checked)}
						className="w-4 h-4"
					/>
					<span className="font-semibold">Include Summary</span>
				</label>

				{exportOptions.includeSummary && (
					<div className="ml-6 space-y-3">
						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={exportOptions.summaryOptions.includeOverallSummary}
								onChange={(e) => updateExportOptions(['summaryOptions', 'includeOverallSummary'], e.target.checked)}
								className="w-4 h-4"
							/>
							<span>Include overall summary</span>
						</label>

						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={exportOptions.summaryOptions.includeKeyTopics}
								onChange={(e) => updateExportOptions(['summaryOptions', 'includeKeyTopics'], e.target.checked)}
								className="w-4 h-4"
							/>
							<span>Include key topics</span>
						</label>

						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={exportOptions.summaryOptions.includeLearningRecommendations}
								onChange={(e) => updateExportOptions(['summaryOptions', 'includeLearningRecommendations'], e.target.checked)}
								className="w-4 h-4"
							/>
							<span>Include learning recommendations</span>
						</label>

						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={exportOptions.summaryOptions.includeDocumentStats}
								onChange={(e) => updateExportOptions(['summaryOptions', 'includeDocumentStats'], e.target.checked)}
								className="w-4 h-4"
							/>
							<span>Include document statistics</span>
						</label>

						{exportOptions.summaryOptions.includeKeyTopics && (
							<div>
								<span className="block mb-2">Topic Importance Filter:</span>
								<div className="flex space-x-4">
									{['high', 'medium', 'low'].map(importance => (
										<label key={importance} className="flex items-center space-x-1">
											<input
												type="checkbox"
												checked={exportOptions.summaryOptions.topicImportanceFilter?.includes(importance as any)}
												onChange={(e) => {
													const current = exportOptions.summaryOptions.topicImportanceFilter || [];
													const updated = e.target.checked
														? [...current, importance as any]
														: current.filter(i => i !== importance);
													updateExportOptions(['summaryOptions', 'topicImportanceFilter'], updated);
												}}
												className="w-4 h-4"
											/>
											<span className="capitalize">{importance}</span>
										</label>
									))}
								</div>
							</div>
						)}

						{exportOptions.summaryOptions.includeLearningRecommendations && (
							<div>
								<span className="block mb-2">Recommendation Type Filter:</span>
								<div className="grid grid-cols-2 gap-2">
									{['prerequisite', 'follow_up', 'practice', 'resource'].map(type => (
										<label key={type} className="flex items-center space-x-1">
											<input
												type="checkbox"
												checked={exportOptions.summaryOptions.recommendationTypeFilter?.includes(type as any)}
												onChange={(e) => {
													const current = exportOptions.summaryOptions.recommendationTypeFilter || [];
													const updated = e.target.checked
														? [...current, type as any]
														: current.filter(t => t !== type);
													updateExportOptions(['summaryOptions', 'recommendationTypeFilter'], updated);
												}}
												className="w-4 h-4"
											/>
											<span className="capitalize">{type.replace('_', ' ')}</span>
										</label>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Generate Button */}
			<Button
				variant="ghost"
				onClick={generatePDF}
				disabled={isGenerating || (!exportOptions.includeDocumentInfo && !exportOptions.includeFlashcards && !exportOptions.includeSummary)}
				className="w-full bg-zinc-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-zinc-800 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
			>
				{isGenerating ? 'Generating PDF...' : 'Generate PDF'}
			</Button>

			{!exportOptions.includeDocumentInfo && !exportOptions.includeFlashcards && !exportOptions.includeSummary && (
				<p className="text-red-500 text-sm mt-2 text-center">
					Please select at least one section to include in the PDF.
				</p>
			)}
		</div>
	);
};

export default PDFGenerator;