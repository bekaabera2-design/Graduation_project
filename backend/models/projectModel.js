const pool = require('../config/db');

class Project {
    static async create(title, description, department, supervisor, userId, fileUrl = null) {
        try {
            const result = await pool.query(
                `INSERT INTO projects (title, description, department, supervisor, user_id, file_url) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 RETURNING *`,
                [title, description, department, supervisor, userId, fileUrl]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const result = await pool.query(`
                SELECT p.*, u.name as student_name, u.email as student_email
                FROM projects p 
                LEFT JOIN users u ON p.user_id = u.id 
                ORDER BY p.submitted_at DESC
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query(`
                SELECT p.*, u.name as student_name, u.email as student_email
                FROM projects p 
                LEFT JOIN users u ON p.user_id = u.id 
                WHERE p.id = $1
            `, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async findByUser(userId) {
        try {
            const result = await pool.query(`
                SELECT * FROM projects 
                WHERE user_id = $1 
                ORDER BY submitted_at DESC
            `, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByStatus(status) {
        try {
            const result = await pool.query(`
                SELECT p.*, u.name as student_name, u.email as student_email
                FROM projects p 
                LEFT JOIN users u ON p.user_id = u.id 
                WHERE p.status = $1 
                ORDER BY p.submitted_at DESC
            `, [status]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByDepartment(department) {
        try {
            const result = await pool.query(`
                SELECT p.*, u.name as student_name
                FROM projects p 
                LEFT JOIN users u ON p.user_id = u.id 
                WHERE p.department = $1 
                ORDER BY p.submitted_at DESC
            `, [department]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async countByStatus(status) {
        try {
            const result = await pool.query('SELECT COUNT(*) FROM projects WHERE status = $1', [status]);
            return parseInt(result.rows[0].count);
        } catch (error) {
            throw error;
        }
    }

    static async countByUser(userId) {
        try {
            const result = await pool.query('SELECT COUNT(*) FROM projects WHERE user_id = $1', [userId]);
            return parseInt(result.rows[0].count);
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updates) {
        try {
            const fields = [];
            const values = [];
            let index = 1;

            if (updates.title) {
                fields.push(`title = $${index++}`);
                values.push(updates.title);
            }
            if (updates.description) {
                fields.push(`description = $${index++}`);
                values.push(updates.description);
            }
            if (updates.department) {
                fields.push(`department = $${index++}`);
                values.push(updates.department);
            }
            if (updates.supervisor) {
                fields.push(`supervisor = $${index++}`);
                values.push(updates.supervisor);
            }
            if (updates.status) {
                fields.push(`status = $${index++}`);
                values.push(updates.status);
            }
            if (updates.file_url !== undefined) {
                fields.push(`file_url = $${index++}`);
                values.push(updates.file_url);
            }
            if (updates.admin_comment !== undefined) {
                fields.push(`admin_comment = $${index++}`);
                values.push(updates.admin_comment);
            }

            fields.push(`updated_at = NOW()`);
            values.push(id);

            const result = await pool.query(
                `UPDATE projects SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
                values
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(id, status) {
        try {
            const result = await pool.query(
                `UPDATE projects SET status = $1, reviewed_at = NOW(), updated_at = NOW() 
                 WHERE id = $2 RETURNING *`,
                [status, id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async approve(id) {
        try {
            const result = await pool.query(
                `UPDATE projects SET status = 'approved', reviewed_at = NOW(), updated_at = NOW() 
                 WHERE id = $1 RETURNING *`,
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async reject(id, comment = null) {
        try {
            const result = await pool.query(
                `UPDATE projects SET status = 'rejected', reviewed_at = NOW(), updated_at = NOW(), admin_comment = $2
                 WHERE id = $1 RETURNING *`,
                [id, comment]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM projects WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async search(keyword) {
        try {
            const result = await pool.query(`
                SELECT p.*, u.name as student_name, u.email as student_email
                FROM projects p 
                LEFT JOIN users u ON p.user_id = u.id 
                WHERE p.title ILIKE $1 
                   OR p.description ILIKE $1 
                   OR p.department ILIKE $1
                   OR u.name ILIKE $1
                ORDER BY p.submitted_at DESC
            `, [`%${keyword}%`]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getStats() {
        try {
            const total = await pool.query('SELECT COUNT(*) FROM projects');
            const approved = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'approved'");
            const pending = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'pending'");
            const rejected = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'rejected'");
            
            return {
                total: parseInt(total.rows[0].count),
                approved: parseInt(approved.rows[0].count),
                pending: parseInt(pending.rows[0].count),
                rejected: parseInt(rejected.rows[0].count)
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Project;