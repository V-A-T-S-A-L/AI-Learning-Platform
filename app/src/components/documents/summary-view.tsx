import React from 'react';
import { Clock, BookOpen, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Star } from 'lucide-react';

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
	generatedAt?: string;
}

interface SummaryDisplayProps {
	summary: PDFSummary;
	className?: string;
}

const SummaryView: React.FC<SummaryDisplayProps> = ({ summary, className = "" }) => {

	const getImportanceColor = (importance: string) => {
		switch (importance) {
			case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30';
			case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
			case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
			default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'text-red-400';
			case 'medium': return 'text-yellow-400';
			case 'low': return 'text-green-400';
			default: return 'text-gray-400';
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'beginner': return 'text-green-400 bg-green-900/20';
			case 'intermediate': return 'text-yellow-400 bg-yellow-900/20';
			case 'advanced': return 'text-red-400 bg-red-900/20';
			default: return 'text-gray-400 bg-gray-900/20';
		}
	};

	const getRecommendationIcon = (type: string) => {
		switch (type) {
			case 'prerequisite': return <AlertCircle className="w-4 h-4" />;
			case 'follow_up': return <ArrowRight className="w-4 h-4" />;
			case 'practice': return <CheckCircle className="w-4 h-4" />;
			case 'resource': return <BookOpen className="w-4 h-4" />;
			default: return <Star className="w-4 h-4" />;
		}
	};

	const formatPageNumbers = (pages: number[]) => {
		if (pages.length === 0) return 'N/A';
		if (pages.length === 1) return `Page ${pages[0]}`;

		// Sort and group consecutive pages
		const sorted = [...pages].sort((a, b) => a - b);
		const groups: string[] = [];
		let start = sorted[0];
		let end = sorted[0];

		for (let i = 1; i < sorted.length; i++) {
			if (sorted[i] === end + 1) {
				end = sorted[i];
			} else {
				groups.push(start === end ? `${start}` : `${start}-${end}`);
				start = sorted[i];
				end = sorted[i];
			}
		}
		groups.push(start === end ? `${start}` : `${start}-${end}`);

		return `Page${groups.length > 1 ? 's' : ''} ${groups.join(', ')}`;
	};

	return (
		<div className={`bg-black text-white p-6 rounded-lg space-y-6 ${className}`}>
			{/* Header with Document Stats */}
			<div className="border-b border-gray-700 pb-4">
				<h2 className="text-2xl font-bold mb-4 text-white">Document Summary</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-zinc-800 p-3 rounded-lg text-center">
						<BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-400" />
						<div className="text-xl font-bold">{summary.documentStats.totalPages}</div>
						<div className="text-xs text-gray-400">Pages</div>
					</div>
					<div className="bg-zinc-800 p-3 rounded-lg text-center">
						<Clock className="w-5 h-5 mx-auto mb-1 text-green-400" />
						<div className="text-xl font-bold">{summary.documentStats.estimatedReadingTime}</div>
						<div className="text-xs text-gray-400">Minutes</div>
					</div>
					<div className="bg-zinc-800 p-3 rounded-lg text-center">
						<TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-400" />
						<div className={`text-sm font-semibold px-2 py-1 rounded ${getDifficultyColor(summary.documentStats.difficulty)}`}>
							{summary.documentStats.difficulty.charAt(0).toUpperCase() + summary.documentStats.difficulty.slice(1)}
						</div>
					</div>
					<div className="bg-zinc-800 p-3 rounded-lg text-center">
						<div className="text-sm font-bold text-gray-300">{summary.documentStats.category}</div>
						<div className="text-xs text-gray-400">Category</div>
					</div>
				</div>
			</div>

			{/* Overall Summary */}
			<div>
				<h3 className="text-xl font-semibold mb-3 text-white">Overview</h3>
				<div className="bg-zinc-800 p-4 rounded-lg">
					<p className="text-gray-300 leading-relaxed whitespace-pre-line">{summary.overallSummary}</p>
				</div>
			</div>

			{/* Key Topics */}
			{summary.keyTopics.length > 0 && (
				<div>
					<h3 className="text-xl font-semibold mb-3 text-white">Key Topics</h3>
					<div className="space-y-3">
						{summary.keyTopics.map((topic, index) => (
							<div key={index} className="bg-zinc-800 p-4 rounded-lg border-l-4 border-zinc-500">
								<div className="flex items-start justify-between mb-2">
									<h4 className="text-lg font-semibold text-white">{topic.topic}</h4>
									<div className="flex items-center space-x-2">
										<span className={`px-2 py-1 text-xs rounded-full border ${getImportanceColor(topic.importance)}`}>
											{topic.importance}
										</span>
										<span className="text-xs text-gray-400">
											{formatPageNumbers(topic.pageNumbers)}
										</span>
									</div>
								</div>
								<p className="text-gray-300 text-sm">{topic.description}</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Learning Recommendations */}
			{summary.learningRecommendations.length > 0 && (
				<div>
					<h3 className="text-xl font-semibold mb-3 text-white">Learning Recommendations</h3>
					<div className="grid gap-3">
						{summary.learningRecommendations.map((rec, index) => (
							<div key={index} className="bg-zinc-800 p-4 rounded-lg">
								<div className="flex items-start space-x-3">
									<div className={`p-2 rounded`}>
										{getRecommendationIcon(rec.type)}
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-1">
											<h4 className="font-semibold text-white">{rec.title}</h4>
											<div className="flex items-center space-x-2">
												<span className={`text-xs px-2 py-1 rounded capitalize ${getPriorityColor(rec.priority)}`}>
													{rec.priority}
												</span>
												<span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 capitalize">
													{rec.type.replace('_', ' ')}
												</span>
											</div>
										</div>
										<p className="text-gray-300 text-sm">{rec.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Footer */}
			{summary.generatedAt && (
				<div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-700">
					Generated on {new Date(summary.generatedAt).toLocaleString()}
				</div>
			)}
		</div>
	);
};

export default SummaryView;