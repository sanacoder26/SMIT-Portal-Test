# 🎓 SMIT Connect Portal

SMIT Connect Portal is a full-stack web application designed to manage student admissions, course listings, and leave requests with role-based access for Students and Admins.

---

##  Features

### 👨‍🎓 Student Features

* Sign up (CNIC & Roll Number based validation)
* Login system
* View available courses
* Apply for courses
* Submit leave requests
* Track leave status (Pending / Approved / Rejected)

###  Admin Features

* Secure login & password reset
* Add new admins
* Upload students via Excel (bulk import)
* Manage courses (Add / Edit / Open / Close)
* View and manage student applications
* Approve / Reject leave requests
* Full system control

---

## 🏠 Pages Overview

### Home Page

* Displays SMIT Facebook posts (or placeholder content)
* Navigation buttons:

  * Student Login / Signup
  * View Courses

### Courses Page

* Responsive course listing
* Apply button (disabled if admissions closed)
* Popup admission form

### Admin Dashboard

* Student Management
* Course Management
* Leave Management
* Admin Controls

---

##  Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Redux Toolkit

### Backend & Database

* Supabase (PostgreSQL + Auth + Storage)
  *(Alternative: Firebase)*

### File Uploads

* Supabase Storage / Cloudinary

---

## Responsive Design

* Fully mobile-first design
* Optimized for:

  * Mobile 
  * Tablet 
  * Laptop 
  * Desktop 
  * Large Screens (2xl / 4K)

### Key Practices:

* `max-w-7xl mx-auto` for centered layout
* Responsive grids:

  * `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
* Flexible forms & modals
* Scrollable tables (`overflow-x-auto`)
* Adaptive typography & spacing

---

## 🗄️ Database Structure

### Tables:

* `users` → stores roles (admin/student)
* `students` → pre-added students (CNIC, Roll Number)
* `courses` → course listings (open/closed)
* `applications` → course applications
* `leaves` → leave requests
* `admins` → admin accounts

---

## 🔐 Authentication Rules

* Only students added by Admin can register
* Role-based access control:

  * Students → limited access
  * Admins → full control

---

## 📂 Project Structure

```
src/
├── components/
├── pages/
├── redux/
├── services/
├── utils/
└── App.js
```


# Run development server
npm run dev
```

---

##  Environment Variables

Create a `.env` file and add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

##  Deployment

* Frontend:  Netlify
* Backend: Supabase

---



##  Author

Developed by **[SanaCoder]**

---
This project is for educational purposes (SMIT).
