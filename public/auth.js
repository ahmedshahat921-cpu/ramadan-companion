const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleLink = document.getElementById('toggle-link');
const toggleQuestion = document.getElementById('toggle-question');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

let isLogin = true;
const API_URL = ''; // Use relative path for production

toggleLink.addEventListener('click', () => {
    isLogin = !isLogin;
    updateUI();
});

function updateUI() {
    formTitle.innerText = isLogin ? 'تسجيل الدخول' : 'إنشاء حساب';
    submitBtn.innerText = isLogin ? 'دخول' : 'تسجيل';
    toggleQuestion.innerText = isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟";
    toggleLink.innerText = isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول';
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
}

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const endpoint = isLogin ? '/login' : '/register';

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const contentType = res.headers.get("content-type");
        let data;

        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await res.json();
        } else {
            // If response is not JSON (e.g. Server Error text or Vercel HTML error)
            const text = await res.text();
            throw new Error(text || 'حدث خطأ في السيرفر (غير معروف)');
        }

        if (!res.ok) {
            throw new Error(data.msg || 'حدث خطأ ما');
        }

        if (isLogin) {
            localStorage.setItem('username', data.username);
            window.location.href = 'index.html';
        } else {
            showSuccess('تم التسجيل بنجاح! الرجاء تسجيل الدخول.');
            isLogin = true;
            updateUI();
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }

    } catch (err) {
        console.error('Login Error:', err);
        // Clean up the error message if it's a long HTML string
        let msg = err.message;
        if (msg.includes('<!DOCTYPE html>')) {
            msg = 'خطأ في السيرفر (500) - تأكد من قاعدة البيانات';
        }
        showError(msg === 'Invalid Credentials' ? 'بيانات الدخول غير صحيحة' : msg);
    }
});

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
