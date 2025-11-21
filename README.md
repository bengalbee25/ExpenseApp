# ExpenseApp – Personal Expense Tracker

A full-stack expense tracking application built with **React (Vite)** on the front end and **Node.js + Express + MySQL** on the back end.  
Users can register, log in, record incomes and expenses, see charts, generate reports, and manage their personal finances.

---

## Features

- 🔐 **Authentication**
  - User registration and login
  - JSON Web Token–based (JWT) authentication
  - Change password screen

- 💸 **Transaction Management**
  - Separate pages for **Income** and **Expenses**
  - Add, edit, delete transactions
  - Category, amount, date, and description fields

- 📊 **Dashboard & Analytics**
  - Summary cards for **Total Income**, **Total Expense**, and **Balance**
  - Recent transactions table
  - Monthly income vs. expense charts
  - Expense breakdown by category (pie chart)

- 🔍 **Search & Filter**
  - Search transactions by category, date range, and type
  - Dedicated **Search Transactions** page

- 🧾 **Reports & Export**
  - Report page to view filtered data
  - Export / print using **jsPDF**, **jspdf-autotable**, and **html2canvas** (PDF report generation)

---

## Tech Stack

**Frontend (client)**

- React 18 (Vite)
- React Router DOM
- Axios
- Recharts (charts & graphs)
- Tailwind CSS
- jsPDF, jspdf-autotable, html2canvas

**Backend (server)**

- Node.js + Express
- MySQL (mysql2)
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- Zod (request validation)
- dotenv, cors, morgan

**Database**

- MySQL  
- Schema and tables provided in: `expense app database.sql`

---

## Project Structure

bash
ExpenseApp/
├── client/                     # React frontend (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── api.js              # Axios instance for API calls
│       ├── context/
│       │   └── AuthContext.jsx # Auth state & JWT handling
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── SummaryCard.jsx
│       │   ├── TransactionForm.jsx
│       │   ├── TransactionTable.jsx
│       │   └── charts/
│       │       ├── ExpensePie.jsx
│       │       ├── IncomeExpenseBar.jsx
│       │       └── IncomeExpenseLine.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Income.jsx
│           ├── Expenses.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── ChangePassword.jsx
│           ├── SearchTransactions.jsx
│           └── Report.jsx
│
├── server/                     # Node/Express backend
│   ├── package.json
│   └── src/
│       ├── index.js            # Express app entry
│       ├── db.js               # MySQL connection pool
│       ├── middleware/
│       │   └── authMiddleware.js
│       ├── routes/
│       │   ├── auth.js         # /api/auth (login/register/change-password)
│       │   └── transactions.js # /api/transactions (CRUD & analytics)
│       └── utils/
│           └── validators.js   # Zod validation schemas
│
└── expense app database.sql    # Database schema (users, transactions)
`

---

## Getting Started

### Prerequisites

* **Node.js** (LTS recommended)
* **npm** or **yarn**
* **MySQL** server

---

## 1. Clone the Repository

bash
git clone <your-repo-url>.git
cd ExpenseApp


---

## 2. Database Setup (MySQL)

1. Start your MySQL server.
2. Open a MySQL client (CLI, phpMyAdmin, Workbench, etc.).
3. Run the SQL script:

   sql
   SOURCE path/to/"expense app database.sql";
   

   This will:

   * Create the database: `expense_app`
   * Create tables: `users`, `transactions`

---

## 3. Backend Setup (server)

bash
cd server
npm install


Create a `.env` file in the `server` folder:

env
PORT=5000
JWT_SECRET=your_jwt_secret_here

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=expense_app


Run the server in development mode:

bash
npm run dev


The backend will run on:

text
http://localhost:5000


Health check endpoint:

text
GET /health


---

## 4. Frontend Setup (client)

In another terminal:

bash
cd client
npm install


Create a `.env` file in the `client` folder:

env
VITE_API_URL=http://localhost:5000


Start the React dev server:

bash
npm run dev


By default (Vite), the frontend will run on:

text
http://localhost:5173


---

## 5. Using the App

1. Open the frontend in your browser (`/login` page).
2. Click **Register** to create a new user account.
3. Log in with your credentials.
4. Use the sidebar to navigate:

   * **Dashboard** – overview, charts, recent transactions
   * **Income / Expenses** – add or edit transactions
   * **Search Transactions** – advanced filtering
   * **Report** – generate and export reports
   * **Change Password** – update your password

---

## Available Scripts

### Client (`client/`)

* `npm run dev` – start Vite dev server
* `npm run build` – build production bundle
* `npm run preview` – preview the production build

### Server (`server/`)

* `npm run dev` – run server with nodemon (auto-reload)
* `npm start` – run server with Node

---

## Deployment Notes

* **Frontend** can be built with `npm run build` in `client` and deployed to any static hosting (e.g., Netlify, Vercel, static S3).
* **Backend** should be deployed on a Node-compatible host (e.g., Render, Railway, VPS) with access to a MySQL database.
* Make sure to:

  * Set environment variables on the server (DB credentials, `JWT_SECRET`, `PORT`).
  * Update `VITE_API_URL` in the frontend `.env` to point to your deployed backend URL.

---

## License

This project is licensed under Apache License 2.0. See the LICENSE file for details.
