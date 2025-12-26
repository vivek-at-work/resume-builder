import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Dashboard } from "@/pages/Dashboard"

export default async function DashboardPage() {
  const authResult = await auth()
  const userId = authResult?.userId
  
  if (!userId) {
    redirect("/sign-in")
  }

  return <Dashboard />
}

