import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Consultations from './pages/admin/Consultations';
import Subscribers from './pages/admin/Subscribers';
import ChatSessions from './pages/admin/ChatSessions';
import Documents from './pages/admin/Documents';
import Settings from './pages/admin/Settings';
import SEOManagement from './pages/admin/SEOManagement';
import EmailTemplates from './pages/admin/EmailTemplates';
import ProjectDocs from './pages/admin/ProjectDocs';

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
                <ChatWidget />
              </>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/consultations" element={<Consultations />} />
          <Route path="/admin/subscribers" element={<Subscribers />} />
          <Route path="/admin/chats" element={<ChatSessions />} />
          <Route path="/admin/documents" element={<Documents />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/seo" element={<SEOManagement />} />
          <Route path="/admin/email-templates" element={<EmailTemplates />} />
          <Route path="/admin/project-docs" element={<ProjectDocs />} />
        </Routes>
      </BrowserRouter>
    </div>
    </HelmetProvider>
  );
}

export default App;
