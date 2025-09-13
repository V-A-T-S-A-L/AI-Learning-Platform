'use client' // Important!

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1>An error occurred</h1>
    </div>
  )
}
