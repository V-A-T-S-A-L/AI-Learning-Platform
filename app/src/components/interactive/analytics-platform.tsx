"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpenCheck, FileText, Video, ArrowUpRight, ArrowDownRight, RefreshCw, ChartLine } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export function AnalyticsPlatform() {
	const [activeTab, setActiveTab] = useState("overview")
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [chartData, setChartData] = useState<number[]>([65, 59, 80, 81, 56, 55, 40])
	const isMobile = useMediaQuery("(max-width: 768px)")
	const isVerySmall = useMediaQuery("(max-width: 500px)")

	// Simulate data refresh
	const refreshData = () => {
		setIsRefreshing(true)
		setTimeout(() => {
			setChartData(Array.from({ length: 7 }, () => Math.floor(Math.random() * 60) + 20))
			setIsRefreshing(false)
		}, 1000)
	}

	// Auto refresh data periodically
	useEffect(() => {
		const interval = setInterval(() => {
			if (!isRefreshing) {
				refreshData()
			}
		}, 5000)

		return () => clearInterval(interval)
	}, [isRefreshing])

	return (
		<div className="bg-zinc-950 rounded-lg border border-zinc-600 p-3 md:p-6 h-full">
			<div className="flex justify-between items-center mb-3 md:mb-6">
				<div className="flex items-center gap-1 md:gap-2">
					<BookOpenCheck className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
					<h3 className="font-medium text-xs sm:text-sm md:text-base">FlashMe Analytics</h3>
				</div>
				<button
					onClick={refreshData}
					disabled={isRefreshing}
					className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 hover:text-white disabled:opacity-50"
				>
					<RefreshCw className={`h-2.5 w-2.5 md:h-3 md:w-3 ${isRefreshing ? "animate-spin" : ""}`} />
					{isVerySmall ? "" : "Refresh"}
				</button>
			</div>

			<div className="flex border-b border-gray-800 mb-3 md:mb-6 overflow-x-auto pb-1 -mx-1 px-1">
				{[
					{ id: "overview", label: "Overview", icon: BookOpenCheck },
					{ id: "performance", label: isVerySmall ? "Perf" : "Engagement", icon: FileText },
					{ id: "distribution", label: isVerySmall ? "Dash" : "Dashboard", icon: ChartLine },
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-[10px] sm:text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
								? "text-blue-400 border-blue-500"
								: "text-gray-400 border-transparent hover:text-gray-300"
							}`}
					>
						<tab.icon className="h-3 w-3 md:h-4 md:w-4" />
						{tab.label}
					</button>
				))}
			</div>

			<div className="grid grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-6">
				{[
					{ label: "Flashcards Created", value: isVerySmall ? "0.4k" : "416", change: "+8%", isPositive: true },
					{ label: "Summaries Generated", value: "12", change: "+5%", isPositive: true },
					{ label: "Avg Study Time", value: isVerySmall ? "32m" : "32m 15s", change: "-2%", isPositive: false },
					{ label: "Notes Uploaded", value: "24", change: "+10%", isPositive: true },
				].map((stat, index) => (
					<div key={index} className="bg-gray-800/50 p-2 md:p-3 rounded-lg">
						<div className="text-[8px] sm:text-xs text-gray-400 mb-0.5 md:mb-1 truncate">{stat.label}</div>
						<div className="flex justify-between items-end">
							<div className="text-xs sm:text-sm md:text-lg font-bold">{stat.value}</div>
							<div
								className={`text-[8px] sm:text-xs flex items-center gap-0.5 md:gap-1 ${stat.isPositive ? "text-green-500" : "text-red-500"}`}
							>
								{stat.change}
								{stat.isPositive ? (
									<ArrowUpRight className="h-2 w-2 md:h-3 md:w-3" />
								) : (
									<ArrowDownRight className="h-2 w-2 md:h-3 md:w-3" />
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Weekly usage and content distribution chart remains as-is, already fits analytics */}
		</div>
	)
}
