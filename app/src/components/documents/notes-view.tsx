"use client"

import * as React from "react"
import { Save, FileText, Copy, Bold, Italic, Underline, List, ListOrdered, CheckSquare, Code, Link as LinkIcon, Unlink, Undo, Redo } from "lucide-react"
import { EditorContent, useEditor } from "@tiptap/react"

// Import useState explicitly
const { useState, useRef, useEffect } = React

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline as UnderL } from "@tiptap/extension-underline"
import { Link } from "@tiptap/extension-link"
import { CodeBlock } from "@tiptap/extension-code-block"

// Define the Document interface
interface MyDocument {
	uuid: string
	user_id: string
	file_name: string
	file_path: string
	created_at: string
	pages?: number
	type?: string
}


// Simple Toolbar Component
const SimpleToolbar = ({ editor }: { editor: any }) => {
	if (!editor) return null
	const [tooltip, setTooltip] = useState<{ id: string; text: string } | null>(null)
	const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null)

	const showTooltip = (id: string, text: string) => {
		// Clear any existing timeout to prevent multiple tooltips
		if (tooltipTimeout) {
			clearTimeout(tooltipTimeout)
		}
		// Set a new timeout to show the tooltip after 500ms
		const timeout = setTimeout(() => {
			setTooltip({ id, text })
		}, 500)
		setTooltipTimeout(timeout)
	}

	const hideTooltip = () => {
		// Clear the timeout and hide the tooltip
		if (tooltipTimeout) {
			clearTimeout(tooltipTimeout)
			setTooltipTimeout(null)
		}
		setTooltip(null)
	}
	const setLink = () => {
		const url = prompt("Enter the URL")
		if (url) {
			editor.chain().focus().setLink({ href: url }).run()
		}
	}

	const unsetLink = () => {
		editor.chain().focus().unsetLink().run()
	}

	return (
		<div className="bg-zinc-900 p-3 rounded-t-2xl  flex flex-wrap gap-2 shadow-lg sticky top-0 z-10">

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					onMouseEnter={() => showTooltip("bold", "Bold")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('bold') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<Bold className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Bold</span> */}
				</button>
				{tooltip?.id === "bold" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>
			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					onMouseEnter={() => showTooltip("italic", "Italic")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('italic') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<Italic className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Italic</span> */}
				</button>
				{tooltip?.id === "italic" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					onMouseEnter={() => showTooltip("underline", "Underline")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('underline') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<Underline className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Underline</span> */}
				</button>
				{tooltip?.id === "underline" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					onMouseEnter={() => showTooltip("heading1", "Heading 1")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-1.25 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('heading', { level: 1 }) ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<span className="text-[1.25rem] font-bold">H1</span>
				</button>
				{tooltip?.id === "heading1" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					onMouseEnter={() => showTooltip("heading2", "Heading 2")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-1.5 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<span className="text-[1.125rem] font-semibold">H2</span>
				</button>
				{tooltip?.id === "heading2" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					onMouseEnter={() => showTooltip("heading3", "Heading 3")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-2 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('heading', { level: 3 }) ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<span className="text-[1rem] font-medium">H3</span>
				</button>
				{tooltip?.id === "heading3" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					onMouseEnter={() => showTooltip("bulletList", "Bullet List")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('bulletList') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<List className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Bullet List</span> */}
				</button>
				{tooltip?.id === "bulletList" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					onMouseEnter={() => showTooltip("orderedList", "Ordered List")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('orderedList') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<ListOrdered className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Ordered List</span> */}
				</button>
				{tooltip?.id === "orderedList" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					onMouseEnter={() => showTooltip("taskList", "Task List")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('taskList') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<CheckSquare className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Task List</span> */}
				</button>
				{tooltip?.id === "taskList" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					onMouseEnter={() => showTooltip("codeBlock", "Code Block")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('codeBlock') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<Code className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Code Block</span> */}
				</button>
				{tooltip?.id === "codeBlock" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={setLink}
					onMouseEnter={() => showTooltip("setLink", "Set Link")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('link') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<LinkIcon className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Set Link</span> */}
				</button>
				{tooltip?.id === "setLink" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={unsetLink}
					onMouseEnter={() => showTooltip("unsetLink", "Unset Link")}
					onMouseLeave={hideTooltip}
					className={`px-3 py-3 rounded text-white transition-all duration-200 flex items-center gap-1.5 ${editor.isActive('link') ? 'bg-purple-600 shadow-md' : 'bg-zinc-800 hover:bg-zinc-700'
						}`}
				>
					<Unlink className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Unset Link</span> */}
				</button>
				{tooltip?.id === "unsetLink" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().undo().run()}
					onMouseEnter={() => showTooltip("undo", "Undo")}
					onMouseLeave={hideTooltip}
					className="px-3 py-3 rounded text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 flex items-center gap-1.5"
				>
					<Undo className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Undo</span> */}
				</button>
				{tooltip?.id === "undo" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => editor.chain().focus().redo().run()}
					onMouseEnter={() => showTooltip("redo", "Redo")}
					onMouseLeave={hideTooltip}
					className="px-3 py-3 rounded text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 flex items-center gap-1.5"
				>
					<Redo className="h-4 w-4" />
					{/* <span className="hidden sm:inline">Redo</span> */}
				</button>
				{tooltip?.id === "redo" && (
					<span className="absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-2 py-1 rounded shadow-lg">
						{tooltip.text}
					</span>
				)}
			</div>
		</div>
	)
}

export default function NotesView({ document }: { document: MyDocument }) {
	const [notes, setNotes] = useState("")
	const [isSaving, setIsSaving] = useState(false)
	const [lastSaved, setLastSaved] = useState<Date | null>(null)
	const [showCommandMenu, setShowCommandMenu] = useState(false)
	const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 })
	const [slashPosition, setSlashPosition] = useState<number>(0)
	const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
	const editorRef = useRef<HTMLDivElement>(null)

	const editor = useEditor({
		extensions: [
			StarterKit,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			UnderL,
			TaskList,
			TaskItem.configure({ nested: true }),
			Highlight.configure({ multicolor: true }),
			Image,
			Typography,
			Superscript,
			Subscript,
			Link.configure({ openOnClick: false }),
		],
		content: "",
		onUpdate: ({ editor }) => {
			const text = editor.getText()
			setNotes(text)
		},
	})

	const handleSaveNotes = () => {
		setIsSaving(true)
		setTimeout(() => {
			setLastSaved(new Date())
			setIsSaving(false)
		}, 800)
	}

	const handleCopyNotes = () => {
		if (editor) {
			const text = editor.getText()
			navigator.clipboard.writeText(text)
			alert("Notes copied to clipboard!")
		}
	}

	const formatLastSaved = () => {
		if (!lastSaved) return ""
		return lastSaved.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const commandOptions = [
		{
			name: "Heading 1",
			shortcut: "Ctrl+Alt+1",
			icon: "H1",
			command: "# ",
			action: (editor: any) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
		},
		{
			name: "Heading 2",
			shortcut: "Ctrl+Alt+2",
			icon: "H2",
			command: "## ",
			action: (editor: any) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
		},
		{
			name: "Heading 3",
			shortcut: "Ctrl+Alt+3",
			icon: "H3",
			command: "### ",
			action: (editor: any) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
		},
		{
			name: "Numbered List",
			shortcut: "Ctrl+Shift+7",
			icon: "1.",
			command: "1. ",
			action: (editor: any) => editor.chain().focus().toggleOrderedList().run(),
		},
		{
			name: "Bullet List",
			shortcut: "Ctrl+Shift+8",
			icon: "•",
			command: "- ",
			action: (editor: any) => editor.chain().focus().toggleBulletList().run(),
		},
		{
			name: "Check List",
			shortcut: "Ctrl+Shift+9",
			icon: "☑",
			command: "- [ ] ",
			action: (editor: any) => editor.chain().focus().toggleTaskList().run(),
		},
		{
			name: "Code Block",
			shortcut: "Ctrl+Alt+C",
			icon: "</>",
			command: "```\n\n```",
			action: (editor: any) => {
				editor.chain().focus().toggleCodeBlock().run();
			},
		},
	]

	const replaceSlashWithCommand = (selectedCommand: any) => {
		if (!editor) return

		// Delete the "/" character
		editor.commands.deleteRange({
			from: slashPosition,
			to: slashPosition + 1
		})

		// Insert the selected command at the same position
		editor.commands.insertContentAt(slashPosition, selectedCommand.command)

		// Calculate the range of the inserted command text
		const commandLength = selectedCommand.command.length
		const commandEndPosition = slashPosition + commandLength + 1

		// Execute the associated editor action
		selectedCommand.action(editor)

		// Delete the inserted command text (e.g., "# ", "- ", etc.)
		editor.commands.deleteRange({
			from: slashPosition,
			to: commandEndPosition
		})

		// For lists and code blocks, ensure no extra whitespace remains
		const { from } = editor.state.selection
		const textAfter = editor.state.doc.textBetween(from, from + 1)
		if (textAfter === " " && (
			selectedCommand.name === "Bullet List" ||
			selectedCommand.name === "Numbered List" ||
			selectedCommand.name === "Check List" ||
			selectedCommand.name === "Code Block"
		)) {
			editor.commands.deleteRange({
				from: from,
				to: from + 1
			})
		}

		// For Code Block, ensure cursor is positioned correctly
		if (selectedCommand.name === "Code Block") {
			const { from } = editor.state.selection
			editor.chain().focus().setTextSelection(from).run()
		}

		// Hide the command menu
		setShowCommandMenu(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!editor) return

		// Handle command menu navigation
		if (showCommandMenu) {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault()
					setSelectedCommandIndex(prev =>
						prev < commandOptions.length - 1 ? prev + 1 : 0
					)
					break
				case "ArrowUp":
					e.preventDefault()
					setSelectedCommandIndex(prev =>
						prev > 0 ? prev - 1 : commandOptions.length - 1
					)
					break
				case "Enter":
					e.preventDefault()
					replaceSlashWithCommand(commandOptions[selectedCommandIndex])
					break
				case "Escape":
					e.preventDefault()
					setShowCommandMenu(false)
					break
			}
			return
		}

		// Handle slash trigger
		if (e.key === "/") {
			e.preventDefault()
			const { from } = editor.state.selection

			// Insert the slash
			editor.commands.insertContentAt(from, "/")

			// Store the slash position
			setSlashPosition(from)

			// Calculate menu position
			setTimeout(() => {
				const coords = editor.view.coordsAtPos(from + 1)
				const editorRect = editorRef.current?.getBoundingClientRect()
				if (editorRect) {
					const top = coords.bottom - editorRect.top + (editorRef.current?.scrollTop || 0) + 5
					const left = coords.left - editorRect.left + (editorRef.current?.scrollLeft || 0)
					setCommandPosition({ top, left })
				}

				// Show command menu
				setShowCommandMenu(true)
				setSelectedCommandIndex(0)
			}, 0)
		}

		// Handle keyboard shortcuts
		if (e.ctrlKey && e.altKey) {
			if (e.key === '1') {
				e.preventDefault()
				editor.chain().focus().toggleHeading({ level: 1 }).run()
			} else if (e.key === '2') {
				e.preventDefault()
				editor.chain().focus().toggleHeading({ level: 2 }).run()
			} else if (e.key === '3') {
				e.preventDefault()
				editor.chain().focus().toggleHeading({ level: 3 }).run()
			} else if (e.key === 'c') {
				e.preventDefault()
				editor.chain().focus().toggleCodeBlock().run()
			}
		}

		if (e.ctrlKey && e.shiftKey) {
			if (e.key === '&') { // Shift+7
				e.preventDefault()
				editor.chain().focus().toggleOrderedList().run()
			} else if (e.key === '*') { // Shift+8
				e.preventDefault()
				editor.chain().focus().toggleBulletList().run()
			} else if (e.key === '(') { // Shift+9
				e.preventDefault()
				editor.chain().focus().toggleTaskList().run()
			}
		}

		// Auto-continue lists on Enter
		if (e.key === 'Enter') {
			const { $from } = editor.state.selection
			const parent = $from.parent
			if (parent.type.name === 'bullet_list') {
				editor.commands.splitListItem('list_item')
			} else if (parent.type.name === 'ordered_list') {
				editor.commands.splitListItem('list_item')
			} else if (parent.type.name === 'task_list') {
				editor.commands.splitListItem('list_item')
			}
		}
	}

	// Hide menu when clicking outside
	useEffect(() => {
		// Ensure this runs only on the client side and document is available
		if (typeof window === 'undefined' || !globalThis.document) return

		const doc = globalThis.document as Document
		const handleClickOutside = (event: MouseEvent) => {
			if (showCommandMenu && editorRef.current && !editorRef.current.contains(event.target as Node)) {
				setShowCommandMenu(false)
			}
		}

		doc.addEventListener('mousedown', handleClickOutside)
		return () => doc.removeEventListener('mousedown', handleClickOutside)
	}, [showCommandMenu])

	return (
		<div className="flex flex-col h-full bg-black">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 px-6 pt-6">
				<div className="flex items-center mb-4 sm:mb-0">
					<div className="flex items-center justify-center w-10 h-10 bg-zinc-900 rounded-2xl mr-3">
						<FileText className="h-5 w-5 text-purple-400" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-white">Your Notes</h3>
						<p className="text-sm text-zinc-400">Take notes as you study "{document.file_name}"</p>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
					{lastSaved && (
						<span className="text-xs text-zinc-500">
							Last saved at {formatLastSaved()}
						</span>
					)}
					<button
						onClick={handleCopyNotes}
						className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-1.5 sm:px-5 sm:py-2 shadow-lg transition-colors text-white flex items-center text-sm sm:text-base"
					>
						<Copy className="h-4 w-4 mr-2" />
						Copy Notes
					</button>
					<button
						onClick={handleSaveNotes}
						disabled={isSaving}
						className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-4 py-1.5 sm:px-5 sm:py-2 shadow-lg transition-colors text-white flex items-center text-sm sm:text-base"
					>
						<Save className="h-4 w-4 mr-2" />
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>

			<div className="flex-1 relative" ref={editorRef}>
				<div className="flex flex-col h-full">
					<SimpleToolbar editor={editor} />
					<div className="flex-1 relative">
						<EditorContent
							editor={editor}
							onKeyDown={handleKeyDown}
							className="w-full h-full bg-gradient-to-b from-zinc-950 to-zinc-900 border border-t-0 border-zinc-800 rounded-b-2xl p-6 text-white text-base leading-relaxed overflow-y-auto focus:outline-none focus:ring-2 focus:ring-purple-500 tiptap shadow-inner"
							style={{ lineHeight: '1.6' }}
						/>
						{notes === "" && (
							<span className="text-zinc-500 absolute top-[30.5px] left-6 pointer-events-none">
								Start typing... (use '/' for commands)
							</span>
						)}
					</div>
				</div>

				{showCommandMenu && (
					<div
						className="absolute bg-white rounded-lg shadow-xl w-64 p-2 z-20 border"
						style={{ top: commandPosition.top, left: commandPosition.left }}
					>
						<div className="text-sm font-semibold text-gray-600 mb-2 px-2">Commands</div>
						{commandOptions.map((option, index) => (
							<button
								key={index}
								onClick={() => replaceSlashWithCommand(option)}
								className={`w-full flex items-center space-x-2 px-2 py-2 text-gray-800 rounded-md text-sm transition-colors ${index === selectedCommandIndex
									? 'bg-purple-100 border-purple-300'
									: 'hover:bg-gray-100'
									}`}
							>
								<span className="w-6 text-center font-medium">{option.icon}</span>
								<span className="flex-1 text-left">{option.name}</span>
								<span className="text-xs text-gray-500">{option.shortcut}</span>
							</button>
						))}
					</div>
				)}

				{/* Add styles for Tiptap content */}
				<style>{`
          .tiptap {
            outline: none;
          }

          /* Headings */
          .tiptap h1 {
            font-size: 1.5rem; /* 24px */
            font-weight: 700;
            margin-top: 1.25rem;
            margin-bottom: 0.5rem;
            line-height: 1.3;
            color: #ffffff;
          }

          .tiptap h2 {
            font-size: 1.25rem; /* 20px */
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            line-height: 1.4;
            color: #e5e7eb;
          }

          .tiptap h3 {
            font-size: 1.125rem; /* 18px */
            font-weight: 500;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
            line-height: 1.5;
            color: #d1d5db;
          }

          /* Paragraphs */
          .tiptap p {
            font-size: 1rem; /* 16px */
            margin: 0.5rem 0;
            line-height: 1.6;
            color: #e5e7eb;
          }

          /* Lists */
          .tiptap ul,
          .tiptap ol {
            padding-left: 1.5rem;
            margin: 0.75rem 0;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 0.5rem;
            padding: 0.25rem 0 0.25rem 1.5rem;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
          }

          .tiptap ul li,
          .tiptap ol li {
            font-size: 1rem; /* 16px */
            margin: 0.25rem 0;
            line-height: 1.6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            transition: background 0.2s ease;
          }

          .tiptap ul li:hover,
          .tiptap ol li:hover {
            background: rgba(147, 51, 234, 0.1);
          }

          .tiptap ul li {
            list-style-type: disc;
            color: #ffffff;
          }

          .tiptap ol li {
            list-style-type: decimal;
            color: #ffffff;
          }

          .tiptap li p {
            margin: 0;
          }

          /* Task List */
          .tiptap ul[data-type="taskList"] {
            list-style: none;
            padding-left: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 0.5rem;
            padding: 0.25rem 0 0.25rem 1rem;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
          }

          .tiptap ul[data-type="taskList"] li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            transition: background 0.2s ease;
          }

          .tiptap ul[data-type="taskList"] li:hover {
            background: rgba(147, 51, 234, 0.1);
          }

          .tiptap ul[data-type="taskList"] li input[type="checkbox"] {
            accent-color: #9333ea;
            width: 1rem;
            height: 1rem;
            border-radius: 0.25rem;
          }

          /* Code Block */
          .tiptap pre {
            position: relative;
            background: #2d2d2d; /* Dark background */
            padding: 1.25rem 0.75rem 0.75rem 0.75rem;
            border-radius: 0.5rem;
            margin: 0.75rem 0;
            font-family: 'Fira Code', monospace;
            font-size: 0.8125rem; /* 13px */
            line-height: 1.4;
            overflow-x: auto;
            border: 1px solid #4b5563;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          }

          .tiptap pre::before {
            content: "Code";
            position: absolute;
            top: 0.25rem;
            right: 0.75rem;
            font-size: 0.75rem;
            color: #9ca3af;
            padding: 0.1rem 0.5rem;
            border-radius: 0.25rem;
          }

          .tiptap pre code {
            background: none;
            padding: 0;
            font: inherit;
            color: #e5e7eb; /* Light gray text for code */
          }

          /* Links */
          .tiptap a {
            font-size: 1rem; /* 16px */
            color: #60a5fa;
            text-decoration: none;
            padding: 0.1rem 0.3rem;
            border-radius: 0.25rem;
            transition: all 0.2s ease;
          }

          .tiptap a:hover {
            color: #93c5fd;
            background: rgba(96, 165, 250, 0.2);
            box-shadow: 0 0 8px rgba(96, 165, 250, 0.3);
            text-decoration: underline;
          }
        `}</style>
			</div>
		</div>
	)
}