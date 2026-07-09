const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create(name, email, password, role = 'user', department = null) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                `INSERT INTO users (name, email, password, role, department) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING id, name, email, role, department, created_at`,
                [name, email, hashedPassword, role, department]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role, department, created_at FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role, department, created_at FROM users ORDER BY id'
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByRole(role) {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role, department, created_at FROM users WHERE role = $1',
                [role]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByDepartment(department) {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role, department, created_at FROM users WHERE department = $1',
                [department]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updates) {
        try {
            const fields = [];
            const values = [];
            let index = 1;

            if (updates.name) {
                fields.push(`name = $${index++}`);
                values.push(updates.name);
            }
            if (updates.email) {
                fields.push(`email = $${index++}`);
                values.push(updates.email);
            }
            if (updates.role) {
                fields.push(`role = $${index++}`);
                values.push(updates.role);
            }
            if (updates.department) {
                fields.push(`department = $${index++}`);
                values.push(updates.department);
            }
            if (updates.password) {
                const hashedPassword = await bcrypt.hash(updates.password, 10);
                fields.push(`password = $${index++}`);
                values.push(hashedPassword);
            }

            fields.push(`updated_at = NOW()`);
            values.push(id);

            const result = await pool.query(
                `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} 
                 RETURNING id, name, email, role, department, created_at`,
                values
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async updateRole(email, role) {
        try {
            const result = await pool.query(
                'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, name, email, role, department',
                [role, email]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async updatePassword(email, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await pool.query(
                'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email',
                [hashedPassword, email]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async deleteByEmail(email) {
        try {
            const result = await pool.query(
                'DELETE FROM users WHERE email = $1 RETURNING id, name, email',
                [email]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async comparePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    static async getStats() {
        try {
            const total = await pool.query('SELECT COUNT(*) FROM users');
            const admins = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
            const students = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
            
            return {
                total: parseInt(total.rows[0].count),
                admins: parseInt(admins.rows[0].count),
                students: parseInt(students.rows[0].count)
            };
        } catch (error) {
            throw error;
        }
    }

    static async search(keyword) {
        try {
            const result = await pool.query(`
                SELECT id, name, email, role, department, created_at
                FROM users 
                WHERE name ILIKE $1 
                   OR email ILIKE $1 
                   OR department ILIKE $1
                ORDER BY name
            `, [`%${keyword}%`]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAdmins() {
        try {
            const result = await pool.query(
                'SELECT id, name, email, department FROM users WHERE role = $1',
                ['admin']
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getStudents() {
        try {
            const result = await pool.query(
                'SELECT id, name, email, department FROM users WHERE role = $1',
                ['user']
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;