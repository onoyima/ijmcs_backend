# Igniting Journal of Multidisciplinary and Contemporary Studies (IJMCS)

IJMCS is a modern, responsive, and fully functional full-stack academic publishing platform. It is designed to manage the entire lifecycle of scholarly articles—from author submission and editorial peer review to APC payment processing and global open-access publication.

---

## 🌟 Key Features

### User Roles & Workflows
* **Authors:** Register, submit manuscripts (metadata + file upload), track review progress, pay Article Processing Charges (APC), and approve galley proofs.
* **Reviewers:** Accept/decline review invitations, download manuscripts, and submit standardized evaluation forms with recommendations (Accept, Minor/Major Revision, Reject).
* **Editors:** Manage the journal workflow. Assign reviewers, make desk decisions (Accept/Reject), compile approved articles into Issues, and publish them to the live site.
* **Administrators:** Manage global site settings, user roles, pricing, and view system-wide analytics.

### Technical Highlights
* **Decoupled Architecture:** Independent frontend and backend repositories for scalable cloud hosting.
* **Automated Email Engine:** Brand-aligned HTML email notifications utilizing Nodemailer.
* **Secure Authentication:** JWT-based access control with role-gated API endpoints (`requireRole` middleware).
* **Financial Integration:** Built-in gateways (Paystack/Flutterwave) for processing academic publishing fees.
* **Premium UX/UI:** Fluid Framer Motion page transitions, a bespoke custom mouse cursor, scroll-to-top integrations, and a deeply customizable aesthetic powered by Tailwind CSS.

---

## 💻 Tech Stack

**Frontend (Client)**
* React.js 18 (Vite)
* Tailwind CSS (Styling & Design System)
* Framer Motion (Micro-animations & Page Transitions)
* Lucide React (Iconography)
* Axios (API Client)

**Backend (Server)**
* Node.js & Express.js (RESTful API architecture)
* MySQL2 (Data Persistence)
* JWT & Bcrypt (Security & Authentication)
* Nodemailer (Email Communication)
* Multer (File Upload Handling)

---

## 📁 Project Structure

\`\`\`text
IJMCS/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets (images, logos)
│   ├── src/
│   │   ├── api/                # Axios instance configuration
│   │   ├── components/         # Reusable UI components (Navbar, Footers, Loaders)
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── pages/              # Application Routes
│   │   │   ├── auth/           # Login, Register, Verify Email
│   │   │   ├── authenticated/  # Dashboards, Submissions (Role Guarded)
│   │   │   └── public/         # Homepage, Archives, Editorial Team
│   │   └── index.css           # Global Tailwind and base styles
│   └── vercel.json             # SPA Deployment routing for Vercel
│
└── server/                     # Node/Express Backend API
    ├── src/
    │   ├── config/             # DB connection, Environment variables, schema.sql
    │   ├── controllers/        # Business logic for all routes
    │   ├── middleware/         # JWT Auth, Role Gatekeeper, Error Handlers
    │   ├── routes/             # API Endpoint definitions
    │   └── utils/              # Email Template Generator, File Handlers
    └── .env                    # Deployment Server secrets
\`\`\`

---

## 🚀 Local Development Setup

### Prerequisites
* Node.js (v18+)
* MySQL Server (running locally)

### 1. Database Configuration
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin).
2. Create a new database named \`ijmcs_db\`.
3. Execute the SQL script located at \`server/src/config/schema.sql\` to build all tables and relationships.

### 2. Backend Setup
1. Open a terminal and navigate to the \`server\` directory:
   \`\`\`bash
   cd server
   npm install
   \`\`\`
2. Duplicate the \`.env.example\` file and rename it to \`.env\`.
3. Fill in your local MySQL credentials:
   \`\`\`env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ijmcs_db
   \`\`\`
4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   *(The server will start on http://localhost:5000)*

### 3. Frontend Setup
1. Open a new terminal instance and navigate to the \`client\` directory:
   \`\`\`bash
   cd client
   npm install
   \`\`\`
2. Create a \`.env\` file in the \`client\` root:
   \`\`\`env
   VITE_API_BASE_URL=http://localhost:5000
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   *(The platform UI will load on http://localhost:5173)*

---

## 🌐 Production Deployment

The project is configured to automatically route external API requests properly when environment variables are injected in production. 

### Deploying the Backend (Recommended: Render.com)
1. Push your repository to GitHub.
2. Link your repository to Render -> **New Web Service**.
3. Point the Root Directory to \`server\`.
4. Build Command: \`npm install\` | Start Command: \`npm start\`
5. **Crucial Environment Variable:** Add \`CLIENT_URL=https://your-frontend-domain.vercel.app\` so the backend allows requests from your live UI.

### Deploying the Frontend (Recommended: Vercel.com)
1. Link your repository to Vercel -> **New Project**.
2. Point the Root Directory to \`client\`.
3. Vercel automatically detects the Vite framework. 
4. **Crucial Environment Variable:** Add \`VITE_API_BASE_URL=https://your-backend-domain.onrender.com\` so the UI stops pointing to \`localhost\` and hits your live server.

*(Note: The included \`vercel.json\` file guarantees that page reloads on your live URL do not trigger 404 errors due to Single-Page Application routing).*

---

## ✉️ Email Configuration
To enable the Journal to send out Registration/Decision emails, ensure you provide valid SMTP credentials in the \`server/.env\` file. 

\`\`\`env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=journal.ignitingmultidisciplinary@lasu.edu.ng
SMTP_PASS=your_email_password
EMAIL_FROM="IJMCS Editorial Office <journal.ignitingmultidisciplinary@lasu.edu.ng>"
\`\`\`

---

## 🔒 Security Practices
* **Never commit \`.env\` files to version control.**
* Ensure the \`JWT_ACCESS_SECRET\` and \`JWT_REFRESH_SECRET\` strings in production are long, randomized keys.
* The Multer upload destination (\`uploads/submissions\`) should be secured appropriately in production to prevent direct execution of scripts. 
