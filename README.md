# Trello Clone

یک نسخه ساده از Trello با **Next.js**، **TypeScript** و **SCSS** — پروژه مصاحبه (ارزیابی مهارت React).

## تکنولوژی‌ها

- **Next.js** (App Router)
- **TypeScript**
- **SCSS** (Variables, Mixins, Nesting, Partials)
- **@dnd-kit** برای Drag & Drop (لیست‌ها و کارت‌ها)
- **localStorage** برای ذخیره‌سازی داده
- State با **React hooks** (useState, useCallback, useEffect)

## ویژگی‌ها

- **مدیریت برد:** برد ثابت «Demo Board»، ویرایش عنوان برد
- **مدیریت لیست:** ایجاد، حذف، ویرایش عنوان، جابه‌جایی افقی با Drag & Drop
- **مدیریت کارت:** ایجاد کارت، ویرایش عنوان، Drag & Drop عمودی و بین لیست‌ها
- **مودال نظرات:** مشاهده و افزودن نظر برای هر کارت
- **طراحی واکنش‌گرا** برای دسکتاپ و موبایل
- **ذخیره خودکار** در localStorage

## نصب و اجرا

```bash
npm install
npm run dev
```

سپس در مرورگر: [http://localhost:3000](http://localhost:3000)

## ساختار پروژه

```
src/
├── app/              # App Router (layout, page)
├── components/       # UI (Board, BoardHeader, List, Card, CommentModal)
├── hooks/            # useBoard (state + actions)
├── services/         # storage (localStorage)
├── data/             # initialBoard
├── types/            # Board, List, Card, Comment
├── utils/            # generateId
└── styles/           # SCSS (variables, mixins, globals)
```

## معیارهای رعایت‌شده

- ساختار فولدر منطقی و جداسازی concerns
- کامپوننت‌های قابل استفاده مجدد
- Custom Hook برای منطق برد (useBoard)
- TypeScript برای type safety
- فقط SCSS برای استایل (Variables, Mixins, Partials)
- بدون Backend؛ همه داده‌ها سمت کلاینت و localStorage

## تحویل

- کد منبع در این مخزن
- README با توضیح تکنولوژی‌ها و ساختار

موفق باشید.
