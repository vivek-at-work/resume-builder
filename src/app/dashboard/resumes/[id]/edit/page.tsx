import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ResumeFormPage } from "@/components/resume/ResumeFormPage"

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const authResult = await auth()
  const userId = authResult?.userId
  
  if (!userId) {
    redirect("/sign-in")
  }

  return <ResumeFormPage resumeId={id} />
}

