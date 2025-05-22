"use client"

import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { PlusIcon, BookOpenIcon, MessageSquareIcon, FileTextIcon } from "lucide-react"
import { Upload, Link, Mic, ArrowUp, Plus, Trash2, Menu, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import UploadDocumentDialog from "@/components/upload-document-dialog"
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from "react"
import { User, onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

// Mock data for previously uploaded documents
const documents = [
    {
        id: "1",
        title: "Machine Learning Fundamentals",
        type: "PDF",
        uploadedAt: "2 days ago",
        pages: 42,
        flashcards: 120,
        thumbnail: "/placeholder.svg?height=100&width=80",
    },
    {
        id: "2",
        title: "Web Development Guide",
        type: "DOCX",
        uploadedAt: "1 week ago",
        pages: 78,
        flashcards: 215,
        thumbnail: "/placeholder.svg?height=100&width=80",
    },
    {
        id: "3",
        title: "Data Structures & Algorithms",
        type: "PDF",
        uploadedAt: "3 weeks ago",
        pages: 103,
        flashcards: 310,
        thumbnail: "/placeholder.svg?height=100&width=80",
    },
    {
        id: "4",
        title: "Python Programming",
        type: "PDF",
        uploadedAt: "1 month ago",
        pages: 65,
        flashcards: 180,
        thumbnail: "/placeholder.svg?height=100&width=80",
    },
]

// Mock data for user stats
const userStats = {
    totalDocuments: 12,
    totalFlashcards: 1250,
    studyStreak: 7,
    lastStudied: "Today",
}

export default function HomePage() {
    //const { user } = useAuth();
    //console.warn(user);
    const router = useRouter();

    // Redirect if not authenticated
    // useEffect(() => {
    //     if (!user) {
    //         router.push('/login');
    //     }
    // }, [user, router]);

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                console.warn(user);
                setLoading(false);
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    const [greeting, setGreeting] = useState("Good morning")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) {
            setGreeting("Good morning")
        } else if (hour >= 12 && hour < 18) {
            setGreeting("Good afternoon")
        } else {
            setGreeting("Good evening")
        }
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-t from-black via-[#000] to-[#340258] text-white">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-black font-bold text-sm">FM</span>
                        </div>
                        <span className="text-xl font-semibold">FlashMe</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors">
                        Upgrade
                    </button>
                    <button onClick={() => signOut(auth)} className="cursor-pointer px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-black transition-colors">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Practice with exams badge */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500 rounded-full text-green-400 text-sm">
                        <span className="px-2 py-1 bg-green-500 text-black text-xs rounded font-medium">NEW</span>
                        <span>Practice with exams</span>
                        <ArrowUp className="w-4 h-4 rotate-45" />
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                    {greeting} {user?.displayName}! 👋
                </h1>
                <h1 className="text-4xl text-center mb-12">
                    What do you want to learn today?
                </h1>

                {/* Action Cards */}
                <UploadDocumentDialog>
                    <div className="mb-8">
                        {/* Upload Card */}
                        <div className="flex flex-col items-center p-6 bg-gray-900 rounded-xl border border-purple-700 hover:border-purple-400 transition-colors cursor-pointer">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                                <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="font-semibold mb-1">Upload</h3>
                            <p className="text-sm text-gray-400 text-center">File, Audio, Video</p>
                        </div>
                    </div>
                </UploadDocumentDialog>

                {/* AI Tutor Section */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <span className="text-gray-400">Or ask AI tutor</span>
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <ArrowUp className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* My Spaces Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">My spaces</h2>
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                            </div>
                            <span>Vatsal's Space</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <Plus className="w-4 h-4" />
                                <span className="text-sm">Add space</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Continue Learning Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Continue learning</h2>
                        <button className="text-sm text-gray-400 hover:text-white transition-colors">
                            View all
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Card 1 */}
                        <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white overflow-hidden">
                            <div className="absolute top-2 left-2">
                                <div className="flex items-center gap-1 px-2 py-1 bg-black/20 rounded text-xs">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <span>Private</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="font-bold text-lg mb-1">CRYPTOGRAPHIC HASHES,</h3>
                                <h3 className="font-bold text-lg mb-1">MESSAGE DIGESTS AND</h3>
                                <h3 className="font-bold text-lg">DIGITAL CERTIFICATES</h3>
                            </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-white overflow-hidden">
                            <div className="absolute top-2 left-2">
                                <div className="flex items-center gap-1 px-2 py-1 bg-black/20 rounded text-xs">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <span>Private</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-xs mb-2 opacity-80">Data Analytics and Visualization (DAV)</div>
                                <div className="text-xs mb-4 opacity-80">CSC601</div>
                                <h3 className="font-semibold text-sm mb-1">Subject Incharge</h3>
                                <p className="text-xs opacity-80">Mrs. Aditi Malkar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
