//app/src/app/dashboard/page.tsx
"use client"

import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { PlusIcon, BookOpenIcon, MessageSquareIcon, FileTextIcon, Cpu } from "lucide-react"
import { Upload, Mic, ArrowUp, Plus, Trash2, Menu, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import UploadDocumentDialog from "@/components/upload-document-dialog"
import { useEffect, useState } from "react"
import { useUser } from '@/contexts/UserContext'
import { supabase } from '@/lib/supabaseClient'
import ContinueLearningSection from "@/components/ContinueLearningSection";
import Link from "next/link";

export default function HomePage() {

    const router = useRouter();

    const { user, loading } = useUser()

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

    if (!user) {
        router.push("/login");
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Logout error:', error.message)
        } else {
            console.log('User logged out successfully')
            // Optional: redirect to login or homepage
            window.location.href = '/login'  // or '/'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-t from-black via-[#000] to-[#340258] text-white">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-6 w-6 text-purple-500" />
                            <span className="font-bold text-xl">CardGenX</span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors">
                        Upgrade
                    </button>
                    <button onClick={logout} className="cursor-pointer px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-black transition-colors">
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
                        <span>Generate Summary!</span>
                        <ArrowUp className="w-4 h-4 rotate-45" />
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                    {greeting} {user?.user_metadata.full_name}! 👋
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
                        </div>
                    </div>
                </UploadDocumentDialog>

                {/* AI Tutor Section */}
                {/* <div className="flex items-center justify-center gap-3 mb-12">
                    <span className="text-gray-400">Or ask AI tutor</span>
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <ArrowUp className="w-5 h-5 text-gray-400" />
                    </div>
                </div> */}

                {/* My Spaces Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">My spaces</h2>
                    <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-dashed border-zinc-500">
                        <div className="flex items-center gap-3">
                            <span>Coming Soon!</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="cursor-pointer p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <Plus className="w-4 h-4" />
                                <span className="text-sm">Add space</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Continue Learning Section */}
                <ContinueLearningSection />
            </main>
        </div>
    );
}
