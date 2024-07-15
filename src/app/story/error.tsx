"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

const ErrorPage = () => {
    const router=useRouter();
  return (
    <>
    <div>not signed in</div>

    </>

  )
}

export default ErrorPage