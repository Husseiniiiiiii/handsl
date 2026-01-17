import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ArticleCard } from '@/components/ArticleCard'

interface ProfilePageProps {
  params: { id: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      handle: true,
      verified: true,
      role: true,
      createdAt: true,
      articles: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              handle: true,
              verified: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
          articles: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader user={user} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          المقالات ({user.articles.length})
        </h2>

        {user.articles.length === 0 ? (
          <p className="text-center text-gray-500 py-8">لا توجد مقالات بعد</p>
        ) : (
          <div className="space-y-6">
            {user.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
