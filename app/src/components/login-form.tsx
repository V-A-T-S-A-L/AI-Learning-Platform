'use client';

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { supabase } from "@/lib/supabaseClient" // import supabase client

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {

	const router = useRouter()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [resetEmailSent, setResetEmailSent] = useState(false)

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		const { error } = await supabase.auth.signInWithPassword({ email, password })

		if (error) {
			setError(error.message)
		} else {
			router.push("/dashboard") // Redirect on success
		}

		setLoading(false)
	}

	const handleForgotPassword = async () => {
		setLoading(true)
		setError("")
		const { error } = await supabase.auth.resetPasswordForEmail(email)

		if (error) {
			setError(error.message)
		} else {
			setResetEmailSent(true)
		}

		setLoading(false)
	}

	const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
		setLoading(true)
		const { error } = await supabase.auth.signInWithOAuth({ provider })
		if (error) setError(error.message)
		setLoading(false)
	}

	return (
		<div className={cn("w-full", className)} {...props}>
			<Card className="w-full shadow-lg border border-purple-500">
				<CardHeader className="text-center relative pb-8">
					<div className="absolute right-4 top-4">
						<ThemeToggle />
					</div>
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription className="text-base">Sign in to continue</CardDescription>
				</CardHeader>
				<CardContent className="px-6 sm:px-8 md:px-12 pb-12">
					{error && (
						<div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
							{error}
						</div>
					)}

					{resetEmailSent && (
						<div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
							Password reset email sent! Check your inbox.
						</div>
					)}

					<form onSubmit={handleEmailLogin}>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Left column - Email/Password Login */}
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email" className="text-base">
										Email
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={loading}
										className="h-11 border border-purple-500 focus:border-purple-400 focus:ring-purple-300 focus:ring-2"
									/>
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password" className="text-base">
											Password
										</Label>
										<button
											type="button"
											onClick={handleForgotPassword}
											className="ml-auto text-sm underline-offset-4 hover:underline"
											disabled={loading}
										>
											Forgot password?
										</button>
									</div>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={loading}
										className="h-11 border border-purple-500 focus:border-purple-400 focus:ring-purple-300 focus:ring-2"
									/>
								</div>
								<Button
									type="submit"
									variant="outline"
									disabled={loading}
									className="w-full h-11 text-base border border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50"
								>
									{loading ? "Signing in..." : "Login"}
								</Button>
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<a href="/signup" className="underline underline-offset-4">
										Sign up
									</a>
								</div>
							</div>

							{/* Right column - Social Logins */}
							<div className="grid gap-6">
								<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
									<span className="relative z-10 bg-background px-2 text-muted-foreground">Or login with</span>
								</div>
								<div className="flex flex-col gap-4">
									{/* Facebook */}
									<Button
										type="button"
										variant="outline"
										onClick={() => handleSocialLogin('facebook')}
										disabled={loading}
										className="w-full h-11 border border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50"
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
											<path
												d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82V14.706h-3.31v-3.62h3.31V8.413c0-3.284 2.004-5.07 4.932-5.07 1.402 0 2.608.104 2.96.151v3.43l-2.032.001c-1.593 0-1.902.756-1.902 1.865v2.448h3.805l-.496 3.62h-3.31V24h6.49C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"
												fill="currentColor"
											/>
										</svg>
										Facebook
									</Button>

									{/* Google */}
									<Button
										type="button"
										variant="outline"
										onClick={() => handleSocialLogin('google')}
										disabled={loading}
										className="w-full h-11 border border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50"
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
											<path
												d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
												fill="currentColor"
											/>
										</svg>
										Google
									</Button>

									{/* GitHub */}
									<Button
										type="button"
										variant="outline"
										onClick={() => handleSocialLogin('github')}
										disabled={loading}
										className="w-full h-11 border border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50"
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
											<path
												d="M12 0C5.372 0 0 5.372 0 12c0 5.303 3.438 9.8 8.207 11.385.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.206.084 1.839 1.237 1.839 1.237 1.07 1.833 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.306-5.467-1.335-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.958-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.371.823 1.102.823 2.221v3.293c0 .319.192.694.801.576C20.565 21.799 24 17.302 24 12c0-6.628-5.373-12-12-12z"
												fill="currentColor"
											/>
										</svg>
										GitHub
									</Button>

									{/* LinkedIn - Note: LinkedIn OAuth requires special setup */}
									<Button
										type="button"
										variant="outline"
										disabled={true} // Disabled as LinkedIn requires special OAuth setup
										className="w-full h-11 border border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50"
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
											<path
												d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
												fill="currentColor"
											/>
										</svg>
										LinkedIn (Coming Soon)
									</Button>
								</div>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}