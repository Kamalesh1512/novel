"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function VisitorTracking() {
  const pathname = usePathname()
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)
  const [visitorId, setVisitorId] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing consent
    const consent = localStorage.getItem("cookie-consent")
    if (consent) {
      setHasConsent(consent === "accepted")
    }
  }, [])

  useEffect(() => {
    if (hasConsent === true) {
      initializeTracking()
    }
  }, [hasConsent])

  useEffect(() => {
    if (hasConsent === true && visitorId) {
      trackVisit()
    }
  }, [pathname, hasConsent, visitorId])

  const initializeTracking = () => {
    let id = localStorage.getItem("visitor-id")

    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem("visitor-id", id)

      // Set cookie with 1 year expiry
      const expiryDate = new Date()
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      document.cookie = `visitor-id=${id}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
    }

    setVisitorId(id)
  }

  const trackVisit = async () => {
    if (!visitorId) return

    try {
      await fetch("/api/track-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId,
          path: pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Failed to track visit:", error)
    }
  }

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setHasConsent(true)
  }

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie-consent", "declined")
    setHasConsent(false)
  }

  // Show cookie banner only on homepage and if consent not given
  if (pathname === "/" && hasConsent === null) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              We use cookies to improve your experience and analyze website traffic. By accepting, you agree to our use
              of cookies for analytics purposes.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDeclineCookies}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Decline
            </button>
            <Button
              onClick={handleAcceptCookies}
              variant={'premium'}
            >
              Accept Cookies
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
