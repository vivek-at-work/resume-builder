import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET a single resume
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await auth()
    const userId = authResult?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...resume,
      personalInfo: JSON.parse(resume.personalInfo),
      workExperience: JSON.parse(resume.workExperience),
      education: JSON.parse(resume.education),
      skills: JSON.parse(resume.skills),
    })
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    )
  }
}

// PUT update a resume
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await auth()
    const userId = authResult?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      layout,
      isDraft,
      personalInfo,
      professionalSummary,
      workExperience,
      education,
      skills,
    } = body

    // First verify the resume belongs to the user
    const existingResume = await prisma.resume.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    })

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Update the resume
    const updateData: {
      title: string
      layout: string
      isDraft: boolean
      personalInfo: string
      professionalSummary: string
      workExperience: string
      education: string
      skills: string
    } = {
      title: title || "Untitled Resume",
      layout: layout || "layout1",
      isDraft: isDraft !== undefined ? isDraft : true,
      personalInfo: JSON.stringify(personalInfo),
      professionalSummary: professionalSummary || "",
      workExperience: JSON.stringify(workExperience),
      education: JSON.stringify(education),
      skills: JSON.stringify(skills),
    }

    const updatedResume = await prisma.resume.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      ...updatedResume,
      personalInfo: JSON.parse(updatedResume!.personalInfo),
      workExperience: JSON.parse(updatedResume!.workExperience),
      education: JSON.parse(updatedResume!.education),
      skills: JSON.parse(updatedResume!.skills),
    })
  } catch (error) {
    console.error("Error updating resume:", error)
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    )
  }
}

// DELETE a resume
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await auth()
    const userId = authResult?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const resume = await prisma.resume.deleteMany({
      where: {
        id,
        userId: dbUser.id,
      },
    })

    if (resume.count === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    )
  }
}

