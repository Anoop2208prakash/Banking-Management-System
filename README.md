This `README.md` is designed to provide a professional overview of your **Banking Management System** for your final year BCA submission. It summarizes the architecture, role-based security, and technical stack you've implemented for **Anoop Industry Bank**.

---

# 🏛️ Anoop Industry Bank - Management System

A sophisticated, full-stack **Banking Management System** built with a focus on security, role-based access control (RBAC), and a premium institutional user experience. This project was developed as a final year BCA graduation project.

## 🌟 Key Features

* **Role-Based Access Control (RBAC)**: Distinct interfaces and permissions for **Managers**, **Accountants**, **Cashiers**, and **Customers**.
* **Secure Authentication**: High-visibility, modern login and registration system with 256-bit SSL encryption simulation.
* **Institutional Onboarding**: Specialized flow allowing Accountants to securely register new Customers.
* **Financial Registry**: Global liquidity overview and staff management for Bank Managers.
* **Transaction Ledger**: Real-time auditing of deposits, withdrawals, and transfers with staff process tracking.

---

## 🏗️ Project Structure

The project is organized into two primary directories to separate backend logic from the frontend user interface.

```text
banking_system/
├── backend/                # Python 3.10 & Flask API
│   ├── prisma/             # MongoDB Schema & Client
│   ├── app.py              # Role-aware API Server
│   ├── seed_staff.py       # Administrative Setup Script
│   └── requirements.txt    # Stable production dependencies
│
├── frontend/               # React & Vite Dashboard
│   ├── src/
│   │   ├── pages/          # Login, Register, AdminPanel
│   │   ├── components/     # Dashboard & UI Elements
│   │   └── styles/         # Modern SCSS (Glassmorphism)
│   └── tailwind.config.js  # Utility CSS Configuration

```

---

## 🛠️ Tech Stack

| Tier | Technology | Justification |
| --- | --- | --- |
| **Frontend** | React (Vite) | High-performance, modern component architecture. |
| **Styling** | SCSS & Tailwind | Professional-grade styling with glassmorphism effects. |
| **Backend** | Python 3.10.11 | Maximum stability for asynchronous database operations. |
| **Database** | MongoDB Atlas | Scalable NoSQL cloud storage for banking records. |
| **ORM** | Prisma | Type-safe database queries and automated schema management. |

---

## 🚀 Getting Started

### 1. Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
prisma generate
python seed_staff.py  # Create initial Manager/Accountant roles
python app.py

```

### 2. Frontend Setup

```powershell
cd frontend
npm install
npm run dev

```

---

## 👤 Administrative Access

During development, the following roles can be used to test the RBAC system:

* **Manager**: Full system registry access.
* **Accountant**: Financial auditing and customer onboarding privileges.
* **Cashier**: Daily transaction processing.

---

**Developed by:** Anoop Prakash
**Project Title:** Institute Management System (Banking Module)

Would you like me to help you draft the **"Conclusion and Future Enhancements"** section for your project report based on this system?
