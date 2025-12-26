"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { FileText, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { isSignedIn, user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Branding - Left */}
          <Link
            href={isSignedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 group-hover:from-primary/90 group-hover:to-primary/60 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:via-primary/70 group-hover:to-primary/50 transition-all duration-300">
              ResumeBuilder
            </span>
          </Link>

          {/* Navigation - Center (Desktop) */}
          {isSignedIn && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/resumes/new"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                New Resume
              </Link>
            </nav>
          )}

          {/* User Menu - Right */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden group"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    mobileMenuOpen && "rotate-90"
                  )} />
                </Button>

                {/* User Button */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">
                      {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200",
                        userButtonPopoverCard: "shadow-lg border",
                      },
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="hidden sm:inline-flex">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isSignedIn && mobileMenuOpen && (
          <div className="md:hidden border-t py-4 px-4 animate-slide-in-right">
            <nav className="flex flex-col gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/resumes/new"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Resume
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

