# MedLatin — Shifokorlar Lotin Tili va Retseptlar Tarjimoni 🩺

MedLatin — shifokorlar (doktorlar) yozgan lotin tilidagi retseptlar, qisqartmalar (abbreviaturalar), dori shakllari va klinik tashxislarni oddiy bemorlar va tibbiyot talabalari uchun tushunarli o'zbek tiliga tarjima qilib, to'liq izohlab beruvchi zamonaviy interaktiv veb-dastur.

Loyihani yaratishda faqat toza **HTML5**, **CSS3** va **Vanilla JavaScript** ishlatilgan. Hech qanday murakkab kutubxonalar yoki serverlar talab etilmaydi — to'g'ridan-to'g'ri `index.html` orqali brauzerda ishga tushadi!

---

## 🌟 Asosiy Imkoniyatlar

1. 💊 **Aqlli Retsept Dekoderi (Prescription Decoder):**
   - Retsept qisqartmalarini (`Rp.:`, `D.t.d. N.`, `S.`, `Sol.`, `Tab.`, `in amp.`, `i/m`, `i/v`, `p/o`, `t.i.d.`, `b.i.d.`, `a.c.`, `p.c.`, `Cito!` va b.) avtomatik tahlil qiladi.
   - **Bemor uchun sodda tildagi xulosa:** Dorining vazifasi, soni va uni qanday qabul qilish tartibi (kuniga necha mahal, ovqatdan oldin/keyin).
   - Namunaviy tezkor retseptlar (Analgin, Amoksitsillin, Enalapril, Levomitsetin, Oksolin, Paratsetamol).

2. 🩺 **Klinik Tashxis Tahlilchisi (Diagnosis Engine):**
   - 200+ dan ortiq kasalliklar bazasi (12 ta asosiy tibbiyot sohasini to'liq qamrab olgan: Yuqumli va parazitar, Yurak va qon-tomir, Nafas olish tizimi, Hazm qilish tizimi, Asab tizimi va ruhiyat, Endokrin tizim, Tayanch-harakat, Siydik-tanosil, Teri (Dermatologiya), Onkologiya, Ko'z va quloq, Qon tizimi).
   - Har bir tashxis uchun Lotincha, O'zbekcha va Ruscha rasmiy nomlari, xalq tilidagi izohi, alomatlari, davolovchi shifokor, yuqish yo'llari va shoshilinchlik darajasi.
   - Tezkor real-time qidiruv va tahlil.

3. 📖 **Katta Tibbiy Lotin Tili Lug'ati:**
   - 400+ dan ortiq qisqartmalar, dori shakllari, anatomik tana a'zolari va kasallik qo'shimchalari.
   - Jonli real-time qidiruv va filtrlar.
   - Audio talaffuz tinglash imkoniyati (Web Speech API).

4. 📋 **Retsept Blankasi va Shifokor Qoidalari:**
   - Retseptning 6 ta asosiy qismi (*Inscriptio, Invocatio, Designatio materiarum, Subscriptio, Signatura, Sigillum*) interaktiv ko'rinishda.

5. 🗣️ **Lotin Alifbosi va O'qilish Qoidalari (Fonetik):**
   - C, CH, PH, TH, RH, TI, S, AE/OE kabi harf va birikmalarning to'g'ri tibbiy talaffuzi.

6. 🏆 **Interaktiv Viktorina / Test (Quiz):**
   - 8 ta sinov savollari orqali bilimni tekshirish va yakuniy ball hisoblash.

7. 📱 **Android va Smartfonlarga To'liq Moslashuvchanlik (PWA & Mobile Native UX):**
   - **Progressive Web App (PWA):** Android qurilmalarga to'g'ridan-to'g'ri APK kabi o'rnatish (`manifest.json` va "O'rnatish" tugmasi orqali).
   - **Oflayn rejim:** Service Worker (`sw.js`) orqali shifoxona va klinikalarda internetsiz ham uzluksiz ishlaydi.
   - **Android Pastki Navigatsiya Paneli:** Bosh barmoq bilan qulay boshqarish uchun pastki menyu (Retsept, Tashxis, Lug'at, Qoidalar, Talaffuz, Test).
   - **Android "Orqaga" tugmasi / jesti:** Sahifalararo o'tishda Android apparat yoki jest orqaga tugmasi brauzerni yopib yubormasdan oldingi bo'limga qaytaradi.
   - **Haptik tebranish (Vibration API):** Harakatlarda yoqimli taktil fikr-mulohaza (`navigator.vibrate`).
   - **Avto-zoom cheklovi:** Mobil klaviatura ochilganda brauzer buzilib ketishini oldini oluvchi 16px font qoidasi va `visualViewport` moslashuvi.
   - **Bottom Sheet modal oynalari:** Lotincha atamalar tafsiloti Android tizimiga xos pastdan chiquvchi varaq ko'rinishida ochiladi.
   - **Tungi (Dark) va Kunduzgi (Light) tibbiy rejim.**

8. 🔐 **Tizimga Kirish (Login & Profil):**
   - **Tezkor kirish:** Faqat Ism va Parol orqali ortiqcha qiyinchiliklarsiz bitta qulay oynada tizimga kirish.
   - **Parol xavfsizligi:** Parolni ko'rsatish/yashirish ko'z belgisi (👁️) va xatolar nazorati.
   - **Sessiyani eslab qolish:** `localStorage` orqali foydalanuvchi ma'lumotlari saqlanadi, sahifa yangilanganda ham hisob faol qoladi hamda istalgan payt bitta bosishda chiqish (Logout) mumkin.

---

## 🚀 Ishga Tushirish

Hech qanday o'rnatish shart emas! 
Shunchaki `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox, Safari) oching yoki Android telefoningizda brauzer orqali ochib, "Bosh ekranga qo'shish" (O'rnatish) tugmasini bosing.

```bash
# Loyihani klonlash:
git clone https://github.com/dilmurod3739/Lotin_tili_tarjimoni.git

# Papkaga kirish:
cd Lotin_tili_tarjimoni

# Brauzerda ochish:
start index.html
```

---

## 📂 Loyiha Tuzilishi

```text
├── index.html        # Asosiy veb sahifa va mobil navigatsiya
├── style.css         # Dizayn, Dark/Light mode va Android moslashuvchanlik
├── data.js           # Katta tibbiy ma'lumotlar bazasi (200+ tashxis, retseptlar, lug'at)
├── app.js            # Mantiq, qidiruv, audio, Android navigatsiya va haptika
├── manifest.json     # Android PWA o'rnatish konfiguratsiyasi
├── sw.js             # Oflayn ishlash uchun Service Worker
├── icon-192.svg      # Android 192x192 ilova ikonasi
├── icon-512.svg      # Android 512x512 ilova ikonasi
└── reja.txt          # Loyiha hujjatlari va reja
```

---

## 👨‍💻 Muallif

Loyiha muallifi: [dilmurod3739](https://github.com/dilmurod3739)  
Litsenziya: MIT License &copy; 2026
