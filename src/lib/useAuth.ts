'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth(redirectTo = '/login') {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push(redirectTo)
    } else {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [router, redirectTo])

  return { isLoggedIn, loading }
}
