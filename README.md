# Graduation_project
# 🛡️ GC Defense Hub

> A web-based platform for managing final year defense projects at universities.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12.0-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📖 Overview

**GC Defense Hub** is a full-stack web application designed to streamline the management of final year defense projects. It allows students to submit their projects online, enables administrators to review and approve submissions, and provides a centralized repository for all projects.

### 🎯 Problem Statement

- Manual project submission process is time-consuming
- Students don't know the status of their projects
- No central repository for approved projects
- Administrators struggle to track submissions

### 💡 Solution

GC Defense Hub solves these problems by providing:
- ✅ Digital project submission
- ✅ Real-time status tracking
- ✅ Role-based access control
- ✅ Centralized project repository

---

## ✨ Features

### 🔐 Authentication
- **Register** - Create a new account
- **Login** - Secure login with JWT
- **Remember Me** - Save login session
- **Role-based Access** - Users vs Admins

### 👨‍🎓 Student Features
- **Upload Project** - Submit your final year project
- **View Projects** - See all approved projects
- **Track Status** - Check if your project is pending, approved, or rejected
- **Dashboard** - View statistics and project list

### 👨‍💼 Admin Features
- **Review Projects** - Approve or reject submissions
- **Dashboard** - View pending, approved, and rejected projects
- **Manage Users** - View all registered users
- **Search & Filter** - Find projects quickly

### 🔒 Security
- Password hashing with bcrypt
- JWT authentication
- Role-based permissions
- Secure database queries

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript (ES6+) | Interactivity |
| Google Fonts | Typography |
| Font Awesome | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password Encryption |

### Development Tools
- **VS Code** - Code editor
- **Live Server** - Frontend development
- **Postman** - API testing
- **Git** - Version control
- **DBeaver** - Database management

---

## 📁 Project Structure
