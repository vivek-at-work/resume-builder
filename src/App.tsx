import { Routes, Route } from "react-router-dom"
import { LandingPage } from "@/components/auth/LandingPage"
import { AuthPage } from "@/components/auth/AuthPage"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Dashboard } from "@/pages/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<AuthPage />} />
      <Route path="/sign-up" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
