'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Users, FileText, Heart, MessageCircle, Shield, CheckCircle, XCircle, Settings } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  verified: boolean
  role: string
  createdAt: string
  _count: {
    articles: number
    followers: number
  }
}

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalLikes: 0,
    totalComments: 0
  })

  useEffect(() => {
    if (session?.user?.email !== 'alshmryh972@gmail.com') {
      router.push('/')
      return
    }

    fetchUsers()
    fetchStats()
  }, [session, router])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats({
        totalUsers: data.totalUsers || 0,
        totalArticles: data.totalArticles || 0,
        totalLikes: data.totalLikes || 0,
        totalComments: data.totalComments || 0,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats({
        totalUsers: 0,
        totalArticles: 0,
        totalLikes: 0,
        totalComments: 0,
      })
    }
  }

  const toggleVerification = async (userId: string, verified: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !verified })
      })

      if (res.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, verified: !verified } : user
        ))
      }
    } catch (error) {
      console.error('Failed to toggle verification:', error)
    }
  }

  const toggleRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: role === 'ADMIN' ? 'USER' : 'ADMIN' })
      })

      if (res.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: role === 'ADMIN' ? 'USER' : 'ADMIN' } : user
        ))
      }
    } catch (error) {
      console.error('Failed to toggle role:', error)
    }
  }

  if (session?.user?.email !== 'alshmryh972@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h1>
          <p className="text-gray-600">لا تملك صلاحية الوصول إلى لوحة التحكم</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">إدارة الموقع والمستخدمين</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">المستخدمون</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">المقالات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الإعجابات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">التعليقات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">المستخدمون</h2>
          <Settings className="w-5 h-5 text-gray-500" />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">المستخدم</th>
                  <th className="text-right py-3 px-4">البريد الإلكتروني</th>
                  <th className="text-right py-3 px-4">الدور</th>
                  <th className="text-right py-3 px-4">موثق</th>
                  <th className="text-right py-3 px-4">المقالات</th>
                  <th className="text-right py-3 px-4">المتابعون</th>
                  <th className="text-right py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || ''}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name || 'مستخدم'}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'ADMIN' ? 'مشرف' : 'مستخدم'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleVerification(user.id, user.verified)}
                        className={`p-1 rounded-full ${
                          user.verified ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      >
                        {user.verified ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm">{user._count.articles}</td>
                    <td className="py-3 px-4 text-sm">{user._count.followers}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleVerification(user.id, user.verified)}
                          className={`px-3 py-1 rounded text-xs ${
                            user.verified 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {user.verified ? 'إلغاء التوثيق' : 'توثيق'}
                        </button>
                        {user.email !== 'alshmryh972@gmail.com' && (
                          <button
                            onClick={() => toggleRole(user.id, user.role)}
                            className={`px-3 py-1 rounded text-xs ${
                              user.role === 'ADMIN' 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.role === 'ADMIN' ? 'إزالة المشرف' : 'تعيين مشرف'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
