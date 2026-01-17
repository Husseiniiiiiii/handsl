'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { User, Send } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface CommentSectionProps {
  articleId: string
  comments: Comment[]
}

export function CommentSection({ articleId, comments: initialComments }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    const res = await fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (res.ok) {
      const newComment = await res.json()
      setComments([newComment, ...comments])
      setContent('')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        التعليقات ({comments.length})
      </h2>

      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="أضف تعليقاً..."
                rows={3}
                className="w-full input-field resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  إرسال
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg mb-8">
          <p className="text-gray-600 mb-2">سجل دخولك لإضافة تعليق</p>
          <Link href="/auth/login" className="btn-primary inline-block">
            تسجيل الدخول
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">لا توجد تعليقات بعد</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link href={`/profile/${comment.author.id}`}>
                {comment.author.image ? (
                  <img
                    src={comment.author.image}
                    alt={comment.author.name || ''}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                )}
              </Link>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Link
                    href={`/profile/${comment.author.id}`}
                    className="font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {comment.author.name || 'مستخدم'}
                  </Link>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
