import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all resumes for the current user
export async function GET() {
  try {
    const authResult = await auth()
    const userId = authResult?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || null,
          lastName: user.lastName || null,
        },
      })
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: "desc" },
    })

    // Parse JSON strings back to objects
    const parsedResumes = resumes.map((resume) => ({
      ...resume,
      personalInfo: JSON.parse(resume.personalInfo),
      workExperience: JSON.parse(resume.workExperience),
      education: JSON.parse(resume.education),
      skills: JSON.parse(resume.skills),
    }))

    return NextResponse.json(parsedResumes)
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    )
  }
}

// POST create a new resume
export async function POST(request: Request) {
  try {
    const authResult = await auth()
    const userId = authResult?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || null,
          lastName: user.lastName || null,
        },
      })
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

    const resume = await prisma.resume.create({
      data: {
        userId: dbUser.id,
        title: title || "Untitled Resume",
        layout: layout || "layout1",
        isDraft: isDraft !== undefined ? isDraft : true,
        personalInfo: JSON.stringify(personalInfo),
        professionalSummary: professionalSummary || "",
        workExperience: JSON.stringify(workExperience),
        education: JSON.stringify(education),
        skills: JSON.stringify(skills),
      },
    })

    return NextResponse.json({
      ...resume,
      personalInfo: JSON.parse(resume.personalInfo),
      workExperience: JSON.parse(resume.workExperience),
      education: JSON.parse(resume.education),
      skills: JSON.parse(resume.skills),
    })
  } catch (error) {
    console.error("Error creating resume:", error)
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    )
  }
}

