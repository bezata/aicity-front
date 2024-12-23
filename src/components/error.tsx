"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function DepartmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center py-6">
      <Card className="border-red-500/10 bg-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <CardTitle>Error Loading Department</CardTitle>
          </div>
          <CardDescription>
            エラーが発生しました
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-red-400">
            {error.message || "An unexpected error occurred."}
          </p>
          <Button
            onClick={reset}
            className="gap-2 border border-red-500/10 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:text-red-200"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

