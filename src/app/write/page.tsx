'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Save, Eye, EyeOff } from 'lucide-react'

export default function WritePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [published, setPublished] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (editId) {
      fetch(`/api/articles/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setTitle(data.title)
            setContent(data.content)
            setExcerpt(data.excerpt || '')
            setPublished(data.published)
          }
        })
    }
  }, [editId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const url = editId ? `/api/articles/${editId}` : '/api/articles'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, published }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      router.push(`/article/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {editId ? 'تعديل المقال' : 'كتابة مقال جديد'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            عنوان المقال
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان المقال..."
            className="input-field text-xl"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            ملخص المقال (اختياري)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="ملخص قصير يظهر في قائمة المقالات..."
            rows={2}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            محتوى المقال
          </label>
          <div className="card p-0 overflow-hidden">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              published
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {published ? (
              <>
                <Eye className="w-4 h-4" />
                منشور
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                مسودة
              </>
            )}
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'نشر المقال'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}
