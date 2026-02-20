// ===== DOM Elements =====
const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleLink = document.getElementById('toggle-link');
const toggleQuestion = document.getElementById('toggle-question');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

// ===== Eye Icon Toggle (handled in login.html inline script) =====
// NOTE: Do NOT add eye toggle here to avoid double-binding conflict

// ===== Auto-Redirect if Already Logged In =====
if (localStorage.getItem('username')) {
    window.location.href = 'index.html';
}

// ===== State =====
let isLogin = true;
let isLoading = false;

// ===== Toggle Between Login / Register =====
toggleLink.addEventListener('click', () => {
    isLogin = !isLogin;
    updateUI();
});

function updateUI() {
    if (isLogin) {
        formTitle.innerText = 'تسجيل الدخول';
        submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> دخول';
        toggleQuestion.innerText = 'ليس لديك حساب؟';
        toggleLink.innerText = 'إنشاء حساب جديد';
    } else {
        formTitle.innerText = 'إنشاء حساب جديد';
        submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> إنشاء حساب';
        toggleQuestion.innerText = 'لديك حساب بالفعل؟';
        toggleLink.innerText = 'تسجيل الدخول';
    }
    hideMessages();
}

function hideMessages() {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
}

// ===== Form Submit =====
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Client-side validation
    if (!username || !password) {
        showError('يرجى ملء جميع الحقول');
        return;
    }

    if (!isLogin && username.length < 3) {
        showError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
        return;
    }

    if (!isLogin && password.length < 6) {
        showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }

    const endpoint = isLogin ? '/login' : '/register';

    setLoading(true);
    hideMessages();

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        let data;
        try {
            data = await res.json();
        } catch {
            throw new Error('استجابة غير متوقعة من السيرفر. تأكد من الاتصال.');
        }

        if (!res.ok || !data.success) {
            throw new Error(data.msg || 'حدث خطأ ما، حاول مرة أخرى');
        }

        // ===== SUCCESS =====
        if (isLogin) {
            localStorage.setItem('username', data.username);
            showSuccess('✅ تم تسجيل الدخول! جاري التحويل...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 700);
        } else {
            showSuccess('✅ تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
            isLogin = true;
            updateUI();
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }

    } catch (err) {
        console.error('Auth Error:', err);
        showError(err.message || 'حدث خطأ في الاتصال بالسيرفر');
    } finally {
        setLoading(false);
    }
});

// ===== Helper Functions =====
function showError(msg) {
    errorMsg.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + msg;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    errorMsg.style.animation = 'none';
    void errorMsg.offsetHeight;
    errorMsg.style.animation = 'shake 0.4s ease';
}

function showSuccess(msg) {
    successMsg.innerHTML = msg;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
}

function setLoading(state) {
    isLoading = state;
    submitBtn.disabled = state;
    if (state) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (isLogin ? 'جاري الدخول...' : 'جاري التسجيل...');
    } else {
        submitBtn.innerHTML = isLogin
            ? '<i class="fa-solid fa-right-to-bracket"></i> دخول'
            : '<i class="fa-solid fa-user-plus"></i> إنشاء حساب';
    }
    submitBtn.style.opacity = state ? '0.75' : '1';
}
