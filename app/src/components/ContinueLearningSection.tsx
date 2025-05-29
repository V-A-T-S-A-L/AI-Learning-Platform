//app/src/components/ViewAllDocumentsPage
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Trash2, Pencil, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"

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
    const [loading, setLoading] = useState(true)
    const [editingFileId, setEditingFileId] = useState<number | null>(null)
    const [newFileName, setNewFileName] = useState<string>("")

    useEffect(() => {
        const fetchFiles = async () => {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser()

            if (userError || !user) {
                console.error("User not found", userError)
                setLoading(false)
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
                setLoading(false)
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
            setLoading(false)
        }

        fetchFiles()
    }, [])

    // Handle file rename
    const handleRename = async (file: UserFile) => {
        if (!newFileName.trim()) {
            toast.error("File name cannot be empty")
            return
        }

        const { data, error } = await supabase
            .from("user_files")
            .update({ file_name: newFileName })
            .eq("id", file.id)
            .select()
            .single()

        if (error) {
            console.error("Error renaming file:", error)
            toast.error("Failed to rename file: " + error.message)
            return
        }

        // Update local state to reflect the change
        setUserFiles(userFiles.map(f => 
            f.id === file.id ? { ...f, file_name: newFileName } : f
        ))
        setEditingFileId(null)
        setNewFileName("")
        toast.success("File renamed successfully")
    }

    // Handle file deletion
    const handleDelete = async (file: UserFile) => {
        if (!confirm(`Are you sure you want to delete "${file.file_name}"?`)) {
            return
        }

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from("files")
            .remove([file.file_path])

        if (storageError) {
            console.error("Error deleting file from storage:", storageError)
            toast.error("Failed to delete file from storage: " + storageError.message)
            return
        }

        // Delete from database
        const { error: dbError } = await supabase
            .from("user_files")
            .delete()
            .eq("id", file.id)

        if (dbError) {
            console.error("Error deleting file from database:", dbError)
            toast.error("Failed to delete file: " + dbError.message)
            return
        }

        // Update local state
        setUserFiles(userFiles.filter(f => f.id !== file.id))
        toast.success("File deleted successfully")
    }

    const skeletonArray = new Array(4).fill(null)

    return (
        <div className="my-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Continue learning</h2>
                <Link href="/viewalldocument">
                    <Button variant="ghost" className="rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white">
                        View all
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading
                    ? skeletonArray.map((_, idx) => (
                          <div
                              key={idx}
                              className="animate-pulse bg-gradient-to-br from-zinc-800 to-purple-400 rounded-xl p-6 h-[90px]"
                          >
                              <div className="h-4 bg-white/30 rounded w-2/3 mb-2"></div>
                              <div className="h-3 bg-white/20 rounded w-1/2"></div>
                          </div>
                      ))
                    : userFiles.map((file) => (
                          <div
                              key={file.id}
                              className="group relative hover:-translate-y-1 hover:shadow-sm shadow-gray-500 duration-200 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-white overflow-hidden"
                          >
                              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                      className="text-gray-400 hover:text-yellow-300 cursor-pointer"
                                      title="Edit"
                                      onClick={() => {
                                          setEditingFileId(file.id)
                                          setNewFileName(file.file_name)
                                      }}
                                  >
                                      <Pencil className="w-5 h-5" />
                                  </button>
                                  <button
                                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                                      title="Delete"
                                      onClick={() => handleDelete(file)}
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

                              {editingFileId === file.id ? (
                                  <div className="flex flex-col gap-2">
                                      <Input
                                          value={newFileName}
                                          onChange={(e) => setNewFileName(e.target.value)}
                                          className="text-black"
                                          placeholder="New file name"
                                      />
                                      <div className="flex gap-2">
                                          <Button
                                              onClick={() => handleRename(file)}
                                              variant="ghost"
                                              className=""
                                          >
                                              Save
                                          </Button>
                                          <Button
                                              onClick={() => setEditingFileId(null)}
                                              variant="ghost"
                                              className=""
                                              >
                                              Cancel
                                          </Button>
                                      </div>
                                  </div>
                              ) : (
                                  <div>
                                      <h3 className="font-semibold text-sm truncate mb-1">
                                          {file.file_name}
                                      </h3>
                                      <p className="text-xs opacity-80">
                                          {new Date(file.created_at).toLocaleString()}
                                      </p>
                                  </div>
                              )}
                          </div>
                      ))}
            </div>
        </div>
    )
}

export default ContinueLearningSection