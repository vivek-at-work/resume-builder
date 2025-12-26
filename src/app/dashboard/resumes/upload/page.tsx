import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PDFUploadFullScreen } from "@/components/resume/PDFUploadFullScreen"

export default async function PDFUploadPage() {
  const authResult = await auth()
  const userId = authResult?.userId
  
  if (!userId) {
    redirect("/sign-in")
  }

  return <PDFUploadFullScreen />
}

