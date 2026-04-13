import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/Hero/Hero';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProductListing from './pages/ProductListing';

function PublicHome() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-soft-white">
      <Header />
      <Hero
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <HomePage
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <Footer />
    </div>
  );
}

function PublicShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-soft-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/products/:category"
              element={
                <PublicShell>
                  <ProductListing />
                </PublicShell>
              }
            />

            <Route
              path="/about"
              element={
                <PublicShell>
                  <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800">
                      আমাদের সম্পর্কে
                    </h1>
                    <p className="text-lg text-gray-500">
                      Nowshin Fashion House বাংলাদেশের সেরা ঐতিহ্যবাহী ও আধুনিক
                      ফ্যাশনের সংগ্রহ।
                    </p>
                  </div>
                </PublicShell>
              }
            />

            <Route path="/" element={<PublicHome />} />
            <Route path="*" element={<PublicHome />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
