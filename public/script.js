/**
 * رفيق رمضان - v4 (Full Rewrite - All fixes)
 */

// ===== Auth Guard (redirect to login if no session) =====
const username = localStorage.getItem('username');
if (!username) {
    window.location.replace('login.html');
}

// ===== Prevent browser back going to login =====
history.pushState({ page: 'app' }, '', window.location.href);
window.addEventListener('popstate', () => {
    history.pushState({ page: 'app' }, '', window.location.href);
    if (window.app) app._navigate('home');
});

// ===== Juz page ranges (standard Uthmani Hafs) =====
const JUZ_PAGES = [
    [1, 21], [22, 41], [42, 61], [62, 81], [82, 101], [102, 121], [122, 141], [142, 161], [162, 181], [182, 201],
    [202, 221], [222, 241], [242, 261], [262, 281], [282, 301], [302, 321], [322, 341], [342, 361], [362, 381],
    [382, 401], [402, 421], [422, 441], [442, 461], [462, 481], [482, 501], [502, 521], [522, 541], [542, 561],
    [562, 581], [582, 604]
];

// ===== Tasbeeh Azkar Options =====
const AZKAR_OPTIONS = [
    { id: 0, label: 'سبحان الله', arabic: 'سُبْحَانَ اللَّه', milestone: 33 },
    { id: 1, label: 'الحمد لله', arabic: 'اَلْحَمْدُ لِلَّه', milestone: 33 },
    { id: 2, label: 'الله أكبر', arabic: 'اَللَّهُ أَكْبَر', milestone: 33 },
    { id: 3, label: 'استغفر الله', arabic: 'أَسْتَغْفِرُ اللَّه', milestone: 100 },
    { id: 4, label: 'لا إله إلا الله', arabic: 'لَا إِلَهَ إِلَّا اللَّه', milestone: 100 },
    { id: 5, label: 'سبحان الله وبحمده', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِه', milestone: 100 },
    { id: 6, label: 'لا حول ولا قوة إلا بالله', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّه', milestone: 100 },
    { id: 7, label: 'اللهم صل على النبي', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد', milestone: 100 },
];

// ===== Azkar Data =====
const AZKAR_DATA = {
    morning: [
        { arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...', count: 1, source: 'آية الكرسي - البقرة: 255' },
        { arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 1, source: 'مسلم' },
        { arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.', count: 1, source: 'الترمذي' },
        { arabic: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.', count: 3, source: 'أبو داود' },
        { arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.', count: 3, source: 'أبو داود' },
        { arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.', count: 100, source: 'مسلم' },
        { arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.', count: 1, source: 'الترمذي' }
    ],
    evening: [
        { arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 1, source: 'مسلم' },
        { arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.', count: 1, source: 'الترمذي' },
        { arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.', count: 3, source: 'مسلم' },
        { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ.', count: 1, source: 'أبو داود' },
        { arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ.', count: 3, source: 'أبو داود' },
        { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ.', count: 3, source: 'النسائي' }
    ],
    prayer: [
        { arabic: 'أَسْتَغْفِرُ اللَّهَ.', count: 3, source: 'مسلم' },
        { arabic: 'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ.', count: 1, source: 'مسلم' },
        { arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 1, source: 'البخاري' },
        { arabic: 'اللَّهُمَّ لاَ مَانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.', count: 1, source: 'البخاري ومسلم' },
        { arabic: 'سُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (33) ثم لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 1, source: 'مسلم' },
        { arabic: 'آيَةُ الْكُرْسِيِّ بَعْدَ كُلِّ صَلَاةٍ - من قرأها لم يحل بينه وبين الجنة إلا الموت.', count: 1, source: 'النسائي' }
    ]
};

// ==========================================
// ===== Main App Class =====
// ==========================================
class RamadanApp {
    constructor() {
        this.duaaData = [];
        this.quranPage = 1;
        this.quranJuz = 1;
        this.state = {
            currentSection: 'home',
            theme: localStorage.getItem('theme') || 'dark',
            tasbeehCount: parseInt(localStorage.getItem('tasbeehCount')) || 0,
            selectedAzkar: parseInt(localStorage.getItem('selectedAzkar')) || 0,
            khatmaGoal: parseInt(localStorage.getItem('khatmaGoal')) || 1,
            completedJuz: JSON.parse(localStorage.getItem('completedJuz') || '[]'),
            soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
            coordinates: JSON.parse(localStorage.getItem('coordinates') || 'null'),
            notifInterval: parseInt(localStorage.getItem('notifInterval')) || 0,
            dailyReading: JSON.parse(localStorage.getItem('dailyReading') || '{}'),
            lastReadingDate: localStorage.getItem('lastReadingDate') || new Date().toDateString(),
            _nextPrayerTime: null,
            prayerTimes: null,
            intervalId: null,
            countdownTimer: null,
        };
        this._initApp();
    }

    // ------------------------------------------
    async _initApp() {
        this._checkDayReset();
        this._applyTheme();
        this._setupListeners();
        this.renderAzkar('morning');
        this._renderTasbeehAzkarSelector();
        this._updateTasbeehDisplay();
        this._updateQuranPlanner();
        this._renderJuzGrid();
        this._updateHijriDate();
        this._restoreReadingChecks();
        this._updateGreeting();

        // Duaa
        await this._loadDuaa();

        // Prayer times
        if (this.state.coordinates) {
            this._calculatePrayerTimes();
        } else {
            this._autoDetectLocation();
        }

        this._startNotifTimer();

        // First-use wizard
        if (!localStorage.getItem('setupDone')) {
            setTimeout(() => this._showSetupWizard(), 1200);
        }
    }

    // ------------------------------------------
    // ===== Dashboard Greeting =====
    // ------------------------------------------
    _updateGreeting() {
        const el = document.getElementById('greeting-text');
        if (!el) return;
        const firstName = username.split(' ')[0];
        el.innerHTML = `رمضان كريم وكل سنه وانتم طيبين 🌙<br>
            <small style="font-size:1rem; opacity:0.9; font-weight:500;">
                أهلاً بك ${firstName} ✨
            </small>`;
    }

    // ------------------------------------------
    // ===== Setup Wizard =====
    // ------------------------------------------
    _showSetupWizard() {
        const m = document.getElementById('setup-modal');
        if (m) m.style.display = 'flex';
    }

    closeSetupWizard() {
        const m = document.getElementById('setup-modal');
        if (m) m.style.display = 'none';
        const g = document.getElementById('setup-goal');
        if (g) {
            this.state.khatmaGoal = parseInt(g.value) || 1;
            localStorage.setItem('khatmaGoal', this.state.khatmaGoal);
            this._updateQuranPlanner();
        }
        localStorage.setItem('setupDone', 'true');
        this._autoDetectLocation();
        this._requestNotifPermission();
    }

    // ------------------------------------------
    // ===== Event Listeners =====
    // ------------------------------------------
    _setupListeners() {
        const $ = id => document.getElementById(id);
        const themeBtn = $('theme-toggle');
        const tasbeehBtn = $('tasbeeh-btn');
        const logoutBtn = $('logout-btn');
        const notifSel = $('notif-interval');

        if (themeBtn) themeBtn.addEventListener('click', () => this._toggleTheme());
        if (tasbeehBtn) tasbeehBtn.addEventListener('click', () => this._incrementTasbeeh());
        if (logoutBtn) logoutBtn.addEventListener('click', () => {
            if (confirm('تسجيل الخروج؟')) {
                localStorage.removeItem('username');
                window.location.replace('login.html');
            }
        });
        if (notifSel) notifSel.addEventListener('change', e => this._setNotifInterval(+e.target.value));
    }

    // ------------------------------------------
    // ===== Theme =====
    // ------------------------------------------
    _toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.state.theme);
        this._applyTheme();
    }

    _applyTheme() {
        const btn = document.getElementById('theme-toggle');
        if (this.state.theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    // ------------------------------------------
    // ===== Navigation =====
    // ------------------------------------------
    _navigate(sectionId) {
        document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
        const t = document.getElementById(sectionId);
        if (t) t.classList.add('active-section');

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const map = { home: 0, quran: 1, tasbeeh: 2, duaa: 3 };
        const items = document.querySelectorAll('.nav-item');
        if (map[sectionId] !== undefined && items[map[sectionId]]) {
            items[map[sectionId]].classList.add('active');
        }
        this.state.currentSection = sectionId;
        window.scrollTo(0, 0);
    }

    // ------------------------------------------
    // ===== Settings =====
    // ------------------------------------------
    _openSettings() {
        const m = document.getElementById('settings-modal');
        if (m) m.style.display = 'flex';
        const ls = document.getElementById('location-status');
        if (ls && this.state.coordinates) {
            ls.textContent = `✅ الموقع محفوظ (خط العرض: ${this.state.coordinates.latitude.toFixed(2)})`;
        }
        const ni = document.getElementById('notif-interval');
        if (ni) ni.value = this.state.notifInterval;
    }

    _closeSettings() {
        const m = document.getElementById('settings-modal');
        if (m) m.style.display = 'none';
    }

    // ------------------------------------------
    // ===== Location =====
    // ------------------------------------------
    _autoDetectLocation() {
        if (!navigator.geolocation) { this._setDefaultLocation(); return; }
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.state.coordinates = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                localStorage.setItem('coordinates', JSON.stringify(this.state.coordinates));
                this._calculatePrayerTimes();
            },
            () => this._setDefaultLocation(),
            { timeout: 8000, maximumAge: 600000 }
        );
    }

    _setDefaultLocation() {
        this.state.coordinates = { latitude: 30.0444, longitude: 31.2357 }; // Cairo
        this._calculatePrayerTimes();
    }

    _detectLocation() {
        const ls = document.getElementById('location-status');
        if (!navigator.geolocation) { if (ls) ls.textContent = '❌ المتصفح لا يدعم GPS'; return; }
        if (ls) ls.textContent = '⏳ جاري تحديد الموقع...';
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.state.coordinates = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                localStorage.setItem('coordinates', JSON.stringify(this.state.coordinates));
                if (ls) ls.textContent = '✅ تم تحديث الموقع!';
                this._calculatePrayerTimes();
            },
            () => { if (ls) ls.textContent = '❌ فشل تحديد الموقع.'; }
        );
    }

    // ------------------------------------------
    // ===== Prayer Times =====
    // ------------------------------------------
    _calculatePrayerTimes() {
        if (!this.state.coordinates) return;
        if (!window.adhan) { setTimeout(() => this._calculatePrayerTimes(), 1500); return; }

        const date = new Date();
        const coords = new adhan.Coordinates(this.state.coordinates.latitude, this.state.coordinates.longitude);
        const params = adhan.CalculationMethod.Egyptian();
        params.madhab = adhan.Madhab.Shafi;
        const pt = new adhan.PrayerTimes(coords, date, params);
        this.state.prayerTimes = pt;

        const fmt = t => {
            let h = t.getHours(), m = t.getMinutes();
            const ap = h >= 12 ? 'م' : 'ص';
            h = h % 12 || 12;
            return `${h}:${String(m).padStart(2, '0')} ${ap}`;
        };

        const ARABIC = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
        const EMOJIS = { fajr: '🌅', dhuhr: '☀️', asr: '🌤', maghrib: '🌇', isha: '🌙' };

        // Show prayer list
        const pList = document.getElementById('prayer-times-list');
        if (pList) {
            pList.style.display = 'block';
            pList.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">` +
                ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(p =>
                    `<div style="background:rgba(255,255,255,0.1);padding:8px 10px;border-radius:10px;
                        display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:0.85rem;">${EMOJIS[p]} ${ARABIC[p]}</span>
                        <strong style="color:#86efad;font-size:0.9rem;">${fmt(pt[p])}</strong>
                    </div>`
                ).join('') + '</div>';
        }

        // Next prayer — handle 'none' (after Isha: get tomorrow's Fajr)
        const next = pt.nextPrayer();
        let nextTime = null;
        let nextName = 'الفجر';
        let nextEmoji = '🌅';

        if (next && next !== 'none') {
            nextTime = pt.timeForPrayer(next);
            nextName = ARABIC[next] || 'الفجر';
            nextEmoji = EMOJIS[next] || '🌅';
        } else {
            // After Isha — calculate tomorrow's Fajr
            const tomorrow = new Date(date);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const ptTomorrow = new adhan.PrayerTimes(coords, tomorrow, params);
            nextTime = ptTomorrow.fajr;
            nextName = 'الفجر (غداً)';
            nextEmoji = '🌅';
        }

        this.state._nextPrayerTime = nextTime;

        const nameEl = document.getElementById('next-prayer-name');
        const timeEl = document.getElementById('next-prayer-time');
        if (nameEl) nameEl.textContent = `${nextEmoji} ${nextName}`;
        if (timeEl && nextTime) timeEl.textContent = fmt(nextTime);

        // Start countdown
        if (this.state.countdownTimer) clearInterval(this.state.countdownTimer);
        this._updateCountdown();
        this.state.countdownTimer = setInterval(() => this._updateCountdown(), 1000);
    }

    _updateCountdown() {
        if (!this.state._nextPrayerTime) return;

        const diff = this.state._nextPrayerTime - Date.now();

        if (diff <= 0) {
            // Prayer time reached — recalculate
            clearInterval(this.state.countdownTimer);
            this._calculatePrayerTimes();
            return;
        }

        const totalSec = Math.floor(diff / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;

        const el = document.getElementById('time-remaining');
        if (el) {
            el.textContent = h > 0
                ? `باقي ${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
                : `باقي ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }

    // ------------------------------------------
    // ===== Daily Reset =====
    // ------------------------------------------
    _checkDayReset() {
        const today = new Date().toDateString();
        if (this.state.lastReadingDate !== today) {
            this.state.dailyReading = {};
            this.state.lastReadingDate = today;
            localStorage.setItem('dailyReading', '{}');
            localStorage.setItem('lastReadingDate', today);
        }
    }

    _restoreReadingChecks() {
        Object.entries(this.state.dailyReading).forEach(([prayer, done]) => {
            if (done) {
                const row = document.querySelector(`.prayer-row[data-prayer="${prayer}"]`);
                if (row) row.classList.add('checked');
            }
        });
    }

    // ------------------------------------------
    // ===== Quran Reading Toggle =====
    // ------------------------------------------
    _togglePrayerRead(prayer) {
        const row = document.querySelector(`.prayer-row[data-prayer="${prayer}"]`);
        const isChecked = this.state.dailyReading[prayer];

        if (!isChecked) {
            this.state.dailyReading[prayer] = true;
            if (row) row.classList.add('checked');
            localStorage.setItem('dailyReading', JSON.stringify(this.state.dailyReading));

            // Check if ALL 5 prayers are done today
            const all5Done = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].every(p => this.state.dailyReading[p]);

            if (all5Done) {
                // Auto-mark next incomplete juz
                this._autoMarkNextJuz();
            } else {
                this._triggerCelebration(`أحسنت! 🌟 تسجّلت قراءة ${this._prayerName(prayer)}`);
            }
        } else {
            this.state.dailyReading[prayer] = false;
            if (row) row.classList.remove('checked');
            localStorage.setItem('dailyReading', JSON.stringify(this.state.dailyReading));
        }
    }

    _prayerName(p) {
        return { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' }[p] || p;
    }

    _autoMarkNextJuz() {
        // Find next incomplete juz
        let nextJuz = null;
        for (let i = 1; i <= 30; i++) {
            if (!this.state.completedJuz.includes(i)) { nextJuz = i; break; }
        }

        if (nextJuz === null) {
            // All already completed → khatma celebration
            this._triggerCelebration('🎊 ما شاء الله! أتممت ختمة القرآن الكريم كاملاً! تقبل الله منك 🌙');
            return;
        }

        this.state.completedJuz.push(nextJuz);
        localStorage.setItem('completedJuz', JSON.stringify(this.state.completedJuz));
        this._renderJuzGrid();

        const isKhatma = this.state.completedJuz.length === 30;
        const msg = isKhatma
            ? '🎊 ما شاء الله! أتممت ختمة القرآن الكريم كاملاً! تقبل الله منك 🌙'
            : `ما شاء الله! 🎉 أتممت الجزء ${nextJuz} بإتمام قراءة يومك - رزقك الله الختمة كاملة!`;

        // Always show celebration — delay slightly to let juz grid render first
        setTimeout(() => this._triggerCelebration(msg), 500);
    }

    // ------------------------------------------
    // ===== Quran Viewer =====
    // ------------------------------------------
    _openQuranViewer(juzNum) {
        juzNum = juzNum || this._getNextJuzToRead();
        this.quranJuz = juzNum;
        this.quranPage = JUZ_PAGES[juzNum - 1][0];
        this._showQuranModal();
    }

    _getNextJuzToRead() {
        for (let i = 1; i <= 30; i++) {
            if (!this.state.completedJuz.includes(i)) return i;
        }
        return 1;
    }

    _showQuranModal() {
        const modal = document.getElementById('quran-viewer-modal');
        if (!modal) return;
        modal.style.display = 'flex';
        this._renderQuranPage();
    }

    closeQuranViewer() {
        const modal = document.getElementById('quran-viewer-modal');
        if (modal) modal.style.display = 'none';
    }

    _renderQuranPage() {
        const imgEl = document.getElementById('quran-page-img');
        const infoEl = document.getElementById('quran-page-info');
        const juzInfo = JUZ_PAGES[this.quranJuz - 1];
        const pageNum = this.quranPage;
        const padded = String(pageNum).padStart(3, '0');

        if (infoEl) {
            infoEl.textContent = `الجزء ${this.quranJuz} | صفحة ${pageNum} من ${juzInfo[1]}`;
        }

        // ===== Quran Page CDN sources (tested - ordered by reliability) =====
        const SOURCES = [
            // #1: Islamic Network CDN — confirmed 200 OK ✅ (high-resolution colored tajweed)
            `https://cdn.islamic.network/quran/images/high-resolution/${pageNum}.png`,
            // #2: QuranFlash with www prefix (301 redirect target) ✅
            `https://www.quranflash.com/assets/jQ/pages/p${padded}.jpg`,
            // #3: QuranFlash without www (follows 301 to #2)
            `https://quranflash.com/assets/jQ/pages/p${padded}.jpg`,
            // #4: Amazon S3 backup
            `https://quran-images.s3.eu-west-1.amazonaws.com/hafs/${pageNum}.png`,
        ];

        if (imgEl) {
            imgEl.src = '';
            imgEl.style.opacity = '0';
            imgEl.style.display = 'block';
            imgEl.alt = `صفحة ${pageNum}`;

            // Hide fallback text from previous attempt
            const fb = document.getElementById('quran-text-fallback');
            if (fb) { fb.style.display = 'none'; fb.innerHTML = ''; }

            let srcIndex = 0;

            const tryLoad = () => {
                if (srcIndex >= SOURCES.length) {
                    // All CDNs failed — show text fallback with direct link
                    imgEl.style.display = 'none';
                    if (fb) {
                        fb.style.display = 'block';
                        fb.innerHTML = `
                            <div style="text-align:center; padding:20px; background:rgba(16,185,129,0.1); border-radius:12px; margin:10px 0;">
                                <i class="fa-solid fa-circle-exclamation" style="color:#F59E0B; font-size:2rem; display:block; margin-bottom:10px;"></i>
                                <p style="opacity:0.8; margin-bottom:12px;">تعذّر تحميل صورة الصفحة. اضغط الزر أدناه لقراءتها مباشرة:</p>
                                <a href="https://quran.com/page/${pageNum}" target="_blank" rel="noopener"
                                   style="display:inline-block; background:#10B981; color:white; padding:10px 20px;
                                          border-radius:10px; text-decoration:none; font-weight:700; font-size:1rem;">
                                    <i class="fa-solid fa-book-open"></i> افتح صفحة ${pageNum} مباشرة
                                </a>
                            </div>`;
                    }
                    return;
                }

                const url = SOURCES[srcIndex];
                const tmp = new Image();
                tmp.crossOrigin = 'anonymous';
                tmp.onload = () => {
                    imgEl.src = url;
                    imgEl.style.opacity = '1';
                    imgEl.style.display = 'block';
                };
                tmp.onerror = () => { srcIndex++; tryLoad(); };
                // Small timeout between attempts to avoid blocking
                setTimeout(() => { tmp.src = url; }, srcIndex * 100);
            };

            tryLoad();
        }

        // Update navigation buttons
        const juzStart = JUZ_PAGES[this.quranJuz - 1][0];
        const juzEnd = JUZ_PAGES[this.quranJuz - 1][1];
        const prevBtn = document.getElementById('qv-prev');
        const nextBtn = document.getElementById('qv-next');
        if (prevBtn) prevBtn.disabled = (pageNum <= juzStart);
        if (nextBtn) nextBtn.disabled = (pageNum >= juzEnd);
    }

    quranPrevPage() {
        const juzStart = JUZ_PAGES[this.quranJuz - 1][0];
        if (this.quranPage > juzStart) { this.quranPage--; this._renderQuranPage(); }
    }

    quranNextPage() {
        const juzEnd = JUZ_PAGES[this.quranJuz - 1][1];
        if (this.quranPage < juzEnd) { this.quranPage++; this._renderQuranPage(); }
    }

    // ------------------------------------------
    // ===== Azkar =====
    // ------------------------------------------
    renderAzkar(type) {
        const list = document.getElementById('azkar-list');
        if (!list) return;
        list.innerHTML = '';

        (AZKAR_DATA[type] || AZKAR_DATA.morning).forEach(item => {
            const c = document.createElement('div');
            c.className = 'azkar-card';
            c.innerHTML = `
                <p class="arabic-text">${item.arabic}</p>
                ${item.count > 1 ? `<span class="count-badge"><i class="fa-solid fa-rotate-right"></i> ${item.count} مرة</span>` : ''}
                <br>
                <span class="source-text"><i class="fa-solid fa-book-open-reader"></i> ${item.source}</span>
            `;
            list.appendChild(c);
        });

        document.querySelectorAll('.tab-btn').forEach((t, i) => {
            t.classList.toggle('active', i === { morning: 0, evening: 1, prayer: 2 }[type]);
        });
    }

    // ------------------------------------------
    // ===== Tasbeeh Azkar Selector =====
    // ------------------------------------------
    _renderTasbeehAzkarSelector() {
        const container = document.getElementById('azkar-selector-list');
        if (!container) return;
        container.innerHTML = '';
        AZKAR_OPTIONS.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'azkar-chip' + (i === this.state.selectedAzkar ? ' active' : '');
            btn.textContent = opt.label;
            btn.onclick = () => this._selectAzkar(i);
            container.appendChild(btn);
        });
        this._updateTasbeehArabicDisplay();
    }

    _selectAzkar(index) {
        this.state.selectedAzkar = index;
        localStorage.setItem('selectedAzkar', index);
        // Reset count for new azkar type
        this.state.tasbeehCount = 0;
        localStorage.setItem('tasbeehCount', 0);
        this._updateTasbeehDisplay();
        // Update chips
        document.querySelectorAll('.azkar-chip').forEach((c, i) => {
            c.classList.toggle('active', i === index);
        });
        this._updateTasbeehArabicDisplay();
        const label = document.getElementById('tasbeeh-label');
        if (label) label.textContent = 'ابدأ الآن';
    }

    _updateTasbeehArabicDisplay() {
        const el = document.getElementById('tasbeeh-arabic-display');
        const opt = AZKAR_OPTIONS[this.state.selectedAzkar];
        if (el && opt) {
            el.textContent = opt.arabic;
        }
    }

    // ------------------------------------------
    // ===== Tasbeeh Counter =====
    // ------------------------------------------
    _incrementTasbeeh() {
        this.state.tasbeehCount++;
        localStorage.setItem('tasbeehCount', this.state.tasbeehCount);
        this._updateTasbeehDisplay();
        if (navigator.vibrate) navigator.vibrate(40);
        if (this.state.soundEnabled) this._playBeep();

        const opt = AZKAR_OPTIONS[this.state.selectedAzkar];
        const milestone = opt ? opt.milestone : 33;
        const count = this.state.tasbeehCount;
        const label = document.getElementById('tasbeeh-label');

        if (count % milestone === 0) {
            this._triggerCelebration(`ما شاء الله! 🌿 أتممت ${count} مرة من ${opt.label}`);
            if (label) label.textContent = `✨ ${count} - أحسنت!`;
        } else {
            const rem = milestone - (count % milestone);
            if (label) label.textContent = `${rem} للوصول لـ ${milestone}`;
        }
    }

    _playBeep() {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g); g.connect(ctx.destination);
            osc.frequency.value = 880;
            g.gain.value = 0.04;
            osc.start(); setTimeout(() => { osc.stop(); ctx.close(); }, 60);
        } catch (e) { }
    }

    _resetTasbeeh() {
        if (!confirm('تصفير العداد؟')) return;
        this.state.tasbeehCount = 0;
        localStorage.setItem('tasbeehCount', 0);
        this._updateTasbeehDisplay();
        const label = document.getElementById('tasbeeh-label');
        if (label) label.textContent = 'ابدأ التسبيح';
    }

    _updateTasbeehDisplay() {
        const el = document.getElementById('tasbeeh-count');
        if (el) el.textContent = this.state.tasbeehCount;
    }

    _toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        localStorage.setItem('soundEnabled', this.state.soundEnabled);
        const btn = document.getElementById('sound-btn');
        if (btn) btn.innerHTML = this.state.soundEnabled
            ? '<i class="fa-solid fa-volume-high"></i>'
            : '<i class="fa-solid fa-volume-xmark"></i>';
    }

    // ------------------------------------------
    // ===== Quran Planner =====
    // ------------------------------------------
    _updateQuranPlanner() {
        const goal = this.state.khatmaGoal;
        const pagesDay = Math.ceil((604 * goal) / 30);
        const perPrayer = Math.ceil(pagesDay / 5);
        const $ = id => document.getElementById(id);
        if ($('daily-pages')) $('daily-pages').textContent = pagesDay;
        if ($('khatma-goal-display')) $('khatma-goal-display').textContent = goal;
        ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(p => {
            if ($(`pages-${p}`)) $(`pages-${p}`).textContent = `${perPrayer} ص`;
        });
    }

    _adjustGoal(n) {
        let g = Math.max(1, Math.min(10, this.state.khatmaGoal + n));
        this.state.khatmaGoal = g;
        localStorage.setItem('khatmaGoal', g);
        this._updateQuranPlanner();
    }

    _renderJuzGrid() {
        const grid = document.getElementById('juz-grid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 1; i <= 30; i++) {
            const done = this.state.completedJuz.includes(i);
            const box = document.createElement('div');
            box.className = 'juz-box' + (done ? ' completed' : '');
            box.innerHTML = done
                ? `<i class="fa-solid fa-check" style="font-size:0.8rem;"></i><small>${i}</small>`
                : `${i}`;
            box.title = `الجزء ${i} - اضغط لفتح صفحاته`;
            box.addEventListener('click', () => this._openQuranViewer(i));
            grid.appendChild(box);
        }
        this._updateHomeProgress();
    }

    _updateHomeProgress() {
        const done = this.state.completedJuz.length;
        const circle = document.querySelector('.progress-ring__circle');
        if (circle) {
            const r = 33;
            const circ = 2 * Math.PI * r;
            circle.style.strokeDasharray = `${circ} ${circ}`;
            circle.style.strokeDashoffset = circ - (done / 30) * circ;
        }
        const el = document.getElementById('fasting-day');
        if (el) el.textContent = `${done} جزء`;
    }

    // ------------------------------------------
    // ===== Celebration =====
    // ------------------------------------------
    _triggerCelebration(msg) {
        if (window.confetti) {
            const end = Date.now() + 2000;
            const r = (a, b) => Math.random() * (b - a) + a;
            const id = setInterval(() => {
                if (Date.now() > end) return clearInterval(id);
                const n = 40;
                confetti({ particleCount: n, startVelocity: 30, spread: 360, origin: { x: r(0.1, 0.3), y: r(0, 0.5) }, zIndex: 9999 });
                confetti({ particleCount: n, startVelocity: 30, spread: 360, origin: { x: r(0.7, 0.9), y: r(0, 0.5) }, zIndex: 9999 });
            }, 250);
        }

        // Show random duaa
        if (this.duaaData.length > 0) {
            const d = this.duaaData[Math.floor(Math.random() * this.duaaData.length)];
            const el = document.getElementById('reward-duaa');
            if (el) el.textContent = d.arabic;
        }

        const msgEl = document.getElementById('celebration-message');
        if (msgEl) msgEl.textContent = msg;

        setTimeout(() => {
            const modal = document.getElementById('celebration-modal');
            if (modal) modal.style.display = 'flex';
        }, 400);
    }

    closeCelebration() {
        const m = document.getElementById('celebration-modal');
        if (m) m.style.display = 'none';
    }

    // ------------------------------------------
    // ===== Duaa =====
    // ------------------------------------------
    async _loadDuaa() {
        try {
            const res = await fetch('douaa/adkar.json');
            if (!res.ok) throw new Error('not found');
            this.duaaData = await res.json();
        } catch {
            this.duaaData = [
                { title: 'دعاء الإفطار', arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ', translation: '', source: 'أبو داود' },
                { title: 'ليلة القدر', arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', translation: '', source: 'الترمذي' },
                { title: 'الدعاء الجامع', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: '', source: 'البقرة: 201' }
            ];
        }
        this._renderDuaa();
    }

    _renderDuaa() {
        const list = document.getElementById('duaa-list');
        if (!list) return;
        list.innerHTML = '';
        this.duaaData.forEach(d => {
            const c = document.createElement('div');
            c.className = 'duaa-card';
            c.innerHTML = `
                <h3 class="duaa-title">${d.title}</h3>
                <p class="arabic-text">${d.arabic}</p>
                ${d.translation ? `<p class="translation-text">${d.translation}</p>` : ''}
                <span class="source-text"><i class="fa-solid fa-book-open-reader"></i> ${d.source}</span>
            `;
            list.appendChild(c);
        });
    }

    // ------------------------------------------
    // ===== Notifications =====
    // ------------------------------------------
    async _requestNotifPermission() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') await Notification.requestPermission();
    }

    _setNotifInterval(min) {
        this.state.notifInterval = min;
        localStorage.setItem('notifInterval', min);
        this._requestNotifPermission();
        this._startNotifTimer();
    }

    _startNotifTimer() {
        if (this.state.intervalId) clearInterval(this.state.intervalId);
        if (this.state.notifInterval > 0) {
            this.state.intervalId = setInterval(() => {
                this._sendNotif('تذكير بالأذكار 🤲', 'ألا بذكر الله تطمئن القلوب. رطب لسانك بذكر الله.');
            }, this.state.notifInterval * 60000);
        }
    }

    _sendNotif(title, body) {
        if (Notification.permission !== 'granted') return;
        try { new Notification(title, { body }); } catch (e) { }
    }

    // ------------------------------------------
    // ===== Hijri Date =====
    // ------------------------------------------
    _updateHijriDate() {
        const el = document.getElementById('hijri-date');
        if (!el) return;
        try {
            el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                day: 'numeric', month: 'long', year: 'numeric'
            }).format(new Date());
        } catch { el.textContent = 'رمضان 1447 هـ'; }
    }
}

// ==========================================
// ===== Init =====
// ==========================================
const app = new RamadanApp();
window.app = app;
