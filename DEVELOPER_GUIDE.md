# Developer Workflow & Commands Guide

This guide contains all the commands you need to run when developing, making changes, testing, and pushing code to GitHub for **Deva Yadhala Portfolio**.

---

## 📌 Quick Summary of Common Workflows

```bash
# 1. Start Frontend locally
cd frontend
npm run dev

# 2. Start Backend locally
cd backend
.\mvnw.cmd spring-boot:run

# 3. Push your changes to GitHub (triggers auto-deploy on Vercel & Render)
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

---

## 1. Local Development Commands

### 💻 Running the Frontend (React + Vite + TailwindCSS)
Open a terminal in the project root:
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (only needed first time or when new packages are added)
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

### ☕ Running the Backend (Spring Boot + Java 17)
Open a separate terminal in the project root:
```bash
# Navigate to backend folder
cd backend

# Run Spring Boot backend (Windows PowerShell / CMD)
.\mvnw.cmd spring-boot:run

# (On Linux / macOS, use: ./mvnw spring-boot:run)
```
* **Local Backend API:** `http://localhost:8080/`
* **Swagger UI API Documentation:** `http://localhost:8080/swagger-ui.html`

---

## 2. Validating & Building Before Pushing

Before pushing changes to GitHub, test that your code compiles and builds cleanly:

### 🔨 Build the Frontend (Vite)
```bash
cd frontend
npm run build
```
*(If there are any syntax or import errors, Vite will tell you immediately).*

### 🔨 Compile and Test the Backend (Maven)
```bash
cd backend
.\mvnw.cmd clean compile
```

---

## 3. Git Commands: Pushing Changes to GitHub

Whenever you make any changes (e.g. updating code, text, styling, or configuration):

### Step 1: Check what files were changed
```bash
git status
```

### Step 2: Stage all changed files
```bash
git add .
```

### Step 3: Commit the changes with a message
```bash
git commit -m "Update experience timeline and secure backend config"
```

### Step 4: Push to GitHub
```bash
git push origin main
```

---

## 4. How Cloud Deployments Work Automatically

Once you run `git push origin main`:
* 🌐 **Vercel (Frontend):** Automatically detects the push and redeploys `yadhaladevaportfolio.vercel.app` in ~30 seconds.
* ⚙️ **Render (Backend):** Automatically detects the push and rebuilds/redeploys your Spring Boot backend on Render in ~2–3 minutes.

---

## 5. Render & Supabase Environment Variables Checklist

Whenever setting up a new environment or deploying on Render, ensure these environment variables are set in **Render Dashboard → Environment Variables**:

| Variable Key | Description / Example |
| :--- | :--- |
| `DB_URL` | `jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `DB_USERNAME` | `postgres.dizyqymwvpibkqtntzbe` |
| `DB_PASSWORD` | *(Your Supabase Database Password)* |
| `SUPABASE_URL` | `https://dizyqymwvpibkqtntzbe.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Your Supabase `service_role` secret JWT token)* |
| `SUPABASE_BUCKET_CERTIFICATIONS` | `portfolio-certifications` |
| `SUPABASE_BUCKET_RESUMES` | `portfolio-resumes` |
| `JWT_SECRET` | `super_secret_jwt_key_for_dev_min_32_characters_long_portfolio_system_2026` |
| `FRONTEND_URL` | `https://yadhaladevaportfolio.vercel.app` |
| `ADMIN_INITIAL_USERNAME` | `devayadhala` |
| `ADMIN_INITIAL_EMAIL` | `devayadhala04@gmail.com` |
| `ADMIN_INITIAL_PASSWORD` | *(Your Private Admin Password)* |

---

## 6. Useful Troubleshooting Commands

### Port Already in Use?
If port `8080` (backend) or `5173` (frontend) is already running and blocked:
```powershell
# Find process using port 8080 (Windows PowerShell)
netstat -ano | findstr :8080

# Kill process by PID (replace 1234 with actual PID from netstat)
taskkill /PID 1234 /F
```

### Discard Local Changes (Revert back to last Git commit)
```bash
# Discard changes to a specific file
git restore path/to/file

# Discard all unstaged changes
git restore .
```
