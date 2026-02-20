// ===== DOM Elements =====
const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleLink = document.getElementById('toggle-link');
const toggleQuestion = document.getElementById('toggle-question');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

// ===== Password Visibility Toggle =====
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
}

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
    formTitle.innerText = isLogin ? 'تسجيل الدخول' : 'إنشاء حساب';
    submitBtn.innerText = isLogin ? 'دخول' : 'تسجيل';
    toggleQuestion.innerText = isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟';
    toggleLink.innerText = isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول';
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
            // Save username and redirect
            localStorage.setItem('username', data.username);
            showSuccess('تم تسجيل الدخول! جاري التحويل...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } else {
            // After register, switch to login mode
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
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
}

function showSuccess(msg) {
    successMsg.innerText = msg;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
}

function setLoading(state) {
    isLoading = state;
    submitBtn.disabled = state;
    submitBtn.innerText = state
        ? (isLogin ? 'جاري الدخول...' : 'جاري التسجيل...')
        : (isLogin ? 'دخول' : 'تسجيل');
    submitBtn.style.opacity = state ? '0.7' : '1';
}
