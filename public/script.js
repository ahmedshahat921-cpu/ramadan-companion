/**
 * رفيق رمضان - Main App Logic (v3 - Full Fix)
 * All features: Azkar tabs, Prayer times auto-detect, Duaa from JSON,
 * Setup wizard on first login, celebrations, notifications.
 */

// ===== Auth Guard =====
const username = localStorage.getItem('username');
if (!username) {
    window.location.href = 'login.html';
}

// ===== Azkar Data =====
const azkarData = {
    morning: [
        { arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...", count: 1, source: "آية الكرسي - البقرة: 255" },
        { arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1, source: "مسلم" },
        { arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", count: 1, source: "الترمذي" },
        { arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", count: 3, source: "أبو داود" },
        { arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.", count: 3, source: "أبو داود" },
        { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", count: 100, source: "مسلم" },
        { arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.", count: 1, source: "الترمذي" }
    ],
    evening: [
        { arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1, source: "مسلم" },
        { arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.", count: 1, source: "الترمذي" },
        { arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", count: 3, source: "مسلم" },
        { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ.", count: 1, source: "أبو داود" },
        { arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ.", count: 3, source: "أبو داود" },
        { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ.", count: 3, source: "النسائي" }
    ],
    prayer: [
        { arabic: "أَسْتَغْفِرُ اللَّهَ.", count: 3, source: "مسلم" },
        { arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ.", count: 1, source: "مسلم" },
        { arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1, source: "البخاري" },
        { arabic: "اللَّهُمَّ لاَ مَانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.", count: 1, source: "البخاري ومسلم" },
        { arabic: "سُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (33) ثم لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1, source: "مسلم" },
        { arabic: "آيَةُ الْكُرْسِيِّ بَعْدَ كُلِّ صَلَاةٍ - من قرأها لم يحل بينه وبين الجنة إلا الموت.", count: 1, source: "النسائي" }
    ]
};

// ===== App Class =====
class RamadanApp {
    constructor() {
        this.duaaData = [];
        this.state = {
            currentSection: 'home',
            theme: localStorage.getItem('theme') || 'dark',
            tasbeehCount: parseInt(localStorage.getItem('tasbeehCount')) || 0,
            khatmaGoal: parseInt(localStorage.getItem('khatmaGoal')) || 1,
            completedJuz: JSON.parse(localStorage.getItem('completedJuz') || '[]'),
            soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
            coordinates: JSON.parse(localStorage.getItem('coordinates') || 'null'),
            notifInterval: parseInt(localStorage.getItem('notifInterval')) || 0,
            intervalId: null,
            prayerTimerInterval: null,
            dailyReading: JSON.parse(localStorage.getItem('dailyReading') || '{}'),
            lastReadingDate: localStorage.getItem('lastReadingDate') || new Date().toDateString(),
            currentAzkarType: 'morning',
            _nextPrayerTime: null,
            prayerTimes: null
        };
        this._initApp();
    }

    async _initApp() {
        // Daily reset check
        this._checkDayReset();

        // Apply theme first (instant)
        this._applyTheme();

        // Setup event listeners
        this._setupListeners();

        // Render static content
        this.renderAzkar('morning');
        this._updateTasbeehDisplay();
        this._updateQuranPlanner();
        this._renderJuzGrid();
        this._updateHijriDate();
        this._restoreReadingChecks();

        // Greeting
        const greeting = document.querySelector('.greeting-card h2');
        if (greeting) greeting.innerHTML = `رمضان كريم 🌙<br><small style="font-size:1.1rem;opacity:0.9;">${username}</small>`;

        // Load duaa from JSON
        await this._loadDuaa();

        // Prayer times
        if (this.state.coordinates) {
            this._calculatePrayerTimes();
        } else {
            this._autoDetectLocation();
        }

        // Notifications timer
        const savedInterval = document.getElementById('notif-interval');
        if (savedInterval) savedInterval.value = this.state.notifInterval;
        this._startNotifTimer();

        // Show setup wizard on first use
        const firstUse = !localStorage.getItem('setupDone');
        if (firstUse) {
            setTimeout(() => this._showSetupWizard(), 1200);
        }
    }

    // ============================================================
    // ===== Setup Wizard =====
    // ============================================================
    _showSetupWizard() {
        const modal = document.getElementById('setup-modal');
        if (modal) modal.style.display = 'flex';
    }

    closeSetupWizard() {
        const modal = document.getElementById('setup-modal');
        if (modal) modal.style.display = 'none';

        const goalEl = document.getElementById('setup-goal');
        if (goalEl) {
            this.state.khatmaGoal = parseInt(goalEl.value) || 1;
            localStorage.setItem('khatmaGoal', this.state.khatmaGoal);
            this._updateQuranPlanner();
        }

        localStorage.setItem('setupDone', 'true');

        // Request location and notifications
        this._autoDetectLocation();
        this._requestNotifPermission();
    }

    // ============================================================
    // ===== Event Listeners =====
    // ============================================================
    _setupListeners() {
        // Theme toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.addEventListener('click', () => this._toggleTheme());

        // Tasbeeh button
        const tasbeehBtn = document.getElementById('tasbeeh-btn');
        if (tasbeehBtn) tasbeehBtn.addEventListener('click', () => this._incrementTasbeeh());

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد أنك تريد تسجيل الخروج؟')) {
                    localStorage.removeItem('username');
                    window.location.href = 'login.html';
                }
            });
        }

        // Notif interval change
        const notifSel = document.getElementById('notif-interval');
        if (notifSel) notifSel.addEventListener('change', e => this._setNotifInterval(parseInt(e.target.value)));
    }

    // ============================================================
    // ===== Theme =====
    // ============================================================
    _toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.state.theme);
        this._applyTheme();
    }

    _applyTheme() {
        const body = document.body;
        const btn = document.getElementById('theme-toggle');
        if (this.state.theme === 'dark') {
            body.classList.add('dark-mode');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            body.classList.remove('dark-mode');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    // Public alias for onclick
    get navigate() { return this._navigate.bind(this); }
    get openSettings() { return this._openSettings.bind(this); }
    get closeSettings() { return this._closeSettings.bind(this); }
    get detectLocation() { return this._detectLocation.bind(this); }
    get filterAzkar() { return this.renderAzkar.bind(this); }
    get adjustGoal() { return this._adjustGoal.bind(this); }
    get togglePrayerRead() { return this._togglePrayerRead.bind(this); }
    get toggleJuz() { return this._toggleJuz.bind(this); }
    get resetTasbeeh() { return this._resetTasbeeh.bind(this); }
    get toggleSound() { return this._toggleSound.bind(this); }

    // ============================================================
    // ===== Navigation =====
    // ============================================================
    _navigate(sectionId) {
        document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active-section');

        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        const navMap = { home: 0, quran: 1, tasbeeh: 2, duaa: 3 };
        const idx = navMap[sectionId];
        if (idx !== undefined) {
            const items = document.querySelectorAll('.nav-item');
            if (items[idx]) items[idx].classList.add('active');
        }

        this.state.currentSection = sectionId;
        window.scrollTo(0, 0);
    }

    // ============================================================
    // ===== Settings Modal =====
    // ============================================================
    _openSettings() {
        const m = document.getElementById('settings-modal');
        if (m) m.style.display = 'flex';
        const locationStatus = document.getElementById('location-status');
        if (locationStatus && this.state.coordinates) {
            locationStatus.textContent = `✅ الموقع محفوظ (خط العرض: ${this.state.coordinates.latitude.toFixed(2)})`;
        }
    }

    _closeSettings() {
        const m = document.getElementById('settings-modal');
        if (m) m.style.display = 'none';
    }

    // ============================================================
    // ===== Location & Prayer Times =====
    // ============================================================
    _autoDetectLocation() {
        if (!navigator.geolocation) {
            this._setDefaultLocation();
            return;
        }
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
        // Default: Cairo
        this.state.coordinates = { latitude: 30.0444, longitude: 31.2357 };
        this._calculatePrayerTimes();
        const locStatus = document.getElementById('location-status');
        if (locStatus) locStatus.textContent = '📍 موقع افتراضي: القاهرة';
    }

    _detectLocation() {
        const locStatus = document.getElementById('location-status');
        if (!navigator.geolocation) {
            if (locStatus) locStatus.textContent = '❌ المتصفح لا يدعم GPS';
            return;
        }
        if (locStatus) locStatus.textContent = '⏳ جاري تحديد الموقع...';
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.state.coordinates = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                localStorage.setItem('coordinates', JSON.stringify(this.state.coordinates));
                if (locStatus) locStatus.textContent = '✅ تم تحديث الموقع بنجاح!';
                this._calculatePrayerTimes();
            },
            () => {
                if (locStatus) locStatus.textContent = '❌ فشل تحديد الموقع. تأكد من تفعيل GPS.';
            }
        );
    }

    _calculatePrayerTimes() {
        if (!this.state.coordinates) return;
        if (!window.adhan) {
            setTimeout(() => this._calculatePrayerTimes(), 1000);
            return;
        }

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
            return `${h}:${m < 10 ? '0' + m : m} ${ap}`;
        };

        const names = { fajr: '🌅 الفجر', sunrise: '🌄 الشروق', dhuhr: '☀️ الظهر', asr: '🌤 العصر', maghrib: '🌇 المغرب', isha: '🌙 العشاء', none: '🌙 العشاء' };
        const shortNames = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };

        // Show all prayer times in the list
        const pList = document.getElementById('prayer-times-list');
        if (pList) {
            pList.style.display = 'block';
            pList.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">` +
                ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(p => `
                <div style="background:rgba(255,255,255,0.1);padding:8px 10px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:0.85rem;opacity:0.9;">${shortNames[p]}</span>
                    <span style="font-weight:700;color:#86efad;font-size:0.9rem;">${fmt(pt[p])}</span>
                </div>`).join('') + `</div>`;
        }

        // Next prayer
        const next = pt.nextPrayer();
        const nextTime = next !== 'none' ? pt.timeForPrayer(next) : null;
        this.state._nextPrayerTime = nextTime;

        const pEl = document.getElementById('next-prayer-name');
        const tEl = document.getElementById('next-prayer-time');
        if (pEl) pEl.textContent = names[next] || 'الفجر';
        if (tEl && nextTime) tEl.textContent = fmt(nextTime);

        this._updateCountdown();

        // Stop existing timer and start new one
        if (this.state.prayerTimerInterval) clearInterval(this.state.prayerTimerInterval);
        this.state.prayerTimerInterval = setInterval(() => {
            this._updateCountdown();
            // Recalculate every 5 minutes
        }, 30000);
    }

    _updateCountdown() {
        if (!this.state._nextPrayerTime) return;
        const diff = this.state._nextPrayerTime - new Date();
        if (diff <= 0) {
            this._calculatePrayerTimes();
            return;
        }
        const totalMins = Math.floor(diff / 60000);
        const h = Math.floor(totalMins / 60), m = totalMins % 60;
        const el = document.getElementById('time-remaining');
        if (el) el.textContent = h > 0 ? `باقي ${h}س ${m}د` : `باقي ${m} دقيقة`;
    }

    // ============================================================
    // ===== Daily Reset =====
    // ============================================================
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

    // ============================================================
    // ===== Quran Prayer Reading Toggle =====
    // ============================================================
    _togglePrayerRead(prayer) {
        const row = document.querySelector(`.prayer-row[data-prayer="${prayer}"]`);
        const isChecked = this.state.dailyReading[prayer];

        if (!isChecked) {
            this.state.dailyReading[prayer] = true;
            if (row) row.classList.add('checked');
            // Check if all 5 prayers done today
            const allDone = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].every(p => this.state.dailyReading[p]);
            if (allDone) {
                this._triggerCelebration('ما شاء الله! أتممت قراءتك لهذا اليوم كاملاً! 🎉');
            } else {
                this._triggerCelebration(`أحسنت! 🌟 تقبّل الله قراءتك`);
            }
        } else {
            this.state.dailyReading[prayer] = false;
            if (row) row.classList.remove('checked');
        }
        localStorage.setItem('dailyReading', JSON.stringify(this.state.dailyReading));
    }

    // ============================================================
    // ===== Celebration & Duaa Popup =====
    // ============================================================
    _triggerCelebration(msg) {
        // Confetti
        if (window.confetti) {
            const end = Date.now() + 2000;
            const rand = (a, b) => Math.random() * (b - a) + a;
            const loop = setInterval(() => {
                if (Date.now() > end) return clearInterval(loop);
                const n = 50 * ((end - Date.now()) / 2000);
                confetti({ particleCount: n, startVelocity: 30, spread: 360, origin: { x: rand(0.1, 0.3), y: rand(0, 0.5) }, zIndex: 9999 });
                confetti({ particleCount: n, startVelocity: 30, spread: 360, origin: { x: rand(0.7, 0.9), y: rand(0, 0.5) }, zIndex: 9999 });
            }, 250);
        }

        // Pick random duaa
        if (this.duaaData.length > 0) {
            const d = this.duaaData[Math.floor(Math.random() * this.duaaData.length)];
            const el = document.getElementById('reward-duaa');
            if (el) el.textContent = d.arabic;
        }

        const msgEl = document.getElementById('celebration-message');
        if (msgEl) msgEl.textContent = msg;

        const modal = document.getElementById('celebration-modal');
        setTimeout(() => { if (modal) modal.style.display = 'flex'; }, 500);
    }

    closeCelebration() {
        const modal = document.getElementById('celebration-modal');
        if (modal) modal.style.display = 'none';
    }

    // ============================================================
    // ===== Azkar =====
    // ============================================================
    renderAzkar(type) {
        this.state.currentAzkarType = type;
        const list = document.getElementById('azkar-list');
        if (!list) return;
        list.innerHTML = '';

        const data = azkarData[type] || azkarData.morning;
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'azkar-card';
            card.innerHTML = `
                <p class="arabic-text">${item.arabic}</p>
                ${item.count > 1 ? `<span class="count-badge"><i class="fa-solid fa-rotate-right"></i> ${item.count} مرة</span>` : ''}
                <br>
                <span class="source-text"><i class="fa-solid fa-book-open-reader"></i> ${item.source}</span>
            `;
            list.appendChild(card);
        });

        // Update tab active state
        const tabs = document.querySelectorAll('.tab-btn');
        const tabMap = { morning: 0, evening: 1, prayer: 2 };
        tabs.forEach((t, i) => {
            t.classList.toggle('active', i === tabMap[type]);
        });
    }

    // ============================================================
    // ===== Tasbeeh =====
    // ============================================================
    _incrementTasbeeh() {
        this.state.tasbeehCount++;
        localStorage.setItem('tasbeehCount', this.state.tasbeehCount);
        this._updateTasbeehDisplay();
        if (navigator.vibrate) navigator.vibrate(40);
        if (this.state.soundEnabled) this._playBeep();

        // Milestones
        const n = this.state.tasbeehCount;
        const labels = { 33: 'سبحان الله', 66: 'الحمد لله', 99: 'الله أكبر', 100: 'لا إله إلا الله وحده لا شريك له' };
        const label = document.getElementById('tasbeeh-label');
        if (n === 33) { if (label) label.textContent = '✨ سبحان الله - استمر!'; this._triggerCelebration('الحمد لله! 33 تسبيحة 🌿'); }
        else if (n === 66) { if (label) label.textContent = '✨ الحمد لله - استمر!'; this._triggerCelebration('أحسنت! 66 تسبيحة 🌿'); }
        else if (n === 99) { if (label) label.textContent = '✨ الله أكبر - وأتم بالتحليل!'; this._triggerCelebration('ما شاء الله! أتممت التسبيحات 🎊'); }
        else { if (label) label.textContent = n < 33 ? `${33 - n} للتسبيحة` : (n < 66 ? `${66 - n} للتحميدة` : (n < 99 ? `${99 - n} للتكبيرة` : '')); }
    }

    _playBeep() {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g);
            g.connect(ctx.destination);
            osc.frequency.value = 880;
            g.gain.value = 0.04;
            osc.start();
            setTimeout(() => { osc.stop(); ctx.close(); }, 60);
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

    // ============================================================
    // ===== Quran Planner =====
    // ============================================================
    _updateQuranPlanner() {
        const goal = this.state.khatmaGoal;
        const pagesPerDay = Math.ceil((604 * goal) / 30);
        const ppp = Math.ceil(pagesPerDay / 5);

        const $ = id => document.getElementById(id);
        if ($('daily-pages')) $('daily-pages').textContent = pagesPerDay;
        if ($('khatma-goal-display')) $('khatma-goal-display').textContent = goal;
        ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(p => {
            if ($(`pages-${p}`)) $(`pages-${p}`).textContent = `${ppp} ص`;
        });
    }

    _adjustGoal(n) {
        let g = this.state.khatmaGoal + n;
        g = Math.max(1, Math.min(10, g));
        this.state.khatmaGoal = g;
        localStorage.setItem('khatmaGoal', g);
        this._updateQuranPlanner();
    }

    _renderJuzGrid() {
        const grid = document.getElementById('juz-grid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 1; i <= 30; i++) {
            const box = document.createElement('div');
            box.className = 'juz-box' + (this.state.completedJuz.includes(i) ? ' completed' : '');
            box.textContent = i;
            box.title = `الجزء ${i}`;
            box.addEventListener('click', () => this._toggleJuz(i));
            grid.appendChild(box);
        }
        this._updateHomeProgress();
    }

    _toggleJuz(num) {
        if (this.state.completedJuz.includes(num)) {
            this.state.completedJuz = this.state.completedJuz.filter(j => j !== num);
        } else {
            this.state.completedJuz.push(num);
            if (this.state.completedJuz.length === 30) {
                this._triggerCelebration('🎊 ما شاء الله! أتممت ختمة القرآن الكريم! تقبل الله منك 🌙');
            }
        }
        localStorage.setItem('completedJuz', JSON.stringify(this.state.completedJuz));
        this._renderJuzGrid();
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

    // ============================================================
    // ===== Duaa =====
    // ============================================================
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
            const card = document.createElement('div');
            card.className = 'duaa-card';
            card.innerHTML = `
                <h3 class="duaa-title">${d.title}</h3>
                <p class="arabic-text">${d.arabic}</p>
                ${d.translation ? `<p class="translation-text">${d.translation}</p>` : ''}
                <span class="source-text"><i class="fa-solid fa-book-open-reader"></i> ${d.source}</span>
            `;
            list.appendChild(card);
        });
    }

    // ============================================================
    // ===== Notifications =====
    // ============================================================
    async _requestNotifPermission() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    _setNotifInterval(minutes) {
        this.state.notifInterval = minutes;
        localStorage.setItem('notifInterval', minutes);
        this._requestNotifPermission();
        this._startNotifTimer();
    }

    _startNotifTimer() {
        if (this.state.intervalId) clearInterval(this.state.intervalId);
        if (this.state.notifInterval > 0) {
            this.state.intervalId = setInterval(() => {
                this._sendNotif('تذكير بالأذكار 🤲', 'ألا بذكر الله تطمئن القلوب. رطب لسانك بذكر الله.');
            }, this.state.notifInterval * 60 * 1000);
        }
    }

    _sendNotif(title, body) {
        if (Notification.permission !== 'granted') return;
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(r => r.showNotification(title, { body, vibrate: [200, 100, 200] }));
        } else {
            new Notification(title, { body });
        }
    }

    // ============================================================
    // ===== Hijri Date =====
    // ============================================================
    _updateHijriDate() {
        const el = document.getElementById('hijri-date');
        if (!el) return;
        try {
            const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                day: 'numeric', month: 'long', year: 'numeric'
            }).format(new Date());
            el.textContent = hijri;
        } catch {
            el.textContent = 'رمضان 1447 هـ';
        }
    }
}

// ===== Initialize =====
const app = new RamadanApp();
window.app = app;

// ===== Global onclick helpers (must be at window scope) =====
window.navigate = (s) => app._navigate(s);
