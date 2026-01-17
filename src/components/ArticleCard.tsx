import Link from 'next/link'
import { Heart, MessageCircle, Calendar, User, CheckCircle } from 'lucide-react'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    content: string
    excerpt: string | null
    createdAt: Date
    author: {
      id: string
      name: string | null
      image: string | null
      handle: string | null
      verified: boolean
    }
    _count: {
      likes: number
      comments: number
    }
  }
}

function extractFirstImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
  return imgMatch ? imgMatch[1] : null
}

export function ArticleCard({ article }: ArticleCardProps) {
  const articleImage = extractFirstImage(article.content)

  return (
    <article className="card hover:border-primary-200 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4">
        {articleImage && (
          <Link href={`/article/${article.id}`} className="flex-shrink-0">
            <div className="w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={articleImage}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <Link href={`/article/${article.id}`}>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2">
              {article.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
            {article.excerpt || ''}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
            <Link
              href={`/profile/${article.author.id}`}
              className="flex items-center gap-2 hover:text-primary-600"
            >
              {article.author.image ? (
                <img
                  src={article.author.image}
                  alt={article.author.name || ''}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="font-medium">{article.author.name || 'مستخدم'}</span>
                {article.author.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {article.author.handle && (
                <span className="text-gray-400">@{article.author.handle}</span>
              )}
            </Link>

            <div className="flex items-center gap-3 mr-auto">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" />
                {article._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                {article._count.comments}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.createdAt).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
