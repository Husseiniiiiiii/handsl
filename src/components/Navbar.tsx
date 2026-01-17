'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, PenSquare, User, LogOut, Settings, Users, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function Navbar() {
  const { data: session, status } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-l from-primary-600 to-purple-600 bg-clip-text text-transparent">
            هاسنديل
          </Link>

          
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="تبديل الوضع الليلي"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : session ? (
              <>
                {session.user.email === 'alshmryh972@gmail.com' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    <Settings className="w-5 h-5" />
                    لوحة التحكم
                  </Link>
                )}
                <Link
                  href="/search"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  <Users className="w-5 h-5" />
                  البحث عن المستخدمين
                </Link>
                <Link
                  href="/write"
                  className="flex items-center gap-2 btn-primary"
                >
                  <PenSquare className="w-4 h-4" />
                  كتابة مقال
                </Link>
                <Link
                  href={`/profile/${session.user.id}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  <User className="w-5 h-5" />
                  الملف الشخصي
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link href="/search" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  <Users className="w-5 h-5" />
                  البحث عن المستخدمين
                </Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  تسجيل الدخول
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400"
          >
            {isMenuOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-2 w-full justify-start"
            >
              {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-400" />
                    الوضع النهاري
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-gray-600" />
                    الوضع الليلي
                  </>
                )}
            </button>

            {session ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/search"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="w-5 h-5" />
                  البحث عن المستخدمين
                </Link>
                <Link
                  href="/write"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PenSquare className="w-5 h-5" />
                  كتابة مقال
                </Link>
                <Link
                  href={`/profile/${session.user.id}`}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  الملف الشخصي
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut()
                  }}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/search"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="w-5 h-5" />
                  البحث عن المستخدمين
                </Link>
                <Link
                  href="/auth/login"
                  className="text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="text-primary-600 dark:text-primary-400 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
