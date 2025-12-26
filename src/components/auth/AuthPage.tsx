import { SignIn, SignUp } from "@clerk/clerk-react"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"

export function AuthPage() {
  const location = useLocation()
  const isSignUp = location.pathname === "/sign-up"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResumeBuilder
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">
            {isSignUp ? "Create your account to get started" : "Welcome back! Sign in to continue"}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          {isSignUp ? (
            <SignUp 
              routing="path" 
              path="/sign-up"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                },
              }}
            />
          ) : (
            <SignIn 
              routing="path" 
              path="/sign-in"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                },
              }}
            />
          )}
        </div>

        <div className="text-center mt-6">
          <Link 
            to={isSignUp ? "/sign-in" : "/sign-up"} 
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"}
          </Link>
        </div>
      </div>
    </div>
  )
}

