const pool = require("../config/db");

exports.approveProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE projects SET status='approved' WHERE id=$1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE projects SET status='rejected' WHERE id=$1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await require('bcryptjs').hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role || 'user']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role",
      [name, email, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const projects = await pool.query("SELECT COUNT(*) FROM projects");
    const approved = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'approved'");
    const pending = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'pending'");
    
    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalProjects: parseInt(projects.rows[0].count),
      approvedProjects: parseInt(approved.rows[0].count),
      pendingProjects: parseInt(pending.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};