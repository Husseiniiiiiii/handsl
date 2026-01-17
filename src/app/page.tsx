import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/ArticleCard'
import { SearchAndSort } from '@/components/SearchAndSort'

interface HomeProps {
  searchParams: { search?: string; sort?: string; page?: string }
}

export default async function Home({ searchParams }: HomeProps) {
  const search = searchParams.search || ''
  const sort = searchParams.sort || 'latest'
  const page = parseInt(searchParams.page || '1')
  const limit = 10

  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { content: { contains: search } },
      ],
    }),
  }

  const orderBy = sort === 'popular'
    ? { likes: { _count: 'desc' as const } }
    : { createdAt: 'desc' as const }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        createdAt: true,
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
    }),
    prisma.article.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-l from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
          مرحباً بك في هاسنديل
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          اكتشف أحدث المقالات وشارك أفكارك مع العالم
        </p>
      </div>

      <SearchAndSort currentSearch={search} currentSort={sort} />

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {search ? 'لا توجد نتائج للبحث' : 'لا توجد مقالات بعد'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/?search=${search}&sort=${sort}&page=${p}`}
                  className={`px-4 py-2 rounded-lg ${
                    p === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
