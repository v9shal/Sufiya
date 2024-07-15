'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const RefreshLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push(href)
    router.refresh()
  }

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default RefreshLink