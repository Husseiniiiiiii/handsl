'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Check for theme in URL params first
    const urlParams = new URLSearchParams(window.location.search)
    const urlTheme = urlParams.get('theme') as Theme | null
    
    if (urlTheme && (urlTheme === 'light' || urlTheme === 'dark')) {
      setTheme(urlTheme)
    } else {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage.getItem('theme') as Theme | null
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Check system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        setTheme(systemTheme)
      }
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save theme preference
    localStorage.setItem('theme', theme)
    
    // Update URL without page reload
    const url = new URL(window.location.href)
    if (url.searchParams.get('theme') !== theme) {
      if (theme === 'light') {
        url.searchParams.delete('theme')
      } else {
        url.searchParams.set('theme', theme)
      }
      window.history.replaceState({}, '', url.toString())
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
