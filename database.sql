-- Check current database
SELECT current_database();

-- Create database if it doesn't exist
CREATE DATABASE graduation_project;

-- Connect to graduation_project
\c graduation_project;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS project_reviews CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    department VARCHAR(100),
    phone VARCHAR(20),
    year_of_study VARCHAR(20),
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    supervisor VARCHAR(100),
    keywords TEXT[],
    file_url VARCHAR(255),
    file_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revision')),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    admin_comment TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project reviews table
CREATE TABLE project_reviews (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('approved', 'rejected', 'revision')),
    comment TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert users
INSERT INTO users (name, email, password, role, department) VALUES
('Admin User', 'admin@defensehub.com', '$2a$10$XQhFkD9QkLZ4YjH8kVVnAeNvQjXf2ZR3tBc7dNqWrS5tU6vW7xY8z', 'admin', 'Administration'),
('John Doe', 'john@student.com', '$2a$10$XQhFkD9QkLZ4YjH8kVVnAeNvQjXf2ZR3tBc7dNqWrS5tU6vW7xY8z', 'user', 'Computer Science'),
('Jane Smith', 'jane@student.com', '$2a$10$XQhFkD9QkLZ4YjH8kVVnAeNvQjXf2ZR3tBc7dNqWrS5tU6vW7xY8z', 'user', 'Agriculture'),
('Mike Johnson', 'mike@student.com', '$2a$10$XQhFkD9QkLZ4YjH8kVVnAeNvQjXf2ZR3tBc7dNqWrS5tU6vW7xY8z', 'user', 'Information Technology');

-- Insert sample projects
INSERT INTO projects (title, description, department, supervisor, keywords, status, user_id) VALUES
('AI Based Attendance System', 'An automated attendance system using facial recognition technology.', 'Computer Science', 'Dr. Alex Johnson', ARRAY['AI', 'Facial Recognition'], 'approved', 2),
('Smart Irrigation System', 'An IoT-based irrigation system that automatically waters crops.', 'Agriculture', 'Prof. Mary Williams', ARRAY['IoT', 'Agriculture'], 'pending', 3),
('E-Library Management System', 'A digital library platform for managing books and resources.', 'Information Technology', 'Dr. Robert Davis', ARRAY['Library', 'Database'], 'approved', 4),
('Blockchain Voting System', 'A secure voting system using blockchain technology.', 'Computer Science', 'Dr. Sarah Lee', ARRAY['Blockchain', 'Security'], 'pending', 2),
('Mobile Health App', 'A mobile application for health monitoring.', 'Engineering', 'Prof. James Wilson', ARRAY['Mobile', 'Health'], 'rejected', 3);

-- Verify everything
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Projects:', COUNT(*) FROM projects
UNION ALL
SELECT 'Project Reviews:', COUNT(*) FROM project_reviews
UNION ALL
SELECT 'Notifications:', COUNT(*) FROM notifications;

-- Show users
SELECT id, name, email, role, department FROM users;

-- Show projects
SELECT id, title, status, department FROM projects;