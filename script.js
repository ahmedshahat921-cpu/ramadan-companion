/**
 * Modern Islamic Web App - Main Logic
 * Uses Vanilla JS for state management and navigation
 */

// --- Authentication Check ---
const username = localStorage.getItem('username');
if (!username) {
    window.location.href = 'login.html';
}

// --- Initial Data ---
const azkarData = {
    morning: [
        { arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ.", translation: "أصبحنا وأصبح الملك لله...", source: "مسلم" },
        { arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", translation: "اللهم بك أصبحنا وبك أمسينا...", source: "الترمذي" },
        { arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ (3 مرات)", translation: "بسم الله الذي لا يضر مع اسمه شيء...", source: "أبو داود" },
        { arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا (3 مرات)", translation: "رضيت بالله رباً...", source: "أبو داود" },
        { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100 مرة)", translation: "من قالها حين يصبح وحين يمسي لم يأت أحد يوم القيامة بأفضل مما جاء به...", source: "مسلم" },
        { arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", translation: "يا حي يا قيوم...", source: "الترمذي" }
    ],
    evening: [
        { arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ.", translation: "أمسينا وأمسى الملك لله...", source: "مسلم" },
        { arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.", translation: "اللهم بك أمسينا...", source: "الترمذي" },
        { arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (3 مرات)", translation: "أعوذ بكلمات الله التامات...", source: "مسلم" },
        { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ", translation: "اللهم إني أسألك العافية...", source: "أبو داود" }
    ],
    prayer: [
        { arabic: "أَسْتَغْفِرُ اللَّهَ (3 مرات)", translation: "أستغفر الله...", source: "مسلم" },
        { arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ", translation: "اللهم أنت السلام...", source: "مسلم" },
        { arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translation: "لا إله إلا الله وحده...", source: "البخاري" },
        { arabic: "آية الكرسي", translation: "اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...", source: "النسائي" },
        { arabic: "سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (33)", translation: "التسبيح والتحميد والتكبير", source: "مسلم" }
    ]
};

const duaaData = [
    { title: "عند الإفطار", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ", translation: "دعاء الإفطار المأثور", source: "أبو داود" },
    { title: "ليلة القدر", arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", translation: "دعاء ليلة القدر", source: "الترمذي" },
    { title: "صلاة القيام", arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ...", translation: "دعاء الاستفتاح في القيام", source: "البخاري" },
    { title: "طلب المغفرة", arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", translation: "سورة إبراهيم: 41", source: "القرآن" },
    { title: "الرحمة", arabic: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", translation: "سورة الكهف: 10", source: "القرآن" },
    { title: "تفريج الهم", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", translation: "دعاء تفريج الكرب", source: "البخاري" },
    { title: "الرزق", arabic: "اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", translation: "دعاء قضاء الدين", source: "الترمذي" },
    { title: "قبول العمل", arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ", translation: "سورة البقرة: 127", source: "القرآن" },
    { title: "الذريّة الصالحة", arabic: "رَبِّ هَبْ لِي مِن لَّدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاء", translation: "سورة آل عمران: 38", source: "القرآن" },
    { title: "الثبات", arabic: "رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً", translation: "سورة آل عمران: 8", source: "القرآن" }
];

// --- App Class ---
class RamadanApp {
    // ... (Previous Duaa Data and App Class Start) ...

    constructor() {
        this.state = {
            currentSection: 'home',
            theme: localStorage.getItem('theme') || 'dark',
            tasbeehCount: parseInt(localStorage.getItem('tasbeehCount')) || 0,
            notificationEnabled: false,
            khatmaGoal: parseInt(localStorage.getItem('khatmaGoal')) || 1,
            completedJuz: JSON.parse(localStorage.getItem('completedJuz')) || [],
            soundEnabled: true,
            coordinates: JSON.parse(localStorage.getItem('coordinates')) || null,
            notifInterval: parseInt(localStorage.getItem('notifInterval')) || 0,
            intervalId: null,
            dailyReading: JSON.parse(localStorage.getItem('dailyReading')) || {}, // {fajr: bool, dhuhr: bool...}
            lastReadingDate: localStorage.getItem('lastReadingDate') || new Date().toDateString()
        };

        this.init();
    }

    init() {
        this.checkDayReset();
        this.applyTheme();
        this.renderAzkar('morning');
        this.renderDuaa();
        this.updateTasbeehDisplay();
        this.updateQuranPlanner();
        this.renderJuzGrid();
        this.updateHijriDate();
        this.calculatePrayerTimes();
        this.restoreReadingChecks();

        // ... (Listeners same as before) ...

        // Load Settings
        const savedInterval = document.getElementById('notif-interval');
        if (savedInterval) savedInterval.value = this.state.notifInterval;
        this.startNotificationTimer();

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

        const greeting = document.querySelector('.greeting-card h2');
        if (greeting && username) {
            greeting.innerHTML = `رمضان كريم، <br>${username}`;
        }
    }

    // --- Daily Reset Logic ---
    checkDayReset() {
        const today = new Date().toDateString();
        if (this.state.lastReadingDate !== today) {
            this.state.dailyReading = {}; // Reset checks
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

    // --- Quran Planner Interactive Logic ---
    togglePrayerRead(prayer) {
        const isChecked = this.state.dailyReading[prayer];
        const row = document.querySelector(`.prayer-row[onclick="app.togglePrayerRead('${prayer}')"]`);

        if (!isChecked) {
            // Mark as done
            this.state.dailyReading[prayer] = true;
            row.classList.add('checked');
            this.triggerCelebration();
        } else {
            // Unmark
            this.state.dailyReading[prayer] = false;
            row.classList.remove('checked');
        }
        localStorage.setItem('dailyReading', JSON.stringify(this.state.dailyReading));
    }

    triggerCelebration() {
        // Confetti
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Show Modal with Random Duaa
        const modal = document.getElementById('celebration-modal');
        const duaaEl = document.getElementById('reward-duaa');

        // Pick random Duaa not restricted by category
        const randomDuaa = duaaData[Math.floor(Math.random() * duaaData.length)];
        duaaEl.innerText = randomDuaa.arabic + "\n\n" + randomDuaa.translation;

        setTimeout(() => {
            modal.style.display = 'flex';
        }, 800); // Small delay for confetti to start
    }

    // ... (Rest of functions exist: navigate, openSettings, detectLocation, calculatePrayerTimes etc.) ...


    // --- Navigation Logic ---
    navigate(sectionId) {
        // Update Sections
        document.querySelectorAll('section').forEach(sec => sec.classList.remove('active-section'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active-section');

        // Update Bottom Nav
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

    // --- Settings Modal ---
    openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'flex';
            const intervalSelect = document.getElementById('notif-interval');
            intervalSelect.onchange = (e) => this.setNotifInterval(e.target.value);
        }
    }

    closeSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.style.display = 'none';
    }

    // --- Location & Prayer Times ---
    detectLocation() {
        if (!navigator.geolocation) {
            document.getElementById('location-status').innerText = "المتصفح لا يدعم تحديد الموقع";
            return;
        }
        document.getElementById('location-status').innerText = "جاري تحديد الموقع...";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.state.coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                localStorage.setItem('coordinates', JSON.stringify(this.state.coordinates));
                document.getElementById('location-status').innerText = "تم تحديث الموقع بنجاح!";
                this.calculatePrayerTimes();
            },
            () => {
                document.getElementById('location-status').innerText = "فشل في تحديد الموقع. تأكد من تفعيل الـ GPS.";
            }
        );
    }

    calculatePrayerTimes() {
        if (!this.state.coordinates || !window.adhan) return;

        const date = new Date();
        const coords = new adhan.Coordinates(this.state.coordinates.latitude, this.state.coordinates.longitude);
        const params = adhan.CalculationMethod.Egyptian(); // Default to Egyptian Authority
        params.madhab = adhan.Madhab.Shafi;

        const prayerTimes = new adhan.PrayerTimes(coords, date, params);

        // Format time helper
        const formatTime = (time) => {
            let hours = time.getHours();
            let minutes = time.getMinutes();
            const ampm = hours >= 12 ? 'م' : 'ص';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${minutes} ${ampm}`;
        };

        // Determine Next Prayer
        const next = prayerTimes.nextPrayer();
        const nextTime = prayerTimes.timeForPrayer(next);
        const now = new Date();

        const prayerNames = {
            fajr: 'الفجر',
            sunrise: 'الشروق',
            dhuhr: 'الظهر',
            asr: 'العصر',
            maghrib: 'المغرب',
            isha: 'العشاء',
            none: 'الفجر (غداً)'
        };

        const prayerEl = document.getElementById('next-prayer-name');
        const timeEl = document.getElementById('next-prayer-time');
        const remainEl = document.getElementById('time-remaining');

        if (nextTime && prayerEl && timeEl) {
            prayerEl.innerText = prayerNames[next] || '-';
            timeEl.innerText = formatTime(nextTime);

            // Countdown
            const diffMs = nextTime - now;
            const diffMins = Math.floor(diffMs / 60000);
            const hrs = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            if (remainEl) remainEl.innerText = `باقي ${hrs} ساعة و ${mins} دقيقة`;
        } else if (prayerEl) {
            // If today's prayers are done, show total tomorrow logic (simplified)
            prayerEl.innerText = 'الفجر (غداً)';
            timeEl.innerText = '-';
            if (remainEl) remainEl.innerText = '';
        }
    }

    // --- Notification Logic ---
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
            console.log(`Notification set every ${this.state.notifInterval} mins`);
            this.state.intervalId = setInterval(() => {
                this.sendNotification("تذكير بالأذكار", "ألا بذكر الله تطمئن القلوب. رطب لسانك بذكر الله.");
            }, this.state.notifInterval * 60 * 1000);
        }
    }

    sendNotification(title, body) {
        if (Notification.permission === "granted") {
            // Check if service worker registration is available for mobile support
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, {
                        body: body,
                        icon: 'https://cdn-icons-png.flaticon.com/512/4358/4358668.png',
                        vibrate: [200, 100, 200]
                    });
                });
            } else {
                new Notification(title, { body: body, icon: 'https://cdn-icons-png.flaticon.com/512/4358/4358668.png' });
            }
        }
    }

    // --- Theme Logic ---
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
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            body.classList.remove('dark-mode');
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    // --- Azkar Logic ---
    renderAzkar(type) {
        const list = document.getElementById('azkar-list');
        list.innerHTML = '';
        const data = azkarData[type] || azkarData['morning'];
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'azkar-card';
            card.innerHTML = `
                <p class="arabic-text">${item.arabic}</p>
                <p class="translation-text">${item.translation}</p>
                <span class="source-text">${item.source}</span>
            `;
            list.appendChild(card);
        });
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        // Activate correct tab visual logic if needed
    }

    filterAzkar(type) {
        this.renderAzkar(type);
    }

    // --- Tasbeeh Logic ---
    incrementTasbeeh() {
        this.state.tasbeehCount++;
        localStorage.setItem('tasbeehCount', this.state.tasbeehCount);
        this.updateTasbeehDisplay();
        if (navigator.vibrate) navigator.vibrate(50);
        if (this.state.soundEnabled) this.playBeep();
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
            osc.frequency.value = 800; // Hz
            osc.type = 'sine';
            gain.gain.value = 0.05;
            osc.start();
            setTimeout(() => osc.stop(), 50);
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
        document.getElementById('tasbeeh-count').innerText = this.state.tasbeehCount;
    }

    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        document.getElementById('sound-btn').innerHTML = this.state.soundEnabled ?
            '<i class="fa-solid fa-volume-high"></i>' :
            '<i class="fa-solid fa-volume-xmark"></i>';
    }

    // --- Quran Planner Logic ---
    updateQuranPlanner() {
        const goal = this.state.khatmaGoal;
        const totalPages = 604;
        const days = 30;

        // Total pages needed per day for the goal
        const pagesPerDay = Math.ceil((totalPages * goal) / days);
        const juzEquivalent = (pagesPerDay / 20).toFixed(1);

        document.getElementById('daily-pages').innerText = pagesPerDay;

        // Breakdown per prayer (5 prayers)
        const pagesPerPrayer = Math.ceil(pagesPerDay / 5);

        document.getElementById('pages-fajr').innerText = `${pagesPerPrayer} ص`;
        document.getElementById('pages-dhuhr').innerText = `${pagesPerPrayer} ص`;
        document.getElementById('pages-asr').innerText = `${pagesPerPrayer} ص`;
        document.getElementById('pages-maghrib').innerText = `${pagesPerPrayer} ص`;
        document.getElementById('pages-isha').innerText = `${pagesPerPrayer} ص`;

        document.getElementById('khatma-goal-display').innerText = goal;
        document.querySelector('.daily-target h4').innerHTML = `${pagesPerDay} صفحة <small>(~${juzEquivalent} جزء)</small>`;
    }

    adjustGoal(amount) {
        let newGoal = this.state.khatmaGoal + amount;
        if (newGoal < 1) newGoal = 1;
        if (newGoal > 10) newGoal = 10; // Cap at 10
        this.state.khatmaGoal = newGoal;
        localStorage.setItem('khatmaGoal', newGoal);
        this.updateQuranPlanner();
    }

    renderJuzGrid() {
        const grid = document.getElementById('juz-grid');
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
        }
        localStorage.setItem('completedJuz', JSON.stringify(this.state.completedJuz));
        this.renderJuzGrid();
    }

    updateHomeProgress() {
        const completed = this.state.completedJuz.length;
        const percent = (completed / 30) * 100;
        const circle = document.querySelector('.progress-ring__circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        document.getElementById('fasting-day').innerText = `${completed} جزء`;
    }

    // --- Duaa Logic ---
    renderDuaa() {
        const list = document.getElementById('duaa-list');
        duaaData.forEach(d => {
            const card = document.createElement('div');
            card.className = 'duaa-card';
            card.innerHTML = `
                <h3 style="margin-bottom:10px; color:var(--primary-color)">${d.title}</h3>
                <p class="arabic-text">${d.arabic}</p>
                <p class="translation-text">${d.translation}</p>
                <span class="source-text">${d.source}</span>
            `;
            list.appendChild(card);
        });
    }

    updateHijriDate() {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', calendar: 'islamic-umalqura' };
        // Fallback since not all browsers support Islamic calendar accurately
        document.getElementById('hijri-date').innerText = "1 رمضان 1447 هـ";
    }
}

// Initialize App
const app = new RamadanApp();
window.app = app;
