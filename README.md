# OR Management System

An intelligent, decentralized platform designed to modernize surgical scheduling and address the inefficiencies of traditional, centralized OT boards.

---

## 💡 The Problem

Outdated, manual surgical scheduling methods create significant bottlenecks and challenges within hospitals:

- **Delayed Communication**: Critical updates on a patient's status or schedule changes aren't instantly shared with the surgical team.
- **Inefficient Scheduling**: Lack of real-time data leads to surgical delays, wasted time, and poor resource allocation.
- **Increased Stress**: Medical staff face unnecessary pressure due to uncertainty and last-minute changes.
- **Manual Errors**: Paper-based and spreadsheet systems increase the risk of scheduling conflicts and data inconsistencies.

---

## 🚀 Our Solution

The OR Management System is a collaborative web-based platform built to streamline operating room scheduling, staff coordination, and surgical workflow management.

Instead of relying on manual coordination, the system provides:

- Real-Time OR Visibility
- Centralized Surgery Scheduling
- Structured Staff Allocation
- Secure User Authentication
- Interactive Dashboard for Monitoring

This ensures improved coordination, reduced delays, and optimized operating room utilization.

---

## 🏗️ System Architecture

The application follows a full-stack architecture:

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT & bcrypt

The system is modular, scalable, and designed for secure data handling.

---

## 🧩 Core Modules

### 🔐 User Management
- Secure login and registration
- Role-based access control
- JWT-based session management

### 🧑‍⚕️ Staff Management
- Manage Surgeons, Anesthesiologists, Nurses
- Assign staff to surgeries
- Track staff details and availability

### 🧑‍🦽 Patient Management
- Add, edit, and delete patient records
- Link patients to scheduled surgeries

### 🏥 Operation Room Management
- Add and manage operation rooms
- Track OR status (Available / In Use / Closed)
- Prevent double-booking conflicts

### 📅 Surgery Scheduling
- Schedule new surgeries
- Assign OR and surgical team
- Modify or cancel procedures

### 📊 Dashboard & Monitoring
- Real-time surgery overview
- OR availability tracking
- Centralized access to all modules

---

## 🔐 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based authorization
- Environment variable protection using dotenv
- Relational integrity enforced via PostgreSQL

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Supabase

### Security
- JWT
- bcrypt
- dotenv
