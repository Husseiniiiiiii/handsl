import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { articleSchema } from '@/lib/validations'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'latest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
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
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
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

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get articles error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المقالات' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const validatedData = articleSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      )
    }

    const { title, content, excerpt, published } = validatedData.data

    const article = await prisma.article.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200),
        published: published ?? true,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المقال' },
      { status: 500 }
    )
  }
}
