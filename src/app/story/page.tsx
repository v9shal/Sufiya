"use client"

import React, { useEffect, useState } from 'react'
import Home from '@/components/main'
import ErrorPage from './error'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const Page = () => {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in')
    }
  }, [isLoaded, userId, router])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <ErrorPage />
  }

  return userId ? <Home /> : null
}

export default Page