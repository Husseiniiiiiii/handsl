import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { commentSchema } from '@/lib/validations'

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

    const body = await request.json()
    
    const validatedData = commentSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      )
    }

    const { content } = validatedData.data

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        articleId: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إضافة التعليق' },
      { status: 500 }
    )
  }
}
