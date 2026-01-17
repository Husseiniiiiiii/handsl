import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArticleContent } from '@/components/ArticleContent'
import { CommentSection } from '@/components/CommentSection'
import { BackButton } from '@/components/BackButton'

interface ArticlePageProps {
  params: { id: string }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  let article = null
  
  try {
    article = await prisma.article.findUnique({
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
  } catch (error) {
    console.error('Database error:', error)
    article = null
  }

  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BackButton href="/" />
      <div className="mt-6">
        <ArticleContent article={article} />
        <CommentSection articleId={article.id} comments={article.comments} />
      </div>
    </div>
  )
}
