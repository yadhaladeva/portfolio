# 🏛️ Deva Yadhala Portfolio — System Architecture

Comprehensive architectural overview and data flow documentation for the full-stack portfolio application.

---

## 📐 High-Level System Architecture Diagram (Optimized Decoupled Architecture)

```
+---------------------------------------------------------------------------------------------------------+
|                                              CLIENT TIER (Vercel)                                       |
|                                                                                                         |
|   +-----------------------------------------------+   +---------------------------------------------+   |
|   |         Public Visitor View (Fast CDN)        |   |              Admin CMS Portal               |   |
|   |  - Hero, About, Skills, Experience            |   |  - Full CRUD Management                     |   |
|   |  - Projects Showcase, Certifications          |   |  - Resume & Cert Uploader                   |   |
|   |  - Resume & Cert Viewers (Direct Supabase)    |   |  - Theme Settings, Logs, Message Viewer     |   |
|   +-----------------------------------------------+   +---------------------------------------------+   |
|                 |                                                            |                          |
|                 | Direct Client Reads (@supabase/supabase-js)                | JWT Bearer Token (Axios) |
|                 | (Zero dependency on Render cold-starts)                    |                          |
+-----------------|------------------------------------------------------------|--------------------------+
                  |                                                            |
                  |                                                            v
                  |                                     +-------------------------------------------------+
                  |                                     |        API / BACKEND TIER (Spring Boot)         |
                  |                                     |             (Hosted on Render)                  |
                  |                                     |                                                 |
                  |                                     |  - Security Filter & JWT Authentication         |
                  |                                     |  - Admin REST Controllers (/api/admin/**)       |
                  |                                     |  - Contact Inquiries Endpoint (/api/contact)    |
                  |                                     |  - Service Layer & Validation                   |
                  |                                     |  - SupabaseStorageService (Upload / Manage)     |
                  |                                     +-------------------------------------------------+
                  |                                                            |
                  +-----------------------------+------------------------------+
                                                |
                               +----------------+----------------+
                               |                                 |
                               v                                 v
+----------------------------------------------+ +--------------------------------------------------------+
|                DATABASE TIER                 | |                     STORAGE TIER                       |
|                                              | |                                                        |
|  +----------------------------------------+  | |  +--------------------------------------------------+  |
|  |       Supabase PostgreSQL (Cloud)      |  | |  |         Supabase Object Storage (Cloud)      |  |
|  |       (With Row Level Security - RLS)  |  | |  |                                                  |  |
|  +----------------------------------------+  | |  +--------------------------------------------------+  |
|  - Public Read (RLS: anon, authenticated):   | |  - Buckets (Public Read Enabled):                      |
|    - hero_content & hero_stages              | |    - portfolio-resumes (PDF)                           |
|    - about_contents, capabilities, education | |    - portfolio-certifications (PDF, Images)            |
|    - skills, experience, projects            | |                                                        |
|    - certifications, resumes (active only)   | |  - Direct CDN Streaming to Visitor Browser             |
|    - contact_settings, header_configs        | |    (Zero backend latency / No Render wake-up needed)   |
|  - Private Tables (No public read):          | |                                                        |
|    - admin_users (BCrypt hashes)             | |                                                        |
|    - contact_messages (Public INSERT allowed,| |                                                        |
|      strict zero public SELECT read access)  | |                                                        |
+----------------------------------------------+ +--------------------------------------------------------+
```

---

## 🛠️ Technology Stack

### 1. Frontend
* **Core Framework:** React 18 (SPA)
* **Build Tooling:** Vite 6
* **Styling & Design System:** Tailwind CSS, Glassmorphism, Dark Modern UI
* **Icons:** Lucide React
* **HTTP Client:** Axios (with Bearer interceptors and 60s cold-start timeout)
* **Routing:** React Router DOM (Public portfolio + Protected Admin `/admin/*`)

### 2. Backend
* **Runtime & Framework:** Java 17 + Spring Boot 3.3.4
* **Security:** Spring Security 6 + Stateless JJWT (`0.12.6`) + BCrypt hashing
* **Persistence & ORM:** Spring Data JPA + Hibernate 6 + HikariCP Connection Pool
* **API Documentation:** Springdoc OpenAPI 3.0 / Swagger UI (`/swagger-ui.html`)
* **Validation:** Jakarta Validation (`spring-boot-starter-validation`)

### 3. Database & Storage
* **Cloud Database:** PostgreSQL (Hosted on Supabase with Connection Pooling on port 5432/6543)
* **Local Database Fallback:** Embedded H2 Database in `./data/portfolio_db`
* **Cloud Storage:** Supabase Object Storage REST API (persistent buckets)
* **Local Storage Fallback:** Local filesystem in `./data/uploads/`

### 4. Deployment & Hosting
* **Frontend:** Hosted on [Vercel](https://yadhaladevaportfolio.vercel.app/) with automatic Git CI/CD.
* **Backend:** Hosted on [Render](https://render.com/) Container / Web Service with auto-deploy on push to `main`.

---

## 🔐 Security Architecture

1. **Authentication:**
   * `/api/auth/login` issues an HMAC-SHA256 signed JWT token valid for 24 hours.
   * Protected routes (`/api/admin/**`) require `Authorization: Bearer <token>`.
2. **Public Read Access:**
   * Endpoints like `/api/public/portfolio`, `/api/projects`, `/api/resume/preview`, `/api/certifications/*/certificate` are publicly accessible without authentication.
3. **CORS:**
   * Strictly configured to allow requests only from `FRONTEND_URL` (`http://localhost:5173` and `https://yadhaladevaportfolio.vercel.app`).
4. **Credential Safety:**
   * Passwords and API secrets are never hardcoded and are read securely from environment variables.
