# UstozRank — O'quvchilar Reyting va Natijalar Portali

O'qituvchilar, o'quvchilar va ota-onalar uchun maxsus yaratilgan, faqat **HTML5, CSS3 va sof JavaScript (vanilla JS)** da yozilgan ultra-zamonaviy, to'liq moslashuvchan (responsive) ta'lim reyting platformasi.

---

## 🌟 Asosiy Yangiliklar va Imkoniyatlar

1. **👨‍👩‍👧‍👦 Ota-onalar va O'quvchilar Uchun Ochiq Rejim (Public Mode)**
   - Saytga kirgan har bir o'quvchi va ota-ona **hech qanday loginsiz** barcha umumiy reytinglarni, haftalik yetakchilarni, Top-3 podiumni, guruhlar reytingini va har bir o'quvchining shaxsiy profili hamda ballar tarixini ko'rishi mumkin.
   - O'quvchi va ota-onalar ball qo'sha olmaydi yoki tahrirlay olmaydi (Read-Only xavfsizlik).

2. **🔑 Ustoz Kirish Paneli (Teacher Admin Login)**
   - Sahifaning eng yuqori qismida (header) qulay **"🔑 Ustoz Kirish"** tugmasi joylashgan.
   - O'quvchilar ko'rib qolmasligi uchun sayt interfeysida login va parol **hech qayerda ko'rsatilmaydi**.
   - **Login:** `kaludir`
   - **Parol:** `UDKM1234`
   - Ustoz tizimga kirishi bilan barcha boshqaruv tugmalari faollashadi:
     - Dars davomida tezkor ball qo'shish (+5, +10, +20, -5, va h.k.)
     - Yangi guruh va o'quvchilarni qo'shish, tahrirlash, guruhdan guruhga ko'chirish
     - Zaxira nusxa (JSON eksport/import/tiklash)
     - Parolni o'zgartirish

3. **🌓 Qorong'u va Yorug' Rejim (Dark / Light Mode)**
   - Yuqori o'ng burchakdagi Quyosh/Oy tugmasi orqali bir zumda qorong'u (Dark) yoki yorug' (Light) rejimga o'tish.
   - Tanlangan rejim `localStorage` da avtomatik eslab qolinadi.

4. **🌐 4 Ta Til (Multi-Language)**
   - 🇺🇿 **O'zbekcha** (standart)
   - 🇬🇧 **English**
   - 🇷🇺 **Русский**
   - 🇰🇿 **Қазақша**
   - Yuqori paneldagi til tanlash orqali butun interfeys, jadvallar, toifalar va bildirishnomalar tanlangan tilga o'tadi.

5. **🏆 Top 3 Podium va Reyting Tizimi**
   - Oltin 🥇, Kumush 🥈 va Bronza 🥉 kartalari bilan yetakchi o'quvchilar.
   - Guruh va davr bo'yicha saralash (*Barcha vaqt, Bu hafta, Bu oy*).
   - Real vaqtda jonli qidiruv.

6. **📅 Haftalik Reyting**
   - Har dushanbadan yakshanbagacha to'plangan ballarni alohida hisoblaydi.
   - Tarixiy jami ballar hech qachon o'chmaydi.

7. **💾 Zaxira Nusxa va Tiklash (JSON Backup & Restore)**
   - Brauzer xotirasi tozalanganda ham ma'lumotlar yo'qolmasligi uchun `.json` fayl yuklab olish (Eksport) va qayta yuklash (Import).

---

## 🚀 Ishga Tushirish

### 1. Mahalliy (Local)
`index.html` faylini istalgan brauzerda ochish kifoya.

### 2. Vercel ga Yuklash
Loyiha 100% statik frontend (hech qanday Node.js backend talab qilmaydi):
1. Papkani GitHub-ga yuklang (`git push`).
2. [vercel.com](https://vercel.com) da "New Project" qilib ushbu repozitoriyni tanlang va "Deploy" tugmasini bosing.
