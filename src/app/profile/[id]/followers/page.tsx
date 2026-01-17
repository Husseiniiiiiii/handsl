import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BackButton } from '@/components/BackButton'

interface FollowersPageProps {
  params: { id: string }
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      handle: true,
      image: true,
      verified: true,
    },
  })

  if (!user) {
    notFound()
  }

  const followers = await prisma.follow.findMany({
    where: { followingId: params.id },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          handle: true,
          image: true,
          verified: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              متابعو {user.name || 'مستخدم'}
            </h1>
          </div>
          <BackButton />
        </div>

        {followers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا يوجد متابعين بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {followers.map((follow) => (
              <div
                key={follow.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {follow.follower.image ? (
                    <img
                      src={follow.follower.image}
                      alt={follow.follower.name || ''}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {follow.follower.name || 'مستخدم'}
                      </h3>
                      {follow.follower.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {follow.follower.handle && (
                      <p className="text-sm text-gray-600">@{follow.follower.handle}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      متابع منذ {new Date(follow.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/profile/${follow.follower.id}`}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <span className="text-sm">عرض الملف الشخصي</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
