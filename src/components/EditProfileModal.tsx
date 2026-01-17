'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Save, Camera, User, Loader2 } from 'lucide-react'

interface EditProfileModalProps {
  user: {
    id: string
    name: string | null
    bio: string | null
    image: string | null
    handle: string | null
  }
  onClose: () => void
}

export function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user.name || '')
  const [bio, setBio] = useState(user.bio || '')
  const [handle, setHandle] = useState(user.handle || '')
  const [image, setImage] = useState(user.image || '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setImage(data.url)
      } else {
        setError(data.error || 'فشل رفع الصورة')
      }
    } catch {
      setError('حدث خطأ أثناء رفع الصورة')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, handle, image }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      router.refresh()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">تعديل الملف الشخصي</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt="الصورة الشخصية"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 left-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              الاسم
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              اسم المستخدم (@handle)
            </label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                className="input-field pr-8"
                placeholder="username"
                maxLength={30}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              سيظهر كـ @{handle || 'username'}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              نبذة عنك
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="input-field resize-none"
              placeholder="اكتب نبذة مختصرة عنك..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
