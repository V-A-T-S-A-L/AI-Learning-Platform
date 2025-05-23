"use client"

import { BookOpen, Clock, Target, Brain } from "lucide-react"

interface Document {
  id: string
  title: string
  type: string
  url: string
  pages: number
}

export default function SummaryView({ document }: { document: Document }) {
  // Mock summary data - in a real app, this would come from document analysis
  const summaryData = {
    keyTopics: [
      "Supervised Learning Fundamentals",
      "Classification vs Regression",
      "Overfitting and Underfitting",
      "Gradient Descent Optimization",
      "Bias-Variance Tradeoff",
      "Cross-validation Techniques"
    ],
    studyTime: "45 minutes",
    difficulty: "Intermediate",
    keyInsights: [
      "Supervised learning requires labeled training data to map inputs to outputs",
      "The bias-variance tradeoff is crucial for model performance and generalization",
      "Gradient descent iteratively optimizes model parameters to minimize cost functions",
      "Cross-validation helps assess model performance on unseen data"
    ]
  }

  return (
    <div className="h-full bg-black p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-2xl mr-4">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Document Summary</h2>
            <p className="text-zinc-400">{document.title}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-zinc-300">Pages</span>
            </div>
            <p className="text-2xl font-bold text-white">{document.pages}</p>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-zinc-300">Est. Study Time</span>
            </div>
            <p className="text-2xl font-bold text-white">{summaryData.studyTime}</p>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center mb-3">
              <Target className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm font-medium text-zinc-300">Difficulty</span>
            </div>
            <p className="text-2xl font-bold text-white">{summaryData.difficulty}</p>
          </div>
        </div>

        {/* Key Topics */}
        <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Key Topics Covered</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summaryData.keyTopics.map((topic, index) => (
              <div key={index} className="flex items-center p-3 bg-zinc-900 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span className="text-zinc-300">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
          <div className="space-y-4">
            {summaryData.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start p-4 bg-zinc-900 rounded-xl">
                <div className="flex items-center justify-center w-6 h-6 bg-purple-600 rounded-full mr-4 mt-0.5 flex-shrink-0">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Study Recommendations */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Study Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-center text-zinc-300">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Start with supervised learning fundamentals before moving to advanced topics
            </div>
            <div className="flex items-center text-zinc-300">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              Practice implementing gradient descent with simple examples
            </div>
            <div className="flex items-center text-zinc-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Use flashcards to memorize key definitions and concepts
            </div>
            <div className="flex items-center text-zinc-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              Test understanding with practice problems on bias-variance tradeoff
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}