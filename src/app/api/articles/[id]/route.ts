import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { articleSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
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
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Get article error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المقال' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    if (article.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بتعديل هذا المقال' },
        { status: 403 }
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

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200),
        published: published ?? article.published,
      },
    })

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المقال' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    if (article.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بحذف هذا المقال' },
        { status: 403 }
      )
    }

    await prisma.article.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'تم حذف المقال بنجاح' })
  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المقال' },
      { status: 500 }
    )
  }
}
