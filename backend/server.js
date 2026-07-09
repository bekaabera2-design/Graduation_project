const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'graduation_project',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'nathaliebeka'
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to PostgreSQL database:', process.env.DB_NAME);
        release();
    }
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ Server is running!',
        database: process.env.DB_NAME
    });
});

// ============================================
// SETUP ROUTE
// ============================================
app.get('/api/setup', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
                department VARCHAR(100),
                phone VARCHAR(20),
                year_of_study VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query('DELETE FROM users');
        const hash = await bcrypt.hash('admin123', 10);
        
        const users = [
            ['Admin User', 'admin@defensehub.com', hash, 'admin', 'Administration', null, null],
            ['John Doe', 'john@student.com', hash, 'user', 'Computer Science', null, null],
            ['Jane Smith', 'jane@student.com', hash, 'user', 'Agriculture', null, null],
            ['Mike Johnson', 'mike@student.com', hash, 'user', 'Information Technology', null, null]
        ];
        
        for (const user of users) {
            await pool.query(
                'INSERT INTO users (name, email, password, role, department, phone, year_of_study) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                user
            );
        }
        
        res.json({ 
            message: '✅ Users created successfully!',
            credentials: [
                'admin@defensehub.com / admin123 (Admin)',
                'john@student.com / admin123 (Student)',
                'jane@student.com / admin123 (Student)',
                'mike@student.com / admin123 (Student)'
            ]
        });
    } catch (error) {
        console.error('❌ Setup error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// ============================================
// GET ALL USERS
// ============================================
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, department FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============================================
// REGISTER ROUTE - YOUR CODE GOES HERE ✅
// ============================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role, department, phone, year_of_study } = req.body;

        console.log('📝 Registration attempt:', { name, email, department });

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔐 Password hashed successfully');

        const result = await pool.query(
            'INSERT INTO users (name, email, password, role, department, phone, year_of_study) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, department',
            [name, email.toLowerCase(), hashedPassword, role || 'user', department || 'General', phone || null, year_of_study || null]
        );

        const user = result.rows[0];
        console.log('✅ User registered:', { id: user.id, email: user.email });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// ============================================
// LOGIN ROUTE
// ============================================
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt:', email);
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        
        if (result.rows.length === 0) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }
        
        const user = result.rows[0];
        console.log('👤 Found user:', { id: user.id, email: user.email, role: user.role });
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔐 Password match:', isMatch);
        
        if (!isMatch) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
            { expiresIn: '7d' }
        );
        
        console.log('✅ Login successful:', email);
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('🚀 ========================================');
    console.log('');
    console.log('📡 Available endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/test - Test connection`);
    console.log(`   GET  http://localhost:${PORT}/api/setup - Setup test users`);
    console.log(`   GET  http://localhost:${PORT}/api/users - List all users`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register - Register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login - Login`);
    console.log('');
    console.log('💡 Try logging in with:');
    console.log('   Email: john@student.com');
    console.log('   Password: admin123');
    console.log('');
});
