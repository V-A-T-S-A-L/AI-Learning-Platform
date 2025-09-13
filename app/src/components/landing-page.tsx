"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle, Code, Cpu, Github, Globe, Lock, Menu, MessageSquare, RefreshCw, Twitter, X, Zap } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dotted-dialog"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { CloudPlatform } from "./interactive/cloud-platform"
import { AnalyticsPlatform } from "./interactive/analytics-platform"
import { SecurityPlatform } from "./interactive/security-platform"
import { TeamVisualization } from "./interactive/team-visualization"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useUser } from '@/contexts/UserContext'
import StudyInterface from "./interactive/StudyInterface"

export default function LandingPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [email, setEmail] = useState("")
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [scrollY, setScrollY] = useState(0)
	const isVerySmall = useMediaQuery("(max-width: 500px)")

	const { user, loading } = useUser()


	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY)
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const headerClass =
		scrollY > 50 ? "py-4 bg-black/80 backdrop-blur-md border-b border-gray-800/50" : "py-6 bg-transparent"

	return (
		<div className="min-h-screen bg-black text-white overflow-hidden">
			{/* Header */}
			<header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
				<div className="container mx-auto px-4 flex justify-between items-center">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex items-center gap-2"
					>
						<Cpu className="h-6 w-6 text-purple-500" />
						<span className="font-bold text-xl">CardGenX</span>
					</motion.div>
					<nav className="hidden md:flex items-center gap-8">
						{["Features", "Products", "About", "Testimonials"].map((item, i) => (
							<motion.div
								key={item}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
							>
								<Link
									href={`#${item.toLowerCase()}`}
									className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
								>
									{item}
								</Link>
							</motion.div>
						))}
					</nav>
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						{user ? (
							<Link href="/dashboard">
								<Button
									variant="outline"
									className="hidden md:flex border-purple-500 text-purple-500 bg-transparent"
								>
									Dashboard
								</Button>
							</Link>
						) : (
							<Link href="/login">
								<Button
									variant="outline"
									className="hidden md:flex border-purple-500 text-purple-500 bg-transparent"
								>
									Login
								</Button>
							</Link>
						)}
						<Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
							{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</motion.div>
				</div>
			</header >

			{/* Mobile Menu */}
			<AnimatePresence>
				{
					isMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed top-[72px] left-0 right-0 z-40 bg-black border-b border-gray-800 md:hidden"
						>
							<div className="container mx-auto px-4 py-6 flex flex-col gap-6">
								{["Features", "Products", "About", "Testimonials"].map((item) => (
									<Link
										key={item}
										href={`#${item.toLowerCase()}`}
										className="text-gray-300 hover:text-white transition-colors text-lg font-medium"
										onClick={() => setIsMenuOpen(false)}
									>
										{item}
									</Link>
								))}
								<Button
									className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full"
									onClick={() => {
										setIsMenuOpen(false)
										setIsModalOpen(true)
									}}
								>
									Get Started
								</Button>
							</div>
						</motion.div>
					)
				}
			</AnimatePresence >

			{/* Hero Section */}
			< section className="relative pt-32 pb-20 overflow-hidden" >
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
					<div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.1),transparent_65%)]" />
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-4xl mx-auto text-center mb-16">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight"
						>
							The Future of Studying is Here
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
						>
							Discover cutting-edge solutions that transform the way you learn. Powerful, intuitive,
							and designed for the future.
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.6 }}
						>
							<Button
								className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-full text-sm sm:text-lg font-medium shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300"
							>
								Get Started Now
								<ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
							</Button>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.8 }}
						className="relative w-full max-w-5xl mx-auto"
					>
						<StudyInterface />
					</motion.div>
				</div>
			</section >

			{/* Features Section */}
			< section id="features" className="py-24 relative overflow-hidden" >
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,50,255,0.15),transparent_50%)]" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
							<p className="text-gray-400 max-w-2xl mx-auto">
								Our platform offers a comprehensive suite of tools designed to enhance your productivity and streamline
								your workflow.
							</p>
						</motion.div>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								icon: <BrainCircuit className="h-10 w-10 text-red-500" />,
								title: "AI-Generated Content",
								description:
									"Automatically generate flashcards, summaries, and intelligent insights from your uploaded PDFs using advanced AI models.",
							},
							{
								icon: <MessageSquare className="h-10 w-10 text-yellow-500" />,
								title: "Chat with Your PDFs",
								description:
									"Ask questions and get contextual answers directly from the contents of your PDFs using an interactive AI chat interface.",
							},
							{
								icon: <BookOpen className="h-10 w-10 text-purple-500" />,
								title: "Smart Note-Taking",
								description:
									"Write and organize your notes while reading your PDF, all in one unified and distraction-free workspace.",
							},
							{
								icon: <RefreshCw className="h-10 w-10 text-blue-500" />,
								title: "Persistent Intelligence",
								description:
									"All flashcards, summaries, and notes are saved and fetched instantly—no need to reprocess the PDF on every visit.",
							},
							{
								icon: <Lock className="h-10 w-10 text-green-500" />,
								title: "Secure & Private",
								description:
									"Your documents and data are handled with strict privacy, encrypted at rest and in transit, ensuring complete security.",
							},
							{
								icon: <Zap className="h-10 w-10 text-pink-500" />,
								title: "Optimized Performance",
								description:
									"Built with Next.js and modern technologies for a seamless, fast, and responsive user experience across all devices.",
							},
						]
							.map((feature, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
								>
									<div className="h-full bg-transparent p-[1px] rounded-xl">
										<div className="h-full bg-transparent p-6 rounded-xl border border-gray-800/50 hover:border-purple-500 transition-colors">
											<div className="mb-4 p-3 bg-gray-800/30 rounded-lg inline-block">{feature.icon}</div>
											<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
											<p className="text-gray-400">{feature.description}</p>
										</div>
									</div>
								</motion.div>
							))}
					</div>
				</div>
			</section >

			{/* Products Section */}
			< section id="products" className="py-24 relative overflow-hidden" >
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(120,50,255,0.15),transparent_50%)]" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<h2 className="text-3xl md:text-5xl font-bold mb-4">Our Products</h2>
							<p className="text-gray-400 max-w-2xl mx-auto">
								Explore our suite of innovative products designed to transform your digital experience.
							</p>
						</motion.div>
					</div>

					<div className="space-y-24">
						{/* FlashMe Cloud */}
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="space-y-6"
							>
								<h3 className="text-3xl font-bold">FlashMe Study</h3>
								<p className="text-gray-300 text-lg">
									A powerful web-based platform for uploading and managing your PDFs. Automatically generate and store flashcards, summaries, notes, and chat data—accessible anytime without reprocessing.
								</p>
								<ul className="space-y-3">
									{[
										"Instant access to saved summaries and flashcards",
										"Interactive AI chat with your documents",
										"Smart, persistent note-taking",
										"Optimized storage with zero redundant processing"
									].map((feature, i) => (
										<li key={i} className="flex items-center gap-3">
											<CheckCircle className="h-5 w-5 text-purple-500" />
											<span>{feature}</span>
										</li>
									))}
								</ul>

								<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
									Learn More
								</Button>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
							>
								<div className="rounded-lg">
									<div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
										<CloudPlatform />
									</div>
								</div>
							</motion.div>
						</div>

						{/* FlashMe Analytics */}
						<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="order-1 md:order-last space-y-4 md:space-y-6"
							>
								<h3 className="text-2xl md:text-3xl font-bold">FlashMe Analytics</h3>
								<p className="text-gray-300 text-base md:text-lg">
									Gain valuable insights from your study pattern with our powerful analytics platform. Make data-driven decisions
									with confidence.
								</p>
								<ul className="space-y-2 md:space-y-3">
									{["Custom Flashcards", "AI-powered summaries", "Personallized notes"].map(
										(feature, i) => (
											<li key={i} className="flex items-center gap-2 md:gap-3">
												<CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
												<span className="text-sm md:text-base">{feature}</span>
											</li>
										),
									)}
								</ul>
								<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
									Learn More
								</Button>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="order-2 md:order-first"
							>
								<div className="rounded-lg">
									<div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
										<AnalyticsPlatform />
									</div>
								</div>
							</motion.div>
						</div>

						{/* FlashMe Security */}
						{/* <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="space-y-4 md:space-y-6 order-1 md:order-1"
							>
								<h3 className="text-2xl md:text-3xl font-bold">FlashMe Security</h3>
								<p className="text-gray-300 text-base md:text-lg">
									Protect your digital assets with our comprehensive security solution. Stay ahead of threats with
									advanced protection.
								</p>
								<ul className="space-y-2 md:space-y-3">
									{[
										"Threat detection",
										"Vulnerability scanning",
										"Compliance monitoring",
										"24/7 security operations",
									].map((feature, i) => (
										<li key={i} className="flex items-center gap-2 md:gap-3">
											<CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
											<span className="text-sm md:text-base">{feature}</span>
										</li>
									))}
								</ul>
								<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
									Learn More
								</Button>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="order-2 md:order-2"
							>
								<div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-1 rounded-lg">
									<div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
										<SecurityPlatform />
									</div>
								</div>
							</motion.div>
						</div> */}
					</div>
				</div>
			</section >

			{/* About Section */}
			< section id="about" className="py-16 md:py-24 relative overflow-hidden" >
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15),transparent_60%)]" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="order-1 md:order-1"
						>
							<h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6">About Our Mission</h2>
							<p className="text-gray-300 mb-4 md:mb-6 text-sm sm:text-base md:text-lg">
								Founded in 2023, FlashMe was created with a singular vision: to democratize access to cutting-edge
								technology. We believe that powerful tools should be accessible to everyone, regardless of technical
								expertise.
							</p>
							<p className="text-gray-300 mb-4 md:mb-6 text-sm sm:text-base md:text-lg">
								Our team of passionate engineers and designers work tirelessly to create intuitive, powerful solutions
								that solve real-world problems and empower our users to achieve more.
							</p>
							<div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
								<div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
									<span className="text-purple-400 font-medium">50+</span> Team Members
								</div>
								<div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
									<span className="text-purple-400 font-medium">10k+</span> Customers
								</div>
								<div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
									<span className="text-purple-400 font-medium">99.9%</span> Uptime
								</div>
							</div>
							<Button
								variant="outline"
								className="border-purple-500 text-purple-500 hover:bg-purple-950 text-sm sm:text-base"
							>
								Learn More About Us
							</Button>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="order-2 md:order-2"
						>
							<div className="relative">
								<div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-xl" />
								<div className="relative rounded-lg overflow-hidden">
									<div className="w-full h-[300px] md:h-[400px]">
										<TeamVisualization />
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section >

			{/* Testimonials Section */}
			< section id="testimonials" className="py-24 relative overflow-hidden" >
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,50,255,0.15),transparent_50%)]" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
							<p className="text-gray-400 max-w-2xl mx-auto">
								Don't just take our word for it. Here's what our clients have to say about their experience with
								FlashMe.
							</p>
						</motion.div>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								name: "Sarah Johnson",
								role: "CTO, TechStart Inc.",
								image: "https://avatar.vercel.sh/jill",
								content:
									"FlashMe has completely transformed our development workflow. The platform's intuitive design and powerful features have increased our team's productivity by over 40%.",
							},
							{
								name: "Michael Chen",
								role: "Founder, DataFlow",
								image: "https://avatar.vercel.sh/jill",
								content:
									"Implementing FlashMe was one of the best decisions we've made. The seamless integration and robust API have allowed us to focus on what matters most - building great products.",
							},
							{
								name: "Emily Rodriguez",
								role: "Lead Developer, InnovateCorp",
								image: "https://avatar.vercel.sh/jill",
								content:
									"As a developer, I appreciate the attention to detail in FlashMe's platform. The documentation is comprehensive, and the support team is always ready to help.",
							},
						].map((testimonial, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 p-[1px] rounded-xl">
									<div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50 backdrop-blur-sm">
										<div className="flex items-center mb-6">
											<div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">

											</div>
											<div>
												<h4 className="font-bold">{testimonial.name}</h4>
												<p className="text-gray-400 text-sm">{testimonial.role}</p>
											</div>
										</div>
										<p className="text-gray-300 italic">"{testimonial.content}"</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section >

			{/* Contact Section */}
			< section id="contact" className="py-24 relative overflow-hidden" >
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(120,50,255,0.15),transparent_50%)]" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="text-center mb-12"
						>
							<h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
							<p className="text-gray-300 mb-8 text-lg">
								Join thousands of satisfied users who have already transformed their workflow with FlashMe.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="bg-gradient-to-b from-gray-900 to-gray-950 p-[1px] rounded-xl">
								<div className="bg-gradient-to-b from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50 backdrop-blur-sm">
									<h3 className="text-2xl font-bold mb-6">Contact Us</h3>
									<form className="space-y-6">
										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="name" className="text-gray-300">
													Name
												</Label>
												<Input
													id="name"
													type="text"
													placeholder="Enter your name"
													className="bg-gray-800/50 border-gray-700 focus:border-purple-500 h-12"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email" className="text-gray-300">
													Email
												</Label>
												<Input
													id="email"
													type="email"
													placeholder="Enter your email"
													className="bg-gray-800/50 border-gray-700 focus:border-purple-500 h-12"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="subject" className="text-gray-300">
												Subject
											</Label>
											<Input
												id="subject"
												type="text"
												placeholder="Enter subject"
												className="bg-gray-800/50 border-gray-700 focus:border-purple-500 h-12"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="message" className="text-gray-300">
												Message
											</Label>
											<textarea
												id="message"
												rows={4}
												placeholder="Enter your message"
												className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
											></textarea>
										</div>
										<Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-base">
											Send Message
										</Button>
									</form>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section >

			{/* Footer */}
			< footer className="py-16 border-t border-gray-800/50 relative overflow-hidden" >
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(120,50,255,0.1),transparent_70%)]" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
						<div>
							<div className="flex items-center gap-2 mb-6">
								<Cpu className="h-6 w-6 text-purple-500" />
								<span className="font-bold text-xl">FlashMe</span>
							</div>
							<p className="text-gray-400 mb-6">
								Empowering innovation through technology. We build tools that help businesses thrive in the digital age.
							</p>
							<div className="flex space-x-4">
								<a href="#" className="text-gray-400 hover:text-white transition-colors">
									<Twitter className="h-5 w-5" />
								</a>
								<a href="#" className="text-gray-400 hover:text-white transition-colors">
									<Github className="h-5 w-5" />
								</a>
							</div>
						</div>

						<div>
							<h4 className="font-bold text-lg mb-6">Products</h4>
							<ul className="space-y-4">
								{["Cloud Platform", "Analytics", "Security", "API", "Documentation"].map((item) => (
									<li key={item}>
										<a href="#" className="text-gray-400 hover:text-white transition-colors">
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="font-bold text-lg mb-6">Company</h4>
							<ul className="space-y-4">
								{["About", "Careers", "Blog", "Press", "Partners"].map((item) => (
									<li key={item}>
										<a href="#" className="text-gray-400 hover:text-white transition-colors">
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="font-bold text-lg mb-6">Legal</h4>
							<ul className="space-y-4">
								{["Terms", "Privacy", "Cookies", "Licenses", "Contact"].map((item) => (
									<li key={item}>
										<a href="#" className="text-gray-400 hover:text-white transition-colors">
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} FlashMe. All rights reserved.</p>
						<div className="flex gap-6">
							<a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
								Privacy Policy
							</a>
							<a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
								Terms of Service
							</a>
							<a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
								Cookies
							</a>
						</div>
					</div>
				</div>
			</footer >

			{/* Modal */}
			< Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)
			}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-2xl">Get Early Access</DialogTitle>
						<DialogDescription>
							Join our exclusive beta program and be among the first to experience the future of technology.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="modal-email">Email</Label>
							<Input
								id="modal-email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="modal-name">Full Name</Label>
							<Input
								id="modal-name"
								type="text"
								placeholder="Enter your full name"
								className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="modal-company">Company (Optional)</Label>
							<Input
								id="modal-company"
								type="text"
								placeholder="Enter your company name"
								className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button
							className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
							onClick={() => {
								alert("Thank you for your interest! We'll be in touch soon.")
								setIsModalOpen(false)
							}}
						>
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog >
		</div >
	)
}
