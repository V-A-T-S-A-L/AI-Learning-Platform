"use client"

import { Copy, Lightbulb, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

interface Document {
  id: string
  title: string
  type: string
  url: string
  pages: number
}

export default function SummaryView({ document }: { document: Document }) {
  // Mock summary data
  const summary = {
    mainPoints: [
      "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.",
      "Supervised learning involves training with labeled data, while unsupervised learning works with unlabeled data to find patterns.",
      "Common algorithms include linear regression, decision trees, neural networks, and support vector machines.",
      "The bias-variance tradeoff is a central concept in machine learning that balances model complexity.",
      "Evaluation metrics such as accuracy, precision, recall, and F1-score help assess model performance.",
    ],
    keyTerms: [
      { term: "Supervised Learning", definition: "Training a model on labeled data to make predictions or decisions" },
      { term: "Unsupervised Learning", definition: "Finding patterns in unlabeled data" },
      { term: "Overfitting", definition: "When a model learns the training data too well, including noise" },
      { term: "Gradient Descent", definition: "An optimization algorithm to minimize the cost function" },
      { term: "Neural Network", definition: "A computing system inspired by biological neural networks" },
    ],
  }

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="h-full flex flex-col bg-black">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8">
          {/* Main Points Section */}
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-2xl mr-3">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Key Points</h3>
            </div>
            <div className="space-y-4">
              {summary.mainPoints.map((point, index) => (
                <div key={index} className="flex">
                  <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-zinc-900 text-purple-400 text-sm font-semibold mr-4 flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Terms Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-2xl mr-3">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Key Terms</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(summary.keyTerms.map((item) => `${item.term}: ${item.definition}`).join("\n"))
                }
                className="rounded-xl border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>
            <div className="grid gap-4">
              {summary.keyTerms.map((item, index) => (
                <Card key={index} className="bg-zinc-950 border-zinc-800 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-400 text-lg mb-2">{item.term}</h4>
                        <p className="text-zinc-300 leading-relaxed">{item.definition}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(`${item.term}: ${item.definition}`)}
                        className="h-9 w-9 rounded-xl text-zinc-500 hover:text-purple-400 hover:bg-zinc-900 ml-4"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
