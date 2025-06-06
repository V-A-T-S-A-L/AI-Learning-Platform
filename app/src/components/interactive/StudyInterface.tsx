'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, Download, Printer, MoreVertical, RotateCcw, Shuffle, ArrowUpDown, ChevronDown, Star } from 'lucide-react';

const StudyInterface = () => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [activeTab, setActiveTab] = useState('Flashcards');

    return (
        <div className="flex h-screen shadow-xl shadow-purple-950/20 bg-zinc-950 text-white  border-1 rounded-2xl border-zinc-700">
            {/* Left Side - PDF Viewer */}
            <div className="flex-1 bg-zinc-950 flex flex-col rounded-2xl">
                {/* PDF Header */}
                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <ChevronLeft className="h-5 w-5 text-gray-400" />
                        <span className="text-white font-medium">CHAPTER 4.pdf</span>
                    </div>
                    <span className="text-gray-400 text-sm">Review and learn from this document</span>
                </div>

                {/* PDF Toolbar */}
                <div className="flex items-center justify-between p-3 bg-zinc-950 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Menu className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">T748076353447-CH...</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300 text-sm">1 / 40</span>
                        <button className="text-gray-400 hover:text-gray-200">-</button>
                        <span className="text-gray-300 text-sm">54%</span>
                        <button className="text-gray-400 hover:text-gray-200">+</button>
                        <div className="flex gap-2">
                            <Download className="h-4 w-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                            <Printer className="h-4 w-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                            <MoreVertical className="h-4 w-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* PDF Content */}
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg border-1 border-zinc-700 overflow-hidden shadow-lg">
                        {/* Colorful Header */}
                        <div className="relative h-64 bg-gradient-to-br from-zinc-950 to-zinc-800">
                            <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                                <h1 className="text-white text-4xl font-bold leading-tight mb-4">
                                    DIGITAL SIGNATURE<br />
                                    SCHEMES AND<br />
                                    AUTHENTICATION<br />
                                    PROTOCOLS
                                </h1>
                                <div className="text-white text-sm">
                                    <p className="font-medium">Prof. Saurabh Kulkarni</p>
                                    <p className="opacity-90">Department of Artificial Intelligence & Data Science</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 border-t-1 border-white bg-zinc-950 text-white">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-right mb-4">
                                    NEEDHAM-SCHROEDER<br />
                                    AUTHENTICATION<br />
                                    PROTOCOL
                                </h2>
                                <div className="text-sm leading-relaxed">
                                    <p>
                                        • The goal of the protocol is to establish mutual authentication between two parties A and B in the presence of adversary, who can intercept, delay, read / copy and genrate messages.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t-1 border-white bg-zinc-900 text-white">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-left mb-4">
                                    NEEDHAM-SCHROEDER<br />
                                    AUTHENTICATION<br />
                                    PROTOCOL
                                </h2>
                                <div className="text-sm leading-relaxed">
                                    <p>
                                        • The goal of the protocol is to establish mutual authentication between two parties A and B in the presence of adversary, who can
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Study Interface */}
            <div className="w-96 bg-zinc-950 border-l border-gray-800 flex flex-col rounded-r-2xl">
                {/* Study Progress */}
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold mb-3">Study Progress</h2>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="text-sm text-gray-400">8 / 32 cards</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    {['Flashcards', 'Chat', 'Notes', 'Summary'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                ? 'border-blue-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
                                <Shuffle className="h-4 w-4" />
                                Shuffle
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
                                <ArrowUpDown className="h-4 w-4" />
                                Sort
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
                                Filter
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Flashcard */}
                <div className="flex-1 p-4">
                    <div className="bg-zinc-900 rounded-lg p-6 h-full flex flex-col">
                        {/* Star and Difficulty */}
                        <div className="flex items-center justify-between mb-4">
                            <Star className="h-5 w-5 text-gray-600" />
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">medium</span>
                        </div>

                        {/* Question */}
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-medium mb-4 text-center">Question</h3>
                            <p className="text-center text-gray-300 leading-relaxed">
                                Summarize the steps involved in the Needham-Schroeder authentication protocol.
                            </p>
                        </div>

                        {/* Answer Button */}
                        <div className="text-center">
                            <button
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="cursor-pointer text-gray-500 hover:text-gray-400 text-sm"
                            >
                                {showAnswer ? 'Hide answer' : 'Click to reveal answer'}
                            </button>
                            {showAnswer && (
                                <div className="mt-4 p-4 bg-gray-800 rounded-lg text-sm text-gray-300">
                                    <p className="leading-relaxed">
                                        {"The Needham-Schroeder protocol involves 5 steps: 1) A→S: A,B,Na 2) S→A: {Na, B, Kab, { Kab, A }Kb}Ka 3) A→B: {Kab, A}Kb 4) B→A: {Nb}Kab 5) A→B: {Nb - 1}Kab. This establishes mutual authentication between parties A and B through a trusted server S."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                        <button className="p-2 text-gray-400 hover:text-gray-300">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm text-gray-400">8 / 32</span>
                        <button className="p-2 text-gray-400 hover:text-gray-300">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudyInterface;