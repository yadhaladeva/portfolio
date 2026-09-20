import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminHeroPage } from './pages/AdminHeroPage';
import { AdminHeaderPage } from './pages/AdminHeaderPage';
import { AdminAboutPage } from './pages/AdminAboutPage';
import { AdminProjectsPage } from './pages/AdminProjectsPage';
import { AdminSkillsPage } from './pages/AdminSkillsPage';
import { AdminExperiencePage } from './pages/AdminExperiencePage';
import { AdminCertificationsPage } from './pages/AdminCertificationsPage';
import { AdminResumePage } from './pages/AdminResumePage';
import { AdminContactPage } from './pages/AdminContactPage';
import { AdminMessagesPage } from './pages/AdminMessagesPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={<HomePage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Management Portal */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="hero" element={<AdminHeroPage />} />
              <Route path="header" element={<AdminHeaderPage />} />
              <Route path="about" element={<AdminAboutPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="skills" element={<AdminSkillsPage />} />
              <Route path="experience" element={<AdminExperiencePage />} />
              <Route path="certifications" element={<AdminCertificationsPage />} />
              <Route path="resume" element={<AdminResumePage />} />
              <Route path="contact" element={<AdminContactPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
