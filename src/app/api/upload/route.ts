import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 })
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'يجب أن يكون الملف صورة' }, { status: 400 })
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الصورة يجب أن يكون أقل من 5MB' }, { status: 400 })
    }

    // إنشاء اسم فريد للملف
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

    // التأكد من وجود مجلد uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await writeFile(uploadDir + '/.gitkeep', '')
    } catch {
      // المجلد موجود بالفعل
    }

    // حفظ الملف
    await writeFile(filepath, buffer)

    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      message: 'تم رفع الصورة بنجاح'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    )
  }
}
