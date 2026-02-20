require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ===== MongoDB Connection (Optimized for Vercel Serverless) =====
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }

    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error('MONGO_URI is not defined. Please add it to your environment variables.');
    }

    try {
        const db = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        });
        cachedDb = db;
        console.log('✅ MongoDB Connected Successfully');
        return db;
    } catch (err) {
        cachedDb = null;
        console.error('❌ MongoDB Connection Error:', err.message);
        throw err;
    }
}

// Ensure DB connection on every request (important for Vercel serverless)
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        res.status(500).json({
            success: false,
            msg: 'فشل الاتصال بقاعدة البيانات. حاول مرة أخرى.',
        });
    }
});

// ===== Routes =====

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login Page Route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ===== Register =====
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ success: false, msg: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ success: false, msg: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, msg: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'اسم المستخدم موجود بالفعل، اختر اسماً آخر' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({
            username: username.trim(),
            password: hashedPassword
        });

        await newUser.save();

        console.log(`✅ New user registered: ${username}`);
        res.status(201).json({ success: true, msg: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' });

    } catch (err) {
        console.error('Register Error:', err.message);

        // Handle duplicate key error from MongoDB
        if (err.code === 11000) {
            return res.status(400).json({ success: false, msg: 'اسم المستخدم موجود بالفعل' });
        }

        res.status(500).json({ success: false, msg: 'حدث خطأ في السيرفر. حاول مرة أخرى.' });
    }
});

// ===== Login =====
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ success: false, msg: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }

        // Find user
        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'بيانات الدخول غير صحيحة' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'بيانات الدخول غير صحيحة' });
        }

        console.log(`✅ User logged in: ${username}`);
        res.status(200).json({ success: true, msg: 'تم تسجيل الدخول بنجاح', username: user.username });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ success: false, msg: 'حدث خطأ في السيرفر. حاول مرة أخرى.' });
    }
});

// ===== 404 Handler (must be last) =====
app.use((req, res) => {
    // If it's an API route, return JSON
    if (req.path.startsWith('/api') || req.headers['content-type'] === 'application/json') {
        return res.status(404).json({ success: false, msg: 'المسار غير موجود' });
    }
    // Otherwise serve index.html (SPA fallback)
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== Start Server (local development only) =====
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
