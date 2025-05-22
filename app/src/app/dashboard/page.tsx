"use client"

import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { PlusIcon, BookOpenIcon, MessageSquareIcon, FileTextIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import UploadDocumentDialog from "@/components/upload-document-dialog"
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
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
        <div className="min-h-screen bg-[#010206] text-gray-100">
            <main className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">{greeting} {user.displayName}! 👋</h1>
                        <p className="text-gray-400 mt-1">Upload documents, create flashcards, and study smarter</p>
                    </div>
                    <UploadDocumentDialog>
                        <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Upload Document
                        </Button>
                    </UploadDocumentDialog>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-black border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-400">{userStats.totalDocuments}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-black border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Flashcards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-400">{userStats.totalFlashcards}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-black border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Study Streak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-400">{userStats.studyStreak} days</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-black border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Last Studied</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-400">{userStats.lastStudied}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Documents Section */}
                <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {documents.map((doc) => (
                        <Card
                            key={doc.id}
                            className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500 transition-all"
                        >
                            <div className="relative pt-[60%] bg-gray-800">
                                <img
                                    src={doc.thumbnail || "/placeholder.svg"}
                                    alt={doc.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-gray-900 text-xs px-2 py-1 rounded-md">{doc.type}</div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium truncate">{doc.title}</CardTitle>
                                <CardDescription className="text-gray-400 text-xs">
                                    Uploaded {doc.uploadedAt} • {doc.pages} pages
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-0 flex justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-purple-400 border-purple-800 hover:bg-purple-900/20"
                                >
                                    <BookOpenIcon className="h-4 w-4 mr-1" />
                                    Flashcards
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-purple-400 border-purple-800 hover:bg-purple-900/20"
                                >
                                    <MessageSquareIcon className="h-4 w-4 mr-1" />
                                    Chat
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions Section */}
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-2">
                                <FileTextIcon className="h-6 w-6 text-purple-400" />
                            </div>
                            <CardTitle>Browse All Documents</CardTitle>
                            <CardDescription className="text-gray-400">Access your complete document library</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 w-full">
                                View Library
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-2">
                                <BookOpenIcon className="h-6 w-6 text-purple-400" />
                            </div>
                            <CardTitle>Study Flashcards</CardTitle>
                            <CardDescription className="text-gray-400">Review your generated flashcards</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 w-full">
                                Start Studying
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-2">
                                <MessageSquareIcon className="h-6 w-6 text-purple-400" />
                            </div>
                            <CardTitle>Chat with Documents</CardTitle>
                            <CardDescription className="text-gray-400">Ask questions about your documents</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 w-full">
                                Start Chatting
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}
