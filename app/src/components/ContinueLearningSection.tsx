import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"
import { Trash2, Pencil, ExternalLink } from "lucide-react"
import Link from "next/link"

interface UserFile {
    id: number
    user_id: string
    file_name: string
    file_path: string
    created_at: string
    publicUrl?: string
    thumbnail?: string
}

const ContinueLearningSection: React.FC = () => {
    const [userFiles, setUserFiles] = useState<UserFile[]>([])

    useEffect(() => {
        const fetchFiles = async () => {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser()

            if (userError || !user) {
                console.error("User not found", userError)
                return
            }

            const { data, error } = await supabase
                .from("user_files")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(4)

            if (error || !data) {
                console.error("Error fetching files:", error)
                return
            }

            const filesWithThumbs: UserFile[] = await Promise.all(
                data.map(async (file) => {
                    const { data: urlData } = supabase.storage
                        .from("files")
                        .getPublicUrl(file.file_path)

                    const publicUrl = urlData?.publicUrl || ""

                    return {
                        ...file,
                        publicUrl
                    }
                })
            )

            setUserFiles(filesWithThumbs)
        }

        fetchFiles()
    }, [])

    return (
        <div className="my-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Continue learning</h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    View all
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userFiles.map((file) => (
                    <div
                        key={file.id}
                        className="group relative hover:-translate-y-1 hover:shadow-sm shadow-gray-500 duration-200 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-white overflow-hidden"
                    >
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                className="text-gray-400 hover:text-yellow-300 cursor-pointer"
                                title="Edit"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                            <button
                                className="text-gray-400 hover:text-red-500 cursor-pointer"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <Link className="text-center items-center" href={`documents/${file.id}`}>
                                <button
                                    className="text-gray-400 hover:text-green-500 cursor-pointer"
                                    title="Open"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm truncate mb-1">
                                {file.file_name}
                            </h3>
                            <p className="text-xs opacity-80">
                                {new Date(file.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ContinueLearningSection
