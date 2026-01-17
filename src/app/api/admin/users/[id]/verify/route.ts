import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.email !== 'alshmryh972@gmail.com') {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 403 }
      )
    }

    const { verified } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { verified },
      select: {
        id: true,
        verified: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Verify user error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث حالة التوثيق' },
      { status: 500 }
    )
  }
}
