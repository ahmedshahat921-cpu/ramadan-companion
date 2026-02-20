/**
 * رفيق رمضان - Main App Logic
 * Fixed: Azkar tabs, Prayer times, Duaa from JSON, bigger fonts
 */

// --- Authentication Check ---
const username = localStorage.getItem('username');
if (!username) {
    window.location.href = 'login.html';
}

// --- Azkar Data ---
const azkarData = {
    morning: [
        { arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1, source: "مسلم" },
        { arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", count: 1, source: "الترمذي" },
        { arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", count: 3, source: "أبو داود" },
        { arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.", count: 3, source: "أبو داود" },
        { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", count: 100, source: "مسلم" },
        { arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.", count: 1, source: "الترمذي" },
        { arabic: "أَصْبَحْتُ أُشْهِدُ اللَّهَ وَأُشْهِدُ حَمَلَةَ عَرْشِهِ وَمَلاَئِكَتَهُ وَجَمِيعَ خَلْقِهِ أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.", count: 4, source: "أبو داود" }
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
        { arabic: "سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (33)، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1, source: "مسلم" },
        { arabic: "آيَةُ الْكُرْسِيِّ: اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ...", count: 1, source: "النسائي" }
    ]
};

// --- App Class ---
class RamadanApp {
    constructor() {
        this.state = {
            currentSection: 'home',
            theme: localStorage.getItem('theme') || 'dark',
            tasbeehCount: parseInt(localStorage.getItem('tasbeehCount')) || 0,
            khatmaGoal: parseInt(localStorage.getItem('khatmaGoal')) || 1,
            completedJuz: JSON.parse(localStorage.getItem('completedJuz')) || [],
            soundEnabled: true,
            coordinates: JSON.parse(localStorage.getItem('coordinates')) || null,
            notifInterval: parseInt(localStorage.getItem('notifInterval')) || 0,
            intervalId: null,
            prayerTimerInterval: null,
            dailyReading: JSON.parse(localStorage.getItem('dailyReading')) || {},
            lastReadingDate: localStorage.getItem('lastReadingDate') || new Date().toDateString(),
            currentAzkarType: 'morning',
            duaaData: []
        };
        this.init();
    }

    async init() {
        this.checkDayReset();
        this.applyTheme();
        this.renderAzkar('morning');
        this.updateTasbeehDisplay();
        this.updateQuranPlanner();
        this.renderJuzGrid();
        this.updateHijriDate();
        this.restoreReadingChecks();

        // Load Duaa from JSON
        await this.loadDuaa();

        // Prayer Times
        if (this.state.coordinates) {
            this.calculatePrayerTimes();
            this.startPrayerCountdown();
        } else {
            this.autoDetectLocation();
        }

        // Settings
        const savedInterval = document.getElementById('notif-interval');
        if (savedInterval) savedInterval.value = this.state.notifInterval;
        this.startNotificationTimer();

        // Event Listeners
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('tasbeeh-btn').addEventListener('click', () => this.incrementTasbeeh());

        if (document.getElementById('notif-interval')) {
            document.getElementById('notif-interval').addEventListener('change', (e) => this.setNotifInterval(e.target.value));
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد أنك تريد تسجيل الخروج؟')) {
                    localStorage.removeItem('username');
                    window.location.href = 'login.html';
                }
            });
        }

        // Greeting with username
        const greeting = document.querySelector('.greeting-card h2');
        if (greeting && username) {
            greeting.innerHTML = `رمضان كريم 🌙<br><span style="font-size:1.3rem">${username}</span>`;
        }
    }

    // --- Load Duaa from JSON ---
    async loadDuaa() {
        try {
            const res = await fetch('douaa/adkar.json');
            if (!res.ok) throw new Error('Failed to load');
            this.state.duaaData = await res.json();
        } catch (e) {
            console.warn('Using fallback duaa data');
            this.state.duaaData = [
                { title: "دعاء الإفطار", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ", translation: "دعاء الإفطار المأثور", source: "أبو داود" },
                { title: "ليلة القدر", arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", translation: "أفضل دعاء في ليلة القدر", source: "الترمذي" },
                { title: "الدعاء الجامع", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", translation: "دعاء جامع لخيري الدنيا والآخرة", source: "سورة البقرة: 201" }
            ];
        }
        this.renderDuaa();
    }

    // --- Daily Reset Logic ---
    checkDayReset() {
        const today = new Date().toDateString();
        if (this.state.lastReadingDate !== today) {
            this.state.dailyReading = {};
            this.state.lastReadingDate = today;
            localStorage.setItem('dailyReading', JSON.stringify({}));
            localStorage.setItem('lastReadingDate', today);
        }
    }

    restoreReadingChecks() {
        Object.keys(this.state.dailyReading).forEach(prayer => {
            if (this.state.dailyReading[prayer]) {
                const row = document.querySelector(`.prayer-row[onclick="app.togglePrayerRead('${prayer}')"]`);
                if (row) row.classList.add('checked');
            }
        });
    }

    // --- Quran Prayer Reading Toggle ---
    togglePrayerRead(prayer) {
        const isChecked = this.state.dailyReading[prayer];
        const row = document.querySelector(`.prayer-row[onclick="app.togglePrayerRead('${prayer}')"]`);
        if (!isChecked) {
            this.state.dailyReading[prayer] = true;
            if (row) row.classList.add('checked');
            this.triggerCelebration('أحسنت! واصل قراءتك 📖');
        } else {
            this.state.dailyReading[prayer] = false;
            if (row) row.classList.remove('checked');
        }
        localStorage.setItem('dailyReading', JSON.stringify(this.state.dailyReading));
    }

    triggerCelebration(msg = 'أتممت وردك') {
        if (typeof confetti === 'function') {
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };
            const randomInRange = (min, max) => Math.random() * (max - min) + min;
            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }

        const modal = document.getElementById('celebration-modal');
        const celebMsg = document.getElementById('celebration-message');
        const duaaEl = document.getElementById('reward-duaa');

        if (this.state.duaaData.length > 0) {
            const randomDuaa = this.state.duaaData[Math.floor(Math.random() * this.state.duaaData.length)];
            if (duaaEl) duaaEl.innerText = randomDuaa.arabic;
        }
        if (celebMsg) celebMsg.innerText = msg;

        setTimeout(() => {
            if (modal) modal.style.display = 'flex';
        }, 600);
    }

    // --- Navigation ---
    navigate(sectionId) {
        document.querySelectorAll('section').forEach(sec => sec.classList.remove('active-section'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active-section');

        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const navMap = { 'home': 0, 'quran': 1, 'tasbeeh': 2 };
        const navIndex = navMap[sectionId];
        if (navIndex !== undefined) {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems[navIndex]) navItems[navIndex].classList.add('active');
        }

        this.state.currentSection = sectionId;
        window.scrollTo(0, 0);
    }

    // --- Settings ---
    openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.style.display = 'flex';
    }

    closeSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.style.display = 'none';
    }

    // --- Location & Prayer Times ---
    autoDetectLocation() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.state.coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                localStorage.setItem('coordinates', JSON.stringify(this.state.coordinates));
                this.calculatePrayerTimes();
                this.startPrayerCountdown();
            },
            () => {
                // Default to Cairo if location denied
                this.state.coordinates = { latitude: 30.0444, longitude: 31.2357 };
                this.calculatePrayerTimes();
                this.startPrayerCountdown();
                const locStatus = document.getElementById('location-status');
                if (locStatus) locStatus.innerText = '📍 يتم استخدام الموقع الافتراضي (القاهرة)';
            },
            { timeout: 8000 }
        );
    }

    detectLocation() {
        if (!navigator.geolocation) {
            document.getElementById('location-status').innerText = "المتصفح لا يدعم تحديد الموقع";
            return;
        }
        document.getElementById('location-status').innerText = "⏳ جاري تحديد الموقع...";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.state.coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                localStorage.setItem('coordinates', JSON.stringify(this.state.coordinates));
                document.getElementById('location-status').innerText = "✅ تم تحديث الموقع بنجاح!";
                this.calculatePrayerTimes();
                this.startPrayerCountdown();
            },
            () => {
                document.getElementById('location-status').innerText = "❌ فشل في تحديد الموقع. تأكد من تفعيل الـ GPS.";
            }
        );
    }

    calculatePrayerTimes() {
        if (!this.state.coordinates) return;
        if (!window.adhan) {
            // Retry after 1s if adhan not loaded
            setTimeout(() => this.calculatePrayerTimes(), 1000);
            return;
        }

        const date = new Date();
        const coords = new adhan.Coordinates(this.state.coordinates.latitude, this.state.coordinates.longitude);
        const params = adhan.CalculationMethod.Egyptian();
        params.madhab = adhan.Madhab.Shafi;
        const prayerTimes = new adhan.PrayerTimes(coords, date, params);

        const formatTime = (time) => {
            let hours = time.getHours();
            let minutes = time.getMinutes();
            const ampm = hours >= 12 ? 'م' : 'ص';
            hours = hours % 12 || 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${minutes} ${ampm}`;
        };

        const prayerNames = {
            fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
            asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء', none: 'الفجر'
        };

        // Show all prayer times list
        const prayerList = document.getElementById('prayer-times-list');
        if (prayerList) {
            const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
            prayerList.style.display = 'block';
            prayerList.innerHTML = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">` +
                prayers.map(p => `
                    <div style="background:rgba(255,255,255,0.1); padding:8px 12px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem;">${prayerNames[p]}</span>
                        <span style="font-weight:bold; color:#10B981; font-size:0.9rem;">${formatTime(prayerTimes[p])}</span>
                    </div>`).join('') + `</div>`;
        }

        // Next Prayer
        const next = prayerTimes.nextPrayer();
        const nextTime = next !== 'none' ? prayerTimes.timeForPrayer(next) : null;

        const prayerEl = document.getElementById('next-prayer-name');
        const timeEl = document.getElementById('next-prayer-time');
        const remainEl = document.getElementById('time-remaining');

        if (prayerEl) prayerEl.innerText = prayerNames[next] || 'الفجر';
        if (timeEl && nextTime) timeEl.innerText = formatTime(nextTime);

        this._nextPrayerTime = nextTime;
        this.updateCountdown();
    }

    updateCountdown() {
        if (!this._nextPrayerTime) return;
        const now = new Date();
        const diffMs = this._nextPrayerTime - now;
        if (diffMs <= 0) {
            this.calculatePrayerTimes();
            return;
        }
        const diffMins = Math.floor(diffMs / 60000);
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        const remainEl = document.getElementById('time-remaining');
        if (remainEl) remainEl.innerText = hrs > 0 ? `باقي ${hrs}س و${mins}د` : `باقي ${mins} دقيقة`;
    }

    startPrayerCountdown() {
        if (this.state.prayerTimerInterval) clearInterval(this.state.prayerTimerInterval);
        this.state.prayerTimerInterval = setInterval(() => {
            this.updateCountdown();
        }, 30000); // Update every 30 seconds
    }

    // --- Notification ---
    async requestNotificationPermission() {
        if (!("Notification" in window)) return;
        if (Notification.permission !== "granted") {
            await Notification.requestPermission();
        }
    }

    setNotifInterval(minutes) {
        minutes = parseInt(minutes);
        this.state.notifInterval = minutes;
        localStorage.setItem('notifInterval', minutes);
        this.requestNotificationPermission();
        this.startNotificationTimer();
    }

    startNotificationTimer() {
        if (this.state.intervalId) clearInterval(this.state.intervalId);
        if (this.state.notifInterval > 0) {
            this.state.intervalId = setInterval(() => {
                this.sendNotification("تذكير بالأذكار 🤲", "ألا بذكر الله تطمئن القلوب. رطب لسانك بذكر الله.");
            }, this.state.notifInterval * 60 * 1000);
        }
    }

    sendNotification(title, body) {
        if (Notification.permission === "granted") {
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification(title, { body, icon: '/favicon.ico', vibrate: [200, 100, 200] });
                });
            } else {
                new Notification(title, { body });
            }
        }
    }

    // --- Theme ---
    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.state.theme);
        this.applyTheme();
    }

    applyTheme() {
        const body = document.body;
        const toggleBtn = document.getElementById('theme-toggle');
        if (this.state.theme === 'dark') {
            body.classList.add('dark-mode');
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            body.classList.remove('dark-mode');
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    // --- Azkar ---
    renderAzkar(type) {
        const list = document.getElementById('azkar-list');
        if (!list) return;
        list.innerHTML = '';
        this.state.currentAzkarType = type;
        const data = azkarData[type] || azkarData['morning'];

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'azkar-card';
            card.innerHTML = `
                <p class="arabic-text">${item.arabic}</p>
                ${item.count > 1 ? `<div class="count-badge">${item.count} مرة</div>` : ''}
                <span class="source-text">📚 ${item.source}</span>
            `;
            list.appendChild(card);
        });

        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        const tabMap = { morning: 0, evening: 1, prayer: 2 };
        const tabIndex = tabMap[type];
        const tabs = document.querySelectorAll('.tab-btn');
        if (tabs[tabIndex]) tabs[tabIndex].classList.add('active');
    }

    filterAzkar(type) {
        this.renderAzkar(type);
    }

    // --- Tasbeeh ---
    incrementTasbeeh() {
        this.state.tasbeehCount++;
        localStorage.setItem('tasbeehCount', this.state.tasbeehCount);
        this.updateTasbeehDisplay();
        if (navigator.vibrate) navigator.vibrate(40);
        if (this.state.soundEnabled) this.playBeep();

        // Celebrate milestones
        if (this.state.tasbeehCount % 33 === 0) {
            this.triggerCelebration(`أحسنت! وصلت إلى ${this.state.tasbeehCount} 🎉`);
        }
    }

    playBeep() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            osc.type = 'sine';
            gain.gain.value = 0.04;
            osc.start();
            setTimeout(() => osc.stop(), 60);
        } catch (e) { }
    }

    resetTasbeeh() {
        if (confirm("تصفير العداد؟")) {
            this.state.tasbeehCount = 0;
            localStorage.setItem('tasbeehCount', 0);
            this.updateTasbeehDisplay();
        }
    }

    updateTasbeehDisplay() {
        const el = document.getElementById('tasbeeh-count');
        if (el) el.innerText = this.state.tasbeehCount;
    }

    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        const btn = document.getElementById('sound-btn');
        if (btn) btn.innerHTML = this.state.soundEnabled ?
            '<i class="fa-solid fa-volume-high"></i>' :
            '<i class="fa-solid fa-volume-xmark"></i>';
    }

    // --- Quran Planner ---
    updateQuranPlanner() {
        const goal = this.state.khatmaGoal;
        const totalPages = 604;
        const days = 30;
        const pagesPerDay = Math.ceil((totalPages * goal) / days);
        const pagesPerPrayer = Math.ceil(pagesPerDay / 5);

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        setEl('daily-pages', pagesPerDay);
        setEl('pages-fajr', `${pagesPerPrayer} ص`);
        setEl('pages-dhuhr', `${pagesPerPrayer} ص`);
        setEl('pages-asr', `${pagesPerPrayer} ص`);
        setEl('pages-maghrib', `${pagesPerPrayer} ص`);
        setEl('pages-isha', `${pagesPerPrayer} ص`);
        setEl('khatma-goal-display', goal);

        const targetEl = document.querySelector('.daily-target p');
        if (targetEl) targetEl.innerHTML = `<span id="daily-pages">${pagesPerDay}</span> صفحة يومياً <small>(جزء ${(pagesPerDay / 20).toFixed(1)})</small>`;
    }

    adjustGoal(amount) {
        let newGoal = this.state.khatmaGoal + amount;
        if (newGoal < 1) newGoal = 1;
        if (newGoal > 10) newGoal = 10;
        this.state.khatmaGoal = newGoal;
        localStorage.setItem('khatmaGoal', newGoal);
        this.updateQuranPlanner();
    }

    renderJuzGrid() {
        const grid = document.getElementById('juz-grid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 1; i <= 30; i++) {
            const box = document.createElement('div');
            box.className = 'juz-box ' + (this.state.completedJuz.includes(i) ? 'completed' : '');
            box.innerText = i;
            box.onclick = () => this.toggleJuz(i);
            grid.appendChild(box);
        }
        this.updateHomeProgress();
    }

    toggleJuz(num) {
        if (this.state.completedJuz.includes(num)) {
            this.state.completedJuz = this.state.completedJuz.filter(j => j !== num);
        } else {
            this.state.completedJuz.push(num);
            if (this.state.completedJuz.length === 30) {
                this.triggerCelebration('ما شاء الله! أتممت ختمة القرآن الكريم 🎉🌙');
            }
        }
        localStorage.setItem('completedJuz', JSON.stringify(this.state.completedJuz));
        this.renderJuzGrid();
    }

    updateHomeProgress() {
        const completed = this.state.completedJuz.length;
        const percent = (completed / 30) * 100;
        const circle = document.querySelector('.progress-ring__circle');
        if (!circle) return;
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
        const fastingEl = document.getElementById('fasting-day');
        if (fastingEl) fastingEl.innerText = `${completed} جزء`;
    }

    // --- Duaa ---
    renderDuaa() {
        const list = document.getElementById('duaa-list');
        if (!list) return;
        list.innerHTML = '';
        this.state.duaaData.forEach(d => {
            const card = document.createElement('div');
            card.className = 'duaa-card';
            card.innerHTML = `
                <h3 class="duaa-title">${d.title}</h3>
                <p class="arabic-text">${d.arabic}</p>
                ${d.translation ? `<p class="translation-text">${d.translation}</p>` : ''}
                <span class="source-text">📚 ${d.source}</span>
            `;
            list.appendChild(card);
        });
    }

    // --- Hijri Date ---
    updateHijriDate() {
        const el = document.getElementById('hijri-date');
        if (!el) return;
        try {
            const date = new Date();
            const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                day: 'numeric', month: 'long', year: 'numeric'
            }).format(date);
            el.innerText = hijri;
        } catch (e) {
            el.innerText = "رمضان 1447 هـ";
        }
    }
}

// Initialize App
const app = new RamadanApp();
window.app = app;
