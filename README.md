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

7. 📱 **Android va Smartfonlarga To'liq Moslashuvchanlik (Mobile Responsive):**
   - Android Chrome, Samsung Internet va boshqa mobil brauzerlar uchun maxsus moslashtirilgan.
   - Mobil virtual klaviatura qidiruvi (`enterkeyhint="search"`), 48px+ sensorli tugmalar, teginish animatsiyalari.
   - Tungi (Dark) va Kunduzgi (Light) tibbiy rejim.

---

## 🚀 Ishga Tushirish

Hech qanday o'rnatish shart emas! 
Shunchaki `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox, Safari) oching.

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
├── index.html        # Asosiy veb sahifa
├── style.css         # Dizayn va vizual stillar (Dark/Light mode)
├── data.js           # Katta tibbiy ma'lumotlar bazasi (retseptlar, tashxislar, lug'at)
├── app.js            # Mantiq, tahlil, qidiruv, audio va interaktiv boshqaruv
└── reja.txt          # Loyiha hujjatlari va reja
```

---

## 👨‍💻 Muallif

Loyiha muallifi: [dilmurod3739](https://github.com/dilmurod3739)  
Litsenziya: MIT License &copy; 2026
