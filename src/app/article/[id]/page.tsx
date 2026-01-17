import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArticleContent } from '@/components/ArticleContent'
import { CommentSection } from '@/components/CommentSection'

interface ArticlePageProps {
  params: { id: string }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          handle: true,
          verified: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ArticleContent article={article} />
      <CommentSection articleId={article.id} comments={article.comments} />
    </div>
  )
}
