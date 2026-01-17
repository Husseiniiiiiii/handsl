# منصة المقالات - Articles Platform

تطبيق ويب لنشر المقالات والتفاعل الاجتماعي مبني باستخدام Next.js 14 و PostgreSQL.

## المميزات

- **👤 نظام المستخدمين**
  - تسجيل حساب باستخدام Email + Password
  - تسجيل دخول باستخدام Google OAuth
  - صفحة ملف شخصي قابلة للتعديل

- **✍️ المقالات**
  - إنشاء / تعديل / حذف مقالات
  - محرر نص غني (Rich Text Editor)
  - عرض المقالات في الصفحة الرئيسية
  - صفحة خاصة لكل مقال

- **❤️ التفاعل**
  - إعجاب بالمقالات
  - تعليقات على المقالات
  - متابعة المستخدمين

- **🔍 التصفح**
  - بحث عن مقالات
  - ترتيب حسب الأحدث / الأكثر إعجاباً

## Tech Stack

- **Frontend**: Next.js 14 (React + TypeScript), Tailwind CSS
- **Backend**: Next.js API Routes (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Credentials + Google OAuth)
- **Rich Text Editor**: Tiptap

## متطلبات التشغيل

- Node.js 18+
- PostgreSQL 14+
- npm أو yarn أو pnpm

## التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd articles-app
```

### 2. تثبيت الحزم

```bash
npm install
```

### 3. إعداد قاعدة البيانات

أنشئ قاعدة بيانات PostgreSQL جديدة:

```sql
CREATE DATABASE articles_db;
```

### 4. إعداد المتغيرات البيئية

انسخ ملف `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

عدّل ملف `.env` بالقيم الصحيحة:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/articles_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth (اختياري)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### توليد NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

#### إعداد Google OAuth (اختياري)

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروعًا جديدًا
3. فعّل OAuth consent screen
4. أنشئ OAuth 2.0 Client ID
5. أضف `http://localhost:3000/api/auth/callback/google` كـ Authorized redirect URI
6. انسخ Client ID و Client Secret إلى ملف `.env`

### 5. تهيئة قاعدة البيانات

```bash
# توليد Prisma Client
npm run db:generate

# تطبيق Schema على قاعدة البيانات
npm run db:push
```

### 6. تشغيل التطبيق

```bash
# وضع التطوير
npm run dev

# أو للإنتاج
npm run build
npm run start
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## هيكل المشروع

```
src/
├── app/                    # App Router pages
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth & Register
│   │   ├── articles/      # Articles CRUD
│   │   └── users/         # Users & Follow
│   ├── article/[id]/      # Article page
│   ├── auth/              # Auth pages
│   ├── profile/[id]/      # Profile page
│   ├── write/             # Write/Edit article
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/            # React components
│   ├── ArticleCard.tsx
│   ├── ArticleContent.tsx
│   ├── CommentSection.tsx
│   ├── EditProfileModal.tsx
│   ├── Navbar.tsx
│   ├── ProfileHeader.tsx
│   ├── Providers.tsx
│   ├── RichTextEditor.tsx
│   └── SearchAndSort.tsx
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   └── validations.ts    # Zod schemas
└── types/                # TypeScript types
    └── next-auth.d.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Articles
- `GET /api/articles` - جلب المقالات (مع بحث وترتيب)
- `POST /api/articles` - إنشاء مقال جديد
- `GET /api/articles/[id]` - جلب مقال محدد
- `PUT /api/articles/[id]` - تعديل مقال
- `DELETE /api/articles/[id]` - حذف مقال
- `GET /api/articles/[id]/like` - التحقق من الإعجاب
- `POST /api/articles/[id]/like` - إضافة/إزالة إعجاب
- `POST /api/articles/[id]/comments` - إضافة تعليق

### Users
- `GET /api/users/[id]` - جلب بيانات مستخدم
- `PUT /api/users/[id]` - تعديل الملف الشخصي
- `POST /api/users/[id]/follow` - متابعة/إلغاء متابعة

## الأمان

- ✅ تشفير كلمات المرور باستخدام bcrypt
- ✅ حماية CSRF مدمجة في NextAuth
- ✅ التحقق من المدخلات باستخدام Zod
- ✅ التحقق من الصلاحيات (المالك فقط يمكنه التعديل/الحذف)
- ✅ استخدام JWT للجلسات

## الأوامر المفيدة

```bash
# تشغيل التطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm run start

# توليد Prisma Client
npm run db:generate

# تطبيق Schema
npm run db:push

# فتح Prisma Studio
npm run db:studio

# تشغيل migrations
npm run db:migrate
```

## الترخيص

MIT License
