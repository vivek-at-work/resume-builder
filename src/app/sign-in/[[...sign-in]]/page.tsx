"use client"

import { SignIn } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <SignIn 
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl",
            footer: "hidden",
            footerPages: "hidden",
            footerPageLink: "hidden",
          },
          variables: {
            colorText: "#000000",
          },
        }}
      />
    </div>
  )
}

