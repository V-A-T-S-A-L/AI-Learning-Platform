"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, Download, MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { usePDF } from "@/contexts/pdf-context"

interface Document {
	uuid: string
	user_id: string
	file_name: string
	file_path: string
	created_at: string
	pages?: number
	type?: string
}

export default function DocumentViewer({ document }: { document: Document }) {
	//const [currentPage, setCurrentPage] = useState(1)
	const [pdfUrl, setPdfUrl] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [iframeKey, setIframeKey] = useState(0) // Add this to force iframe reload

	const { currentPage } = usePDF();

	useEffect(() => {
		if (pdfUrl && currentPage > 0) {
			// Force iframe to reload when page changes
			setIframeKey(prev => prev + 1);
		}
	}, [currentPage, pdfUrl]);

	useEffect(() => {
		if (!document) return

		const fetchPDF = async () => {
			try {
				setIsLoading(true)
				setError(null)

				// First, try to get a signed URL for private files
				const { data: signedUrlData, error: signedUrlError } = await supabase.storage
					.from('files')
					.createSignedUrl(document.file_path, 3600) // 1 hour expiry

				if (signedUrlData?.signedUrl && !signedUrlError) {
					// Use signed URL for private files
					setPdfUrl(signedUrlData.signedUrl)
				} else {
					// If signed URL fails, try public URL
					const { data: urlData } = supabase.storage
						.from('files')
						.getPublicUrl(document.file_path)

					if (urlData?.publicUrl) {
						// Test if the public URL actually works
						try {
							const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
							if (response.ok) {
								setPdfUrl(urlData.publicUrl)
							} else {
								throw new Error(`File not accessible: ${response.status}`)
							}
						} catch (fetchError) {
							console.error('Public URL test failed:', fetchError)
							throw new Error('File not accessible via public URL')
						}
					} else {
						throw new Error('Could not generate file URL')
					}
				}

				if (signedUrlError) {
					console.error('Signed URL error:', signedUrlError)
					// Don't throw here if we're trying public URL as fallback
				}

			} catch (err) {
				console.error('Error fetching PDF:', err)
				setError(err instanceof Error ? err.message : 'Failed to load document')
			} finally {
				setIsLoading(false)
			}
		}

		fetchPDF()

		// Cleanup signed URLs when component unmounts (blob URLs are no longer created)
		return () => {
			// No cleanup needed for public/signed URLs
		}
	}, [document])

	if (!document) {
		return (
			<div className="flex items-center justify-center h-full text-white">
				<div className="text-center">
					<div className="m-auto animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
					<p>Loading Document...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full bg-black ">
			{/* Header */}
			<div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
				<Link href={"/dashboard"}>
					<ChevronLeft className="text-white mr-4" />
				</Link>
				<div className="flex-1 min-w-0">
					<h1 className="text-xl font-semibold text-white truncate">{document.file_name}</h1>
				</div>
			</div>

			{/* Document Display */}
			<div id="document-viewer" className="border-r border-zinc-800 flex-1 overflow-auto bg-black flex items-center justify-center p-6">
				{isLoading ? (
					<div className="text-center">
						<Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
						<p className="text-zinc-400">Loading PDF...</p>
					</div>
				) : error ? (
					<div className="text-center">
						<div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-red-400 text-2xl">⚠</span>
						</div>
						<p className="text-red-400 mb-2">Failed to load document</p>
						<p className="text-zinc-500 text-sm">{error}</p>
					</div>
				) : pdfUrl ? (
					<div className="relative w-full h-full">
						<div
							className="relative bg-white rounded-2xl overflow-hidden w-full h-full"
						>
							{/* PDF Embed */}
							<iframe
								key={iframeKey} // This forces the iframe to reload when page changes
								src={`${pdfUrl}#page=${currentPage}`}
								className="w-full h-full border-0"
								title={`${document.file_name} - Page ${currentPage}`}
							/>
						</div>
					</div>
				) : (
					<div className="text-center">
						<div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-zinc-400 text-2xl">📄</span>
						</div>
						<p className="text-zinc-400">No document to display</p>
					</div>
				)}
			</div>
		</div>
	)
}