"use client"

import type React from "react"

import { useState } from "react"
import { FileUpIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { supabase } from "@/lib/supabaseClient"

export default function UploadDocumentDialog({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}

	const handleUpload = async () => {
		if (!file) return;

		setUploading(true);

		const user = await supabase.auth.getUser();
		const userId = user.data.user?.id;

		if (!userId) {
			alert("User not authenticated.");
			setUploading(false);
			return;
		}

		const fileExt = file.name.split('.').pop();
		const filePath = `uploads/${Date.now()}-${file.name}`;

		const { data, error } = await supabase.storage
			.from("files")
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: false
			});

		if (error) {
			console.error("Upload error:", error.message);
			alert("Failed to upload file.");
		} else {
			// Insert file metadata to user_files table
			const { error: insertError } = await supabase.from("user_files").insert({
				user_id: userId,
				file_name: file.name,
				file_path: filePath
			});

			if (insertError) {
				console.error("DB insert error:", insertError.message);
				alert("File uploaded, but failed to save metadata.");
			} else {
				console.log("Upload and DB insert success");
				alert("File uploaded successfully!");
			}
		}

		setUploading(false);
		setFile(null);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-gray-100">
				<DialogHeader>
					<DialogTitle>Upload Document</DialogTitle>
					<DialogDescription className="text-gray-400">
						Upload a PDF or document file to generate flashcards or chat with it.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{!file ? (
						<div
							className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
							onClick={() => document.getElementById("file-upload")?.click()}
						>
							<FileUpIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
							<p className="text-gray-400 mb-1">Click to upload or drag and drop</p>
							<p className="text-xs text-gray-500">PDF, DOCX, or TXT (max 50MB)</p>
							<Input
								id="file-upload"
								type="file"
								className="hidden"
								accept=".pdf,.docx,.doc,.txt"
								onChange={handleFileChange}
							/>
						</div>
					) : (
						<div className="border border-gray-800 rounded-lg p-4 bg-gray-950">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-purple-900/30 rounded">
										<FileUpIcon className="h-6 w-6 text-purple-400" />
									</div>
									<div>
										<p className="font-medium truncate max-w-[200px]">{file.name}</p>
										<p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
									</div>
								</div>
								<Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8 rounded-full">
									<XIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="title" className="text-right">
							Title
						</Label>
						<Input
							id="title"
							defaultValue={file?.name.split(".").slice(0, -1).join(".") || ""}
							className="col-span-3 bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(false)}
						className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						onClick={handleUpload}
						disabled={!file || uploading}
						className="bg-purple-600 hover:bg-purple-700"
					>
						{uploading ? "Uploading..." : "Upload"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
