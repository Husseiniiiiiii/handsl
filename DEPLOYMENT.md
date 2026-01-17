# 🚀 دليل النشر (Deployment Guide)

## 🌐 خيارات النشر

### 1. 🟢 Vercel (موصى به)

**المميزات:**
- 🆓 مجاني للمشاريع الصغيرة
- ⚡ نشر تلقائي مع GitHub
- 🌍 CDN عالمي
- 🔧 سهل الإعداد

**الخطوات:**

1. **إنشاء حساب Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل باستخدام GitHub/GitLab/Bitbucket

2. **إعداد قاعدة البيانات**
   ```bash
   # استخدم PostgreSQL من Supabase أو Neon
   # مثال: Neon (مجاني)
   # 1. اذهب إلى neon.tech
   # 2. أنشئ مشروع جديد
   # 3. انسخ DATABASE_URL
   ```

3. **إعداد المتغيرات البيئية في Vercel**
   ```env
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   NEXTAUTH_URL="https://your-app.vercel.app"
   NEXTAUTH_SECRET="your-32-char-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **نشر المشروع**
   ```bash
   # 1. ادفع الكود إلى GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   
   # 2. في Vercel: Import Project → GitHub → اختر الريبو
   # 3. Vercel سيبني وينشر تلقائياً
   ```

---

### 2. 🔵 Netlify

**المميزات:**
- 🆓 خطة مجانية سخية
- 🔄 Continuous Deployment
- 📱 Forms و Functions مجانية

**الخطوات:**

1. **بناء المشروع محلياً**
   ```bash
   npm run build
   ```

2. **إعداد Netlify**
   - اذهب إلى [netlify.com](https://netlify.com)
   - اسحب مجلد `out` أو `dist` إلى Netlify

3. **إعداد Environment Variables**
   ```env
   DATABASE_URL="your-postgres-url"
   NEXTAUTH_URL="https://your-app.netlify.app"
   NEXTAUTH_SECRET="your-secret"
   ```

---

### 3. 🟠 Railway

**المميزات:**
- 🐳 Docker support
- 💾 Database included
- 🔄 Auto-deploy

**الخطوات:**

1. **إنشاء حساب Railway**
   - اذهب إلى [railway.app](https://railway.app)

2. **إعداد Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

3. **نشر**
   ```bash
   # Connect GitHub repo to Railway
   # Railway will deploy automatically
   ```

---

### 4. 🟣 DigitalOcean App Platform

**المميزات:**
- 💰 تكلفة معقولة
- 🌍 CDN مدمج
- 📊 Monitoring

**الخطوات:**

1. **إنشاء حساب DigitalOcean**
2. **إعداد App Platform**
3. **Connect GitHub**
4. **Configure Environment Variables**

---

## 📋 قائمة التحقق قبل النشر

### ✅ المتطلبات الأساسية

1. **🔐 Environment Variables**
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="32-char-random-string"
   ```

2. **🗄️ قاعدة البيانات**
   - [ ] PostgreSQL جاهز
   - [ ] Schema مُهيأ
   - [ ] Prisma generated

3. **🔧 الإعدادات**
   - [ ] `NEXTAUTH_URL` صحيح
   - [ ] Google OAuth (اختياري)
   - [ ] CORS settings

### ✅ خطوات التحضير

```bash
# 1. تحديث الحزم
npm update

# 2. بناء المشروع
npm run build

# 3. اختبار البناء
npm run start

# 4. تهيئة قاعدة البيانات
npm run db:generate
npm run db:push

# 5. اختبار كل شيء
npm run test # إذا كان لديك tests
```

---

## 🛠️ إعدادات الإنتاج

### 1. **Next.js Production Config**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['your-domain.com', 'storage.googleapis.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
```

### 2. **Database Config**

```env
# استخدم connection pooling للإنتاج
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20"
```

### 3. **Security Headers**

```javascript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}
```

---

## 📊 المراقبة والصيانة

### 1. **🔍 Monitoring**
- **Vercel Analytics** - مجاني مع Vercel
- **Sentry** - لتتبع الأخطاء
- **LogRocket** - لتسجيل الجلسات

### 2. **📈 Performance**
- **Google PageSpeed Insights**
- **Web Vitals**
- **Database monitoring**

### 3. **🔄 Backups**
- **Database backups** يومية
- **Code backups** في GitHub
- **Asset backups** في CDN

---

## 🚨 استكشاف الأخطاء

### المشاكل الشائعة:

1. **🔐 NextAuth Issues**
   ```bash
   # تحقق من NEXTAUTH_URL
   echo $NEXTAUTH_URL
   
   # تحقق من NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

2. **🗄️ Database Issues**
   ```bash
   # اختبار الاتصال
   npx prisma db pull
   
   # إعادة تهيئة
   npx prisma migrate reset
   ```

3. **🌐 CORS Issues**
   ```javascript
   // next.config.js
   async headers() {
     return [
       {
         source: '/api/:path*',
         headers: [
           { key: 'Access-Control-Allow-Origin', value: '*' },
           { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
         ],
       },
     ]
   }
   ```

---

## 💰 التكاليف التقديرية

### Vercel (موصى به)
- **Hobby**: $0/شهر (مجاني)
- **Pro**: $20/شهر
- **Database**: $0-20/شهر (Neon/Supabase)

### Railway
- **Basic**: $5/شهر
- **Database**: مدمج

### DigitalOcean
- **Basic**: $5/شهر
- **Database**: $7/شهر

---

## 🎯 التوصيات النهائية

1. **🟢 ابدأ بـ Vercel** - الأسهل والأسرع
2. **🗄️ استخدم Neon** - قاعدة بيانات PostgreSQL مجانية
3. **🔐 تأمين المتغيرات** - لا تضع secrets في الكود
4. **📊 راقب الأداء** - استخدم analytics
5. **💾 احفظ نسخ احتياطية** - بانتظام

---

## 📞 المساعدة

إذا واجهت مشاكل:
- 📖 [Vercel Docs](https://vercel.com/docs)
- 📖 [Next.js Deployment](https://nextjs.org/docs/deployment)
- 📖 [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**🎉 مبروك! موقعك جاهز للنشر!**
