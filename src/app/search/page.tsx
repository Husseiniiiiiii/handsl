'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, User } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  id: string
  name: string | null
  handle: string | null
  image: string | null
  verified: boolean
  _count: {
    followers: number
    articles: number
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return
    
    setIsLoading(true)
    setHasSearched(true)
    
    try {
      const response = await fetch(`/api/search/users?q=${encodeURIComponent(query.trim())}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          البحث عن المستخدمين
        </h1>
        <p className="text-gray-600">
          ابحث عن المستخدمين بالاسم أو اسم المستخدم (@handle)
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب اسم المستخدم أو الاسم..."
            className="w-full input-field pl-12 text-lg"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 disabled:opacity-50"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            جاري البحث...
          </div>
        </div>
      )}

      {!isLoading && hasSearched && (
        <>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                لم يتم العثور على مستخدمين يطابقون بحثك
              </p>
              <p className="text-gray-400 mt-2">
                جرب استخدام كلمات مختلفة أو تحقق من الإملاء
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                تم العثور على {results.length} مستخدم
              </p>
              
              {results.map((user) => (
                <div
                  key={user.id}
                  className="card hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link href={`/profile/${user.id}`}>
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || ''}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center ring-2 ring-gray-100">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </Link>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/profile/${user.id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {user.name || 'مستخدم'}
                          </Link>
                          {user.verified && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {user.handle && (
                          <Link
                            href={`/profile/${user.id}`}
                            className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                          >
                            @{user.handle}
                          </Link>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {user._count.followers} متابع
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {user._count.articles} مقال
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href={`/profile/${user.id}`}
                      className="btn-primary"
                    >
                      عرض الملف الشخصي
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
