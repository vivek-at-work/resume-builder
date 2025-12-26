import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const authResult = await auth()
    const userId = authResult?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }

    const { text, sectionType, sectionId } = await request.json()

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Create context-aware prompt based on section type
    let contextPrompt = ""
    switch (sectionType) {
      case "heading":
        contextPrompt = "This is a resume section heading. Provide 3-5 alternative headings that are professional, clear, and ATS-friendly."
        break
      case "statement":
        contextPrompt = "This is a professional statement or bullet point from a resume. Provide 3-5 alternative versions that are more impactful, use action verbs, and are optimized for ATS systems. Keep the same meaning but make it more compelling."
        break
      case "description":
        contextPrompt = "This is a work experience or project description from a resume. Provide 3-5 alternative versions that are more concise, use strong action verbs, include quantifiable achievements when possible, and are ATS-optimized. Format as bullet points if the original is a paragraph."
        break
      case "summary":
        contextPrompt = "This is a professional summary from a resume. Provide 3-5 alternative versions that are more compelling, highlight key achievements, and are optimized for ATS systems. Keep it concise (2-4 sentences or bullet points)."
        break
      case "skill":
        contextPrompt = "This is a skills section from a resume. Provide 3-5 alternative ways to present these skills that are more organized, ATS-friendly, and highlight relevant competencies."
        break
      default:
        contextPrompt = "This is text from a resume. Provide 3-5 alternative versions that are more professional, impactful, and ATS-optimized."
    }

    const prompt = `${contextPrompt}

Original text:
${text}

Return a JSON object with an "alternatives" property containing an array of 3-5 alternative versions, each as a string. Do not include any explanations or markdown formatting. Example format: {"alternatives": ["alternative 1", "alternative 2", "alternative 3"]}`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || "{}"
    let parsedContent
    
    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError)
      // Try to extract JSON object from text
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          parsedContent = JSON.parse(jsonMatch[0])
        } catch (e) {
          console.error("Failed to parse extracted JSON:", e)
        }
      }
      
      // If still no valid JSON, try to extract array
      if (!parsedContent || typeof parsedContent !== "object") {
        const arrayMatch = content.match(/\[[\s\S]*\]/)
        if (arrayMatch) {
          try {
            const array = JSON.parse(arrayMatch[0])
            parsedContent = { alternatives: Array.isArray(array) ? array : [content.trim()] }
          } catch (e) {
            parsedContent = { alternatives: [content.trim()] }
          }
        } else {
          // Fallback: treat response as single alternative
          parsedContent = { alternatives: [content.trim()] }
        }
      }
    }

    // Extract alternatives array
    let alternatives: string[] = []
    if (parsedContent && typeof parsedContent === "object") {
      if (Array.isArray(parsedContent.alternatives)) {
        alternatives = parsedContent.alternatives
      } else if (Array.isArray(parsedContent)) {
        alternatives = parsedContent
      } else {
        // Try to find any array property
        const arrayValues = Object.values(parsedContent).filter(Array.isArray)
        if (arrayValues.length > 0) {
          alternatives = arrayValues[0] as string[]
        }
      }
    }

    // Ensure we have at least one alternative
    if (alternatives.length === 0) {
      // Try to split by newlines or bullets as fallback
      const lines = content.split(/\n/).filter(line => line.trim().length > 0)
      if (lines.length > 0) {
        alternatives = lines.slice(0, 5)
      } else {
        alternatives = [text] // Fallback to original
      }
    }

    // Limit to 5 alternatives
    alternatives = alternatives.slice(0, 5)

    return NextResponse.json({ alternatives })
  } catch (error) {
    console.error("Error improving text:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    return NextResponse.json(
      {
        error: "Failed to generate alternatives",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}

