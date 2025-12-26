import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { parseResumeFromPDF } from "@/lib/parse-resume-from-pdf"

export async function POST(request: Request) {
  try {
    const authResult = await auth()
    const userId = authResult?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate buffer is not empty
    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { error: "Invalid PDF file: file appears to be empty" },
        { status: 400 }
      )
    }

    // Parse the PDF
    const parsedData = await parseResumeFromPDF(buffer)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error parsing PDF:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Full error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to parse PDF. Please ensure it's a valid resume PDF.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

