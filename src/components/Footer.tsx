'use client'

import { usePathname } from 'next/navigation'

const hideOnPages = ['/login', '/signup', '/guide']

export default function Footer() {
  const pathname = usePathname()

  if (hideOnPages.includes(pathname)) return null

  return (
    <footer className="hidden md:block border-t border-pink-100 bg-white/50 backdrop-blur-sm mt-12">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <p className="font-handwriting text-lg text-pink-300 mb-1">Momento</p>
        <p className="font-ui text-xs text-gray-300">우리의 특별한 순간을 기록하는 공간</p>
        <p className="font-ui text-xs text-gray-300 mt-2">&copy; 2026 Momento. All rights reserved.</p>
      </div>
    </footer>
  )
}
