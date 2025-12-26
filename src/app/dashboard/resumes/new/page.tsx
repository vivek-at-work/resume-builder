import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ResumeFormPage } from "@/components/resume/ResumeFormPage"

export default async function NewResumePage() {
  const authResult = await auth()
  const userId = authResult?.userId
  
  if (!userId) {
    redirect("/sign-in")
  }

  return <ResumeFormPage />
}

