import type { ResumeFormData } from "./resumeSchema"

interface ParsedResume {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn: string
    portfolio: string
  }
  professionalSummary: string
  workExperience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    graduationDate: string
  }>
  skills: {
    technical: string
    soft: string
  }
}

// Extract email from text
function extractEmail(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(emailRegex)
  return matches?.[0] || ""
}

// Extract phone number from text
function extractPhone(text: string): string {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
  const matches = text.match(phoneRegex)
  return matches?.[0] || ""
}

// Extract LinkedIn URL
function extractLinkedIn(text: string): string {
  const linkedInRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi
  const matches = text.match(linkedInRegex)
  return matches?.[0] || ""
}

// Extract portfolio/website URL
function extractPortfolio(text: string): string {
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi
  const matches = text.match(urlRegex)
  // Filter out LinkedIn and common email domains
  const filtered = matches?.filter(
    (url) =>
      !url.includes("linkedin.com") &&
      !url.includes("@") &&
      !url.includes("gmail.com") &&
      !url.includes("yahoo.com") &&
      !url.includes("outlook.com")
  )
  return filtered?.[0] || ""
}

// Extract name (usually first line or before email)
function extractName(text: string): string {
  const lines = text.split("\n").filter((line) => line.trim().length > 0)
  // Name is usually in the first few lines, before contact info
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim()
    // Skip if it's clearly an email, phone, or URL
    if (
      line.includes("@") ||
      extractPhone(line) ||
      line.startsWith("http") ||
      line.toLowerCase().includes("resume") ||
      line.toLowerCase().includes("cv")
    ) {
      continue
    }
    // Name is usually 2-4 words
    const words = line.split(/\s+/)
    if (words.length >= 2 && words.length <= 4) {
      return line
    }
  }
  return ""
}

// Extract location (look for city, state or country patterns)
function extractLocation(text: string): string {
  const locationPatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})/g, // City, State
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+)/g, // City, Country
  ]

  for (const pattern of locationPatterns) {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      return matches[0]
    }
  }
  return ""
}

// Extract work experience
function extractWorkExperience(text: string): ParsedResume["workExperience"] {
  const experiences: ParsedResume["workExperience"] = []
  const lines = text.split("\n")

  // Common patterns for work experience sections
  const experienceKeywords = [
    "experience",
    "employment",
    "work history",
    "professional experience",
    "career",
  ]

  let inExperienceSection = false
  let currentExperience: Partial<ParsedResume["workExperience"][0]> | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const lowerLine = line.toLowerCase()

    // Detect experience section
    if (
      experienceKeywords.some((keyword) => lowerLine.includes(keyword)) &&
      lowerLine.length < 50
    ) {
      inExperienceSection = true
      continue
    }

    // Stop if we hit education section
    if (
      lowerLine.includes("education") &&
      lowerLine.length < 50 &&
      inExperienceSection
    ) {
      break
    }

    if (inExperienceSection && line.length > 0) {
      // Look for position/company pattern (e.g., "Software Engineer | Company Name")
      const positionCompanyMatch = line.match(/^(.+?)\s*[|\-–—]\s*(.+)$/)
      if (positionCompanyMatch) {
        if (currentExperience) {
          experiences.push(currentExperience as ParsedResume["workExperience"][0])
        }
        currentExperience = {
          position: positionCompanyMatch[1].trim(),
          company: positionCompanyMatch[2].trim(),
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        }
        continue
      }

      // Look for date ranges (e.g., "Jan 2020 - Present" or "2020-2023")
      const dateRangeMatch = line.match(
        /(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(Present|Current|\d{4}|\w+\s+\d{4})/i
      )
      if (dateRangeMatch && currentExperience) {
        currentExperience.startDate = dateRangeMatch[1]
        const endDate = dateRangeMatch[2]
        if (endDate.toLowerCase() === "present" || endDate.toLowerCase() === "current") {
          currentExperience.current = true
        } else {
          currentExperience.endDate = endDate
        }
        continue
      }

      // Collect description lines
      if (currentExperience && line.length > 20) {
        currentExperience.description +=
          (currentExperience.description ? " " : "") + line
      }
    }
  }

  if (currentExperience) {
    experiences.push(currentExperience as ParsedResume["workExperience"][0])
  }

  return experiences.length > 0 ? experiences : []
}

// Extract education
function extractEducation(text: string): ParsedResume["education"] {
  const education: ParsedResume["education"] = []
  const lines = text.split("\n")

  let inEducationSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const lowerLine = line.toLowerCase()

    if (lowerLine.includes("education") && lowerLine.length < 50) {
      inEducationSection = true
      continue
    }

    // Stop if we hit skills section
    if (
      (lowerLine.includes("skills") || lowerLine.includes("technical")) &&
      lowerLine.length < 50 &&
      inEducationSection
    ) {
      break
    }

    if (inEducationSection && line.length > 0) {
      // Look for degree pattern (e.g., "Bachelor of Science in Computer Science")
      const degreeMatch = line.match(
        /(Bachelor|Master|PhD|Doctorate|Associate|Diploma|Certificate).*?(?:in|of)\s*(.+?)(?:,|\s+-\s+|\s*$)/i
      )
      if (degreeMatch) {
        const degree = degreeMatch[0].trim()
        const institution = lines[i + 1]?.trim() || ""
        const dateMatch = text.match(/(\d{4})/g)
        const graduationDate = dateMatch?.[dateMatch.length - 1] || ""

        education.push({
          degree,
          field: degreeMatch[2]?.trim() || "",
          institution,
          graduationDate,
        })
      }
    }
  }

  return education.length > 0 ? education : []
}

// Extract skills
function extractSkills(text: string): ParsedResume["skills"] {
  const skills: ParsedResume["skills"] = {
    technical: "",
    soft: "",
  }

  const lines = text.split("\n")
  let inSkillsSection = false
  const technicalKeywords = [
    "javascript",
    "python",
    "java",
    "react",
    "node",
    "sql",
    "aws",
    "docker",
    "git",
    "typescript",
    "html",
    "css",
    "mongodb",
    "postgresql",
  ]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const lowerLine = line.toLowerCase()

    if (
      (lowerLine.includes("skills") || lowerLine.includes("technical")) &&
      lowerLine.length < 50
    ) {
      inSkillsSection = true
      continue
    }

    if (inSkillsSection && line.length > 0) {
      // Check if line contains technical skills
      const hasTechnical = technicalKeywords.some((keyword) =>
        lowerLine.includes(keyword)
      )

      if (hasTechnical) {
        skills.technical += (skills.technical ? ", " : "") + line
      } else if (line.length > 3) {
        skills.soft += (skills.soft ? ", " : "") + line
      }
    }
  }

  return skills
}

// Extract professional summary/objective
function extractProfessionalSummary(text: string): string {
  const lines = text.split("\n")
  const summaryKeywords = ["summary", "objective", "profile", "about"]

  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i].trim()
    const lowerLine = line.toLowerCase()

    if (
      summaryKeywords.some((keyword) => lowerLine.includes(keyword)) &&
      lowerLine.length < 50
    ) {
      // Collect the next few lines as summary
      let summary = ""
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const summaryLine = lines[j].trim()
        if (summaryLine.length > 10) {
          summary += (summary ? " " : "") + summaryLine
        }
      }
      return summary
    }
  }

  return ""
}

export async function parseResumeFromPDF(pdfBuffer: Buffer): Promise<ResumeFormData> {
  try {
    // First, extract text from PDF using pdf-parse
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { PDFParse } = require("pdf-parse")
    
    let extractedText = ""
    
    try {
      const parser = new PDFParse({ data: pdfBuffer })
      const result = await parser.getText()
      extractedText = result?.text || ""
    } catch (pdfError) {
      console.error("PDF text extraction failed, will use OpenAI only:", pdfError)
    }

    // Use OpenAI to parse and structure the resume data
    const OpenAI = (await import("openai")).default
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    if (!process.env.OPENAI_API_KEY) {
      // Fallback to regex parsing if OpenAI is not configured
      if (extractedText) {
        return extractResumeData(extractedText)
      }
      throw new Error("OPENAI_API_KEY is not configured. Please set it in your environment variables.")
    }

    // Use OpenAI to structure the extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("Could not extract text from PDF. The PDF might be image-based, password-protected, or corrupted.")
    }

    const promptText = `Parse the following resume text and extract structured information. Return a JSON object with this exact structure:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedIn": "string (URL or empty)",
    "portfolio": "string (URL or empty)"
  },
  "professionalSummary": "string",
  "workExperience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string (YYYY-MM format)",
      "endDate": "string (YYYY-MM format or empty)",
      "current": boolean,
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduationDate": "string (YYYY-MM format)"
    }
  ],
  "skills": {
    "technical": "string (comma-separated)",
    "soft": "string (comma-separated or empty)"
  }
}

IMPORTANT FORMATTING INSTRUCTIONS:
- For work experience descriptions: Convert long paragraphs into bullet points. Format each bullet point on a new line starting with "- " or "• ". Break down responsibilities, achievements, and accomplishments into separate bullet points.
- For professional summary: If the summary is a long paragraph, break it into 2-3 concise bullet points when possible, each on a new line starting with "- " or "• ".
- Preserve the original meaning and content, but organize it as bullet lists instead of long paragraphs.
- Each bullet point should be a complete, meaningful statement.

Resume text:
${extractedText}

Return ONLY valid JSON, no additional text or markdown formatting.`

    // Use OpenAI text API to parse and structure the resume
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: promptText,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    })

    const jsonResponse = response.choices[0]?.message?.content || "{}"
    const parsedData = JSON.parse(jsonResponse)
    
    // Transform to match ResumeFormData format
    return {
      personalInfo: parsedData.personalInfo || {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedIn: "",
        portfolio: "",
      },
      professionalSummary: parsedData.professionalSummary || "",
      workExperience: parsedData.workExperience?.length > 0 ? parsedData.workExperience : [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
      education: parsedData.education?.length > 0 ? parsedData.education : [
        {
          institution: "",
          degree: "",
          field: "",
          graduationDate: "",
        },
      ],
      skills: {
        technical: parsedData.skills?.technical || "",
        soft: parsedData.skills?.soft || "",
      },
    }
  } catch (error) {
    console.error("Error parsing PDF with OpenAI:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("PDF Parse Error Details:", errorMessage)
    
    // Fallback to regex parsing if OpenAI fails
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      const { PDFParse } = require("pdf-parse")
      const parser = new PDFParse({ data: pdfBuffer })
      const result = await parser.getText()
      const text = result?.text || ""
      if (text && text.trim().length > 0) {
        console.log("Falling back to regex parsing")
        return extractResumeData(text)
      }
    } catch (fallbackError) {
      console.error("Fallback parsing also failed:", fallbackError)
    }
    
    // Provide more helpful error messages
    if (errorMessage.includes("OPENAI_API_KEY")) {
      throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.")
    } else if (errorMessage.includes("empty") || errorMessage.includes("extract text")) {
      throw new Error("Could not extract text from PDF. The PDF might be image-based, password-protected, or corrupted.")
    } else if (errorMessage.includes("Invalid PDF")) {
      throw new Error("Invalid PDF file format. Please ensure the file is a valid PDF.")
    } else if (errorMessage.includes("rate_limit") || errorMessage.includes("quota")) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.")
    } else if (errorMessage.includes("JSON")) {
      throw new Error("Failed to parse OpenAI response. Please try again.")
    } else {
      throw new Error(`Failed to parse PDF: ${errorMessage}`)
    }
  }
}

// Extract resume data from text
function extractResumeData(text: string): ResumeFormData {
  // Extract all information
  const personalInfo = {
    fullName: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedIn: extractLinkedIn(text),
    portfolio: extractPortfolio(text),
  }

  const professionalSummary = extractProfessionalSummary(text)
  const workExperience = extractWorkExperience(text)
  const education = extractEducation(text)
  const skills = extractSkills(text)

  // Return structured data matching ResumeFormData format
  return {
    personalInfo,
    professionalSummary: professionalSummary || "",
    workExperience: workExperience.length > 0 ? workExperience : [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: education.length > 0 ? education : [
      {
        institution: "",
        degree: "",
        field: "",
        graduationDate: "",
      },
    ],
    skills: {
      technical: skills.technical || "",
      soft: skills.soft || "",
    },
  }
}

