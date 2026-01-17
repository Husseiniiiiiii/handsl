import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false })
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: params.id,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('Check like error:', error)
    return NextResponse.json({ liked: false })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: params.id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      return NextResponse.json({ liked: false, message: 'تم إزالة الإعجاب' })
    }

    await prisma.like.create({
      data: {
        userId: session.user.id,
        articleId: params.id,
      },
    })

    return NextResponse.json({ liked: true, message: 'تم الإعجاب بالمقال' })
  } catch (error) {
    console.error('Toggle like error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    )
  }
}
