# KidsWear — Arxitektura Qarorlari

## Qabul qilingan qarorlar

### Til va lokalizatsiya
- **Standart til:** O'zbek (uz)
- **Qo'shimcha tillar:** Ingliz (en), Rus (ru)
- **Kutubxona:** `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- **Saqlash:** `localStorage` (`kidswear_lang` kaliti)
- **Fayl joylashuvi:** `src/locales/{uz,en,ru}/common.json`

### Narx formati
- **Valyuta:** UZS (O'zbek so'mi)
- **Format:** `Intl.NumberFormat` bilan `uz-UZ` locale
- **Saqlash:** Butun son (so'm, tiyinsiz)

### Qidiruv (mahsulotlar)
- Hozircha **mijoz tarafida** qidirish (kichik katalog uchun)
- Keyingi bosqichda Algolia/Typesense integratsiya qilinishi mumkin
- Tradeoff: katta katalogda sekin, lekin hozir yetarli

### To'lov usuli — Qisman onlayn (50%)
- Haqiqiy to'lov shluzi hali ulanmagan
- `paymentService` interfeysi orqali stublanayotgan (kelajakda PSP ulash mumkin)
- Depozit tasdiqlanganda `paidAmount = depositAmount`, `status = "deposit_paid"`

### CSS arxitekturasi
- **Tailwind v4** CSS-first konfiguratsiya (config fayl yo'q)
- **MUI** CSS layers (`@layer base, mui, utilities`) orqali Tailwind bilan birgalikda ishlaydi
- `StyledEngineProvider injectFirst` — MUI stillarini keyin kiritadi, Tailwind utilitylar ustuvorlik qiladi

### Holat boshqaruvi
- **Redux Toolkit** — `auth`, `cart`, `ui` slaydlari
- **Firestore real-time** — `onSnapshot` orqali mahsulotlar va buyurtmalar
- `cart` va `ui.theme` — `localStorage`ga `redux-persist` orqali saqlanadi

### Rasm menedjmenti
- **Firestore Storage** layouti: `product-images/{productId}/{n}.webp`, `avatars/{uid}.webp`
- Mijoz tarafida Canvas orqali o'lcham qisqartiriladi (Phase 3 da)

### Admin xavfsizligi
- **Custom claim** (`role: "admin"`) — yagona haqiqat manbai
- `VITE_ADMIN_EMAIL` — faqat UX yo'naltirish uchun (xavfsizlik emas)
- Firestore Rules — server tarafida ijro etiladi

## Faza qabul checklisti

### Phase 0 — Scaffold & Tooling ✅
- [x] Vite 8 + React 19 + TypeScript 6 (strict)
- [x] Tailwind v4 (CSS-first, Vite plugin)
- [x] MUI 9 + Emotion (CSS layers)
- [x] ESLint + Prettier konfiguratsiya
- [x] `@/` alias
- [x] Papka strukturasi + barrel eksportlar
- [x] Tema tokenlar (themeTokens.ts) — Tailwind + MUI uchun umumiy
- [x] Dark/light toggle (uiSlice + ThemeProvider)
- [x] Asosiy UI primitivlar (Button, Badge, Card, Avatar, Input, Skeleton, PriceTag, Rating, QuantityStepper)
- [x] Layoutlar (PublicLayout, AuthLayout, AdminLayout)
- [x] Router skeleton (createBrowserRouter, lazy loading, guards)
- [x] Placeholder sahifalar
- [x] i18n (uz/en/ru, standart uz)
- [x] Redux store + persist
- [x] .env.example

### Phase 1 — Firebase foundation 🔜
### Phase 2 — Auth & Profile 🔜
### Phase 3 — Catalog & Product Details 🔜
### Phase 4 — Cart & Checkout 🔜
### Phase 5 — Order side-effects (Functions) 🔜
### Phase 6 — Admin Dashboard 🔜
### Phase 7 — Telegram Bot 🔜
### Phase 8 — Blog + Contact 🔜
### Phase 9 — Polish 🔜
### Phase 10 — Deploy 🔜
