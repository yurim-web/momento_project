'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/posts', label: '게시글', icon: '✏️' },
  { href: '/diary', label: '일기장', icon: '📖' },
  { href: '/calendar', label: '캘린더', icon: '📅' },
  { href: '/gallery', label: '갤러리', icon: '🖼' },
  { href: '/profile', label: '프로필', icon: '♡' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-handwriting text-2xl text-pink-400">
            Momento
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-ui transition-colors ${
                  pathname === item.href
                    ? 'text-pink-500 font-bold'
                    : 'text-gray-400 hover:text-pink-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* 모바일 하단 네비게이션 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-pink-100">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 text-xs font-ui transition-colors ${
                pathname === item.href
                  ? 'text-pink-500'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
