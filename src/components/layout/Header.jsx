/// src/components/layout/Header.jsx ///
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { NAV_CATEGORIES, getCategoryLabel } from '../../constants/shopCategories';

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setCategoryMenuOpen(false);
  };

  const categoryMenuLabel = language === 'en' ? 'Categories' : 'ক্যাটাগরি';
  const languageToggleLabel = language === 'en' ? 'বাংলা' : 'EN';

  const navLinkClass = (isActive) =>
    [
      'text-sm font-medium transition-colors duration-200',
      isActive ? 'text-slate-950' : 'text-slate-500 hover:text-slate-950',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/98 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-1.5" onClick={closeMenu}>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-950">
            Nowshin
          </span>
          <span className="text-xl font-bold tracking-tight text-blue-600">
            Fashion
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className={navLinkClass(location.pathname === '/')}>
            {t('header.home')}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCategoryMenuOpen(true)}
            onMouseLeave={() => setCategoryMenuOpen(false)}
          >
            <button
              type="button"
              className={[
                'flex items-center gap-1 text-sm font-medium transition-colors duration-200',
                location.pathname.startsWith('/products/')
                  ? 'text-slate-950'
                  : 'text-slate-500 hover:text-slate-950',
              ].join(' ')}
            >
              {categoryMenuLabel}
              <ChevronDown
                size={15}
                className={['transition-transform duration-200', categoryMenuOpen ? 'rotate-180' : ''].join(' ')}
              />
            </button>

            {categoryMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-[0_16px_48px_rgba(15,23,42,0.14)]">
                {NAV_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/products/${category.slug}`}
                    onClick={() => setCategoryMenuOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                  >
                    {getCategoryLabel(category, language)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className={navLinkClass(location.pathname === '/about')}>
            {t('header.about')}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleLanguage}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:border-slate-300 hover:text-slate-900"
          >
            {languageToggleLabel}
          </button>
          <Link
            to="/login"
            className="px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            {t('auth.login')}
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
          >
            {t('auth.register')}
          </Link>
        </div>

        {/* Mobile: Lang + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500"
          >
            {languageToggleLabel}
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-16 z-40 border-t border-slate-100 bg-white shadow-2xl lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              {t('header.home')}
            </Link>

            <div className="mt-2">
              <p className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                {categoryMenuLabel}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {NAV_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/products/${category.slug}`}
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    {getCategoryLabel(category, language)}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              onClick={closeMenu}
              className="mt-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('header.about')}
            </Link>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-2xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('auth.login')}
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-2xl bg-slate-950 py-3 text-center text-sm font-semibold text-white hover:bg-blue-600"
              >
                {t('auth.register')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
