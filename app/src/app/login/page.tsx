import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-t from-black  to-[#340258] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl mx-auto">
        <LoginForm />
        <div className="text-balance text-center text-xs mt-6 text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
