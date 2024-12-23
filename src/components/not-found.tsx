import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function DepartmentNotFound() {
  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center py-6">
      <Card className="border-yellow-500/10 bg-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <CardTitle>Department Not Found</CardTitle>
          </div>
          <CardDescription>
            部門が見つかりません
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-yellow-400">
            The department you're looking for doesn't exist or has been moved.
          </p>
          <Button
            asChild
            className="gap-2 border border-yellow-500/10 bg-yellow-500/5 text-yellow-300 hover:bg-yellow-500/10 hover:text-yellow-200"
          >
            <Link href="/departments">
              <ArrowLeft className="h-4 w-4" />
              Back to Departments
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

