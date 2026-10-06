/**
 * Shifokorlar Lotin Tili Lug'ati va Ma'lumotlar Bazasi
 * Bemorlar, talabalar va shifokorlar uchun to'liq tushuntirishlar
 */

const MEDICAL_DATA = {
    // 1. Retsept Qisqartmalari (Abbreviatura)
    abbreviations: [
        {
            abbr: "Rp.",
            full: "Recipe",
            trans: "Ol / Oling (Qabul qil)",
            cat: "recipe",
            desc: "Retseptning asosiy boshlanishi. Shifokor dorixonachi yoki bemorga dori vositasini olishni buyuradi.",
            example: "Rp.: Sol. Glucosi 40% - 20 ml"
        },
        {
            abbr: "D.t.d. N.",
            full: "Da (Dentur) tales doses numero...",
            trans: "Shunday dozalardan ... ta berilsin",
            cat: "recipe",
            desc: "Kerakli dori miqdori yoki tabletka/ampula sonini ko'rsatadi.",
            example: "D.t.d. N. 10 in ampullis"
        },
        {
            abbr: "S.",
            full: "Signa / Signetur",
            trans: "Belgilansin / Qabul qilish tartibi yozilsin",
            cat: "recipe",
            desc: "Bemor uchun dorini qanday, qachon va qancha ichish yoki qo'llash ko'rsatmasi.",
            example: "S. 1 tabletkadan kuniga 3 mahal ovqatdan so'ng"
        },
        {
            abbr: "D.S.",
            full: "Da. Signa.",
            trans: "Berilsin. Belgilansin.",
            cat: "recipe",
            desc: "Dorini berish va uning ustiga qo'llash tartibini yozib berishni bildiradi.",
            example: "D.S. Kuniga 2 marta 1 kapsuladan"
        },
        {
            abbr: "M.f.",
            full: "Misce fiat (fiant)...",
            trans: "Aralashtir, hosil bo'lsin...",
            cat: "recipe",
            desc: "Dorixonada tayyorlanadigan dorilar uchun tarkibiy qismlarni aralashtirish buyrug'i.",
            example: "M.f. pulvis (Aralashtir, kukun hosil bo'lsin)"
        },
        {
            abbr: "M.f. pulv.",
            full: "Misce fiat pulvis",
            trans: "Aralashtir, kukun (poroshok) hosil bo'lsin",
            cat: "recipe",
            desc: "Kukun dori shaklini tayyorlash buyrug'i.",
            example: "M.f. pulv. D.t.d. N. 12"
        },
        {
            abbr: "M.f. ung.",
            full: "Misce fiat unguentum",
            trans: "Aralashtir, malham (maz) hosil bo'lsin",
            cat: "recipe",
            desc: "Surkama dori (maz) tayyorlash buyrug'i.",
            example: "M.f. ung. D.S. Teriga surtish uchun"
        },
        {
            abbr: "M.f. sol.",
            full: "Misce fiat solutio",
            trans: "Aralashtir, eritma hosil bo'lsin",
            cat: "recipe",
            desc: "Suyuq dori eritmasini tayyorlash buyrug'i.",
            example: "M.f. sol. D.S. Chayish uchun"
        },
        {
            abbr: "M.f. suppos.",
            full: "Misce fiat suppositorium",
            trans: "Aralashtir, shamcha (svecha) hosil bo'lsin",
            cat: "recipe",
            desc: "Rektal yoki vaginal shamcha tayyorlash buyrug'i.",
            example: "M.f. supp. D.t.d. N. 6"
        },
        {
            abbr: "in tab.",
            full: "in tabulettis",
            trans: "Tabletkalarda",
            cat: "form",
            desc: "Dori qattiq tabletka shaklida berilishi kerakligini bildiradi.",
            example: "D.t.d. N. 20 in tab."
        },
        {
            abbr: "in amp.",
            full: "in ampullis",
            trans: "Ampulalarda",
            cat: "form",
            desc: "Dori shisha ampulada, odatda in'yeksiya (ukol) uchun.",
            example: "D.t.d. N. 10 in ampull."
        },
        {
            abbr: "in caps.",
            full: "in capsulis",
            trans: "Kapsulalarda",
            cat: "form",
            desc: "Dori yutiladigan jelatin qobiqli kapsulada.",
            example: "D.t.d. N. 30 in caps."
        },
        {
            abbr: "in flac.",
            full: "in flaconis",
            trans: "Flakonlarda",
            cat: "form",
            desc: "Dori shisha idishda (flakon) berilishi.",
            example: "D.t.d. N. 1 in flac."
        },
        {
            abbr: "i/m (i.m.)",
            full: "intra musculum",
            trans: "Mushak ichiga (ukol)",
            cat: "usage",
            desc: "Dori vositasini dumba yoki boshqa mushakka yuborish tartibi.",
            example: "1 ampuladan i/m kuniga 1 mahal"
        },
        {
            abbr: "i/v (i.v.)",
            full: "intra venam",
            trans: "Vena ichiga (tomirga ukol yoki kapelnitsa)",
            cat: "usage",
            desc: "Dori vositasini to'g'ridan-to'g'ri qon tomiriga yuborish.",
            example: "10 ml i/v sekin yuborilsin"
        },
        {
            abbr: "p/o (per os)",
            full: "per os",
            trans: "Og'iz orqali (ichishga)",
            cat: "usage",
            desc: "Dorini chaynamasdan yoki suv bilan ichish kerakligi.",
            example: "1 tabletkadan p/o kuniga 2 mahal"
        },
        {
            abbr: "s/c (s.c.)",
            full: "sub cutem",
            trans: "Teri ostiga (ukol)",
            cat: "usage",
            desc: "Dori vositasini teri osti qatlamiga (masalan, insulin) yuborish.",
            example: "s/c yuborilsin ovqatdan oldin"
        },
        {
            abbr: "p/r (per rectum)",
            full: "per rectum",
            trans: "To'g'ri ichak orqali (orqadan)",
            cat: "usage",
            desc: "Shamchalar (svechalar) uchun qo'llash usuli.",
            example: "1 shamchadan kechqurun p/r"
        },
        {
            abbr: "a.c.",
            full: "ante coenum (ante cibum)",
            trans: "Ovqatdan oldin",
            cat: "usage",
            desc: "Dorini ovqatlanishdan kamida 20-30 daqiqa oldin ichish kerak.",
            example: "1 tabletkadan a.c."
        },
        {
            abbr: "p.c.",
            full: "post coenum (post cibum)",
            trans: "Ovqatdan keyin",
            cat: "usage",
            desc: "Dorini ovqat yeb bo'lgach (oshqozon to'q paytda) ichish tavsiya etiladi.",
            example: "1 kapsuladan p.c."
        },
        {
            abbr: "i.c.",
            full: "inter cibos",
            trans: "Ovqatlar oralig'ida",
            cat: "usage",
            desc: "Ikki ovqatlanish o'rtasidagi vaqtda qabul qilish.",
            example: "Ovqatlanishdan 2 soat keyin"
        },
        {
            abbr: "b.i.d.",
            full: "bis in die",
            trans: "Kuniga 2 marta (har 12 soatda)",
            cat: "usage",
            desc: "Sutkada ikki marotaba teng oraliqda ichish kerak.",
            example: "1 tab. b.i.d."
        },
        {
            abbr: "t.i.d.",
            full: "ter in die",
            trans: "Kuniga 3 marta (har 8 soatda)",
            cat: "usage",
            desc: "Sutkada uch mahal qabul qilish rejimi.",
            example: "1 tab. t.i.d."
        },
        {
            abbr: "q.i.d.",
            full: "quater in die",
            trans: "Kuniga 4 marta (har 6 soatda)",
            cat: "usage",
            desc: "Sutkada to'rt marta qabul qilish tartibi.",
            example: "1 tabletkadan q.i.d."
        },
        {
            abbr: "q.d.",
            full: "quaque die",
            trans: "Har kuni (kuniga 1 marta)",
            cat: "usage",
            desc: "Har kuni bir xil vaqtda bir mahal qabul qilinadi.",
            example: "Ertalab 1 tabletka q.d."
        },
        {
            abbr: "q.h.",
            full: "quaque hora",
            trans: "Har soatda",
            cat: "usage",
            desc: "Har bir soat oralig'ida qabul qilish.",
            example: "q.2h. - har 2 soatda"
        },
        {
            abbr: "h.s.",
            full: "hora somni",
            trans: "Uyqudan oldin (yotish oldidan)",
            cat: "usage",
            desc: "Kechqurun yotishga yotishdan 30 daqiqa oldin ichish.",
            example: "1 tab. h.s."
        },
        {
            abbr: "p.r.n.",
            full: "pro re nata",
            trans: "Zarurat bo'lganda (kerak bo'lganda)",
            cat: "usage",
            desc: "Doimiy emas, balki faqat og'riq yoki harorat ko'tarilganda ichish.",
            example: "Isitma chiqsa 1 tabletka p.r.n."
        },
        {
            abbr: "stat.",
            full: "statim",
            trans: "Zudlik bilan / Darhol!",
            cat: "urgent",
            desc: "Dorini kutmasdan darhol berish yoki qo'llash talabi.",
            example: "Statim 2 ml yuborilsin"
        },
        {
            abbr: "Cito!",
            full: "Cito!",
            trans: "Tezda! (Shoshilinch)",
            cat: "urgent",
            desc: "Dorixonada retseptni navbatsiz va tez tayyorlab berish belgisi.",
            example: "Cito! Retsept ustiga yoziladi"
        },
        {
            abbr: "Citissime!",
            full: "Citissime!",
            trans: "Juda tez! / Favqulodda tez!",
            cat: "urgent",
            desc: "Eng yuqori darajadagi shoshilinchlik.",
            example: "Bemor hayoti xavfda bo'lganda"
        },
        {
            abbr: "aa (ana)",
            full: "ana partes aequales",
            trans: "Teng miqdordan / Har biridan teng",
            cat: "recipe",
            desc: "Bir nechta moddaning har biridan teng miqdorda olishni bildiradi.",
            example: "aa 10,0 (har biridan 10 grammdan)"
        },
        {
            abbr: "q.s.",
            full: "quantum satis",
            trans: "Yetarli miqdorda",
            cat: "recipe",
            desc: "Kerakli massaga yoki shaklga yetguncha asos qo'shish.",
            example: "q.s. ut fiat unguentum"
        },
        {
            abbr: "ad us. ext.",
            full: "ad usum externum",
            trans: "Tashqi qo'llash uchun (surtish, chayish)",
            cat: "usage",
            desc: "Ichilmaydigan, faqat teriga yoki shilliq qavatga ishlatiladigan dori.",
            example: "Spirtli eritma ad us. ext."
        },
        {
            abbr: "ad us. int.",
            full: "ad usum internum",
            trans: "Ichki qo'llash uchun (ichishga)",
            cat: "usage",
            desc: "Ichishga mo'ljallangan dori vositalari.",
            example: "Sirop ad us. int."
        },
        {
            abbr: "pro inject.",
            full: "pro injectionibus",
            trans: "In'yeksiya (ukol) uchun",
            cat: "usage",
            desc: "Steril, ukol qilish uchun mo'ljallangan suv yoki eritma.",
            example: "Aqua pro injectionibus"
        },
        {
            abbr: "pro infant.",
            full: "pro infantibus",
            trans: "Bolalar uchun",
            cat: "usage",
            desc: "Dozasi bolalar yoshiga moslashtirilgan dori shakli.",
            example: "Paracetamol pro infant."
        },
        {
            abbr: "Steril!",
            full: "Sterilisetur!",
            trans: "Sterillansin! (Mikroblardan tozalansin)",
            cat: "urgent",
            desc: "Dori vositasini to'liq mikroblarsizlantirish buyrug'i.",
            example: "Kuz tomchilari va in'yeksiyalar uchun"
        },
        {
            abbr: "Repete!",
            full: "Repete!",
            trans: "Qaytarilsin! (Yana berilsin)",
            cat: "recipe",
            desc: "Shifokor retseptni dorixonadan yana bir bor olishga ruxsat berishi.",
            example: "Surunkali bemorlar uchun"
        },
        {
            abbr: "Non repete!",
            full: "Non repete!",
            trans: "Qaytarilmasin!",
            cat: "recipe",
            desc: "Kuchli ta'sirli dorilar faqat bir marta berilishi shart.",
            example: "Giyohvandlik va kuchli tinchlantiruvchilar"
        }
    ],

    // 2. Dori Shakllari (Dosage Forms)
    dosageForms: [
        { lat: "Solutio (Sol.)", uz: "Eritma", type: "Suyuq", desc: "Moddaning suyuqlikda to'liq erigan holati (ichish, chayish yoki ukol uchun)" },
        { lat: "Tabuletta (Tab.)", uz: "Tabletka", type: "Qattiq", desc: "Presslangan kukun shaklidagi qattiq dori vositasi" },
        { lat: "Unguentum (Ung.)", uz: "Malham (Maz)", type: "Yumshoq", desc: "Teriga yoki shilliq qavatlarga surtish uchun mo'ljallangan quyuq modda" },
        { lat: "Capsula (Caps.)", uz: "Kapsula", type: "Qattiq", desc: "Jelatin qobiq ichiga solingan kukun yoki suyuq dori" },
        { lat: "Tinctura (T-ra / Tinct.)", uz: "Damlama (Nastoyka)", type: "Suyuq", desc: "Dorivor o'simliklarning spirtli tindirmasi" },
        { lat: "Extractum (Ext.)", uz: "Ekstrakt (Siqma)", type: "Quyuq/Quruq", desc: "O'simlik yoki xomashyodan ajratib olingan quyuq modda" },
        { lat: "Suppositorium (Supp.)", uz: "Shamcha (Svecha)", type: "Yumshoq", desc: "Tana haroratida eriydigan, to'g'ri ichakka yoki qinga qo'yiladigan dori" },
        { lat: "Guttae (Gutt.)", uz: "Tomchilar", type: "Suyuq", desc: "Ko'z, quloq, burun yoki ichish uchun tomchilatib o'lchanadigan eritma" },
        { lat: "Sirupus (Sir.)", uz: "Sirop (Shirin sharbat)", type: "Suyuq", desc: "Qand moddasi qo'shilgan quyuq shirin dori eritmasi" },
        { lat: "Suspensio (Susp.)", uz: "Suspenziya", type: "Suyuq", desc: "Suyuqlik ichida erimagan mayda zarrachalar aralashmasi (ishlatishdan oldin chayqatiladi)" },
        { lat: "Emulsio (Emuls.)", uz: "Emulsiya", type: "Suyuq", desc: "Bir-birida erimaydigan ikki suyuqlik (masalan, yog' va suv) aralashmasi" },
        { lat: "Pasta (Past.)", uz: "Pasta", type: "Yumshoq", desc: "Tarkibida 25% dan ko'p kukun bo'lgan juda quyuq malham" },
        { lat: "Pulvis (Pulv.)", uz: "Kukun (Poroshok)", type: "Qattiq", desc: "Maydalangan quruq dori moddasi" },
        { lat: "Aerosolum (Aeros.)", uz: "Aerozol (Sprey)", type: "Gazsimon/Sepiladigan", desc: "Bosim ostida purkaladigan dori shakli (masalan, astmada)" },
        { lat: "Linimentum (Lin.)", uz: "Liniment (Suyuq surtma)", type: "Yumshoq", desc: "Tana haroratida eriydigan quyuq suyuq surtma dori" },
        { lat: "Infusum (Inf.)", uz: "Damlamasi (Suvli)", type: "Suyuq", desc: "Dorivor o'simlikning suvda damlangan damlamasi" },
        { lat: "Decoctum (Dec.)", uz: "Qaynatmasi", type: "Suyuq", desc: "Dorivor ildiz va po'stloqlarni qaynatib olingan suyuqlik" },
        { lat: "Dragee", uz: "Draje", type: "Qattiq", desc: "Qavatma-qavat shakar qoplab dumaloq shaklga keltirilgan dori" }
    ],

    // 3. Anatomik Tana A'zolari (Anatomy)
    anatomy: [
        { lat: "Cor, cordis", uz: "Yurak", system: "Yurak-qon tomir", desc: "Qonni tanaga haydab beruvchi asosiy muskulli a'zo" },
        { lat: "Sanguis", uz: "Qon", system: "Qon tizimi", desc: "Organizmning suyuq hayotiy muhiti" },
        { lat: "Vas, vasis", uz: "Qon tomir", system: "Yurak-qon tomir", desc: "Arteriya, vena va kapillyarlarning umumiy nomi" },
        { lat: "Hepar, hepatis", uz: "Jigar", system: "Hazm qilish", desc: "Organizmning asosiy biokimyoviy laboratoriyasi va filtri" },
        { lat: "Gaster, gastris", uz: "Oshqozon", system: "Hazm qilish", desc: "Ovqat hazm bo'ladigan asosiy bo'shliq a'zo" },
        { lat: "Pulmo, pulmonis", uz: "O'pka", system: "Nafas olish", desc: "Gazlar almashinuvi sodir bo'ladigan juft nafas a'zosi" },
        { lat: "Ren, renis", uz: "Buyrak", system: "Siydik ayirish", desc: "Qonni tozalab siydik hosil qiluvchi juft a'zo" },
        { lat: "Cerebrum / Encephalon", uz: "Bosh miya", system: "Asab tizimi", desc: "Asab faoliyatining oliy markazi" },
        { lat: "Medulla spinalis", uz: "Orqa miya", system: "Asab tizimi", desc: "Umurtqa pog'onasi kanalidagi asab tolasi" },
        { lat: "Oculus, oculi", uz: "Ko'z", system: "Sezgi a'zolari", desc: "Ko'rish a'zosi" },
        { lat: "Auris, auris", uz: "Quloq", system: "Sezgi a'zolari", desc: "Eshitish va muvozanat a'zosi" },
        { lat: "Nasus, nasi", uz: "Burun", system: "Nafas olish", desc: "Nafas va hid bilish a'zosi" },
        { lat: "Dens, dentis", uz: "Tish", system: "Hazm qilish", desc: "Ovqatni maydalovchi qattiq suyaksimon tuzilma" },
        { lat: "Lingua, linguae", uz: "Til", system: "Hazm / Nutq", desc: "Ta'm bilish va gapirish a'zosi" },
        { lat: "Cutis, cutis", uz: "Teri", system: "Qoplag'ich", desc: "Tananing tashqi himoya qoplami" },
        { lat: "Os, ossis", uz: "Suyak", system: "Tayanch-harakat", desc: "Skeletni tashkil etuvchi qattiq to'qima" },
        { lat: "Musculus, musculi", uz: "Mushak (Muskul)", system: "Tayanch-harakat", desc: "Tana harakatini ta'minlovchi qisqaruvchan to'qima" },
        { lat: "Articulatio", uz: "Bo'g'im", system: "Tayanch-harakat", desc: "Suyaklarning o'zaro harakatchan birikmasi" },
        { lat: "Intestinum", uz: "Ichak", system: "Hazm qilish", desc: "Ingichka va yo'g'on ichaklar umumiy nomi" },
        { lat: "Vesica biliaris (fellea)", uz: "O't pufagi", system: "Hazm qilish", desc: "Jigar ishlab chiqargan o't suyuqligi to'planadigan xalta" },
        { lat: "Vesica urinaria", uz: "Siydik qopi (qovuq)", system: "Siydik ayirish", desc: "Siydik to'planadigan pufak a'zo" },
        { lat: "Pancreas", uz: "Oshqozon osti bezi", system: "Hazm / Endokrin", desc: "Insulin va hazm fermentlarini ishlab chiqaruvchi bez" },
        { lat: "Larynx", uz: "Hiqildoq", system: "Nafas olish", desc: "Ovoz paychalari joylashgan nafas yo'li qismi" },
        { lat: "Pharynx", uz: "Halqum", system: "Nafas / Hazm", desc: "Burun-bo'g'iz va ovqat o'tish yo'li" },
        { lat: "Trachea", uz: "Kekirdak", system: "Nafas olish", desc: "Hiqildoqdan bronxlarga o'tuvchi tog'ay naycha" },
        { lat: "Bronchus", uz: "Bronx", system: "Nafas olish", desc: "O'pkaga havo yetkazuvchi tarmoqlangan yo'llar" },
        { lat: "Glandula thyroidea", uz: "Qalqonsimon bez", system: "Endokrin", desc: "Bo'yin oldida joylashgan moddalar almashinuvini boshqaruvchi bez" }
    ],

    // 4. Tibbiy Morfologiya: Prefiks va Suffikslar (Tashxis Dekoderi uchun)
    prefixes: [
        { prefix: "a- / an-", meaning: "Yo'qligi, inkor qilish", uz: "Mavjud emas, to'xtagan", example: "Anuria (siydik ajralmasligi), Atonia (mushak tonusi yo'qligi)" },
        { prefix: "dys-", meaning: "Buzilish, buzilgan, qiyinlashgan", uz: "Buzilish, faoliyat yomonlashishi", example: "Dyspepsia (hazm buzilishi), Dyspnoea (nafas qisishi)" },
        { prefix: "hyper-", meaning: "Ortiqcha, baland, me'yordan yuqori", uz: "Ko'paygan, yuqori darajada", example: "Hypertonia (yuqori qon bosimi), Hyperglycaemia (qand ko'payishi)" },
        { prefix: "hypo-", meaning: "Yetishmovchilik, past, past darajada", uz: "Kamaygan, tushib ketgan", example: "Hypotonia (past bosim), Hypovitaminosis (vitamin yetishmasligi)" },
        { prefix: "poly-", meaning: "Ko'p, ko'psonli", uz: "Juda ko'p miqdorda", example: "Polyuria (ko'p siydik ajralishi), Polyarthritis (ko'p bo'g'im yallig'lanishi)" },
        { prefix: "oligo-", meaning: "Kam, oz miqdorda", uz: "Yetarli emas, oz", example: "Oliguria (kam siydik chiqishi)" },
        { prefix: "tachy-", meaning: "Tez, tezlashgan", uz: "Tez urish, tezlashuv", example: "Tachycardia (yurakning tez urishi)" },
        { prefix: "brady-", meaning: "Sekin, sekinlashgan", uz: "Sekin urish, kamayuv", example: "Bradycardia (yurakning juda sekin urishi)" },
        { prefix: "endo-", meaning: "Ichki, ichida", uz: "A'zo ichki qavati", example: "Endocarditis (yurak ichki pardasi yallig'lanishi)" },
        { prefix: "peri-", meaning: "Atrofidagi, tashqi qavati", uz: "A'zoni o'rab turgan parda", example: "Pericarditis (yurak xaltasi yallig'lanishi)" },
        { prefix: "hemi-", meaning: "Yarim, bir tomonlama", uz: "Yarim qismi", example: "Hemiplegia (tananing bir yarmi falajligi)" },
        { prefix: "pan-", meaning: "Hammasi, butunlay", uz: "Butun a'zoni qamrab olgan", example: "Pancreatitis, Pansinusitis (barcha burun yondosh bo'shliqlari yallig'lanishi)" }
    ],

    roots: [
        { root: "gastr", uz: "Oshqozon", lat: "Gaster" },
        { root: "card / cardi", uz: "Yurak", lat: "Cor / Cardia" },
        { root: "hepat", uz: "Jigar", lat: "Hepar" },
        { root: "nephr", uz: "Buyrak", lat: "Ren" },
        { root: "pneum / pneumon", uz: "O'pka", lat: "Pulmo" },
        { root: "bronch", uz: "Bronx", lat: "Bronchus" },
        { root: "enter", uz: "Ichak (ingichka ichak)", lat: "Intestinum tenue" },
        { root: "col", uz: "Yo'g'on ichak", lat: "Colon" },
        { root: "cholecyst", uz: "O't pufagi", lat: "Vesica biliaris" },
        { root: "pancreat", uz: "Oshqozon osti bezi", lat: "Pancreas" },
        { root: "derm / dermat", uz: "Teri", lat: "Cutis" },
        { root: "oste / osteo", uz: "Suyak", lat: "Os" },
        { root: "arthr", uz: "Bo'g'im", lat: "Articulatio" },
        { root: "my / myo", uz: "Mushak (muskul)", lat: "Musculus" },
        { root: "neur", uz: "Asab (nerv)", lat: "Nervus" },
        { root: "encephal", uz: "Bosh miya", lat: "Cerebrum" },
        { root: "cyst", uz: "Siydik pufagi / pufak", lat: "Vesica urinaria" },
        { root: "ot", uz: "Quloq", lat: "Auris" },
        { root: "ophthalm", uz: "Ko'z", lat: "Oculus" },
        { root: "rhin", uz: "Burun", lat: "Nasus" },
        { root: "stomat", uz: "Og'iz bo'shlig'i", lat: "Os" },
        { root: "odont", uz: "Tish", lat: "Dens" },
        { root: "pharyng", uz: "Halqum (tomoq)", lat: "Pharynx" },
        { root: "laryng", uz: "Hiqildoq", lat: "Larynx" },
        { root: "appendic", uz: "Ko'richak o'simtasi (appendiks)", lat: "Appendix" },
        { root: "splen", uz: "Taloq", lat: "Lien" },
        { root: "phleb", uz: "Vena tomiri", lat: "Vena" },
        { root: "arteri", uz: "Arteriya tomiri", lat: "Arteria" },
        { root: "lymph", uz: "Limfa bezlari/suyuqligi", lat: "Lympha" },
        { root: "haem / haemat", uz: "Qon", lat: "Sanguis" },
        { root: "glyc", uz: "Qand (glyukoza)", lat: "Dulcis / Glucosum" },
        { root: "ur", uz: "Siydik", lat: "Urina" },
        { root: "lith", uz: "Tosh", lat: "Calculus" },
        { root: "py", uz: "Yiring", lat: "Pus" }
    ],

    suffixes: [
        {
            suffix: "-itis (-it)",
            meaning: "Yallig'lanish jarayoni",
            uz: "Yallig'lanish (infeksiya yoki shamollash)",
            desc: "Ushbu qo'shimcha a'zoning yallig'langanligini anglatadi. Masalan: Gastritis - oshqozon devorining yallig'lanishi.",
            example: "Gastritis, Bronchitis, Hepatitis, Otitis, Nefritis"
        },
        {
            suffix: "-oma (-oma)",
            meaning: "O'sma (o'simta)",
            uz: "O'sma to'qimasi (xavfli yoki xavfsiz)",
            desc: "Hujayralarning me'yordan ortiq o'sib ketishi natijasida hosil bo'lgan tugun yoki o'sma.",
            example: "Myoma (mushak o'smasi), Lipoma (yog' to'qimasi o'smasi), Adenoma"
        },
        {
            suffix: "-osis (-oz)",
            meaning: "Surunkali buzilish, distrofik yoki no-yallig'lanish holat",
            uz: "Surunkali kasallik yoki me'yordan ko'payish",
            desc: "Organ to'qimasining yallig'lanishsiz, sekin yemirilishi yoki o'zgarishi.",
            example: "Arthrosis (bo'g'im yemirilishi), Nephrosis, Leucocytosis"
        },
        {
            suffix: "-pathia (-patiya)",
            meaning: "Kasallik, noaniq xarakterdagi umumiy shikastlanish",
            uz: "A'zoning kasallanishi yoki shikastlanishi",
            desc: "Ushbu a'zoning umumiy zararlanish holati.",
            example: "Cardiomyopathia (yurak mushagi kasalligi), Neuropathia"
        },
        {
            suffix: "-algia (-algiya)",
            meaning: "Og'riq hissi",
            uz: "Kuchli og'riq",
            desc: "Strukturaviy buzilishsiz yoki asab bo'ylab keluvchi og'riq.",
            example: "Neuralgia (nerv og'rig'i), Myalgia (mushak og'rig'i), Gastralgia"
        },
        {
            suffix: "-ectomia (-ektomiya)",
            meaning: "Jarrohlik yo'li bilan butunlay olib tashlash",
            uz: "A'zoni kesib olib tashlash operatsiyasi",
            desc: "Zararlangan a'zoni jarroh tomonidan olib tashlanishi.",
            example: "Appendectomia (appendiksni olib tashlash), Cholecystectomia"
        },
        {
            suffix: "-tomia (-tomiya)",
            meaning: "Kesish, tilish (ochish operatsiyasi)",
            uz: "Jarohlik yo'li bilan kesish",
            desc: "A'zo bo'shlig'ini ochish uchun qilingan kesik.",
            example: "Tracheotomia (kekirdakni kesib havo yo'li ochish), Laparotomia"
        },
        {
            suffix: "-stomia (-stomiya)",
            meaning: "Sun'iy teshik (og'izcha) hosil qilish",
            uz: "Sun'iy naycha yoki teshik qo'yish",
            desc: "A'zodan tashqariga yoki boshqa a'zoga chiqish yo'li ochish.",
            example: "Gastrostomia, Colostomia"
        },
        {
            suffix: "-scopia (-skopiya)",
            meaning: "Asbob yordamida ichki ko'zdan kechirish",
            uz: "Kamera/asbob bilan ichkarini tekshirish",
            desc: "Optik zond orqali ichki a'zoni monitor orqali tekshirish.",
            example: "Gastroscopia (oshqozonni zond orqali ko'rish), Bronchoscopia"
        },
        {
            suffix: "-graphia (-grafiya)",
            meaning: "Grafik yoki tasviriy yozib olish (rentgen, ekg)",
            uz: "Tasvirga olish yoki yozib olish tekshiruvi",
            desc: "A'zoning faoliyatini yoki tasvirini qog'ozga / apparatga tushirish.",
            example: "Electrocardiographia (EKG), Radiographia, Angiographia"
        },
        {
            suffix: "-plegia (-plegiya)",
            meaning: "To'liq falajlik (harakatsizlik)",
            uz: "Falajlik (ishlamay qolish)",
            desc: "Asab shikastlanishi sababli harakatning yo'qolishi.",
            example: "Hemiplegia (yarim tana falaji), Paraplegia"
        },
        {
            suffix: "-lithiasis (-litiaz)",
            meaning: "Tosh hosil bo'lish kasalligi",
            uz: "Tosh paydo bo'lishi",
            desc: "A'zoda tuzlar cho'kib tosh hosil bo'lishi.",
            example: "Nephrolithiasis (buyrak toshi), Cholelithiasis (o't toshi)"
        },
        {
            suffix: "-rrhagia (-rragiya)",
            meaning: "Kuchli qon ketishi yoki suyuqlik oqishi",
            uz: "Qon ketishi",
            desc: "Qon tomir devori yorilishi sababli qon chiqishi.",
            example: "Haemorrhagia (qon ketish), Gastrorrhagia (oshqozondan qon ketish)"
        },
        {
            suffix: "-spasmus (-spazm)",
            meaning: "Mushakning keskin qisqarishi (tortishish)",
            uz: "Tortishish, qisqarib qolish",
            desc: "A'zo devoridagi silliq mushaklarning spazmi.",
            example: "Bronchospasmus (bronxlar qisqarib havo o'tmasligi), Vasospasmus"
        }
    ],

    // 5. Namunaviy Doktor Retseptlari (Prescription Templates)
    presetPrescriptions: [
        {
            title: "Og'riqqoldiruvchi va Isitma tushiruvchi (Analgin ukoli)",
            category: "Ukol / In'yeksiya",
            raw: "Rp.: Sol. Analgini 50% - 2 ml\n" +
                 "D.t.d. N. 10 in ampull.\n" +
                 "S. Mushak ichiga 2 ml dan og'riq kuchayganda.",
            explanation: {
                line1: "Rp. (Recipe - Oling): 50 foizli Analgin eritmasidan 2 millilitr.",
                line2: "D.t.d. N. 10 in ampull. (Dentur tales doses numero 10 in ampullis): Shunday dozadan 10 ta ampulada berilsin.",
                line3: "S. (Signa - Belgilansin): Mushak ichiga (i/m) 2 ml dan faqat og'riq bo'lganda yuborilsin."
            },
            notes: "Tezkor og'riqqoldiruvchi va harorat tushiruvchi vosita."
        },
        {
            title: "Keng ta'sirli Antibiotik (Amoksitsillin tabletkasi)",
            category: "Tabletka / Ichishga",
            raw: "Rp.: Amoxicillini 0,5\n" +
                 "D.t.d. N. 20 in tab.\n" +
                 "S. 1 tabletkadan kuniga 3 mahal ovqatdan so'ng (t.i.d. p.c.).",
            explanation: {
                line1: "Rp.: 0.5 grammli Amoksitsillin dori moddasidan oling.",
                line2: "D.t.d. N. 20 in tab.: Shunday dozada 20 dona tabletkada berilsin.",
                line3: "S.: 1 tabletkadan kuniga 3 mahal (har 8 soatda) ovqatdan keyin ichilsin. Kursni to'liq tugatish shart."
            },
            notes: "Bakterial infeksiyalarga qarshi antibiotik."
        },
        {
            title: "Yurak va Qon bosimiga (Enalapril tabletkasi)",
            category: "Kardiologiya",
            raw: "Rp.: Tab. Enalaprili 0,01 N. 30\n" +
                 "D.S. Kuniga 1 mahal ertalab 1 tabletkadan (q.d.).",
            explanation: {
                line1: "Rp. Tab. Enalaprili 0.01 N. 30: 0.01 gramm (10 mg) li Enalapril tabletkasidan 30 dona oling.",
                line2: "D.S.: Berilsin. Qabul qilish tartibi yozilsin: Har kuni ertalab 1 tabletkadan muntazam ichilsin."
            },
            notes: "Yuqori qon bosimini (gipertoniya) me'yorda ushlab turish uchun."
        },
        {
            title: "Ko'z tomchisi (Levomitsetin eritmasi)",
            category: "Oftalmologiya / Tomchi",
            raw: "Rp.: Sol. Laevomycetini 0,25% - 10 ml\n" +
                 "Steril.!\n" +
                 "D.S. Har bir ko'zga 1-2 tomchidan kuniga 3 mahal (gutt.).",
            explanation: {
                line1: "Rp. Sol. Laevomycetini 0.25% - 10 ml: 0.25 foizli Levomitsetin eritmasidan 10 ml oling.",
                line2: "Steril.! (Sterilisetur!): To'liq mikroblarsizlantirilsin (steril tayyorlansin)!",
                line3: "D.S.: Har bir ko'zga 1-2 tomchidan kuniga 3 marta tomizilsin."
            },
            notes: "Ko'z kon'yunktiviti va bakterial yallig'lanishida qo'llanadi."
        },
        {
            title: "Teri uchun Malham (Oksolin mazi)",
            category: "Malham / Tashqi",
            raw: "Rp.: Ung. Oxolini 0,25% - 10,0\n" +
                 "D.S. Burun shilliq qavatiga kuniga 2 marta surtilsin (ad us. ext.).",
            explanation: {
                line1: "Rp. Ung. Oxolini 0.25% - 10.0: 0.25 foizli Oksolin malhamidan 10 gramm oling.",
                line2: "D.S.: Berilsin. Belgilansin: Tashqi qo'llash uchun (ad usum externum) burun ichiga surtilsin."
            },
            notes: "Virusli infeksiyalardan saqlanish uchun profilaktik vosita."
        },
        {
            title: "Shamcha (Rektal Svecha) - Paratsetamol",
            category: "Shamcha / Rektal",
            raw: "Rp.: Supp. Paracetamoli 0,25\n" +
                 "D.t.d. N. 10\n" +
                 "S. Harorat 38.5 dan oshganda 1 shamchadan to'g'ri ichakka (p/r).",
            explanation: {
                line1: "Rp. Supp. Paracetamoli 0.25: 0.25 grammli Paratsetamol shamchasidan oling.",
                line2: "D.t.d. N. 10: Shunday dozadan 10 dona berilsin.",
                line3: "S.: Bolada tana harorati ko'tarilganda to'g'ri ichakka (per rectum) qo'yilsin."
            },
            notes: "Bolalarda isitmani tez va xavfsiz tushirish uchun qulay shakl."
        }
    ],

    // 6. Lotin Alifbosi va Tibbiyotda O'qilish Qoidalari
    phonetics: [
        {
            letter: "C c",
            rule: "E, I, Y, AE, OE harflaridan oldin [TS] deb, qolgan hollarda (A, O, U va undoshlar oldida) [K] deb o'qiladi.",
            examples: [
                { lat: "Cito", trans: "[Tsito]", uz: "Tezda" },
                { lat: "Centrum", trans: "[Tsentrum]", uz: "Markaz" },
                { lat: "Cor", trans: "[Kor]", uz: "Yurak" },
                { lat: "Caput", trans: "[Kaput]", uz: "Bosh" }
            ]
        },
        {
            letter: "CH ch",
            rule: "Yunoncha so'zlarda uchraydi va o'zbek tilidagi [X] kabi o'qiladi.",
            examples: [
                { lat: "Charta", trans: "[Xarta]", uz: "Qog'oz" },
                { lat: "Chirurgia", trans: "[Xirurgiya]", uz: "Jarrohlik" },
                { lat: "Cholera", trans: "[Xolera]", uz: "Vabo" }
            ]
        },
        {
            letter: "PH ph",
            rule: "Yunoncha so'zlarda uchraydi va o'zbek tilidagi [F] kabi talaffuz qilinadi.",
            examples: [
                { lat: "Pharmacia", trans: "[Farmatsiya]", uz: "Dorishunoslik" },
                { lat: "Phosphorus", trans: "[Fosforus]", uz: "Fosfor" },
                { lat: "Pharynx", trans: "[Farinks]", uz: "Halqum" }
            ]
        },
        {
            letter: "TH th",
            rule: "Yunoncha so'zlarda [T] deb o'qiladi.",
            examples: [
                { lat: "Therapia", trans: "[Terapiya]", uz: "Davolash" },
                { lat: "Thorax", trans: "[Toraks]", uz: "Ko'krak qafasi" }
            ]
        },
        {
            letter: "RH rh",
            rule: "Yunoncha so'zlarda [R] deb o'qiladi.",
            examples: [
                { lat: "Rheumatismus", trans: "[Revmatizmus]", uz: "Bo'g'im kasalligi" },
                { lat: "Rhinitis", trans: "[Rinitis]", uz: "Burun shamollashi (tumov)" }
            ]
        },
        {
            letter: "TI ti",
            rule: "Unli harfdan oldin kelsa [TSI] deb o'qiladi. Agar undan oldin S, T, X kelsa, [TI] saqlanib qoladi.",
            examples: [
                { lat: "Solutio", trans: "[Solyutsio]", uz: "Eritma" },
                { lat: "Injectio", trans: "[Inyeksio]", uz: "In'yeksiya, ukol" },
                { lat: "Mixtio", trans: "[Mikstio]", uz: "Aralashma (S dan keyin bo'lgani uchun [ti])" }
            ]
        },
        {
            letter: "S s",
            rule: "Odatda [S] o'qiladi. Lekin ikki unli orasida kelsa [Z] deb talaffuz etiladi.",
            examples: [
                { lat: "Dosis", trans: "[Dozis]", uz: "Doza (ikki unli orasida)" },
                { lat: "Nervus", trans: "[Nervus]", uz: "Nerv, asab" }
            ]
        },
        {
            letter: "AE va OE",
            rule: "Ushbu diftonglar odatda [E] kabi o'qiladi.",
            examples: [
                { lat: "Aegrota", trans: "[Egrota]", uz: "Bemor ayol" },
                { lat: "Oedema", trans: "[Edema]", uz: "Shish, suyuqlik to'planishi" }
            ]
        }
    ],

    // 7. Tibbiy Viktorina / Test (Quiz)
    quizzes: [
        {
            q: "Shifokor retseptidagi 'Rp.:' nimani anglatadi?",
            options: ["Oling (Recipe)", "Bemor nomi", "Dorixona manzili", "Tezda yuborilsin"],
            correct: 0,
            desc: "'Rp.' bu lotincha 'Recipe' (Ol, qabul qil) so'zining qisqartmasi bo'lib, har bir retsept shu so'z bilan boshlanadi."
        },
        {
            q: "'D.t.d. N. 10 in tab.' yozuvining ma'nosi nima?",
            options: [
                "10 kundan keyin qaytilsin",
                "Shunday dozadan 10 dona tabletkada berilsin",
                "10 ml eritma tayyorlansin",
                "10 mahal ichilsin"
            ],
            correct: 1,
            desc: "Da (Dentur) tales doses numero 10 in tabulettis - Shunday dozadan 10 ta tabletkada berilsin degani."
        },
        {
            q: "Tibbiy tashxisdagi '-itis' (masalan: Gastritis, Bronchitis) qo'shimchasi nimani bildiradi?",
            options: ["O'sma", "Yallig'lanish", "Jarrohlik kesmasi", "Falajlik"],
            correct: 1,
            desc: "Lotin va yunon tibbiyotida '-itis' har doim a'zoning yallig'lanish jarayonini bildiradi."
        },
        {
            q: "'t.i.d.' yoki 'ter in die' qisqartmasi dorini qanday ichishni bildiradi?",
            options: ["Kuniga 1 marta", "Kuniga 2 marta", "Kuniga 3 marta", "Uyqudan oldin"],
            correct: 2,
            desc: "'Ter in die' lotinchadan 'Kuniga 3 marta' deb tarjima qilinadi."
        },
        {
            q: "'Appendectomia' so'zidagi '-ectomia' nimani bildiradi?",
            options: ["Jarrohlik yo'li bilan kesib olib tashlash", "Yallig'lanish", "Og'riq hissi", "Kamera bilan tekshirish"],
            correct: 0,
            desc: "'-ectomia' - a'zoni to'liq olib tashlash operatsiyasi (masalan, appendiksni kesib tashlash)."
        },
        {
            q: "Dorini 'i/m' yuborish ko'rsatmasi nimani bildiradi?",
            options: ["Vena ichiga", "Mushak ichiga (intra musculum)", "Teri ostiga", "Og'iz orqali"],
            correct: 1,
            desc: "'intra musculum' - mushak ichiga ukol qilish deganidir."
        },
        {
            q: "'Cito!' belgisi retseptda ko'rinsa nimani bildiradi?",
            options: ["Ehtiyotkorlik bilan", "Kechqurun ichilsin", "Tezda! (Shoshilinch)", "Tashqi qo'llash uchun"],
            correct: 2,
            desc: "'Cito!' lotinchada 'Tezda!' degani bo'lib, dorixonachi dorini navbatsiz shoshilinch tayyorlab berishi shartligini anglatadi."
        },
        {
            q: "O'zbek tilida 'Gaster' va 'Hepar' a'zolari mos ravishda qaysilar?",
            options: ["Yurak va O'pka", "Oshqozon va Jigar", "Buyrak va Miya", "Ichak va Taloq"],
            correct: 1,
            desc: "Gaster - oshqozon, Hepar - jigar hisoblanadi."
        }
    ],

    // 8. Shifokorlar Eng Ko'p Qo'yadigan Klinik Tashxislar Bazasi (100+ Diagnoses)
    clinicalDiagnoses: [
        // Hazm a'zolari
        {
            id: "gastritis",
            lat: "Gastritis chronica / acuta",
            uz: "Surunkali yoki o'tkir gastrit",
            ru: "Хронический или острый гастрит",
            abbr: "XG / OG",
            category: "Hazm a'zolari",
            organ: "Oshqozon (Gaster)",
            plainExplain: "Oshqozon shilliq qavatining yallig'lanishi. Noto'g'ri ovqatlanish, stress, spirtli ichimliklar yoki Helicobacter pylori bakteriyasi tufayli kelib chiqadi.",
            symptoms: "Ovqatdan keyin to'sh ostida og'riq, qorin dam bo'lishi, ko'ngil aynishi, jig'ildon qaynashi (kekirish).",
            doctor: "Gastroenterolog, Terapevt",
            urgency: "Rejali davolanish",
            keywords: ["gastrit", "gastritis", "oshqozon", "гастрит", "oshqozon shamollashi", "xronik gastrit", "surunkali gastrit", "eroziv gastrit"]
        },
        {
            id: "ulcus-ventriculi",
            lat: "Ulcus ventriculi et duodeni",
            uz: "Oshqozon va 12 barmoqli ichak yarasi (Yazva)",
            ru: "Язвенная болезнь желудка и 12-перстной кишки",
            abbr: "YaBJ / Yazva",
            category: "Hazm a'zolari",
            organ: "Oshqozon va o'n ikki barmoqli ichak",
            plainExplain: "Oshqozon yoki 12 barmoqli ichak devorida yara hosil bo'lishi. Kuchli kislotalilik yoki bakteriya oqibatida shilliq qavat zararlanadi.",
            symptoms: "Och qolganda yoki kechasi kuchayadigan o'tkir og'riq, qora rangli axlat, jig'ildon qaynashi, qusish.",
            doctor: "Gastroenterolog, Jarroh (Xirurg)",
            urgency: "Tezkor tekshiruv (og'ir xurujda shoshilinch)",
            keywords: ["yazva", "yara", "ulcus", "oshqozon yarasi", "duodeni", "yazvennaya bolezn", "язва"]
        },
        {
            id: "cholecystitis",
            lat: "Cholecystitis chronica (calculosa)",
            uz: "Surunkali xoletsistit (O't pufagi toshli yallig'lanishi)",
            ru: "Хронический калькулезный холецистит",
            abbr: "XX / XBX",
            category: "Hazm a'zolari",
            organ: "O't pufagi (Vesica biliaris)",
            plainExplain: "O't pufagining yallig'lanishi va ko'pincha unda toshlar (kalkulyoz) hosil bo'lishi. Yog'li va qovurilgan ovqatlar o't dimlanishini keltirib chiqaradi.",
            symptoms: "O'ng qovurg'a ostida simillovchi yoki sanchuvchi og'riq, og'izda achchiq ta'm, ko'ngil aynishi.",
            doctor: "Gastroenterolog, Jarroh (agar tosh bo'lsa)",
            urgency: "Rejali (o't xurujida shoshilinch)",
            keywords: ["xoletsistit", "cholecystitis", "o't pufagi", "холецистит", "o't toshi", "kalkulyoz", "jigar", "o'ng qovurg'a"]
        },
        {
            id: "pancreatitis",
            lat: "Pancreatitis acuta / chronica",
            uz: "O'tkir yoki surunkali pankreatit",
            ru: "Острый или хронический панкреатит",
            abbr: "OP / XP",
            category: "Hazm a'zolari",
            organ: "Oshqozon osti bezi (Pancreas)",
            plainExplain: "Oshqozon osti bezining yallig'lanishi. Fermentlar bezning o'zini hazm qila boshlaganda yuzaga keladi. O'ta xavfli kasallik.",
            symptoms: "Qorin yuqorisida va belga tarqaluvchi (kamar shaklidagi) chidab bo'lmas kuchli og'riq, to'xtovsiz qusish.",
            doctor: "Jarroh, Gastroenterolog",
            urgency: "O'tkir turida darhol shoshilinch tez yordam!",
            keywords: ["pankreatit", "pancreatitis", "панкреатит", "oshqozon osti bezi", "bel og'rig'i", "kamar og'riq"]
        },
        {
            id: "appendicitis",
            lat: "Appendicitis acuta",
            uz: "O'tkir appenditsit (Ko'richak o'simtasi yallig'lanishi)",
            ru: "Острый аппендицит",
            abbr: "OA",
            category: "Hazm a'zolari",
            organ: "Ko'richak appendiksi (Appendix)",
            plainExplain: "Ko'richak chuvalchangsimon o'simtasining to'satdan yallig'lanishi. Qorin pardasiga yorilib ketmasligi uchun shoshilinch operatsiya talab etiladi.",
            symptoms: "Dastlab kindik atrofida boshlanib, keyin o'ng yonboshga tushadigan kuchli og'riq, harorat ko'tarilishi, ko'ngil aynishi.",
            doctor: "Shoshilinch jarroh (Xirurg)",
            urgency: "Zudlik bilan tez yordam va operatsiya!",
            keywords: ["appenditsit", "appendicitis", "ko'richak", "аппендицит", "o'tkir qorin"]
        },
        {
            id: "hepatitis",
            lat: "Hepatitis chronica (viralis B, C)",
            uz: "Surunkali gepatit (Virusli jigar yallig'lanishi)",
            ru: "Хронический гепатит В, С",
            abbr: "GVB / GVC",
            category: "Hazm a'zolari",
            organ: "Jigar (Hepar)",
            plainExplain: "Jigar to'qimalarining virus, dori yoki spirt ta'sirida yallig'lanishi va zararlanishi. Vaqtida davolanmasa sirrozga o'tishi mumkin.",
            symptoms: "Doimiy holsizlik, terining va ko'z oqining sarg'ayishi, o'ng qovurg'a ostida og'irlik, ishtaha yo'qolishi.",
            doctor: "Infeksionist, Gepatolog",
            urgency: "Rejali laboratoriya tahlili va davolanish",
            keywords: ["gepatit", "hepatitis", "jigar", "гепатит", "sariq kasal", "jigar shamollashi", "gepatit b", "gepatit c"]
        },
        {
            id: "cirrhosis",
            lat: "Cirrhosis hepatis",
            uz: "Jigar sirrozi",
            ru: "Цирроз печени",
            abbr: "CP",
            category: "Hazm a'zolari",
            organ: "Jigar (Hepar)",
            plainExplain: "Jigar hujayralarining nobud bo'lib, o'rnini chandiqli biriktiruvchi to'qima egallashi va jigar yetishmovchiligi kelib chiqishi.",
            symptoms: "Qorinda suyuqlik to'planishi (astsit), oyoqlar shishi, qon ketishga moyillik, qattiq ozib ketish.",
            doctor: "Gepatolog, Gastroenterolog",
            urgency: "Doimiy shifokor nazorati va statsionar davo",
            keywords: ["sirroz", "cirrhosis", "цирроз", "jigar sirrozi", "astsit"]
        },
        {
            id: "steatosis",
            lat: "Steatosis hepatis (Hepatos)",
            uz: "Yog'li gepatoz (Jigar yog' bosishi)",
            ru: "Жировой гепатоз печени",
            abbr: "NAJBP",
            category: "Hazm a'zolari",
            organ: "Jigar (Hepar)",
            plainExplain: "Jigar to'qimasida ortiqcha yog' tomchilarining to'planishi. Odatda ortiqcha vazn, diabet yoki noto'g'ri ovqatlanish sabab bo'ladi.",
            symptoms: "O'ng qovurg'a ostida bosim hissi, tez charchash, ko'pincha belgisiz kechadi.",
            doctor: "Terapevt, Gepatolog",
            urgency: "Parhez va turmush tarzini o'zgartirish",
            keywords: ["gepatoz", "steatosis", "гепатоз", "yog' bosishi", "jigar kattalashishi"]
        },
        {
            id: "colitis",
            lat: "Colitis / Enterocolitis",
            uz: "Kolit (Yo'g'on ichak yallig'lanishi)",
            ru: "Колит / Энтероколит",
            abbr: "Kolit",
            category: "Hazm a'zolari",
            organ: "Ichak (Colon / Intestinum)",
            plainExplain: "Yo'g'on ichak shilliq qavatining yallig'lanishi. Ich ketishi yoki qabziyat bilan birga kechadi.",
            symptoms: "Qorinda to'lg'oqsimon og'riqlar, meteorizm (gaz to'planishi), najasda shilliq bo'lishi.",
            doctor: "Gastroenterolog",
            urgency: "Rejali",
            keywords: ["kolit", "colitis", "колит", "ichak", "enterokolit", "diareya", "qabziyat"]
        },
        {
            id: "haemorrhoides",
            lat: "Haemorrhoides",
            uz: "Gemorroy (Bavosil kasalligi)",
            ru: "Геморрой",
            abbr: "Gemorroy",
            category: "Hazm a'zolari",
            organ: "To'g'ri ichak venalari",
            plainExplain: "To'g'ri ichak va orqa chiqaruv teshigi venalarining kengayishi va tugunlar hosil qilishi.",
            symptoms: "Hojat vaqtida qon ketishi, og'riq, qichishish, tugunlarning tashqariga chiqishi.",
            doctor: "Proktolog, Jarroh",
            urgency: "Rejali",
            keywords: ["gemorroy", "bavosil", "геморрой", "to'g'ri ichak", "haemorrhoides"]
        },

        // Yurak-qon tomir tizimi
        {
            id: "hypertonia",
            lat: "Hypertensio arterialis (Morbus hypertonicus)",
            uz: "Arterial gipertoniya (Yuqori qon bosimi kasalligi)",
            ru: "Артериальная гипертензия (Гипертоническая болезнь)",
            abbr: "AG / GB",
            category: "Yurak-qon tomir",
            organ: "Qon tomirlar va yurak",
            plainExplain: "Qon bosimining doimiy ravishda 140/90 mm simob ustunidan yuqori bo'lishi. Insult va infarkt xavfini keskin oshiradi.",
            symptoms: "Ensa (bosh orqa) sohasida og'riq, bosh aylanishi, ko'z oldida miltillashlar, yurak tez urishi.",
            doctor: "Kardiolog, Terapevt",
            urgency: "Doimiy dori ichish va nazorat (krizda shoshilinch)",
            keywords: ["gipertoniya", "hypertensio", "davleniya", "bosim", "гипертония", "qon bosimi", "gipertenziya", "gb"]
        },
        {
            id: "hypotonia",
            lat: "Hypotensio arterialis",
            uz: "Arterial gipotoniya (Past qon bosimi)",
            ru: "Артериальная гипотензия",
            abbr: "Gipotoniya",
            category: "Yurak-qon tomir",
            organ: "Qon tomirlari",
            plainExplain: "Qon bosimining 100/60 mm simob ustunidan pasayib ketishi. Miya va organlarga qon yetib borishi sekinlashadi.",
            symptoms: "Mudroqlik, bosh aylanishi, hushdan ketishga moyillik, tez toliqish.",
            doctor: "Terapevt, Nevropatolog",
            urgency: "Rejali",
            keywords: ["gipotoniya", "past bosim", "hypotensio", "гипотония", "bosim tushishi"]
        },
        {
            id: "infarctus",
            lat: "Infarctus myocardii acutus",
            uz: "O'tkir yurak miokard infarkti",
            ru: "Острый инфаркт миокарда",
            abbr: "OIM / IM",
            category: "Yurak-qon tomir",
            organ: "Yurak mushagi (Myocardium)",
            plainExplain: "Yurak toj tomirining tiqilib qolishi natijasida yurak mushagi bir qismining qonsizlanib nobud bo'lishi (nekroz).",
            symptoms: "Ko'krak qafasi orqasida chap qo'lga, yelkaga tarqaluvchi chidab bo'lmas ezuvchi og'riq, sovuq ter, nafas qisishi.",
            doctor: "Shoshilinch Kardioreanimatsiya",
            urgency: "Zudlik bilan tez yordam (103) chaqirish shart!",
            keywords: ["infarkt", "infarctus", "инфаркт", "yurak xuruji", "miokard", "yurak to'xtashi"]
        },
        {
            id: "ischaemia",
            lat: "Morbus ischaemicus cordis (IBS)",
            uz: "Yurak ishemik kasalligi (YUIK)",
            ru: "Ишемическая болезнь сердца (ИБС)",
            abbr: "YUIK / IBS",
            category: "Yurak-qon tomir",
            organ: "Yurak toj tomirlari",
            plainExplain: "Yurak mushagini qon bilan ta'minlovchi tomirlarning torayishi (ateroskleroz) oqibatida yurakka kislorod yetishmasligi.",
            symptoms: "Jismoniy harakatda ko'krak qisishi, havo yetishmasligi, yurak sohasida bosim.",
            doctor: "Kardiolog",
            urgency: "Doimiy kardiologik nazorat",
            keywords: ["yuik", "ibs", "ishemiya", "ischaemia", "ибс", "yurak ishemiyasi", "yurak kasalligi"]
        },
        {
            id: "angina-pectoris",
            lat: "Angina pectoris (Stenocardia)",
            uz: "Stenokardiya (Ko'krak qisishi / Yurak xuruji)",
            ru: "Стенокардия (Грудная жаба)",
            abbr: "Stenokardiya",
            category: "Yurak-qon tomir",
            organ: "Yurak",
            plainExplain: "YUIK ning asosiy ko'rinishi bo'lib, yurak tomirlari torayishi sababli paydo bo'ladigan xurujli og'riq.",
            symptoms: "Ko'krak to'sh suyagi orqasida 3-5 daqiqa davom etadigan ezuvchi og'riq, nitroglitserin ichilganda o'tib ketadi.",
            doctor: "Kardiolog",
            urgency: "Rejali (xuruj qaytmasa infarkt xavfi)",
            keywords: ["stenokardiya", "angina pectoris", "стенокардия", "ko'krak qisishi", "yurak siqilishi"]
        },
        {
            id: "arrhythmia",
            lat: "Arrhythmia cordis (Fibrillatio atriorum)",
            uz: "Yurak aritmiyasi (Xilpillovchi aritmiya / Taxikardiya)",
            ru: "Аритмия сердца (Мерцательная аритмия)",
            abbr: "Aritmiya",
            category: "Yurak-qon tomir",
            organ: "Yurak o'tkazuvchi tizimi",
            plainExplain: "Yurakning urish ritmi va ketma-ketligining buzilishi (juda tez urish — taxikardiya, juda sekin — bradikardiya yoki tartibsiz urish).",
            symptoms: "Yurakning urib ketishi yoki to'xtab qolayotgandek tuyulishi, bosh aylanishi, holsizlik.",
            doctor: "Kardiolog, Aritmolog",
            urgency: "Rejali yoki shoshilinch (paroksizmda)",
            keywords: ["aritmiya", "arrhythmia", "аритмия", "taxikardiya", "bradikardiya", "yurak o'ynashi"]
        },
        {
            id: "atherosclerosis",
            lat: "Atherosclerosis",
            uz: "Ateroskleroz (Qon tomirlari qotishi va torayishi)",
            ru: "Атеросклероз сосудов",
            abbr: "Ateroskleroz",
            category: "Yurak-qon tomir",
            organ: "Arteriya qon tomirlari",
            plainExplain: "Arteriyalar devorida xolesterin blyashkalari to'planib, tomir teshigini toraytirishi va qon oqimini qiyinlashtirishi.",
            symptoms: "Qaysi a'zo tomiri torayganiga qarab: xotira pasayishi, oyoqlarda og'riq, yurak og'rig'i.",
            doctor: "Kardiolog, Angioxirurg",
            urgency: "Rejali",
            keywords: ["ateroskleroz", "atherosclerosis", "атеросклероз", "xolesterin", "tomir torayishi"]
        },
        {
            id: "varicosis",
            lat: "Varix venarum / Thrombophlebitis",
            uz: "Varikoz (Oyoq venalarining kengayishi va tromboflebit)",
            ru: "Варикозное расширение вен, тромбофлебит",
            abbr: "VRV",
            category: "Yurak-qon tomir",
            organ: "Oyoq venalari",
            plainExplain: "Oyoq venalaridagi klapanlarning ishdan chiqishi tufayli qonning dimlanishi, tomirlarning bo'rtib chiqishi va tugun hosil bo'lishi.",
            symptoms: "Kechqurun oyoqlarda og'irlik, shish, tomir tortishishi, ko'kimtir tomirlar tarmog'i.",
            doctor: "Flebolog, Qon tomir jarrohi",
            urgency: "Rejali (tromb bo'lsa shoshilinch)",
            keywords: ["varikoz", "varix", "варикоз", "tromboflebit", "oyoq shishi", "vena"]
        },

        // Nafas tizimi va o'pka
        {
            id: "bronchitis",
            lat: "Bronchitis acuta / chronica",
            uz: "O'tkir yoki surunkali bronxit",
            ru: "Острый или хронический бронхит",
            abbr: "OB / XB",
            category: "Nafas a'zolari",
            organ: "Bronxlar (Bronchus)",
            plainExplain: "Bronxlar shilliq qavatining yallig'lanishi. Sovuq qotish, viruslar yoki chekish sababli kelib chiqadi.",
            symptoms: "Yo'tal (dastlab quruq, so'ng balg'amli), ko'krakda qirilib og'rish, tana harorati ko'tarilishi.",
            doctor: "Pulmonolog, Terapevt",
            urgency: "Rejali",
            keywords: ["bronxit", "bronchitis", "бронхит", "yo'tal", "balg'am", "o'pka shamollashi"]
        },
        {
            id: "pneumonia",
            lat: "Pneumonia",
            uz: "Zotiljam (O'pka pnevmoniyasi / O'pka shamollashi)",
            ru: "Пневмония (Воспаление легких)",
            abbr: "Pnevmoniya",
            category: "Nafas a'zolari",
            organ: "O'pka to'qimasi (Pulmo)",
            plainExplain: "O'pka alveolalari va to'qimalarining infeksion yallig'lanishi. Gaz almashinuvi buzilib, kislorod yetishmovchiligi vujudga keladi.",
            symptoms: "Yuqori tana harorati (38-39°C), yo'tal, ko'krakda nafas olganda og'riq, hansirash, kuchli terlash.",
            doctor: "Pulmonolog, Terapevt",
            urgency: "Zudlik bilan shifokor ko'rigi va antibiotik davo!",
            keywords: ["pnevmoniya", "pneumonia", "пневмония", "zotiljam", "o'pka shamollashi", "isitma", "rentgen"]
        },
        {
            id: "asthma",
            lat: "Asthma bronchiale",
            uz: "Bronxial astma (Nafas qisishi kasalligi)",
            ru: "Бронхиальная астма",
            abbr: "BA",
            category: "Nafas a'zolari",
            organ: "Bronxlar",
            plainExplain: "Bronxlarning surunkali allergik yallig'lanishi va ularning torayishi (spazm) oqibatida nafas chiqarishning qiyinlashuvi.",
            symptoms: "To'satdan nafas qisishi xuruji, xirillagan hushtaksimon nafas, bo'g'ilish hissi.",
            doctor: "Allergolog, Pulmonolog",
            urgency: "Xurujda shoshilinch ingalyator!",
            keywords: ["astma", "asthma", "астма", "bronxial astma", "nafas qisishi", "bo'g'ilish"]
        },
        {
            id: "copd",
            lat: "Morbus pulmonum obstructivus chronicus (COPD)",
            uz: "Surunkali obstruktiv o'pka kasalligi (XOBK)",
            ru: "Хроническая обструктивная болезнь легких (ХОБЛ)",
            abbr: "XOBK / COPD",
            category: "Nafas a'zolari",
            organ: "O'pka va bronxlar",
            plainExplain: "Uzoq muddat chekish yoki chang nafas olish oqibatida o'pka to'qimasining qaytmas darajada shikastlanishi va torayishi.",
            symptoms: "Doimiy ertalabki balg'amli yo'tal, yurganda kuchayuvchi hansirash.",
            doctor: "Pulmonolog",
            urgency: "Doimiy davolanish",
            keywords: ["xobk", "hobl", "copd", "хобл", "surunkali o'pka", "chekuvchi yo'tali"]
        },
        {
            id: "orvi",
            lat: "Infectio respiratoria viralis acuta",
            uz: "O'RVI / Gripp (O'tkir respirator virusli infeksiya)",
            ru: "ОРВИ / Грипп",
            abbr: "O'RVI / ORVI",
            category: "Nafas a'zolari",
            organ: "Burun, tomoq, yuqori nafas yo'llari",
            plainExplain: "Viruslar chaqiradigan yuqumli mavsumiy kasallik. Burun, tomoq va bronxlarni zararlaydi.",
            symptoms: "Tumov, burun bitishi, tomoq og'rig'i, harorat ko'tarilishi, mushaklarda qaqshash.",
            doctor: "Terapevt, Pediatr",
            urgency: "Uy sharoitida to'shak rejimi",
            keywords: ["orvi", "o'rvi", "gripp", "орви", "shamollash", "tumov", "isitma", "virus"]
        },

        // Buyrak va siydik tizimi
        {
            id: "pyelonephritis",
            lat: "Pyelonephritis acuta / chronica",
            uz: "Piyelonefrit (Buyrak jomi yallig'lanishi)",
            ru: "Острый или хронический пиелонефрит",
            abbr: "OPN / XPN",
            category: "Buyrak va siydik",
            organ: "Buyrak (Ren)",
            plainExplain: "Bakteriyalar keltirib chiqaradigan buyrak to'qimasi va jomchasining yallig'lanishi. Sovuq qotganda kuchayadi.",
            symptoms: "Bel sohasida simillovchi yoki qattiq og'riq, tana harorati (titroq bilan), peshob loyqalanishi.",
            doctor: "Urolog, Nefrolog",
            urgency: "Tezkor antibakterial davo",
            keywords: ["pielonefrit", "pyelonephritis", "пиелонефрит", "buyrak shamollashi", "bel og'rig'i", "peshob"]
        },
        {
            id: "nephrolithiasis",
            lat: "Nephrolithiasis / Urolithiasis (MKB)",
            uz: "Buyrak tosh kasalligi (Urolitiaz)",
            ru: "Мочекаменная болезнь (МКБ)",
            abbr: "MKB",
            category: "Buyrak va siydik",
            organ: "Buyrak va siydik yo'llari",
            plainExplain: "Moddalar almashinuvi buzilishi sababli buyraklarda tuzlar cho'kib, qattiq toshlar paydo bo'lishi.",
            symptoms: "Buyrak sanchig'i (to'satdan tutadigan kuchli chidab bo'lmas bel og'rig'i), peshobda qon ko'rinishi.",
            doctor: "Urolog",
            urgency: "Sanchiqda (kolika) shoshilinch tez yordam!",
            keywords: ["buyrak toshi", "nephrolithiasis", "mkb", "мкб", "tosh kasalligi", "buyrak sanchig'i", "urolitiaz"]
        },
        {
            id: "cystitis",
            lat: "Cystitis acuta",
            uz: "Sistit (Siydik pufagi yallig'lanishi)",
            ru: "Острый цистит",
            abbr: "Sistit",
            category: "Buyrak va siydik",
            organ: "Siydik pufagi (Vesica urinaria)",
            plainExplain: "Siydik pufagi shilliq qavatining infeksion yallig'lanishi. Ko'pincha ayollarda sovuq qotish natijasida yuz beradi.",
            symptoms: "Tez-tez va qattiq achishish bilan peshob qilish, qorin pastida simillovchi og'riq.",
            doctor: "Urolog, Ginekolog",
            urgency: "Rejali",
            keywords: ["sistit", "cystitis", "цистит", "siydik qistashi", "achishish", "peshob achishi"]
        },
        {
            id: "prostatitis",
            lat: "Prostatitis chronica / acuta",
            uz: "Prostatit (Prostata bezi yallig'lanishi)",
            ru: "Простатит",
            abbr: "Prostatit",
            category: "Buyrak va siydik",
            organ: "Prostata bezi",
            plainExplain: "Erkaklarda prostata bezining shamollashi va shishi. Siydik chiqishi buzilishiga olib keladi.",
            symptoms: "Chov va oraliq sohasida og'riq, peshob oqimining sustligi, tez-tez tunda hojatga chiqish.",
            doctor: "Urolog, Androlog",
            urgency: "Rejali",
            keywords: ["prostatit", "prostatitis", "простатит", "prostata", "erkaklar kasalligi"]
        },

        // Asab tizimi
        {
            id: "stroke",
            lat: "Accidens cerebrovascularis / Apoplexia (ONMK)",
            uz: "Bosh miya qon aylanishining o'tkir buzilishi (Insult)",
            ru: "Острое нарушение мозгового кровообращения (ОНМК, Инсульт)",
            abbr: "ONMK / Insult",
            category: "Asab tizimi",
            organ: "Bosh miya (Cerebrum)",
            plainExplain: "Miya qon tomirining tiqilib qolishi (ishemik) yoki yorilishi (gemorragik) oqibatida miya to'qimasining zararlanishi.",
            symptoms: "Yuz qiyshayishi, bir tomonlama qo'l-oyoq harakatsizligi (falaj), nutq yo'qolishi yoki tushunarsiz gapirish.",
            doctor: "Shoshilinch Nevrologiya / Reanimatsiya",
            urgency: "Darhol 103! Dastlabki 4.5 soat (oltin vaqt) ichida yetkazish zarur!",
            keywords: ["insult", "onmk", "онмк", "инсульт", "falaj", "nutq buzilishi", "miya qon quyilishi"]
        },
        {
            id: "osteochondrosis",
            lat: "Osteochondrosis vertebralis",
            uz: "Umurtqa osteoxondrozi (Bo'yin, ko'krak, bel)",
            ru: "Остеохондроз позвоночника",
            abbr: "Osteoxondroz",
            category: "Asab tizimi",
            organ: "Umurtqa pog'onasi",
            plainExplain: "Umurtqalararo tog'ay disklarning yemirilib, elastikligini yo'qotishi va nerv tolalarini qisishi.",
            symptoms: "Bel, bo'yin yoki yelkada doimiy og'riq, qo'l yoki oyoqlarning uvishishi, bosh aylanishi.",
            doctor: "Nevropatolog, Vertebrolog",
            urgency: "Rejali",
            keywords: ["osteoxondroz", "osteochondrosis", "остеохондроз", "bel og'rig'i", "bo'yin og'rig'i", "umurtqa"]
        },
        {
            id: "hernia",
            lat: "Hernia disci intervertebralis",
            uz: "Umurtqa diski churrasi (Grija)",
            ru: "Грыжа межпозвоночного диска",
            abbr: "Grija",
            category: "Asab tizimi",
            organ: "Umurtqa diski",
            plainExplain: "Umurtqa diski tolali halqasining yorilib, ichki mag'zining orqa miya nerv kanaliga chiqib nervni qisib qo'yishi.",
            symptoms: "Belda o'tkir og'riq, og'riqning oyoqqa yoki tovoniga tortishi, oyoq kuchsizlanishi.",
            doctor: "Nevropatolog, Neyrojarroh",
            urgency: "MRT tekshiruvi va mutaxassis ko'rigi",
            keywords: ["grija", "churra", "hernia", "грыжа", "disk grijasi", "ishias"]
        },
        {
            id: "neuralgia",
            lat: "Neuralgia",
            uz: "Nevralgiya (Uch shoxli nerv yoki qovurg'alararo nerv og'rig'i)",
            ru: "Невралгия (Тройничного нерва / Межреберная)",
            abbr: "Nevralgiya",
            category: "Asab tizimi",
            organ: "Periferik nervlar",
            plainExplain: "Nerv tolasining shamollashi yoki qisilishi natijasida nerv yo'nalishi bo'ylab paydo bo'ladigan o'tkir og'riq.",
            symptoms: "Elektr toki urgandek to'satdan tutadigan o'tkir, sanchuvchi og'riq.",
            doctor: "Nevropatolog",
            urgency: "Rejali",
            keywords: ["nevralgiya", "neuralgia", "невралгия", "nerv shamollashi", "uch shoxli nerv"]
        },

        // Tayanch-harakat va bo'g'imlar
        {
            id: "arthritis",
            lat: "Arthritis (Rheumatoid arthritis)",
            uz: "Artrit (Bo'g'im yallig'lanishi, Revmatoid artrit)",
            ru: "Артрит / Ревматоидный артрит",
            abbr: "RA",
            category: "Tayanch-harakat",
            organ: "Bo'g'imlar (Articulatio)",
            plainExplain: "Bo'g'im shilliq pardasining infeksiya yoki autoimmun mexanizm orqali yallig'lanishi.",
            symptoms: "Bo'g'imning shishishi, qizarishi, qizishi, ertalabki harakat qiyinligi.",
            doctor: "Revmatolog, Artrolog",
            urgency: "Rejali",
            keywords: ["artrit", "arthritis", "артрит", "bo'g'im og'rig'i", "revmatoid", "tizza og'rig'i"]
        },
        {
            id: "arthrosis",
            lat: "Osteoarthrosis / Gonarthrosis / Coxarthrosis",
            uz: "Artroz (Bo'g'im tog'ayining yemirilishi, Gonartroz)",
            ru: "Артроз (Остеоартроз, Гонартроз)",
            abbr: "OA",
            category: "Tayanch-harakat",
            organ: "Bo'g'im tog'ayi",
            plainExplain: "Yosh o'tishi yoki zo'riqish natijasida bo'g'im ichidagi tog'ayning yeyilib yupqalashishi va suyaklar ishqalanishi.",
            symptoms: "Qadam bosganda yoki zinadan tushganda tizzada qisirlash va kuchli og'riq, harakat cheklanishi.",
            doctor: "Travmatolog-ortoped, Revmatolog",
            urgency: "Rejali",
            keywords: ["artroz", "arthrosis", "артроз", "gonartroz", "koksartroz", "tog'ay yemirilishi"]
        },

        // Endokrinologiya
        {
            id: "diabetes",
            lat: "Diabetes mellitus (Typus 1 / 2)",
            uz: "Qandli diabet (1 yoki 2-tur / Qand kasalligi)",
            ru: "Сахарный диабет 1, 2 типа",
            abbr: "SD / QD",
            category: "Endokrin tizim",
            organ: "Oshqozon osti bezi va moddalar almashinuvi",
            plainExplain: "Organizmda insulin yetishmovchiligi yoki hujayralarning unga sezgirligi pasayishi sababli qondagi shakar (glyukoza) miqdorining ko'payishi.",
            symptoms: "Doimiy chanqash, og'iz qurishi, tez-tez ko'p peshob ajralishi, ko'rish pasayishi, holsizlik.",
            doctor: "Endokrinolog",
            urgency: "Muntazam qand miqdorini nazorat qilish va davolanish",
            keywords: ["diabet", "diabetes", "диабет", "qandli diabet", "saxar", "shakar kasalligi", "insulin"]
        },
        {
            id: "thyroid",
            lat: "Hypothyreosis / Hyperthyreosis (Goiter)",
            uz: "Gipotireoz / Gipertireoz (Bo'qoq / Qalqonsimon bez kasalligi)",
            ru: "Гипотиреоз / Гипертиреоз (Зоб)",
            abbr: "AIT / Bo'qoq",
            category: "Endokrin tizim",
            organ: "Qalqonsimon bez (Glandula thyroidea)",
            plainExplain: "Qalqonsimon bez gormonlarining me'yordan kamayib ketishi (gipotireoz) yoki haddan tashqari ko'payishi (gipertireoz / tireotoksikoz).",
            symptoms: "Bo'yinda shish, yurak tez urishi yoki sekinlashishi, vazn keskin o'zgarishi, asabiylashish yoki sustlik.",
            doctor: "Endokrinolog",
            urgency: "Rejali gormon tahlili",
            keywords: ["bo'qoq", "gipotireoz", "gipertireoz", "зоб", "гипотиреоз", "qalqonsimon bez", "yod"]
        },

        // LOR va Yuqori nafas yo'llari
        {
            id: "sinusitis",
            lat: "Sinusitis maxillaris (Highmoritis)",
            uz: "Gaymorit (Yuqori jag' bo'shlig'i yallig'lanishi)",
            ru: "Гайморит (Верхнечелюстной синусит)",
            abbr: "Gaymorit",
            category: "LOR a'zolari",
            organ: "Burun yondosh bo'shliqlari",
            plainExplain: "Burun yoni gaymor bo'shlig'ining yiringli yoki shilliqli shamollashi. Burun bitishi oqibatida havo aylanmay qoladi.",
            symptoms: "Ko'z osti va peshonada og'irlik, boshni engashtirganda kuchayuvchi og'riq, burundan quyuq ajralma kelishi.",
            doctor: "LOR (Otorinolaringolog)",
            urgency: "Rejali",
            keywords: ["gaymorit", "sinusitis", "гайморит", "burun", "sinusit", "peshona og'rig'i"]
        },
        {
            id: "otitis",
            lat: "Otitis media",
            uz: "Otit (O'rta quloq yallig'lanishi)",
            ru: "Отит (Воспаление среднего уха)",
            abbr: "Otit",
            category: "LOR a'zolari",
            organ: "Quloq (Auris)",
            plainExplain: "Quloq nog'ora pardasi va o'rta quloq bo'shlig'ining infeksion yallig'lanishi. Ko'pincha tumov asorati sifatida rivojlanadi.",
            symptoms: "Quloqda sanchuvchi, qizdiruvchi o'tkir og'riq, eshitish pasayishi, yiring oqishi.",
            doctor: "LOR shifokori",
            urgency: "Tezkor shifokor ko'rigi",
            keywords: ["otit", "otitis", "отит", "quloq og'rig'i", "quloq shamollashi"]
        },
        {
            id: "tonsillitis",
            lat: "Tonsillitis acuta (Angina)",
            uz: "Angina (O'tkir tonzillit / Tomoq bodomcha bezlari yallig'lanishi)",
            ru: "Ангина (Острый тонзиллит)",
            abbr: "Angina",
            category: "LOR a'zolari",
            organ: "Tomoq murtaklari (Tonsilla)",
            plainExplain: "Tomoqdagi bodomchasimon bezlarning streptokokk bakteriyasi tufayli yiringlab yallig'lanishi. Yurak va bo'g'imga asorat berishi mumkin.",
            symptoms: "Yutinganda tomoqda qattiq og'riq, yuqori harorat (38-40°C), bezlarda oq karash yoki yiringli nuqtalar.",
            doctor: "LOR, Terapevt, Infeksionist",
            urgency: "To'liq antibiotik kursi zarur",
            keywords: ["angina", "tonzillit", "tonsillitis", "ангина", "tomoq og'rig'i", "murtak", "yiring"]
        },

        // Ko'z, Qon va Teri
        {
            id: "anemia",
            lat: "Anaemia (Deficientia ferri)",
            uz: "Temir tanqisligi anemiyasi (Kamqonlik)",
            ru: "Железодефицитная анемия (Малокровие)",
            abbr: "TTA / Anemiya",
            category: "Qon tizimi",
            organ: "Qon va suyak iligi",
            plainExplain: "Qondagi gemoglobin va qizil qon tanachalari (eritrotsitlar) miqdorining kamayib ketishi. To'qimalarga kislorod yetishmaydi.",
            symptoms: "Tez toliqish, bosh aylanishi, soch to'kilishi, rang oqarishi, tirnoqlarning sinishi.",
            doctor: "Gematolog, Terapevt",
            urgency: "Rejali tahlil va temir preparatlari",
            keywords: ["anemiya", "anaemia", "анемия", "kamqonlik", "gemoglobin", "temir moddasi"]
        },
        {
            id: "conjunctivitis",
            lat: "Conjunctivitis",
            uz: "Kon'yunktivit (Ko'z shilliq pardasi shamollashi)",
            ru: "Конъюнктивит",
            abbr: "Konyunktivit",
            category: "Ko'z kasalliklari",
            organ: "Ko'z (Oculus)",
            plainExplain: "Ko'z oqi va qovoq ichki pardasining virus, bakteriya yoki allergiya ta'sirida qizarib yallig'lanishi.",
            symptoms: "Ko'z qizarishi, qichishishi, ko'zdan yosh oqishi, ertalab qovoqlarning yopishib qolishi.",
            doctor: "Oftalmolog (Ko'z shifokori)",
            urgency: "Rejali",
            keywords: ["konyunktivit", "conjunctivitis", "конъюнктивит", "ko'z qizarishi", "ko'z shamollashi"]
        },
        {
            id: "dermatitis",
            lat: "Dermatitis / Eczema / Psoriasis",
            uz: "Dermatit / Ekzema / Psoriaz (Teri kasalliklari)",
            ru: "Дерматит / Экзема / Псориаз",
            abbr: "Dermatit",
            category: "Teri kasalliklari",
            organ: "Teri (Cutis)",
            plainExplain: "Terining allergik yoki surunkali yallig'lanish kasalligi. Qizarish, toshmalar va po'st tashlash bilan kechadi.",
            symptoms: "Terida qizarish, qichishish, pufakchalar yoki kumushrang qipiqli tangachalar paydo bo'lishi.",
            doctor: "Dermatolog, Allergolog",
            urgency: "Rejali",
            keywords: ["dermatit", "dermatitis", "дерматит", "ekzema", "psoriaz", "qichima", "teri toshmasi"]
        },

        // Yuqumli va Virusli Kasalliklar (Infeksionist & OITS / SPID)
        {
            id: "oits-spid",
            lat: "Syndroma immunodeficientiae acquisita (HIV / AIDS)",
            uz: "OITS — Ortirilgan Immunitet Tanqisligi Sindromi (SPID / OIV)",
            ru: "СПИД — Синдром приобретенного иммунодефицита (ВИЧ-инфекция)",
            abbr: "OITS / SPID / OIV / HIV / AIDS",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Immun tizimi (CD4 T-limfotsitlar) va barcha ichki a'zolar",
            plainExplain: "OITS (ruscha SPID, xalqaro AIDS) — OIV (Odam Immunitet Tanqisligi Virusi / HIV) qo'zg'atadigan surunkali infeksiyaning eng og'ir oxirgi bosqichidir. Ushbu virus insonning himoya qo'rg'oni bo'lgan qon hujayralari (CD4 T-limfotsitlar)ni parchalaydi. Oqibatda organizm oddiy shamollash yoki mayda mikroblarga ham qarshilik qila olmay qoladi va turli xavfli yondosh kasalliklar (pnevmoniya, sil, o'smalar) rivojlanadi.",
            transmission: "Faqat 3 xil yo'l bilan yuqadi: 1) Qon orqali (steril bo'lmagan shprits, tatuirovka, manikyur asboblari, qon quyish); 2) Himoyalanmagan jinsiy aloqa orqali; 3) Homiladorlik, tug'ruq yoki emizish davrida zararlangan onadan bolaga. MAISHIY YO'L BILAN (qo'l berib ko'rishish, bir idishdan ovqatlanish, quchoqlashish, yo'talish, basseynda cho'milish, chivin chaqishi orqali) ASLO YUQMAYDI!",
            symptoms: "Dastlab yillar davomida hech qanday belgisiz (yashirin) kechishi mumkin. Keyin: sababsiz uzoq vaqt harorat ko'tarilishi (37-38°C), doimiy holsizlik, tunda kuchli terlash, sababsiz keskin ozib ketish (tana vaznining 10% dan ortig'i yo'qolishi), bo'yin va chov limfa bezlarining kattalashishi, 1 oydan ortiq davom etuvchi ich ketishi (diareya), og'izda oq karash (molochnitsa / kandidoz).",
            doctor: "OITSga qarshi kurashish markazi (SPID-markaz), Vrach-infeksionist, Immunolog",
            treatment: "Maxsus Antiretrovirus Terapiya (ARVT) dorilari qabul qilinadi. Dori vositalari har bir viloyat OITS markazlarida davlat tomonidan BEPUL beriladi. ARVT virus ko'payishini to'liq to'xtatib, qondagi virus miqdorini aniqlanmaydigan darajaga tushiradi. Natijada bemor boshqalarga virus yuqtirmaydi va sog'lom insonlardek uzoq, baxtli umr ko'radi.",
            urgency: "Zudlik bilan viloyat OITS markazida anonim qon tahlili (IFA/PSR) topshirish!",
            keywords: ["oits", "spid", "oiv", "hiv", "aids", "vich", "спид", "вич", "immunitet tanqisligi", "oits markazi", "spid sentr", "virus", "yuqumli", "qon orqali"]
        },
        {
            id: "tuberculosis",
            lat: "Tuberculosis pulmonum (TBC)",
            uz: "Sil kasalligi (Tuberkulyoz / O'pka sili)",
            ru: "Туберкулез легких (ТБЦ, палочка Коха)",
            abbr: "Sil / TBC / TB",
            category: "Yuqumli va virusli kasalliklar",
            organ: "O'pka to'qimasi, limfa bezlari, suyaklar",
            plainExplain: "Sil — Kox tayoqchasi (Mycobacterium tuberculosis) bakteriyasi chaqiradigan yuqumli surunkali kasallik. Ko'pincha o'pkani zararlaydi, lekin suyak, buyrak va boshqa a'zolarda ham uchrashi mumkin. Vaqtida aniqlansa to'liq davolanadi.",
            transmission: "Havo-tomchi yo'li bilan (bemor yo'talganda, aksirganda yoki gaplashganda havoga tarqalgan mikroblarni nafas orqali yutganda).",
            symptoms: "3 haftadan ortiq davom etuvchi yo'tal, balg'amda qon izlari (qon tuflash), kechki payt haroratning 37.2-37.5°C gacha ko'tarilishi, tunda bo'yin va ko'krakning kuchli terlashishi, ishtaha yo'qolishi va ozib ketish.",
            doctor: "Ftiziatr (Sil shifokori), Pulmonolog",
            treatment: "Maxsus silga qarshi dorilar (Izoniazid, Rifampitsin, Pirazinamid, Etambutol) 6-9 oy davomida to'xtovsiz qabul qilinadi. Barcha dorilar davlat tomonidan bepul ta'minlanadi.",
            urgency: "Fluorografiya / Rentgen va balg'am tahlili (GenXpert) topshirish shart!",
            keywords: ["sil", "tuberkulyoz", "tbc", "туберкулез", "kox tayoqchasi", "ftiziatr", "o'pka sili", "yo'tal", "qon tuflash"]
        },
        {
            id: "covid19",
            lat: "Infectio Coronaviralis (COVID-19 / SARS-CoV-2)",
            uz: "Koronavirus infeksiyasi (COVID-19)",
            ru: "Коронавирусная инфекция (КОВИД-19)",
            abbr: "COVID-19 / SARS",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Nafas yo'llari, o'pka, qon tomirlar",
            plainExplain: "SARS-CoV-2 koronavirusi keltirib chiqaradigan o'tkir virusli nafas yo'li kasalligi. Tomir devorlarini zararlab, qon quyilishiga (tromboz) va virusli pnevmoniyaga sabab bo'lishi mumkin.",
            transmission: "Havo-tomchi yo'li bilan, bemor bilan yaqin muloqotda bo'lganda.",
            symptoms: "Tana harorati ko'tarilishi, quruq yo'tal, hid va ta'm bilishning yo'qolishi (anosmiya), kuchli holsizlik, hansirash.",
            doctor: "Infeksionist, Terapevt, Pulmonolog",
            treatment: "Antivirus preparatlar, qon suyultiruvchi vositalar (antikoagulyantlar), kislorod terapiyasi.",
            urgency: "PZR test va pulsoksimetrda kislorod (SpO2) nazorati!",
            keywords: ["covid", "kovid", "koronavirus", "коронавирус", "covid-19", "sars", "hid bilmaslik"]
        },
        {
            id: "syphilis",
            lat: "Syphilis (Lues)",
            uz: "Zaxm (Sifilis / Lues)",
            ru: "Сифилис (Люэс)",
            abbr: "RW / Lues",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Jinsiy a'zolar, teri, asab tizimi, yurak",
            plainExplain: "Oqish treponema (Treponema pallidum) bakteriyasi chaqiradigan surunkali tanosil (jinsiy) kasalligi. Davolanmasa suyak, miya va yurakni yemiradi.",
            transmission: "Himoyalanmagan jinsiy aloqa, qon orqali va onadan homilaga.",
            symptoms: "1-bosqichda: jinsiy a'zolarda og'riqsiz qattiq yara (qattiq shankr); 2-bosqichda: butun tanaga pushti toshmalar toshishi, soch to'kilishi; 3-bosqichda: a'zolarning parchalanishi.",
            doctor: "Dermatovenerolog",
            treatment: "Penitsillin guruhi antibiotiklari bilan maxsus sxema bo'yicha to'liq davolanadi.",
            urgency: "Venerolog ko'rigi va Vasserman reaksiyasi (RW/IFA) topshirish!",
            keywords: ["sifilis", "zaxm", "lues", "сифилис", "shankr", "rw", "venerolog", "tanosil"]
        },
        {
            id: "botulism",
            lat: "Botulismus",
            uz: "Botulizm (Konserva zaharlanishi / O'lim xavfi yuqori)",
            ru: "Ботулизм",
            abbr: "Botulizm",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Asab tizimi, nafas mushaklari",
            plainExplain: "Uy sharoitida tayyorlangan konserva (pomidor, bodring, qo'ziqorin)larda havosi yo'q muhitda Clostridium botulinum bakteriyasi ishlab chiqaradigan dunyodagi eng kuchli botulotoksin zahari chaqiradigan o'limli zaharlanish.",
            transmission: "Uyda tayyorlangan buzilgan, qopqog'i ko'tarilgan konservalarni iste'mol qilish orqali.",
            symptoms: "Ko'z oldi xiralashishi, narsalar ikkita bo'lib ko'rinishi (diplopiya), qovoqlar osilib qolishi (ptoz), tomoq qaqrab yutinish va gapirish qiyinlashishi, nafas to'xtashi.",
            doctor: "Shoshilinch Toksikologiya va Reanimatsiya",
            treatment: "Zudlik bilan botulizmga qarshi maxsus zardob (antitoksin) yuborish, oshqozonni yuvish.",
            urgency: "Zudlik bilan tez yordam (103)! Kechikish o'limga olib keladi!",
            keywords: ["botulizm", "botulismus", "ботулизм", "konserva", "zaharlanish", "ko'z ikkita ko'rinishi", "zahar"]
        },
        {
            id: "helminthiasis",
            lat: "Helminthiasis (Ascaridosis, Enterobiosis)",
            uz: "Gelmintoz (Gijja kasalliklari / Askaridoz, Ostritsa)",
            ru: "Гельминтоз (Глисты, Аскаридоз, Энтеробиоз)",
            abbr: "Gijja",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Oshqozon-ichak trakti, jigar",
            plainExplain: "Ichakda va tana a'zolarida parazit qurtlar (askarida, ostritsa, gijja) yashashi. Organizm ozuqasini so'rib, zaharli moddalar chiqaradi va allergiyani keltirib chiqaradi.",
            transmission: "Yuvilmagan meva-sabzavotlar, iflos qo'llar, xom suv va uy hayvonlari orqali.",
            symptoms: "Kechasi tish g'ijirlatish, kindik atrofida og'riq, orqa chiqaruv yo'lida qichishish, ishtaha yo'qolishi yoki haddan ortiq yeyish, ko'ngil aynishi.",
            doctor: "Parazitolog, Infeksionist, Pediatr",
            treatment: "Gijjaga qarshi zamonaviy preparatlar (Albendazol, Mebendazol, Pirantel). Butun oila a'zolari bir vaqtda davolanishi shart.",
            urgency: "Najas tahlili va dori ichish",
            keywords: ["gijja", "gelmintoz", "askaridoz", "глисты", "parazit", "tish g'ijirlatish", "ichak qurti"]
        },
        {
            id: "echinococcosis",
            lat: "Echinococcosis",
            uz: "Exinokokkoz (Jigar yoki o'pka pufakli qurt kistasi)",
            ru: "Эхинококкоз",
            abbr: "Exinokokk",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Jigar, o'pka, bosh miya",
            plainExplain: "Echinococcus tasmasimon paraziti lichinkalari keltirib chiqaradigan og'ir kasallik. Jigar yoki o'pkada suyuqlik bilan to'lgan parazitar pufaklar (kistalar) hosil bo'ladi va asta-sekin o'sib organ to'qimasini ezadi.",
            transmission: "Itlar bilan aloqada bo'lish, ifloslangan oziq-ovqat va suv orqali tuxumlarini yutib yuborish.",
            symptoms: "Jigar sohasida og'irlik va to'mtoq og'riq, o'pkada bo'lsa yo'tal va qon tuflash. Kista yorilsa kuchli anafilaktik shok va o'lim xavfi.",
            doctor: "Xirurg (Jarroh), Parazitolog",
            treatment: "Jarrohlik yo'li bilan kistani olib tashlash va parazitga qarshi dori (Albendazol) ichish.",
            urgency: "UZI / MRT tekshiruvi va jarroh ko'rigi",
            keywords: ["exinokokk", "echinococcosis", "эхинококкоз", "jigar kistasi", "itdan yuqadigan", "parazit kista"]
        },
        {
            id: "measles",
            lat: "Morbilli",
            uz: "Qizamiq (Kory / O'ta yuqumli virus)",
            ru: "Корь",
            abbr: "Qizamiq",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Nafas yo'llari, teri, ko'z shilliq pardasi",
            plainExplain: "Qizamiq virusi chaqiradigan havoda uchuvchi o'ta yuqumli kasallik. 1 nafar bemor 18 kishiga yuqtirishi mumkin. O'pka va miyaga og'ir asorat berishi bilan xavflidir.",
            transmission: "Havo-tomchi yo'li bilan (bemor xonadan chiqqandan keyin ham havo 2 soatgacha yuqumli bo'lib qoladi).",
            symptoms: "Yuqori tana harorati (39-40°C), qattiq yo'tal, kon'yunktivit (ko'z qizarishi va yorug'likdan qo'rqish), og'iz shilliq qavatida Filatov-Koplik oq dog'lari, 4-kundan boshlab yuzdan boshlanib pastga qarab bosqichma-bosqich toshadigan toshmalar.",
            doctor: "Infeksionist, Pediatr",
            treatment: "To'liq karantin, simptomatik davolash, vitamin A, asoratlarning oldini olish. Eng yaxshi himoya — vaksina (QPM / KPK).",
            urgency: "Izolyatsiya va zudlik bilan shifokor nazorati!",
            keywords: ["qizamiq", "kory", "корь", "morbilli", "toshma", "yuqumli", "isitma", "vaksina"]
        },
        {
            id: "varicella",
            lat: "Varicella",
            uz: "Suvchechak (Vetriyanka / Gerpes virusi)",
            ru: "Ветряная оспа (Ветрянка)",
            abbr: "Vetriyanka",
            category: "Yuqumli va virusli kasalliklar",
            organ: "Teri va shilliq qavatlar",
            plainExplain: "Varicella-Zoster gerpes virusi chaqiradigan o'tkir yuqumli kasallik. Terida qichishuvchi suyuqlikli pufakchalar paydo bo'lishi bilan xarakterlanadi.",
            transmission: "Havo-tomchi yo'li bilan juda oson yuqadi.",
            symptoms: "Isitma, bosh og'rig'i, butun tanada va boshning sochli qismida qattiq qichishuvchi qizil dog'lar, so'ngra ichida tiniq suyuqlik bo'lgan pufakchalar toshishi.",
            doctor: "Pediatr, Infeksionist",
            treatment: "Pufakchalarga antiseptik (kalamin losoni yoki zelenka) surtish, qichishga qarshi antigistamin dorilar.",
            urgency: "Karantin va gigiyena",
            keywords: ["suvchechak", "vetriyanka", "ветрянка", "varicella", "pufakcha", "qichima toshma"]
        }
    ]
};

