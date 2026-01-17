'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart, Calendar, User, Edit, Trash2, CheckCircle } from 'lucide-react'

interface ArticleContentProps {
  article: {
    id: string
    title: string
    content: string
    createdAt: Date
    authorId: string
    author: {
      id: string
      name: string | null
      image: string | null
      bio: string | null
      handle: string | null
      verified: boolean
    }
    _count: {
      likes: number
      comments: number
    }
  }
}

export function ArticleContent({ article }: ArticleContentProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(article._count.likes)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = session?.user?.id === article.authorId

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/articles/${article.id}/like`)
        .then((res) => res.json())
        .then((data) => setLiked(data.liked))
    }
  }, [session, article.id])

  const handleLike = async () => {
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    const res = await fetch(`/api/articles/${article.id}/like`, {
      method: 'POST',
    })
    const data = await res.json()
    
    if (res.ok) {
      setLiked(data.liked)
      setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1))
    }
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    setIsDeleting(true)
    const res = await fetch(`/api/articles/${article.id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      router.push('/')
    } else {
      setIsDeleting(false)
      alert('حدث خطأ أثناء حذف المقال')
    }
  }

  return (
    <article className="card mb-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/profile/${article.author.id}`}
          className="flex items-center gap-3 hover:opacity-80"
        >
          {article.author.image ? (
            <img
              src={article.author.image}
              alt={article.author.name || ''}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">
                {article.author.name || 'مستخدم'}
              </p>
              {article.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {article.author.handle && (
              <p className="text-sm text-gray-500">@{article.author.handle}</p>
            )}
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.createdAt).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </Link>

        {isOwner && (
          <div className="flex gap-2">
            <Link
              href={`/write?edit=${article.id}`}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>

      <div
        className="prose prose-lg max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            liked
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>
      </div>
    </article>
  )
}
