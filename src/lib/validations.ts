import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون أكثر من حرفين')
    .max(50, 'الاسم طويل جداً'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    ),
})

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'الرجاء إدخال كلمة المرور'),
})

export const articleSchema = z.object({
  title: z
    .string()
    .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً'),
  content: z.string().min(50, 'المحتوى يجب أن يكون 50 حرف على الأقل'),
  excerpt: z.string().max(500, 'الملخص طويل جداً').optional(),
  published: z.boolean().optional(),
})

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'الرجاء كتابة تعليق')
    .max(1000, 'التعليق طويل جداً'),
})

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون أكثر من حرفين')
    .max(50, 'الاسم طويل جداً'),
  bio: z.string().max(500, 'النبذة طويلة جداً').optional(),
  handle: z
    .string()
    .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
    .max(30, 'اسم المستخدم طويل جداً')
    .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على حروف وأرقام وشرطات سفلية فقط')
    .optional(),
  image: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ArticleInput = z.infer<typeof articleSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type ProfileInput = z.infer<typeof profileSchema>
