# How to Run Deva Yadhala Portfolio Application

This document provides the exact terminal commands to run both the **Backend (Spring Boot)** and the **Frontend (React + Vite)** on your machine.

---

## 🚀 Quick Start (Two-Terminal Setup)

Open two separate terminal windows (PowerShell, Command Prompt, or Git Bash):

### 📌 Terminal 1: Backend (Spring Boot — Port 8080)

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
> *(On macOS / Linux / Git Bash: use `./mvnw spring-boot:run`)*

---

### 📌 Terminal 2: Frontend (React + Vite — Port 5173)

```powershell
cd frontend
npm.cmd run dev
```
> *(On Command Prompt or macOS/Linux/Git Bash: `npm run dev`)*

---

## 🌐 Application URLs

| Service | URL | Description |
|---|---|---|
| **Frontend Web App** | [http://localhost:5173](http://localhost:5173) | Main portfolio user interface |
| **Backend API Server** | [http://localhost:8080](http://localhost:8080) | Spring Boot REST API |
| **Swagger UI API Docs** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive API testing documentation |
| **OpenAPI Specification** | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) | Raw OpenAPI v3 JSON specification |
| **Admin Portal** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | Admin management dashboard |

### 🔑 Default Admin Credentials
- **Username / Email:** `devayadhala04@gmail.com` (or `devayadhala`)
- **Password:** `BhavyaSri@07`

---

## 💻 Exact Commands by Terminal Type

### 1. PowerShell (Windows)

#### Terminal 1 — Run Backend:
```powershell
cd "c:\Users\devro\OneDrive\Desktop\Portfolio\backend"
.\mvnw.cmd spring-boot:run
```

#### Terminal 2 — Run Frontend:
```powershell
cd "c:\Users\devro\OneDrive\Desktop\Portfolio\frontend"
npm.cmd run dev
```

> **Note for PowerShell Users:** If PowerShell blocks `npm` with a script execution error (`PSSecurityException`), either run `npm.cmd run dev` or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` once in your PowerShell session.

---

### 2. Command Prompt (cmd.exe)

#### Terminal 1 — Run Backend:
```cmd
cd /d "c:\Users\devro\OneDrive\Desktop\Portfolio\backend"
mvnw.cmd spring-boot:run
```

#### Terminal 2 — Run Frontend:
```cmd
cd /d "c:\Users\devro\OneDrive\Desktop\Portfolio\frontend"
npm run dev
```

---

### 3. Git Bash / Linux / macOS

#### Terminal 1 — Run Backend:
```bash
cd backend
./mvnw spring-boot:run
```

#### Terminal 2 — Run Frontend:
```bash
cd frontend
npm run dev
```

---

## 🛠️ First-Time Setup / Clean Build (If Needed)

If you just cloned the repository or need to reinstall packages:

### Backend Build & Dependencies:
```powershell
cd backend
.\mvnw.cmd clean package -DskipTests
```

### Frontend Dependencies:
```powershell
cd frontend
npm.cmd install
```

---

## ⚙️ Environment Configuration

The application works out of the box with zero setup using an embedded persistent **H2 database** (`./backend/data/portfolio_db`).

To switch to **PostgreSQL** or customize secrets, edit the `.env` file in the root directory:

```properties
# Database Configuration (PostgreSQL)
DB_URL=jdbc:postgresql://localhost:5432/portfolio_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT Security Secret (32+ characters)
JWT_SECRET=super_secret_jwt_key_for_dev_min_32_characters_long_portfolio_system_2026
JWT_EXPIRATION_MS=86400000

# Initial Admin Credentials
ADMIN_INITIAL_USERNAME=devayadhala
ADMIN_INITIAL_EMAIL=devayadhala04@gmail.com
ADMIN_INITIAL_PASSWORD=BhavyaSri@07

# Ports & Origins
PORT=8080
FRONTEND_URL=http://localhost:5173
```

---

## ❓ Troubleshooting

1. **Port 8080 or 5173 is already in use:**
   - Find and kill the process occupying the port on Windows:
     ```powershell
     netstat -ano | findstr :8080
     taskkill /PID <PID_NUMBER> /F
     ```
2. **Backend cannot connect to PostgreSQL:**
   - If PostgreSQL is not installed or running, remove or comment out `DB_URL` in `.env`. Spring Boot will automatically fall back to the built-in local H2 file database.
3. **Frontend API Proxy:**
   - The Vite frontend (`vite.config.js`) proxies all `/api` requests to `http://localhost:8080` automatically. Ensure the backend is started before making admin or contact requests.
