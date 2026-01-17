'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { User, Calendar, Users, FileText, Settings, CheckCircle, Info } from 'lucide-react'
import { EditProfileModal } from './EditProfileModal'

interface ProfileHeaderProps {
  user: {
    id: string
    name: string | null
    image: string | null
    bio: string | null
    handle: string | null
    verified: boolean
    role: string
    createdAt: Date
    _count: {
      followers: number
      following: number
      articles: number
    }
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(user._count.followers)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const isOwner = session?.user?.id === user.id

  // Check if current user is following this profile user
  useEffect(() => {
    if (session?.user && !isOwner) {
      checkFollowStatus()
    }
  }, [session, user.id, isOwner])

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/follow-status`)
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const handleFollow = async () => {
    if (!session?.user) {
      window.location.href = '/auth/login'
      return
    }

    setIsFollowLoading(true)
    const res = await fetch(`/api/users/${user.id}/follow`, {
      method: 'POST',
    })

    if (res.ok) {
      const data = await res.json()
      setIsFollowing(data.following)
      setFollowersCount((prev) => (data.following ? prev + 1 : prev - 1))
    }
    setIsFollowLoading(false)
  }

  return (
    <>
      <div className="card">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || ''}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center ring-4 ring-gray-100">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            {user.verified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white border-2 border-white">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-right">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name || 'مستخدم'}
                  </h1>
                  {user.verified && (
                    <Link
                      href={`/verification/${user.id}`}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">موثق</span>
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      مشرف
                    </span>
                  )}
                </div>
                {user.handle && (
                  <p className="text-gray-500 mt-1">@{user.handle}</p>
                )}
                {user.bio && (
                  <p className="text-gray-600 mt-2">{user.bio}</p>
                )}
                <p className="text-sm text-gray-500 mt-2 flex items-center justify-center md:justify-start gap-1">
                  <Calendar className="w-4 h-4" />
                  انضم في {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>

              {isOwner ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  تعديل الملف الشخصي
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                </button>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user._count.articles}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  مقال
                </p>
              </div>
              <div className="text-center">
                <Link href={`/profile/${user.id}/followers`} className="block hover:text-primary-600 transition-colors">
                  <p className="text-2xl font-bold text-gray-900">{followersCount}</p>
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                    <Users className="w-4 h-4" />
                    متابع
                  </p>
                </Link>
              </div>
              <div className="text-center">
                <Link href={`/profile/${user.id}/following`} className="block hover:text-primary-600 transition-colors">
                  <p className="text-2xl font-bold text-gray-900">{user._count.following}</p>
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                    <Users className="w-4 h-4" />
                    يتابع
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  )
}
