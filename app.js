/**
 * Shifokorlar Lotin Tili Dasturi - Asosiy Mantiqiy Qism (Logic & UI)
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initTheme();
    initNavigation();
    initPrescriptionDecoder();
    initDiagnosisExplainer();
    initDictionary();
    initPhonetics();
    initQuiz();
    initPWA();
    initAndroidOptimizations();
    initAuth();
    initSecuritySystem();
    initWelcomeSplash();
}

/* ==========================================================================
   1. THEME (Dark / Light)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('med_latin_theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('med_latin_theme', newTheme);
            updateThemeIcon(newTheme);
            triggerHaptic(15);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

/* ==========================================================================
   2. NAVIGATION (Tabs & Android Bottom Navigation)
   ========================================================================== */
function triggerHaptic(duration = 15) {
    if (window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate(duration); } catch(e){}
    }
}

function switchSection(targetId, updateHistory = true) {
    const allNavBtns = document.querySelectorAll('.nav-tab-btn, .mobile-nav-item');
    const sections = document.querySelectorAll('.app-section');
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    allNavBtns.forEach(btn => {
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
            if (btn.classList.contains('nav-tab-btn')) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        } else {
            btn.classList.remove('active');
        }
    });

    sections.forEach(s => s.classList.remove('active'));
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    triggerHaptic(15);

    if (updateHistory) {
        try {
            history.pushState({ section: targetId }, '', '#' + targetId);
        } catch(e){}
    }
}

function initNavigation() {
    const allNavBtns = document.querySelectorAll('.nav-tab-btn, .mobile-nav-item');

    allNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (targetId) {
                switchSection(targetId, true);
            }
        });
    });

    // Android Hardware / Gesture Back Button handling
    window.addEventListener('popstate', (e) => {
        const targetId = (e.state && e.state.section) || location.hash.replace('#', '') || 'section-decoder';
        switchSection(targetId, false);
    });

    // Handle initial hash link
    if (location.hash) {
        const initialTarget = location.hash.replace('#', '');
        if (document.getElementById(initialTarget)) {
            switchSection(initialTarget, false);
        }
    }
}

/* ==========================================================================
   3. RETSEPT DEKODERI (Prescription Analyzer & Explainer)
   ========================================================================== */
function initPrescriptionDecoder() {
    const input = document.getElementById('prescription-input');
    const analyzeBtn = document.getElementById('analyze-rx-btn');
    const clearBtn = document.getElementById('clear-rx-btn');
    const sampleBtns = document.querySelectorAll('.rx-sample-pill');
    const speakBtn = document.getElementById('speak-rx-btn');
    const copyBtn = document.getElementById('copy-result-btn');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const text = input ? input.value.trim() : '';
            if (!text) {
                showToast("Iltimos, avval retsept matnini kiriting yoki namunani tanlang!", "warning");
                return;
            }
            decodePrescription(text);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (input) input.value = '';
            const resultBox = document.getElementById('rx-result-container');
            if (resultBox) resultBox.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-prescription empty-icon"></i>
                    <h3>Retsept tahlili bu yerda chiqadi</h3>
                    <p>Yuqoriga shifokor retseptini yozing yoki namunaviy tugmalardan birini bosing</p>
                </div>
            `;
        });
    }

    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'), 10);
            const sample = MEDICAL_DATA.presetPrescriptions[index];
            if (sample && input) {
                input.value = sample.raw;
                decodePrescription(sample.raw, sample);
            }
        });
    });

    if (speakBtn) {
        speakBtn.addEventListener('click', () => {
            const text = input ? input.value : '';
            if (text) {
                speakText(text, 'la');
            } else {
                showToast("Talaffuz qilish uchun matn yo'q", "info");
            }
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const resultBox = document.getElementById('rx-result-container');
            if (resultBox && resultBox.innerText) {
                navigator.clipboard.writeText(resultBox.innerText).then(() => {
                    triggerHaptic(20);
                    showToast("Tahlil natijasi nusxalandi!", "success");
                }).catch(() => {
                    showToast("Nusxalashda xatolik yuz berdi", "error");
                });
            }
        });
    }

    // Default: load first preset sample
    if (input && MEDICAL_DATA.presetPrescriptions.length > 0) {
        const first = MEDICAL_DATA.presetPrescriptions[0];
        input.value = first.raw;
        decodePrescription(first.raw, first);
    }
}

let currentAnalyzedRxText = '';
let currentPatientSummaryText = '';

function decodePrescription(text, presetData = null) {
    const resultBox = document.getElementById('rx-result-container');
    if (!resultBox) return;

    currentAnalyzedRxText = text;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsedLines = [];
    const detectedTerms = [];
    let overallPatientSummary = [];

    // Analyze lines
    lines.forEach((line, idx) => {
        const lineAnalysis = analyzeSingleRxLine(line);
        parsedLines.push(lineAnalysis);
        if (lineAnalysis.detectedTerms) {
            detectedTerms.push(...lineAnalysis.detectedTerms);
        }
        if (lineAnalysis.patientNote) {
            overallPatientSummary.push(lineAnalysis.patientNote);
        }
    });

    // Remove duplicates from detected terms
    const uniqueTerms = Array.from(new Set(detectedTerms.map(t => t.abbr || t.lat || t.term)))
        .map(key => detectedTerms.find(t => (t.abbr || t.lat || t.term) === key));

    currentPatientSummaryText = getPlainLanguageSummary(parsedLines, presetData);

    // Render HTML
    let html = `
        <div class="result-card animated-fade-in">
            <div class="result-header">
                <div>
                    <span class="badge badge-success"><i class="fas fa-check-circle"></i> Retsept Muvaffaqiyatli Tahlil Qilindi</span>
                    ${presetData ? `<h3 class="preset-title">${presetData.title}</h3>` : ''}
                </div>
                <div class="result-actions">
                    <button class="btn btn-sm btn-outline" onclick="speakCurrentRx()" title="Lotincha o'qib berish">
                        <i class="fas fa-volume-up"></i> Tinglash
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="copyCurrentRxResult()" title="Nusxalash">
                        <i class="fas fa-copy"></i> Nusxalash
                    </button>
                </div>
            </div>

            <!-- Bemorni Tushunishi Uchun Asosiy Xulosa (Xalq Tili) -->
            <div class="patient-summary-box">
                <div class="summary-icon-box">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <div class="summary-text-box">
                    <h4><i class="fas fa-user-check"></i> Bemor uchun sodda tildagi xulosa:</h4>
                    <p class="summary-lead">${currentPatientSummaryText}</p>
                </div>
            </div>

            <!-- Satrma-Satr Ilmiy va Tibbiy Tahlil -->
            <div class="line-by-line-section">
                <h4 class="section-subtitle"><i class="fas fa-list-ol"></i> Retseptning satrma-satr tahlili:</h4>
                <div class="line-cards-list">
    `;

    parsedLines.forEach((item, i) => {
        html += `
            <div class="line-card">
                <div class="line-card-num">${i + 1}</div>
                <div class="line-card-content">
                    <div class="raw-code"><code>${escapeHtml(item.raw)}</code></div>
                    <div class="line-meaning"><i class="fas fa-arrow-right"></i> <strong>Ma'nosi:</strong> ${item.meaning}</div>
                    ${item.details ? `<div class="line-details-text">${item.details}</div>` : ''}
                </div>
            </div>
        `;
    });

    html += `
                </div>
            </div>

            <!-- Retseptda Qatnashgan Atamalar va Qisqartmalar Kartochkalari -->
            ${uniqueTerms.length > 0 ? `
                <div class="detected-terms-section">
                    <h4 class="section-subtitle"><i class="fas fa-microscope"></i> Aniqlangan tibbiy qisqartmalar va tushunchalar (${uniqueTerms.length}):</h4>
                    <div class="term-chips-grid">
                        ${uniqueTerms.map(t => `
                            <div class="term-chip" onclick="showTermModal('${escapeHtml(t.abbr || t.lat || '')}')">
                                <span class="term-chip-title">${escapeHtml(t.abbr || t.lat || t.term)}</span>
                                <span class="term-chip-trans">${escapeHtml(t.trans || t.uz || '')}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Xavfsizlik va Ehtiyotkorlik Eslatmasi -->
            <div class="safety-warning">
                <i class="fas fa-shield-alt"></i>
                <div>
                    <strong>Muhim eslatma:</strong> Ushbu dastur tibbiy retseptlarni o'rganish va tushunish uchun yordamchi qo'llanmadir. Dorilarni qabul qilishdan oldin davolovchi shifokor yoki provizor (farmatsevt) bilan maslahatlashing.
                </div>
            </div>
        </div>
    `;

    resultBox.innerHTML = html;
}

window.speakCurrentRx = function() {
    if (currentAnalyzedRxText) {
        speakText(currentAnalyzedRxText, 'la');
    }
};

window.copyCurrentRxResult = function() {
    if (!currentAnalyzedRxText) return;
    const textToCopy = `Retsept:\n${currentAnalyzedRxText}\n\nXulosa:\n${currentPatientSummaryText}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        triggerHaptic(20);
        showToast("Tahlil natijasi nusxalandi!", "success");
    }).catch(() => {
        showToast("Nusxalashda xatolik yuz berdi", "error");
    });
};

function analyzeSingleRxLine(line) {
    const lower = line.toLowerCase();
    const detectedTerms = [];
    let meaning = "";
    let details = "";
    let patientNote = "";

    // 1. Recipe / Rp. line
    if (line.startsWith('Rp.') || line.startsWith('Rp:')) {
        detectedTerms.push({ abbr: "Rp.", full: "Recipe", trans: "Oling (Qabul qil)" });
        
        let formMatch = "";
        if (lower.includes('sol.')) {
            formMatch = "Eritma (Solutio)";
            detectedTerms.push({ abbr: "Sol.", trans: "Eritma (Solutio)" });
        } else if (lower.includes('tab.')) {
            formMatch = "Tabletka (Tabuletta)";
            detectedTerms.push({ abbr: "Tab.", trans: "Tabletka (Tabuletta)" });
        } else if (lower.includes('ung.')) {
            formMatch = "Malham / Maz (Unguentum)";
            detectedTerms.push({ abbr: "Ung.", trans: "Malham (Unguentum)" });
        } else if (lower.includes('supp.')) {
            formMatch = "Shamcha / Svecha (Suppositorium)";
            detectedTerms.push({ abbr: "Supp.", trans: "Shamcha (Suppositorium)" });
        } else if (lower.includes('caps.')) {
            formMatch = "Kapsula (Capsula)";
            detectedTerms.push({ abbr: "Caps.", trans: "Kapsula" });
        } else if (lower.includes('gutt.')) {
            formMatch = "Tomchilar (Guttae)";
            detectedTerms.push({ abbr: "Gutt.", trans: "Tomchilar" });
        }

        meaning = `<strong>Rp. (Recipe):</strong> Dorixonaga buyruq — Ushbu dori vositasidan oling. ${formMatch ? `Dori shakli: <b>${formMatch}</b>.` : ''}`;
        details = "Shifokor retseptning asosiy moddasi va uning dozasini ko'rsatmoqda.";
        patientNote = "Dori vositasi va dozasi belgilandi.";
        return { raw: line, meaning, details, patientNote, detectedTerms };
    }

    // 2. D.t.d. / Da tales doses line
    if (lower.includes('d.t.d.') || lower.includes('dtd') || lower.includes('da tales')) {
        detectedTerms.push({ abbr: "D.t.d. N.", full: "Da tales doses numero", trans: "Shunday dozadan ... ta berilsin" });

        let packaging = "";
        if (lower.includes('in amp')) {
            packaging = "ampulalarda (ukol uchun)";
            detectedTerms.push({ abbr: "in amp.", trans: "Ampulalarda" });
        } else if (lower.includes('in tab')) {
            packaging = "tabletkalarda";
            detectedTerms.push({ abbr: "in tab.", trans: "Tabletkalarda" });
        } else if (lower.includes('in caps')) {
            packaging = "kapsulalarda";
            detectedTerms.push({ abbr: "in caps.", trans: "Kapsulalarda" });
        } else if (lower.includes('in flac')) {
            packaging = "flakonlarda (shisha idishda)";
            detectedTerms.push({ abbr: "in flac.", trans: "Flakonlarda" });
        }

        meaning = `<strong>D.t.d. (Da tales doses):</strong> Shunday miqdordagi dozadan ${packaging ? `<b>${packaging}</b>` : ''} kerakli soni berilsin.`;
        details = "Dorixonachi bemorga aynan qancha hajm/dona dori berishi kerakligini belgilaydi.";
        patientNote = "Kerakli son va qadoqlash shakli.";
        return { raw: line, meaning, details, patientNote, detectedTerms };
    }

    // 3. Sterilisetur / Cito
    if (lower.includes('steril')) {
        detectedTerms.push({ abbr: "Steril.!", trans: "Sterillansin! (Mikroblarsizlantirilsin)" });
        meaning = "<strong>Sterilisetur!:</strong> Dori vositasi to'liq sterillansin (mikroblardan tozalanib tayyorlansin).";
        details = "Odatda in'yeksiyalar va ko'z tomchilari uchun qat'iy talab.";
        return { raw: line, meaning, details, patientNote: "Steril tayyorlash buyurilgan", detectedTerms };
    }

    if (lower.includes('cito')) {
        detectedTerms.push({ abbr: "Cito!", trans: "Tezda! (Shoshilinch)" });
        meaning = "<strong>Cito!:</strong> Shoshilinch! Dorixonada navbatsiz darhol tayyorlab berilsin!";
        details = "Bemorning ahvoli kechiktirib bo'lmaydigan holatda ekanini ko'rsatadi.";
        return { raw: line, meaning, details, patientNote: "Shoshilinch retsept", detectedTerms };
    }

    // 4. Signa / D.S. / S. line
    if (line.startsWith('S.') || line.startsWith('S:') || line.startsWith('D.S.') || line.startsWith('DS:')) {
        detectedTerms.push({ abbr: "S. (Signa)", full: "Signa / Signetur", trans: "Belgilansin / Qabul qilish tartibi" });

        let route = [];
        if (lower.includes('i/m') || lower.includes('i.m') || lower.includes('mushak')) {
            route.push("Mushak ichiga (i/m)");
            detectedTerms.push({ abbr: "i/m", trans: "Mushak ichiga ukol" });
        }
        if (lower.includes('i/v') || lower.includes('i.v') || lower.includes('vena')) {
            route.push("Vena ichiga tomirga (i/v)");
            detectedTerms.push({ abbr: "i/v", trans: "Vena ichiga ukol/tomchi" });
        }
        if (lower.includes('p/o') || lower.includes('per os') || lower.includes('og\'iz') || lower.includes('ichilsin')) {
            route.push("Og'iz orqali ichish (per os)");
            detectedTerms.push({ abbr: "p/o", trans: "Og'iz orqali ichish" });
        }
        if (lower.includes('p/r') || lower.includes('per rectum') || lower.includes('shamcha') || lower.includes('to\'g\'ri ichak')) {
            route.push("To'g'ri ichakka shamcha qo'yish (per rectum)");
            detectedTerms.push({ abbr: "p/r", trans: "To'g'ri ichak orqali" });
        }
        if (lower.includes('t.i.d') || lower.includes('kuniga 3')) {
            route.push("Kuniga 3 mahal (har 8 soatda)");
            detectedTerms.push({ abbr: "t.i.d.", trans: "Kuniga 3 marta" });
        }
        if (lower.includes('b.i.d') || lower.includes('kuniga 2')) {
            route.push("Kuniga 2 mahal (har 12 soatda)");
            detectedTerms.push({ abbr: "b.i.d.", trans: "Kuniga 2 marta" });
        }
        if (lower.includes('q.d') || lower.includes('kuniga 1') || lower.includes('har kuni')) {
            route.push("Kuniga 1 mahal (har kuni bir vaqtda)");
            detectedTerms.push({ abbr: "q.d.", trans: "Har kuni bir mahal" });
        }
        if (lower.includes('a.c.') || lower.includes('ovqatdan oldin')) {
            route.push("Ovqatdan oldin (kamida 20-30 daqiqa)");
            detectedTerms.push({ abbr: "a.c.", trans: "Ovqatdan oldin" });
        }
        if (lower.includes('p.c.') || lower.includes('ovqatdan so\'ng') || lower.includes('ovqatdan keyin')) {
            route.push("Ovqatdan keyin (oshqozon to'q paytda)");
            detectedTerms.push({ abbr: "p.c.", trans: "Ovqatdan keyin" });
        }

        meaning = `<strong>S. (Signa - Qabul qilish tartibi):</strong> Bemor uchun dori ichish yoki qo'llash ko'rsatmasi.`;
        if (route.length > 0) {
            details = `Aniqlangan tartib: <b>${route.join(' • ')}</b>.`;
        } else {
            details = "Dorining qachon va qanday tartibda iste'mol qilinishi ko'rsatilgan.";
        }
        patientNote = "Qabul qilish tartibi: " + line.replace(/^[S\.\:\s]+/, '');
        return { raw: line, meaning, details, patientNote, detectedTerms };
    }

    // 5. Misce fiat...
    if (lower.includes('m.f.') || lower.includes('misce')) {
        detectedTerms.push({ abbr: "M.f.", full: "Misce fiat", trans: "Aralashtir, hosil bo'lsin" });
        meaning = "<strong>M.f. (Misce fiat):</strong> Moddalarni aralashtirib, ko'rsatilgan dori shaklini tayyorlash buyrug'i.";
        details = "Dorixonada tayyorlanadigan dorilar tarkibi.";
        return { raw: line, meaning, details, patientNote: "Dorixonada tayyorlanadigan dori", detectedTerms };
    }

    // Fallback general line search in abbreviations
    MEDICAL_DATA.abbreviations.forEach(item => {
        const testPattern = new RegExp(`\\b${item.abbr.replace('.', '\\.')}`, 'i');
        if (testPattern.test(line)) {
            detectedTerms.push(item);
        }
    });

    return {
        raw: line,
        meaning: "Shifokorning tibbiy ko'rsatmasi yoki dori tavsifi.",
        details: "Lotincha matn va qo'shimcha parametrlar.",
        patientNote: line,
        detectedTerms
    };
}

function getPlainLanguageSummary(parsedLines, presetData) {
    if (presetData && presetData.notes) {
        return presetData.notes + " " + (presetData.explanation.line3 || '');
    }

    let summaryParts = [];
    parsedLines.forEach(l => {
        if (l.patientNote && l.patientNote.length > 3) {
            summaryParts.push(l.patientNote);
        }
    });

    if (summaryParts.length > 0) {
        return summaryParts.join(' | ');
    }

    return "Ushbu retseptda shifokor tomonidan belgilangan dori vositasi, dozasi va uni bemor qanday qabul qilishi kerakligi bayon qilingan.";
}

/* ==========================================================================
   4. DIAGNOZ VA TASHXIS DEKONSTRUKTORI (Advanced Clinical Diagnosis Engine)
   ========================================================================== */
function initDiagnosisExplainer() {
    const input = document.getElementById('diag-input');
    const analyzeBtn = document.getElementById('analyze-diag-btn');
    const sampleChips = document.querySelectorAll('.diag-sample-chip');
    const categoryPills = document.querySelectorAll('.diag-cat-pill');
    const autocompleteList = document.getElementById('diag-autocomplete-list');

    if (analyzeBtn && input) {
        analyzeBtn.addEventListener('click', () => {
            const val = input.value.trim();
            if (!val) {
                showToast("Iltimos, shifokor yozgan tashxisni kiriting!", "warning");
                return;
            }
            if (autocompleteList) autocompleteList.style.display = 'none';
            deconstructDiagnosis(val);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                analyzeBtn.click();
            }
        });

        // Live autocomplete suggestions
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (!autocompleteList) return;

            if (query.length < 2) {
                autocompleteList.style.display = 'none';
                return;
            }

            const matches = findClinicalDiagnoses(query).slice(0, 6);
            if (matches.length === 0) {
                autocompleteList.style.display = 'none';
                return;
            }

            autocompleteList.innerHTML = matches.map(m => `
                <div class="diag-autocomplete-item" data-term="${escapeHtml(m.uz)}" onclick="selectDiagSuggestion(this.getAttribute('data-term'))">
                    <div>
                        <div class="diag-auto-main">${escapeHtml(m.uz)}</div>
                        <div class="diag-auto-sub">${escapeHtml(m.lat)} • ${escapeHtml(m.ru || '')}</div>
                    </div>
                    <span class="diag-auto-badge">${escapeHtml(m.category)}</span>
                </div>
            `).join('');

            autocompleteList.style.display = 'block';
        });
    }

    // Close autocomplete on click outside
    document.addEventListener('click', (e) => {
        if (autocompleteList && !e.target.closest('.diag-search-bar-wrap')) {
            autocompleteList.style.display = 'none';
        }
    });

    // Sample chips
    sampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const word = chip.getAttribute('data-word');
            if (input && word) {
                input.value = word;
                if (autocompleteList) autocompleteList.style.display = 'none';
                deconstructDiagnosis(word);
            }
        });
    });

    // Category filter pills
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const cat = pill.getAttribute('data-cat');
            if (cat === 'all') {
                if (input && input.value) {
                    deconstructDiagnosis(input.value);
                } else {
                    deconstructDiagnosis("Surunkali gastrit");
                }
            } else {
                renderCategoryDiagnoses(cat);
            }
        });
    });

    // Default trigger first
    if (input && input.value) {
        deconstructDiagnosis(input.value);
    }
}

window.selectDiagSuggestion = function(term) {
    const input = document.getElementById('diag-input');
    const autocompleteList = document.getElementById('diag-autocomplete-list');
    if (input) {
        input.value = term;
    }
    if (autocompleteList) {
        autocompleteList.style.display = 'none';
    }
    deconstructDiagnosis(term);
};

function findClinicalDiagnoses(query) {
    if (!query || !MEDICAL_DATA.clinicalDiagnoses) return [];

    const clean = query.trim().toLowerCase();
    const cleanTokens = clean.split(/[\s\,\.\-\/]+/).filter(w => w.length > 1);

    const scored = MEDICAL_DATA.clinicalDiagnoses.map(d => {
        let score = 0;
        const allText = [
            d.id,
            d.lat,
            d.uz,
            d.ru,
            d.abbr,
            d.organ,
            d.category,
            d.plainExplain,
            d.symptoms,
            ...(d.keywords || [])
        ].filter(Boolean).join(' ').toLowerCase();

        // Exact matches
        if ((d.id && d.id.toLowerCase() === clean) || d.uz.toLowerCase() === clean || d.lat.toLowerCase() === clean || (d.abbr && d.abbr.toLowerCase() === clean)) {
            score += 100;
        } else if (d.uz.toLowerCase().includes(clean) || d.lat.toLowerCase().includes(clean)) {
            score += 60;
        } else if (d.ru && d.ru.toLowerCase().includes(clean)) {
            score += 50;
        } else if (d.keywords && d.keywords.some(k => k === clean)) {
            score += 45;
        } else if (d.keywords && d.keywords.some(k => k.includes(clean) || clean.includes(k))) {
            score += 35;
        }

        // Multi-token matches
        cleanTokens.forEach(token => {
            if (allText.includes(token)) {
                score += 15;
            }
        });

        return { item: d, score };
    });

    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(s => s.item);
}

function renderCategoryDiagnoses(catName) {
    const resultBox = document.getElementById('diag-result-container');
    if (!resultBox || !MEDICAL_DATA.clinicalDiagnoses) return;

    let items = [];
    if (catName === 'Boshqa') {
        items = MEDICAL_DATA.clinicalDiagnoses.filter(d => 
            d.category.includes('Qon') || d.category.includes('Ko\'z') || d.category.includes('Teri')
        );
    } else {
        items = MEDICAL_DATA.clinicalDiagnoses.filter(d => d.category === catName);
    }

    if (items.length === 0) {
        items = MEDICAL_DATA.clinicalDiagnoses;
    }

    let html = `
        <div class="result-card animated-fade-in">
            <div class="result-header">
                <div>
                    <span class="badge badge-primary"><i class="fas fa-layer-group"></i> A'zolar Guruhi</span>
                    <h2 class="preset-title" style="margin-top:6px;">${escapeHtml(catName)} Bo'yicha Barcha Shifokor Tashxislari (${items.length} ta)</h2>
                </div>
            </div>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Ushbu sohadagi eng ko'p qo'yiladigan tashxislar ro'yxati. To'liq tahlilini ko'rish uchun istalgan tashxis ustiga bosing:</p>
            <div class="matched-others-grid">
    `;

    items.forEach(item => {
        html += `
            <div class="matched-other-card" onclick="selectDiagSuggestion('${escapeHtml(item.uz.replace(/'/g, ''))}')">
                <div class="matched-other-title">${escapeHtml(item.uz)}</div>
                <div class="matched-other-sub">${escapeHtml(item.lat)}</div>
                <div style="font-size:0.83rem; color:var(--text-secondary); margin-top:6px; line-height:1.4;">${escapeHtml(item.plainExplain.slice(0, 100))}...</div>
                <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span class="badge badge-sm badge-info">${escapeHtml(item.organ)}</span>
                    <span style="font-size:0.8rem; color:var(--primary); font-weight:600;">Ko'rish <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    resultBox.innerHTML = html;
}

function deconstructDiagnosis(term) {
    const resultBox = document.getElementById('diag-result-container');
    if (!resultBox) return;

    const clean = term.trim().toLowerCase();

    // 1. First, search within full Clinical Diagnoses
    const clinicalMatches = findClinicalDiagnoses(clean);

    if (clinicalMatches.length > 0) {
        const main = clinicalMatches[0];
        const others = clinicalMatches.slice(1, 7);

        // Check for morphology of main's latin term
        const morphAnalysis = getMorphologyOfWord(main.lat);

        let urgencyClass = main.urgency.toLowerCase().includes('shoshilinch') || main.urgency.toLowerCase().includes('tez yordam') || main.urgency.toLowerCase().includes('zudlik')
            ? 'urgency-danger'
            : 'urgency-routine';

        let html = `
            <div class="clinical-card animated-fade-in">
                <!-- Sarlavha -->
                <div class="clinical-card-header">
                    <div>
                        <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                            <span class="badge badge-success"><i class="fas fa-check-circle"></i> Tibbiy Tashxis Aniqlanti</span>
                            <span class="badge badge-info">${escapeHtml(main.category)}</span>
                            ${main.abbr ? `<span class="badge badge-warning">Qisqartmasi: ${escapeHtml(main.abbr)}</span>` : ''}
                        </div>
                        <h2 class="clinical-title-uz">${escapeHtml(main.uz)}</h2>
                        <div class="clinical-title-lat"><i class="fas fa-file-medical"></i> Lotincha: <strong>${escapeHtml(main.lat)}</strong></div>
                        ${main.ru ? `<div class="clinical-title-ru">Ruscha tibbiy nomi: ${escapeHtml(main.ru)}</div>` : ''}
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-sm btn-outline" onclick="speakText('${escapeHtml(main.lat.replace(/'/g, ''))}', 'la')" title="Lotincha talaffuzi">
                            <i class="fas fa-volume-up"></i> Tinglash
                        </button>
                    </div>
                </div>

                <!-- Bemor Uchun Sodda Tilda Xulosa (Lead) -->
                <div class="clinical-explain-lead">
                    <h4><i class="fas fa-comment-medical"></i> Bemor uchun sodda xalq tilidagi ma'nosi:</h4>
                    <p>${escapeHtml(main.plainExplain)}</p>
                </div>

                <!-- Parametrlar Grid -->
                <div class="clinical-meta-grid">
                    <div class="clinical-meta-box">
                        <span class="meta-label"><i class="fas fa-heartbeat"></i> Zararlangan A'zo:</span>
                        <span class="meta-value" style="color:var(--secondary);">${escapeHtml(main.organ)}</span>
                    </div>

                    <div class="clinical-meta-box">
                        <span class="meta-label"><i class="fas fa-user-md"></i> Qaysi Shifokor Davolaydi:</span>
                        <span class="meta-value">${escapeHtml(main.doctor)}</span>
                    </div>

                    <div class="clinical-meta-box">
                        <span class="meta-label"><i class="fas fa-bell"></i> Xavflilik / Harakat Tartibi:</span>
                        <span class="meta-value ${urgencyClass}">${escapeHtml(main.urgency)}</span>
                    </div>

                    <div class="clinical-meta-box" style="grid-column: 1 / -1;">
                        <span class="meta-label"><i class="fas fa-exclamation-triangle"></i> Asosiy Belgilari va Alomatlari:</span>
                        <span class="meta-value">${escapeHtml(main.symptoms)}</span>
                    </div>
                </div>

                <!-- Yuqish Yo'llari (Infeksion kasalliklar uchun) -->
                ${main.transmission ? `
                    <div style="margin-bottom: 20px; padding: 18px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: var(--radius-md);">
                        <h4 style="color: #fbbf24; margin-bottom: 8px; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-shield-virus"></i> Yuqish Yo'llari va Qanday Saqlanish Kerak:
                        </h4>
                        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-primary); margin: 0;">${escapeHtml(main.transmission)}</p>
                    </div>
                ` : ''}

                <!-- Davolash va Bemorga Tavsiyalar -->
                ${main.treatment ? `
                    <div style="margin-bottom: 20px; padding: 18px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: var(--radius-md);">
                        <h4 style="color: #34d399; margin-bottom: 8px; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-hand-holding-medical"></i> Qanday Davolanadi va Bemor Uchun Muhim Eslatma:
                        </h4>
                        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-primary); margin: 0;">${escapeHtml(main.treatment)}</p>
                    </div>
                ` : ''}

                <!-- Agar lotincha so'zda morfologiya (ildiz + suffiks) bo'lsa -->
                ${morphAnalysis ? `
                    <div style="margin-top: 20px; padding: 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                        <h4 style="font-size:0.95rem; margin-bottom:12px; color:var(--text-primary);"><i class="fas fa-dna"></i> Lotincha So'z Morfologiyasi (Dekonstruktsiya):</h4>
                        <div class="morph-breakdown-row" style="margin-bottom:0;">
                            ${morphAnalysis.prefix ? `
                                <div class="morph-block prefix-block">
                                    <span class="morph-type">Old qo'shimcha (Prefiks)</span>
                                    <span class="morph-text">${escapeHtml(morphAnalysis.prefix.prefix)}</span>
                                    <span class="morph-meaning">${escapeHtml(morphAnalysis.prefix.meaning)}</span>
                                </div>
                            ` : ''}
                            ${morphAnalysis.root ? `
                                <div class="morph-block root-block">
                                    <span class="morph-type">Asos / A'zo (Ildiz)</span>
                                    <span class="morph-text">${escapeHtml(morphAnalysis.root.root)}</span>
                                    <span class="morph-meaning">${escapeHtml(morphAnalysis.root.uz)} (${escapeHtml(morphAnalysis.root.lat)})</span>
                                </div>
                            ` : ''}
                            ${morphAnalysis.suffix ? `
                                <div class="morph-block suffix-block">
                                    <span class="morph-type">Tibbiy Qo'shimcha (Suffiks)</span>
                                    <span class="morph-text">${escapeHtml(morphAnalysis.suffix.suffix)}</span>
                                    <span class="morph-meaning">${escapeHtml(morphAnalysis.suffix.meaning)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}

                <!-- Shuningdek topilgan boshqa o'xshash tashxislar -->
                ${others.length > 0 ? `
                    <div class="matched-others-section">
                        <h4 class="section-subtitle"><i class="fas fa-search-plus"></i> So'rovingizga bog'liq boshqa tashxislar (${others.length}):</h4>
                        <div class="matched-others-grid">
                            ${others.map(o => `
                                <div class="matched-other-card" onclick="selectDiagSuggestion('${escapeHtml(o.uz.replace(/'/g, ''))}')">
                                    <div class="matched-other-title">${escapeHtml(o.uz)}</div>
                                    <div class="matched-other-sub">${escapeHtml(o.lat)}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${escapeHtml(o.organ)} • ${escapeHtml(o.doctor)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        resultBox.innerHTML = html;
        return;
    }

    // 2. If not found in Clinical Diagnoses, execute Morphological Decomposition
    const morph = getMorphologyOfWord(clean);

    if (morph && (morph.root || morph.suffix || morph.prefix)) {
        let explanationSummary = "";
        if (morph.root && morph.suffix) {
            explanationSummary = `<strong>${morph.root.uz}</strong> a'zosidagi <strong>${morph.suffix.meaning.toLowerCase()}</strong> jarayoni (${morph.suffix.uz.toLowerCase()}).`;
            if (morph.prefix) {
                explanationSummary = `<strong>${morph.prefix.meaning}</strong>: ` + explanationSummary;
            }
        } else if (morph.root) {
            explanationSummary = `Ushbu atama <strong>${morph.root.uz}</strong> (${morph.root.lat}) a'zosi yoki to'qimasi bilan bevosita bog'liq.`;
        } else if (morph.suffix) {
            explanationSummary = `Ushbu atamaning ma'nosi: <strong>${morph.suffix.meaning}</strong> (${morph.suffix.uz}).`;
        }

        let html = `
            <div class="result-card animated-fade-in">
                <div class="diag-header-bar">
                    <div class="diag-title-group">
                        <span class="badge badge-primary"><i class="fas fa-microscope"></i> Morfologik Tahlil Natijasi</span>
                        <h2 class="diag-term-title">${escapeHtml(term)}</h2>
                    </div>
                    <button class="btn btn-sm btn-outline" onclick="speakText('${escapeHtml(term.replace(/'/g, ''))}', 'la')">
                        <i class="fas fa-volume-up"></i> Tinglash
                    </button>
                </div>

                <div class="diag-summary-banner">
                    <div class="diag-summary-icon"><i class="fas fa-info-circle"></i></div>
                    <div>
                        <h4>Oddiy tildagi ma'nosi:</h4>
                        <p class="lead-summary">${explanationSummary}</p>
                    </div>
                </div>

                <div class="morph-breakdown-row">
                    ${morph.prefix ? `
                        <div class="morph-block prefix-block">
                            <span class="morph-type">Old qo'shimcha (Prefiks)</span>
                            <span class="morph-text">${escapeHtml(morph.prefix.prefix)}</span>
                            <span class="morph-meaning">${escapeHtml(morph.prefix.meaning)}</span>
                            <small class="morph-desc">${escapeHtml(morph.prefix.uz)}</small>
                        </div>
                    ` : ''}
                    ${morph.root ? `
                        <div class="morph-block root-block">
                            <span class="morph-type">Asos / A'zo (Ildiz)</span>
                            <span class="morph-text">${escapeHtml(morph.root.root)}</span>
                            <span class="morph-meaning">${escapeHtml(morph.root.uz)}</span>
                            <small class="morph-desc">Lotincha a'zo: ${escapeHtml(morph.root.lat)}</small>
                        </div>
                    ` : ''}
                    ${morph.suffix ? `
                        <div class="morph-block suffix-block">
                            <span class="morph-type">Tibbiy Qo'shimcha (Suffiks)</span>
                            <span class="morph-text">${escapeHtml(morph.suffix.suffix)}</span>
                            <span class="morph-meaning">${escapeHtml(morph.suffix.meaning)}</span>
                            <small class="morph-desc">${escapeHtml(morph.suffix.desc)}</small>
                        </div>
                    ` : ''}
                </div>

                <!-- Maslahat qutisi -->
                <div class="diag-tip-box">
                    <i class="fas fa-lightbulb"></i>
                    <p><strong>Bilasizmi?</strong> Tibbiyotda so'z oxiriga <b>-itis</b> qo'shilsa bu har doim shamollash/yallig'lanish, <b>-oma</b> qo'shilsa o'sma, <b>-osis</b> qo'shilsa surunkali distrofiya, <b>-ectomia</b> qo'shilsa jarrohlikda olib tashlashni bildiradi!</p>
                </div>
            </div>
        `;

        resultBox.innerHTML = html;
        return;
    }

    // 3. Fallback: Search dictionary or show suggestions
    const dictMatches = (MEDICAL_DATA.abbreviations || []).concat(MEDICAL_DATA.dosageForms || []).concat(MEDICAL_DATA.anatomy || []);
    const related = dictMatches.filter(item => {
        const text = [item.abbr, item.full, item.lat, item.uz, item.trans, item.desc].filter(Boolean).join(' ').toLowerCase();
        return text.includes(clean);
    }).slice(0, 4);

    let html = `
        <div class="result-card animated-fade-in">
            <div class="empty-state" style="padding: 30px 10px;">
                <i class="fas fa-stethoscope empty-icon" style="color:var(--warning);"></i>
                <h3 style="color:var(--text-primary);">"${escapeHtml(term)}" bo'yicha aniq tashxis topilmadi</h3>
                <p style="max-width:500px; margin: 0 auto 20px;">Iltimos, so'zni to'g'ri yozganingizni tekshiring yoki quyidagi eng ko'p uchraydigan shifokor tashxislaridan birini tanlang:</p>
                
                <div class="matched-others-grid" style="max-width:700px; margin:0 auto; text-align:left;">
                    ${(MEDICAL_DATA.clinicalDiagnoses || []).slice(0, 6).map(d => `
                        <div class="matched-other-card" onclick="selectDiagSuggestion('${escapeHtml(d.uz.replace(/'/g, ''))}')">
                            <div class="matched-other-title">${escapeHtml(d.uz)}</div>
                            <div class="matched-other-sub">${escapeHtml(d.lat)}</div>
                            <span class="badge badge-sm badge-info" style="margin-top:6px;">${escapeHtml(d.category)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    resultBox.innerHTML = html;
}

function getMorphologyOfWord(cleanWord) {
    if (!cleanWord) return null;
    const clean = cleanWord.trim().toLowerCase();

    let foundPrefix = null;
    for (let p of (MEDICAL_DATA.prefixes || [])) {
        const raw = p.prefix.split('/')[0].replace('-', '').trim().toLowerCase();
        if (clean.startsWith(raw)) {
            foundPrefix = p;
            break;
        }
    }

    let foundSuffix = null;
    for (let s of (MEDICAL_DATA.suffixes || [])) {
        const raw = s.suffix.split('(')[0].replace('-', '').trim().toLowerCase();
        if (clean.endsWith(raw) || clean.includes(raw)) {
            foundSuffix = s;
            break;
        }
    }

    let foundRoots = [];
    for (let r of (MEDICAL_DATA.roots || [])) {
        const raw = r.root.split('/')[0].trim().toLowerCase();
        if (clean.includes(raw)) {
            foundRoots.push(r);
        }
    }

    foundRoots.sort((a, b) => b.root.length - a.root.length);
    const foundRoot = foundRoots[0] || null;

    if (!foundPrefix && !foundSuffix && !foundRoot) return null;

    return {
        prefix: foundPrefix,
        root: foundRoot,
        suffix: foundSuffix
    };
}

/* ==========================================================================
   5. KATTA TIBBIY LUG'AT VA QIDIRUV (Medical Dictionary)
   ========================================================================== */
let activeDictionaryFilter = 'all';
let currentSearchQuery = '';

function initDictionary() {
    const searchInput = document.getElementById('dict-search-input');
    const filterButtons = document.querySelectorAll('.filter-pill');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderDictionary();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDictionaryFilter = btn.getAttribute('data-filter') || 'all';
            renderDictionary();
        });
    });

    renderDictionary();
}

function renderDictionary() {
    const container = document.getElementById('dict-cards-container');
    const countBadge = document.getElementById('dict-result-count');
    if (!container) return;

    let items = [];

    // Collect based on filter
    if (activeDictionaryFilter === 'all' || activeDictionaryFilter === 'abbreviations') {
        items.push(...MEDICAL_DATA.abbreviations.map(i => ({ ...i, itemType: 'abbr', displayTitle: i.abbr, subtitle: i.full, translation: i.trans })));
    }
    if (activeDictionaryFilter === 'all' || activeDictionaryFilter === 'forms') {
        items.push(...MEDICAL_DATA.dosageForms.map(i => ({ ...i, itemType: 'form', displayTitle: i.lat, subtitle: i.type + " dori shakli", translation: i.uz })));
    }
    if (activeDictionaryFilter === 'all' || activeDictionaryFilter === 'anatomy') {
        items.push(...MEDICAL_DATA.anatomy.map(i => ({ ...i, itemType: 'anatomy', displayTitle: i.lat, subtitle: i.system, translation: i.uz })));
    }
    if (activeDictionaryFilter === 'all' || activeDictionaryFilter === 'suffixes') {
        items.push(...MEDICAL_DATA.suffixes.map(i => ({ ...i, itemType: 'suffix', displayTitle: i.suffix, subtitle: i.meaning, translation: i.uz })));
        items.push(...MEDICAL_DATA.prefixes.map(i => ({ ...i, itemType: 'prefix', displayTitle: i.prefix, subtitle: i.meaning, translation: i.uz })));
    }

    // Apply search query
    if (currentSearchQuery) {
        items = items.filter(item => {
            const textToMatch = [
                item.displayTitle,
                item.subtitle,
                item.translation,
                item.desc,
                item.example,
                item.lat,
                item.uz,
                item.abbr
            ].filter(Boolean).join(' ').toLowerCase();

            return textToMatch.includes(currentSearchQuery);
        });
    }

    if (countBadge) {
        countBadge.textContent = `${items.length} ta atama topildi`;
    }

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search-minus empty-icon"></i>
                <h3>Hech qanday atama topilmadi</h3>
                <p>"${escapeHtml(currentSearchQuery)}" so'rovi bo'yicha hech narsa topilmadi. Qidiruv so'zini o'zgartirib ko'ring.</p>
            </div>
        `;
        return;
    }

    let html = '';
    items.forEach(item => {
        const typeBadge = getTypeBadge(item.itemType);
        const titleForAudio = escapeHtml((item.displayTitle || '').replace(/'/g, ''));

        html += `
            <div class="dict-card">
                <div class="dict-card-top">
                    <span class="badge ${typeBadge.class}">${typeBadge.label}</span>
                    <button class="icon-audio-btn" onclick="speakText('${titleForAudio}', 'la')" title="Lotincha talaffuzi">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <h3 class="dict-card-title">${escapeHtml(item.displayTitle)}</h3>
                ${item.subtitle ? `<div class="dict-card-sub">${escapeHtml(item.subtitle)}</div>` : ''}
                
                <div class="dict-card-uzbek">
                    <i class="fas fa-check"></i> <strong>${escapeHtml(item.translation)}</strong>
                </div>

                ${item.desc ? `<p class="dict-card-desc">${escapeHtml(item.desc)}</p>` : ''}
                
                ${item.example ? `
                    <div class="dict-card-example">
                        <small>Misol:</small> <code>${escapeHtml(item.example)}</code>
                    </div>
                ` : ''}
            </div>
        `;
    });

    container.innerHTML = html;
}

function getTypeBadge(type) {
    switch (type) {
        case 'abbr':
            return { class: 'badge-warning', label: 'Retsept Qisqartmasi' };
        case 'form':
            return { class: 'badge-info', label: 'Dori Shakli' };
        case 'anatomy':
            return { class: 'badge-success', label: 'Tana A\'zosi' };
        case 'suffix':
            return { class: 'badge-danger', label: 'Qo\'shimcha (Suffiks)' };
        case 'prefix':
            return { class: 'badge-primary', label: 'Old Qo\'shimcha' };
        default:
            return { class: 'badge-neutral', label: 'Atama' };
    }
}

/* ==========================================================================
   6. LOTIN ALIFBOSI VA TALAFFUZ QOIDALARI (Phonetics)
   ========================================================================== */
function initPhonetics() {
    const container = document.getElementById('phonetics-rules-container');
    if (!container) return;

    let html = '';
    MEDICAL_DATA.phonetics.forEach(p => {
        html += `
            <div class="phonetic-card">
                <div class="phonetic-card-header">
                    <div class="phonetic-letter-badge">${escapeHtml(p.letter)}</div>
                    <div class="phonetic-rule-text">${escapeHtml(p.rule)}</div>
                </div>
                <div class="phonetic-examples-grid">
                    ${p.examples.map(ex => `
                        <div class="phonetic-example-item" onclick="speakText('${escapeHtml(ex.lat)}', 'la')">
                            <div class="ph-word"><strong>${escapeHtml(ex.lat)}</strong> <span class="ph-trans">${escapeHtml(ex.trans)}</span></div>
                            <div class="ph-uz">${escapeHtml(ex.uz)}</div>
                            <span class="ph-play-icon"><i class="fas fa-volume-up"></i></span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/* ==========================================================================
   7. TIBBIY VIKTORINA VA TEST (Medical Quiz)
   ========================================================================== */
let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];

function initQuiz() {
    const startBtn = document.getElementById('start-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');

    if (startBtn) {
        startBtn.addEventListener('click', startQuiz);
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', startQuiz);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];

    const welcomeBox = document.getElementById('quiz-welcome-box');
    const questionBox = document.getElementById('quiz-question-box');
    const resultBox = document.getElementById('quiz-result-box');

    if (welcomeBox) welcomeBox.style.display = 'none';
    if (resultBox) resultBox.style.display = 'none';
    if (questionBox) questionBox.style.display = 'block';

    renderCurrentQuestion();
}

function renderCurrentQuestion() {
    const questionBox = document.getElementById('quiz-question-box');
    if (!questionBox) return;

    const quiz = MEDICAL_DATA.quizzes[currentQuestionIndex];
    const total = MEDICAL_DATA.quizzes.length;

    let html = `
        <div class="quiz-active-card animated-fade-in">
            <div class="quiz-progress-bar-container">
                <div class="quiz-progress-bar" style="width: ${((currentQuestionIndex + 1) / total) * 100}%"></div>
            </div>
            
            <div class="quiz-header-meta">
                <span><i class="fas fa-question-circle"></i> Savol ${currentQuestionIndex + 1} / ${total}</span>
                <span>Ball: <strong>${userScore}</strong></span>
            </div>

            <h3 class="quiz-question-title">${escapeHtml(quiz.q)}</h3>

            <div class="quiz-options-list">
                ${quiz.options.map((opt, idx) => `
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(${idx})">
                        <span class="opt-num">${String.fromCharCode(65 + idx)}</span>
                        <span class="opt-text">${escapeHtml(opt)}</span>
                    </button>
                `).join('')}
            </div>

            <div id="quiz-explanation-area" style="display: none;" class="quiz-feedback-box"></div>
        </div>
    `;

    questionBox.innerHTML = html;
}

window.handleQuizAnswer = function(chosenIdx) {
    const quiz = MEDICAL_DATA.quizzes[currentQuestionIndex];
    const buttons = document.querySelectorAll('.quiz-option-btn');
    const feedbackArea = document.getElementById('quiz-explanation-area');

    buttons.forEach(b => b.disabled = true);

    const isCorrect = (chosenIdx === quiz.correct);
    if (isCorrect) {
        userScore++;
        buttons[chosenIdx].classList.add('correct');
    } else {
        buttons[chosenIdx].classList.add('wrong');
        buttons[quiz.correct].classList.add('correct');
    }

    if (feedbackArea) {
        feedbackArea.style.display = 'block';
        feedbackArea.className = `quiz-feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
        feedbackArea.innerHTML = `
            <div class="feedback-title">
                <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i> 
                ${isCorrect ? "To'g'ri javob! Barakalla!" : "Afsuski noto'g'ri javob."}
            </div>
            <p>${escapeHtml(quiz.desc)}</p>
            <button class="btn btn-primary btn-sm next-q-btn" onclick="nextQuizStep()">
                ${currentQuestionIndex + 1 < MEDICAL_DATA.quizzes.length ? 'Keyingi savolga o\'tish' : 'Natijani ko\'rish'} <i class="fas fa-arrow-right"></i>
            </button>
        `;
    }
};

window.nextQuizStep = function() {
    currentQuestionIndex++;
    if (currentQuestionIndex < MEDICAL_DATA.quizzes.length) {
        renderCurrentQuestion();
    } else {
        showQuizResults();
    }
};

function showQuizResults() {
    const questionBox = document.getElementById('quiz-question-box');
    const resultBox = document.getElementById('quiz-result-box');
    if (questionBox) questionBox.style.display = 'none';
    if (!resultBox) return;

    resultBox.style.display = 'block';
    const total = MEDICAL_DATA.quizzes.length;
    const percentage = Math.round((userScore / total) * 100);

    let message = "";
    let badgeClass = "badge-success";
    if (percentage >= 80) {
        message = "A'lo darajada! Siz shifokorlar lotin tilini va retseptlarni juda yaxshi tushunasiz!";
        badgeClass = "badge-success";
    } else if (percentage >= 50) {
        message = "Yaxshi natija! Siz asosiy atamalarni bilasiz, biroz takrorlash orqali bilimlarni mustahkamlashingiz mumkin.";
        badgeClass = "badge-warning";
    } else {
        message = "Hali o'rganish kerak bo'lgan atamalar bor. Dasturning lug'at va o'qish qoidalaridan foydalanib yana urinib ko'ring!";
        badgeClass = "badge-danger";
    }

    resultBox.innerHTML = `
        <div class="quiz-final-card animated-fade-in">
            <div class="result-score-circle">
                <span class="score-percent">${percentage}%</span>
                <span class="score-label">${userScore} / ${total} to'g'ri</span>
            </div>
            <span class="badge ${badgeClass} result-badge">Test yakunlandi</span>
            <h2 class="result-headline">${percentage >= 80 ? 'Ajoyib Natija!' : 'Sinov Yakunlandi'}</h2>
            <p class="result-subtext">${message}</p>
            <div class="result-action-buttons">
                <button class="btn btn-primary" onclick="startQuiz()">
                    <i class="fas fa-redo"></i> Testni qayta topshirish
                </button>
            </div>
        </div>
    `;
}

/* ==========================================================================
   8. AUDIO VA NUTQ SINTEZI (Text-to-Speech)
   ========================================================================== */
window.speakText = function(text, lang = 'la') {
    if (!('speechSynthesis' in window)) {
        showToast("Kechirasiz, sizning brauzeringiz ovozli o'qishni qo'llab-quvvatlamaydi", "warning");
        return;
    }

    window.speechSynthesis.cancel(); // Stop previous audio

    // Clean text from symbols
    const cleanText = text.replace(/[\n\r]/g, ' ').replace(/[^\w\s\.\,\%\-]/gi, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.85; // slightly slower for medical Latin
    utterance.pitch = 1.0;

    // Try finding Latin or Italian voice (Italian phonetics match Classical Latin closely)
    const voices = window.speechSynthesis.getVoices();
    const latinVoice = voices.find(v => v.lang.startsWith('la') || v.lang.startsWith('it') || v.lang.startsWith('es'));
    if (latinVoice) {
        utterance.voice = latinVoice;
    }

    window.speechSynthesis.speak(utterance);
    showToast("Lotincha talaffuz o'qilmoqda...", "info");
};

/* ==========================================================================
   9. MODAL & UTILITY FUNCTIONS
   ========================================================================== */
window.showTermModal = function(termKey) {
    const match = MEDICAL_DATA.abbreviations.find(a => a.abbr === termKey) ||
                  MEDICAL_DATA.dosageForms.find(d => d.lat.includes(termKey)) ||
                  MEDICAL_DATA.anatomy.find(a => a.lat.includes(termKey));

    if (!match) return;

    let content = `
        <div class="modal-overlay" id="custom-modal" onclick="closeModal(event)">
            <div class="modal-box animated-fade-in" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${escapeHtml(match.abbr || match.lat || '')}</h3>
                    <button class="close-modal-btn" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="modal-uzbek"><i class="fas fa-check-circle"></i> <strong>O'zbekcha:</strong> ${escapeHtml(match.trans || match.uz || '')}</p>
                    ${match.full ? `<p><strong>To'liq lotincha:</strong> <em>${escapeHtml(match.full)}</em></p>` : ''}
                    ${match.desc ? `<p class="modal-desc">${escapeHtml(match.desc)}</p>` : ''}
                    ${match.example ? `<div class="modal-example"><strong>Misol:</strong> <code>${escapeHtml(match.example)}</code></div>` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline btn-sm" onclick="speakText('${escapeHtml(match.abbr || match.lat || '')}', 'la')">
                        <i class="fas fa-volume-up"></i> Tinglash
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="closeModal()">Yopish</button>
                </div>
            </div>
        </div>
    `;

    const existing = document.getElementById('custom-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', content);
};

window.closeModal = function(e) {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.remove();
};

function showToast(msg, type = "info") {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type} animated-fade-in`;
    
    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "warning") icon = "fa-exclamation-triangle";
    if (type === "error") icon = "fa-times-circle";

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ==========================================================================
   10. PWA & ANDROID ADAPTATIONS
   ========================================================================== */
function initPWA() {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(err => {
                console.warn('SW registration fallback:', err);
            });
        });
    }

    // Android Chrome / Edge install prompt handling
    let deferredPrompt = null;
    const installBtn = document.getElementById('install-pwa-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            triggerHaptic(20);
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    showToast("MedLatin dasturi qurilmangizga o'rnatildi!", "success");
                }
                deferredPrompt = null;
                installBtn.style.display = 'none';
            } else {
                showToast("Ilovani o'rnatish uchun brauzer menyusidan 'Bosh ekranga qo'shish' tugmasini bosing.", "info");
            }
        });
    }

    window.addEventListener('appinstalled', () => {
        if (installBtn) installBtn.style.display = 'none';
        showToast("MedLatin muvaffaqiyatli o'rnatildi!", "success");
    });
}

function initAndroidOptimizations() {
    const bottomNav = document.getElementById('mobile-bottom-nav');
    if (!bottomNav) return;

    // Detect virtual keyboard opening/closing on Android to prevent covering inputs
    if (window.visualViewport) {
        let initialHeight = window.visualViewport.height;
        window.visualViewport.addEventListener('resize', () => {
            if (window.visualViewport.height < initialHeight * 0.78) {
                bottomNav.classList.add('nav-hidden');
            } else {
                bottomNav.classList.remove('nav-hidden');
                initialHeight = window.visualViewport.height;
            }
        });
    }

    // Mobile inputs focus listener fallback
    const allInputs = document.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                bottomNav.classList.add('nav-hidden');
            }
        });
        input.addEventListener('blur', () => {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    bottomNav.classList.remove('nav-hidden');
                }, 150);
            }
        });
    });
}

/* ==========================================================================
   11. AUTHENTICATION & USER LOGIN (Tizimga Kirish)
   ========================================================================== */
function initAuth() {
    const authModal = document.getElementById('auth-modal');
    const openAuthBtn = document.getElementById('open-auth-btn');
    const closeAuthBtn = document.getElementById('close-auth-modal-btn');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const loginErrorBox = document.getElementById('login-error-box');

    // Update Header UI on load
    updateAuthUI();

    // Open Modal
    if (openAuthBtn && authModal) {
        openAuthBtn.addEventListener('click', () => {
            triggerHaptic(15);
            authModal.style.display = 'flex';
            clearAuthErrors();
            const nameInput = document.getElementById('login-name');
            if (nameInput) setTimeout(() => nameInput.focus(), 100);
        });
    }

    // Close Modal
    function closeAuthModal() {
        if (authModal) {
            authModal.style.display = 'none';
            clearAuthErrors();
        }
    }

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', closeAuthModal);
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal && authModal.style.display === 'flex') {
            closeAuthModal();
        }
    });

    // Password Visibility Toggle
    const pwdToggles = document.querySelectorAll('.pwd-toggle-btn');
    pwdToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            if (targetInput) {
                const isPassword = targetInput.type === 'password';
                targetInput.type = isPassword ? 'text' : 'password';
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                }
            }
        });
    });

    function clearAuthErrors() {
        if (loginErrorBox) {
            loginErrorBox.style.display = 'none';
            loginErrorBox.textContent = '';
        }
    }

    function showAuthError(msg) {
        if (loginErrorBox) {
            loginErrorBox.style.display = 'flex';
            loginErrorBox.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${escapeHtml(msg)}</span>`;
            triggerHaptic(30);
        }
    }

    // Login Form Handler (Only Login)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAuthErrors();

            const nameInput = document.getElementById('login-name');
            const pwdInput = document.getElementById('login-password');

            const name = nameInput ? nameInput.value.trim() : '';
            const password = pwdInput ? pwdInput.value : '';

            if (!name || name.length < 2) {
                showAuthError("Iltimos, ismingizni to'liq kiriting (kamida 2 ta belgi)!");
                return;
            }

            if (!password || password.length < 3) {
                showAuthError("Iltimos, parolingizni kiriting (kamida 3 ta belgi)!");
                return;
            }

            // Load registered users from storage
            let users = [];
            try {
                users = JSON.parse(localStorage.getItem('med_latin_users') || '[]');
            } catch(err) {
                users = [];
            }

            const matchedUser = users.find(u => u.name.toLowerCase() === name.toLowerCase());

            if (matchedUser) {
                if (matchedUser.password !== password) {
                    showAuthError("Parol noto'g'ri kiritildi! Qayta urinib ko'ring.");
                    return;
                }
            } else {
                // If user doesn't exist yet, automatically save and authenticate
                users.push({ name, password, createdAt: new Date().toISOString() });
                localStorage.setItem('med_latin_users', JSON.stringify(users));
            }

            // Save active session
            const activeSession = { name };
            localStorage.setItem('med_latin_user', JSON.stringify(activeSession));

            // Show login progress animation (10%, 40%, 70%, 100%)
            const progressOverlay = document.getElementById('login-progress-overlay');
            const welcomeTitle = document.getElementById('login-welcome-title');
            const miniBar = document.getElementById('login-progress-bar');
            const percentNum = document.getElementById('login-percent-num');
            const stepText = document.getElementById('login-step-text');
            const submitBtn = document.getElementById('login-submit-btn');

            if (progressOverlay && miniBar && percentNum && stepText) {
                if (submitBtn) submitBtn.style.display = 'none';
                progressOverlay.style.display = 'block';
                if (welcomeTitle) welcomeTitle.textContent = `Xush kelibsiz, ${name}!`;

                const authMilestones = [
                    { p: 10, text: "Hisob ma'lumotlari tekshirilmoqda...", delay: 80 },
                    { p: 40, text: "Shaxsiy profil yuklanmoqda...", delay: 280 },
                    { p: 70, text: "Retseptlar bazasi ulanmoqda...", delay: 550 },
                    { p: 100, text: "Xush kelibsiz! Tizim tayyor.", delay: 850 }
                ];

                authMilestones.forEach(m => {
                    setTimeout(() => {
                        miniBar.style.width = `${m.p}%`;
                        percentNum.textContent = `${m.p}%`;
                        stepText.textContent = m.text;
                        triggerHaptic(15);
                    }, m.delay);
                });

                setTimeout(() => {
                    triggerHaptic(30);
                    closeAuthModal();
                    if (submitBtn) submitBtn.style.display = 'inline-flex';
                    progressOverlay.style.display = 'none';
                    loginForm.reset();
                    updateAuthUI();
                    showToast(`Xush kelibsiz, ${name}! Tizimga muvaffaqiyatli kirdingiz.`, 'success');
                }, 1200);
            } else {
                triggerHaptic(25);
                closeAuthModal();
                loginForm.reset();
                updateAuthUI();
                showToast(`Xush kelibsiz, ${name}! Tizimga muvaffaqiyatli kirdingiz.`, 'success');
            }
        });
    }

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerHaptic(20);
            localStorage.removeItem('med_latin_user');
            updateAuthUI();
            showToast("Tizimdan muvaffaqiyatli chiqdingiz.", "info");
        });
    }
}

function updateAuthUI() {
    const openAuthBtn = document.getElementById('open-auth-btn');
    const profileBadge = document.getElementById('user-profile-badge');
    const displayName = document.getElementById('user-display-name');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const userAvatarFallback = document.getElementById('user-avatar-fallback');

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('med_latin_user'));
    } catch(err) {
        currentUser = null;
    }

    // Doctor Face Avatar update
    const savedAvatar = localStorage.getItem('med_doctor_face_avatar');
    if (savedAvatar) {
        if (userAvatarImg) {
            userAvatarImg.src = savedAvatar;
            userAvatarImg.style.display = 'inline-block';
        }
        if (userAvatarFallback) userAvatarFallback.style.display = 'none';
    } else {
        if (userAvatarImg) userAvatarImg.style.display = 'none';
        if (userAvatarFallback) userAvatarFallback.style.display = 'inline-block';
    }

    if (currentUser && currentUser.name) {
        if (openAuthBtn) openAuthBtn.style.display = 'none';
        if (profileBadge) profileBadge.style.display = 'inline-flex';
        if (displayName) displayName.textContent = currentUser.name;
    } else {
        if (openAuthBtn) openAuthBtn.style.display = 'inline-flex';
        if (profileBadge) profileBadge.style.display = 'none';
    }
}

/* ==========================================================================
   11. XUSH KELIBSİZ — ZAMONAVIY TIBBIY KIRISH ANIMATSIYASI (SPLASH SCREEN)
   ========================================================================== */
function initWelcomeSplash() {
    const splashScreen = document.getElementById('app-splash-screen');
    const progressBar = document.getElementById('splash-progress-bar');
    const percentText = document.getElementById('splash-percent-text');
    const statusText = document.getElementById('splash-status-text');

    if (!splashScreen) return;

    let isSplashFinished = false;
    let animFrameId = null;

    function finishSplash() {
        if (isSplashFinished) return;
        isSplashFinished = true;
        if (animFrameId) cancelAnimationFrame(animFrameId);

        if (progressBar) progressBar.style.width = '100%';
        if (percentText) percentText.textContent = '100%';
        if (statusText) statusText.innerHTML = '<i class="fas fa-check-circle" style="color: #34d399;"></i> Xush kelibsiz! MedLatin tayyor.';

        triggerHaptic(25);

        setTimeout(() => {
            splashScreen.classList.add('splash-exit');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                if (typeof window.checkAppSecurityLock === 'function') {
                    window.checkAppSecurityLock();
                }
            }, 450);
        }, 280);
    }

    const startTime = performance.now();
    const duration = 1400; // 1.4 soniya silliq va tezkor to'lish

    function animateProgress(now) {
        if (isSplashFinished) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Silliq kubik harakat
        const ease = 1 - Math.pow(1 - progress, 3);
        const percent = Math.round(ease * 100);

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (percentText) percentText.textContent = `${percent}%`;

        if (statusText) {
            if (percent < 35) {
                statusText.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Tibbiy tizim sozlanmoqda...';
            } else if (percent < 75) {
                statusText.innerHTML = '<i class="fas fa-file-prescription"></i> Retseptlar bazasi yuklanmoqda...';
            } else if (percent < 100) {
                statusText.innerHTML = '<i class="fas fa-stethoscope"></i> Klinik tashxislar tayyorlanmoqda...';
            } else {
                statusText.innerHTML = '<i class="fas fa-check-circle" style="color: #34d399;"></i> Xush kelibsiz!';
            }
        }

        if (progress < 1) {
            animFrameId = requestAnimationFrame(animateProgress);
        } else {
            finishSplash();
        }
    }

    animFrameId = requestAnimationFrame(animateProgress);

    // Ekranni bosish orqali darhol kirish
    splashScreen.addEventListener('click', () => {
        finishSplash();
    });
}

/* ==========================================================================
   12. BIOMETRIC FACE ID & 4-DIGIT PIN SECURITY SYSTEM (SHIFOKOR HIMOYASI)
   ========================================================================== */
function initSecuritySystem() {
    const secScreen = document.getElementById('app-security-screen');
    if (!secScreen) return;

    // Tabs
    const tabFace = document.getElementById('sec-tab-face');
    const tabPin = document.getElementById('sec-tab-pin');
    const panelFace = document.getElementById('sec-panel-face');
    const panelPin = document.getElementById('sec-panel-pin');
    const switchToPinBtn = document.getElementById('btn-switch-to-pin');
    const switchToFaceBtn = document.getElementById('pin-pad-switch-face');

    // Face elements
    const faceVideo = document.getElementById('face-video');
    const faceCanvas = document.getElementById('face-canvas');
    const faceStatusBox = document.getElementById('face-status-box');
    const faceStatusIcon = document.getElementById('face-status-icon');
    const faceStatusTitle = document.getElementById('face-status-title');
    const faceStatusSub = document.getElementById('face-status-sub');
    const faceCamPlaceholder = document.getElementById('face-cam-placeholder');
    const faceRegisterBox = document.getElementById('face-register-box');
    const registerFaceBtn = document.getElementById('btn-register-face');
    const laserLine = document.getElementById('face-laser-line');

    // PIN elements
    const pinCircles = document.querySelectorAll('.pin-circle');
    const pinAlertNotice = document.getElementById('pin-alert-notice');
    const pinPadButtons = document.querySelectorAll('.pin-pad-btn[data-key]');
    const pinDelBtn = document.getElementById('pin-pad-del');
    const pinPromptTitle = document.getElementById('pin-prompt-title');
    const pinPromptSub = document.getElementById('pin-prompt-sub');
    const pinSetupActions = document.getElementById('pin-setup-actions');
    const cancelPinSetupBtn = document.getElementById('btn-cancel-pin-setup');

    // Header & Modal elements
    const quickLockBtn = document.getElementById('header-lock-quick-btn');
    const headerLockBtn = document.getElementById('lock-app-btn');
    const openSecSettingsBtn = document.getElementById('open-sec-settings-btn');
    const secSettingsModal = document.getElementById('security-settings-modal');
    const closeSecSettingsBtn = document.getElementById('close-sec-settings-btn');
    const btnReregisterFace = document.getElementById('btn-reregister-face');
    const btnChangePin = document.getElementById('btn-change-pin');
    const btnLockFromSettings = document.getElementById('btn-lock-from-settings');
    const settingsAvatarImg = document.getElementById('settings-avatar-img');
    const settingsAvatarFallback = document.getElementById('settings-avatar-icon-fallback');
    const settingsFaceStatus = document.getElementById('settings-face-status');

    // Internal state
    let activeStream = null;
    let faceCheckTimer = null;
    let pinInput = '';
    let pinSetupMode = false; // false = unlock mode, 'new' = enter new pin, 'confirm' = confirm new pin
    let tempNewPin = '';
    let isScreenLocked = false;
    let consecutiveMatches = 0;

    // Helper: Stored PIN
    function getStoredPin() {
        return localStorage.getItem('med_doctor_pin') || '1234';
    }

    // Helper: Stored Face Vector
    function getStoredFaceVector() {
        try {
            const raw = localStorage.getItem('med_doctor_face_vector');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function isFaceRegistered() {
        return !!getStoredFaceVector();
    }

    // Status helper
    function updateStatusBox(state, title, subtitle) {
        if (!faceStatusBox) return;
        faceStatusBox.className = 'face-status-box';
        if (state === 'success') faceStatusBox.classList.add('success');
        if (state === 'error') faceStatusBox.classList.add('error');

        if (faceStatusIcon) {
            if (state === 'success') {
                faceStatusIcon.innerHTML = '<i class="fas fa-check-circle" style="color: #34d399;"></i>';
            } else if (state === 'error') {
                faceStatusIcon.innerHTML = '<i class="fas fa-times-circle" style="color: #f87171;"></i>';
            } else {
                faceStatusIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
            }
        }

        if (title && faceStatusTitle) faceStatusTitle.textContent = title;
        if (subtitle && faceStatusSub) faceStatusSub.textContent = subtitle;
    }

    // Biometric Face Feature Extractor
    function extractFaceFeatures(video, canvas) {
        if (!video || video.readyState < 2) return null;
        const w = 96;
        const h = 96;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const vw = video.videoWidth || 320;
        const vh = video.videoHeight || 240;
        const size = Math.min(vw, vh);
        const sx = (vw - size) / 2;
        const sy = (vh - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Luminance Variance check (anti-blank/anti-dark check)
        let totalLum = 0;
        const lumValues = [];
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLum += lum;
            lumValues.push(lum);
        }
        const meanLum = totalLum / lumValues.length;

        let variance = 0;
        for (let i = 0; i < lumValues.length; i += 8) {
            const diff = lumValues[i] - meanLum;
            variance += diff * diff;
        }
        variance = variance / (lumValues.length / 8);

        if (variance < 22 || meanLum < 12 || meanLum > 245) {
            return { valid: false, reason: 'low_contrast' };
        }

        // 6x6 Spatial Grid Luminance Vector (36 features)
        const gridSize = 6;
        const cellW = Math.floor(w / gridSize);
        const cellH = Math.floor(h / gridSize);
        const vector = [];

        for (let gy = 0; gy < gridSize; gy++) {
            for (let gx = 0; gx < gridSize; gx++) {
                let cellLum = 0;
                let cellCount = 0;
                for (let y = gy * cellH; y < (gy + 1) * cellH; y++) {
                    for (let x = gx * cellW; x < (gx + 1) * cellW; x++) {
                        const idx = (y * w + x) * 4;
                        cellLum += 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                        cellCount++;
                    }
                }
                vector.push(cellLum / (cellCount * 255));
            }
        }

        // Color and Edge balance features (12 features)
        for (let t = 0; t < 4; t++) {
            let rSum = 0, gSum = 0, bSum = 0, cnt = 0;
            const yStart = t * 24;
            const yEnd = (t + 1) * 24;
            for (let y = yStart; y < yEnd; y++) {
                for (let x = 16; x < 80; x++) {
                    const idx = (y * w + x) * 4;
                    rSum += data[idx];
                    gSum += data[idx + 1];
                    bSum += data[idx + 2];
                    cnt++;
                }
            }
            const avgR = rSum / (cnt || 1);
            const avgG = gSum / (cnt || 1);
            const avgB = bSum / (cnt || 1);
            vector.push((avgR - avgG) / (avgR + avgG + 10));
            vector.push((avgR - avgB) / (avgR + avgB + 10));
            vector.push((avgR + avgG + avgB) / 765);
        }

        // Generate small avatar thumbnail
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 72;
        thumbCanvas.height = 72;
        const tCtx = thumbCanvas.getContext('2d');
        if (tCtx) {
            tCtx.drawImage(canvas, 0, 0, 72, 72);
        }
        const avatarUrl = thumbCanvas.toDataURL('image/jpeg', 0.82);

        return {
            valid: true,
            vector: vector,
            avatar: avatarUrl
        };
    }

    // Cosine similarity
    function calculateVectorSimilarity(v1, v2) {
        if (!v1 || !v2 || v1.length !== v2.length) return 0;
        let dot = 0;
        let mag1 = 0;
        let mag2 = 0;
        for (let i = 0; i < v1.length; i++) {
            dot += v1[i] * v2[i];
            mag1 += v1[i] * v1[i];
            mag2 += v2[i] * v2[i];
        }
        if (mag1 === 0 || mag2 === 0) return 0;
        return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
    }

    // Camera Lifecycle
    async function startCamera() {
        stopCamera();
        if (faceCamPlaceholder) faceCamPlaceholder.style.display = 'flex';
        updateStatusBox('loading', 'Kamera faollashtirilmoqda...', 'Yuzingizni kameraning o\'rtasiga qarating');

        try {
            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: 480 },
                    height: { ideal: 480 }
                },
                audio: false
            };
            activeStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (faceVideo) {
                faceVideo.srcObject = activeStream;
                faceVideo.onloadedmetadata = () => {
                    faceVideo.play().catch(() => {});
                    if (faceCamPlaceholder) faceCamPlaceholder.style.display = 'none';
                    startFaceVerificationLoop();
                };
            }
        } catch (err) {
            console.warn("Camera could not start:", err);
            if (faceCamPlaceholder) {
                faceCamPlaceholder.style.display = 'flex';
                faceCamPlaceholder.innerHTML = `<i class="fas fa-video-slash" style="color: #f87171;"></i><p>Kamera topilmadi yoki ruxsat berilmadi</p>`;
            }
            updateStatusBox('error', 'Kameradan foydalanish imkoni yo\'q', '4 xonali PIN kod orqali kiring');
            setTimeout(() => {
                if (isScreenLocked) switchTab('pin');
            }, 1200);
        }
    }

    function stopCamera() {
        if (faceCheckTimer) {
            clearInterval(faceCheckTimer);
            faceCheckTimer = null;
        }
        if (activeStream) {
            try {
                activeStream.getTracks().forEach(track => track.stop());
            } catch (e) {}
            activeStream = null;
        }
        if (faceVideo) {
            faceVideo.srcObject = null;
        }
        consecutiveMatches = 0;
    }

    // Real-time verification loop
    function startFaceVerificationLoop() {
        if (faceCheckTimer) clearInterval(faceCheckTimer);
        consecutiveMatches = 0;

        faceCheckTimer = setInterval(() => {
            if (!isScreenLocked || !faceVideo || faceVideo.paused || faceVideo.ended) return;

            const registered = isFaceRegistered();
            if (!registered) {
                if (faceRegisterBox) faceRegisterBox.style.display = 'block';
                updateStatusBox('loading', "Face ID o'rnatilmagan", "Yuzingizni 1 marta skanerlab saqlang");
                return;
            } else {
                if (faceRegisterBox) faceRegisterBox.style.display = 'none';
            }

            const sample = extractFaceFeatures(faceVideo, faceCanvas);
            if (!sample || !sample.valid) {
                updateStatusBox('loading', "Yuz aniqlanmoqda...", "Yuzingizni kameraga to'g'rilang");
                consecutiveMatches = 0;
                return;
            }

            const storedVector = getStoredFaceVector();
            const similarity = calculateVectorSimilarity(sample.vector, storedVector);

            if (similarity >= 0.88) {
                consecutiveMatches++;
                if (consecutiveMatches >= 2) {
                    consecutiveMatches = 0;
                    clearInterval(faceCheckTimer);
                    faceCheckTimer = null;
                    updateStatusBox('success', '✅ Shifokor yuzi tasdiqlandi!', 'Xush kelibsiz! Dastur ochilmoqda...');
                    triggerHaptic(30);

                    if (laserLine) {
                        laserLine.style.background = '#34d399';
                        laserLine.style.boxShadow = '0 0 20px 8px rgba(52, 211, 153, 0.9)';
                    }

                    setTimeout(() => {
                        unlockApp('Face ID orqali muvaffaqiyatli kirildi');
                    }, 400);
                }
            } else {
                consecutiveMatches = 0;
                updateStatusBox('error', '❌ Begona yuz aniqlandi!', 'Tizim faqat ro\'yxatdan o\'tgan shifokorga ochiladi');
                triggerHaptic(15);
            }
        }, 320);
    }

    // Register Face Action (1 marta skanerlab saqlash)
    if (registerFaceBtn) {
        registerFaceBtn.addEventListener('click', () => {
            triggerHaptic(20);
            if (!faceVideo || faceVideo.readyState < 2) {
                showToast("Iltimos, kamera to'liq ochilishini kuting", 'warning');
                return;
            }

            registerFaceBtn.disabled = true;
            registerFaceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skanerlanmoqda...';
            updateStatusBox('loading', 'Yuz skanerlanmoqda...', 'Kameraga qarab turing...');

            setTimeout(() => {
                const sample = extractFaceFeatures(faceVideo, faceCanvas);
                if (!sample || !sample.valid) {
                    registerFaceBtn.disabled = false;
                    registerFaceBtn.innerHTML = '<i class="fas fa-user-check"></i> Yuzni Bir Marta Skanerlash va Saqlash';
                    updateStatusBox('error', 'Yuz aniqlanmadi!', 'Yuzingizni kameraning o\'rtasiga to\'g\'rilang va qayta bosing');
                    triggerHaptic(35);
                    return;
                }

                localStorage.setItem('med_doctor_face_vector', JSON.stringify(sample.vector));
                if (sample.avatar) {
                    localStorage.setItem('med_doctor_face_avatar', sample.avatar);
                }
                localStorage.setItem('med_face_registered', 'true');

                updateStatusBox('success', '✅ Yuz muvaffaqiyatli saqlandi!', 'Tizim faqat sizning yuzingizga ochiladi');
                triggerHaptic(35);
                updateAuthUI();
                syncSecuritySettingsUI();

                setTimeout(() => {
                    registerFaceBtn.disabled = false;
                    registerFaceBtn.innerHTML = '<i class="fas fa-user-check"></i> Yuzni Bir Marta Skanerlash va Saqlash';
                    unlockApp('Face ID muvaffaqiyatli sozlandi!');
                }, 500);
            }, 600);
        });
    }

    // PIN Management Functions
    function resetPinUI() {
        pinInput = '';
        updatePinDots('normal');
        clearPinNotice();
        if (pinPromptTitle) {
            pinPromptTitle.textContent = pinSetupMode ? "Yangi 4 xonali PIN kodni kiriting" : "4 xonali PIN kodni kiriting";
        }
        if (pinPromptSub) {
            pinPromptSub.textContent = "Shaxsiy 4 ta raqamli xavfsizlik kodingiz";
        }
        if (pinSetupActions) {
            pinSetupActions.style.display = pinSetupMode ? 'block' : 'none';
        }
    }

    function clearPinNotice() {
        if (pinAlertNotice) {
            pinAlertNotice.style.display = 'none';
            pinAlertNotice.textContent = '';
        }
    }

    function showPinNotice(msg, type = 'error') {
        if (!pinAlertNotice) return;
        pinAlertNotice.style.display = 'block';
        pinAlertNotice.textContent = msg;
        pinAlertNotice.style.color = type === 'success' ? '#34d399' : (type === 'info' ? '#38bdf8' : '#f87171');
    }

    function updatePinDots(state = 'normal') {
        const len = pinInput.length;
        pinCircles.forEach((circle, idx) => {
            circle.className = 'pin-circle';
            if (state === 'success') {
                circle.classList.add('success');
            } else if (state === 'error') {
                circle.classList.add('error');
            } else if (idx < len) {
                circle.classList.add('filled');
            }
        });
    }

    function triggerPinShake() {
        const row = document.getElementById('pin-dots-row');
        if (row) {
            row.classList.remove('pin-shake');
            void row.offsetWidth;
            row.classList.add('pin-shake');
        }
    }

    function handlePinInput(key) {
        if (pinInput.length >= 4) return;
        pinInput += key;
        triggerHaptic(12);
        updatePinDots('normal');
        clearPinNotice();

        if (pinInput.length === 4) {
            processCompletePin();
        }
    }

    function handlePinDelete() {
        if (pinInput.length > 0) {
            pinInput = pinInput.slice(0, -1);
            triggerHaptic(10);
            updatePinDots('normal');
            clearPinNotice();
        }
    }

    function processCompletePin() {
        if (pinSetupMode === 'new') {
            tempNewPin = pinInput;
            pinSetupMode = 'confirm';
            pinInput = '';
            updatePinDots('normal');
            if (pinPromptTitle) pinPromptTitle.textContent = "Yangi PIN kodni tasdiqlang";
            if (pinPromptSub) pinPromptSub.textContent = "4 xonali kodni takroran kiriting";
            showPinNotice("Kodni qaytadan kiriting", 'info');
            return;
        }

        if (pinSetupMode === 'confirm') {
            if (pinInput === tempNewPin) {
                localStorage.setItem('med_doctor_pin', pinInput);
                pinSetupMode = false;
                updatePinDots('success');
                showPinNotice("✅ Yangi PIN kod muvaffaqiyatli o'rnatildi!", 'success');
                triggerHaptic(30);
                setTimeout(() => {
                    resetPinUI();
                    unlockApp("Yangi PIN kod o'rnatildi");
                }, 500);
            } else {
                updatePinDots('error');
                triggerPinShake();
                showPinNotice("❌ PIN kodlar mos kelmadi! Qaytadan kiriting", 'error');
                triggerHaptic(40);
                setTimeout(() => {
                    pinSetupMode = 'new';
                    pinInput = '';
                    tempNewPin = '';
                    updatePinDots('normal');
                    if (pinPromptTitle) pinPromptTitle.textContent = "Yangi 4 xonali PIN kodni kiriting";
                    if (pinPromptSub) pinPromptSub.textContent = "Shaxsiy 4 ta raqamli xavfsizlik kodingiz";
                }, 800);
            }
            return;
        }

        // Normal Unlock
        const savedPin = getStoredPin();
        if (pinInput === savedPin) {
            updatePinDots('success');
            showPinNotice("✅ PIN kod to'g'ri! MedLatin ochilmoqda...", 'success');
            triggerHaptic(25);
            setTimeout(() => {
                unlockApp("PIN kod orqali kirildi");
            }, 350);
        } else {
            updatePinDots('error');
            triggerPinShake();
            showPinNotice("❌ PIN kod noto'g'ri! Qayta urinib ko'ring", 'error');
            triggerHaptic(45);
            setTimeout(() => {
                pinInput = '';
                updatePinDots('normal');
            }, 600);
        }
    }

    // Attach keypad events
    pinPadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            if (key) handlePinInput(key);
        });
    });

    if (pinDelBtn) {
        pinDelBtn.addEventListener('click', handlePinDelete);
    }

    if (cancelPinSetupBtn) {
        cancelPinSetupBtn.addEventListener('click', () => {
            pinSetupMode = false;
            pinInput = '';
            tempNewPin = '';
            resetPinUI();
        });
    }

    // Keyboard support for PIN entry
    document.addEventListener('keydown', (e) => {
        if (!isScreenLocked || !panelPin || panelPin.style.display === 'none') return;
        if (/^[0-9]$/.test(e.key)) {
            handlePinInput(e.key);
        } else if (e.key === 'Backspace') {
            handlePinDelete();
        }
    });

    // Tab Switching
    function switchTab(mode) {
        if (mode === 'face') {
            if (tabFace) tabFace.classList.add('active');
            if (tabPin) tabPin.classList.remove('active');
            if (panelFace) panelFace.style.display = 'flex';
            if (panelPin) panelPin.style.display = 'none';
            startCamera();
        } else {
            if (tabPin) tabPin.classList.add('active');
            if (tabFace) tabFace.classList.remove('active');
            if (panelPin) panelPin.style.display = 'flex';
            if (panelFace) panelFace.style.display = 'none';
            stopCamera();
            resetPinUI();
        }
    }

    if (tabFace) tabFace.addEventListener('click', () => switchTab('face'));
    if (tabPin) tabPin.addEventListener('click', () => switchTab('pin'));
    if (switchToPinBtn) switchToPinBtn.addEventListener('click', () => switchTab('pin'));
    if (switchToFaceBtn) switchToFaceBtn.addEventListener('click', () => switchTab('face'));

    // Lock and Unlock lifecycle
    function lockApp(reason) {
        isScreenLocked = true;
        secScreen.style.display = 'flex';
        secScreen.classList.remove('animated-fade-out');

        resetPinUI();
        switchTab('face');
        syncSecuritySettingsUI();
        triggerHaptic(20);
    }

    function unlockApp(toastMessage) {
        isScreenLocked = false;
        stopCamera();
        secScreen.classList.add('animated-fade-out');
        setTimeout(() => {
            secScreen.style.display = 'none';
            secScreen.classList.remove('animated-fade-out');
        }, 250);

        updateAuthUI();
        syncSecuritySettingsUI();
        if (toastMessage) {
            showToast(toastMessage, 'success');
        }
    }

    // Expose lock functions globally
    window.checkAppSecurityLock = function() {
        lockApp();
    };
    window.lockAppNow = lockApp;

    // Security Settings Modal Sync
    function syncSecuritySettingsUI() {
        const hasFace = isFaceRegistered();
        const savedAvatar = localStorage.getItem('med_doctor_face_avatar');
        let currentUser = null;
        try {
            currentUser = JSON.parse(localStorage.getItem('med_latin_user'));
        } catch(e) {}

        const doctorName = currentUser && currentUser.name ? currentUser.name : 'Shifokor';
        const settingsUserName = document.getElementById('settings-user-name');
        if (settingsUserName) settingsUserName.textContent = doctorName;

        if (savedAvatar) {
            if (settingsAvatarImg) {
                settingsAvatarImg.src = savedAvatar;
                settingsAvatarImg.style.display = 'block';
            }
            if (settingsAvatarFallback) settingsAvatarFallback.style.display = 'none';
        } else {
            if (settingsAvatarImg) settingsAvatarImg.style.display = 'none';
            if (settingsAvatarFallback) settingsAvatarFallback.style.display = 'flex';
        }

        if (settingsFaceStatus) {
            settingsFaceStatus.innerHTML = hasFace
                ? `<i class="fas fa-check-circle" style="color: #34d399;"></i> Face ID holati: <span>Faol (Saqlangan)</span>`
                : `<i class="fas fa-exclamation-triangle" style="color: #fbbf24;"></i> Face ID holati: <span style="color:#fbbf24;">O'rnatilmagan</span>`;
        }
    }

    // Header buttons
    if (quickLockBtn) {
        quickLockBtn.addEventListener('click', () => {
            lockApp();
        });
    }

    if (headerLockBtn) {
        headerLockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            lockApp();
        });
    }

    if (openSecSettingsBtn && secSettingsModal) {
        openSecSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            syncSecuritySettingsUI();
            secSettingsModal.style.display = 'flex';
            triggerHaptic(15);
        });
    }

    if (closeSecSettingsBtn && secSettingsModal) {
        closeSecSettingsBtn.addEventListener('click', () => {
            secSettingsModal.style.display = 'none';
        });
    }

    if (secSettingsModal) {
        secSettingsModal.addEventListener('click', (e) => {
            if (e.target === secSettingsModal) {
                secSettingsModal.style.display = 'none';
            }
        });
    }

    if (btnLockFromSettings) {
        btnLockFromSettings.addEventListener('click', () => {
            if (secSettingsModal) secSettingsModal.style.display = 'none';
            lockApp();
        });
    }

    if (btnReregisterFace) {
        btnReregisterFace.addEventListener('click', () => {
            if (secSettingsModal) secSettingsModal.style.display = 'none';
            lockApp();
            switchTab('face');
            if (faceRegisterBox) faceRegisterBox.style.display = 'block';
            updateStatusBox('loading', 'Yangi yuz nusxasi', 'Yuzingizni kameraga qaratib, saqlash tugmasini bosing');
        });
    }

    if (btnChangePin) {
        btnChangePin.addEventListener('click', () => {
            if (secSettingsModal) secSettingsModal.style.display = 'none';
            lockApp();
            switchTab('pin');
            pinSetupMode = 'new';
            tempNewPin = '';
            pinInput = '';
            updatePinDots('normal');
            if (pinPromptTitle) pinPromptTitle.textContent = "Yangi 4 xonali PIN kodni kiriting";
            if (pinPromptSub) pinPromptSub.textContent = "Yangi 4 ta raqam kiriting";
            if (pinSetupActions) pinSetupActions.style.display = 'block';
            showPinNotice("Yangi PIN kodni kiriting", 'info');
        });
    }
}



