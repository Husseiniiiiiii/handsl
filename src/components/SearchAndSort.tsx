'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, Clock } from 'lucide-react'

interface SearchAndSortProps {
  currentSearch: string
  currentSort: string
}

export function SearchAndSort({ currentSearch, currentSort }: SearchAndSortProps) {
  const router = useRouter()
  const [search, setSearch] = useState(currentSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const url = new URL(window.location.href)
    const isDark = document.documentElement.classList.contains('dark')
    url.searchParams.set('search', search)
    url.searchParams.set('sort', currentSort)
    if (isDark) {
      url.searchParams.set('theme', 'dark')
    }
    router.push(url.pathname + url.search)
  }

  const handleSort = (sort: string) => {
    const url = new URL(window.location.href)
    const isDark = document.documentElement.classList.contains('dark')
    url.searchParams.set('search', search)
    url.searchParams.set('sort', sort)
    if (isDark) {
      url.searchParams.set('theme', 'dark')
    }
    router.push(url.pathname + url.search)
  }

  return (
    <div className="mb-8 space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن مقالات..."
          className="w-full input-field pl-12"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      <div className="flex gap-2">
        <button
          onClick={() => handleSort('latest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentSort === 'latest'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          الأحدث
        </button>
        <button
          onClick={() => handleSort('popular')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentSort === 'popular'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          الأكثر إعجاباً
        </button>
      </div>
    </div>
  )
}
