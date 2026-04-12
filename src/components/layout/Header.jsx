import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
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
  const mobileLanguageLabel = language === 'en' ? 'বাংলা' : 'English';

  const navLinkClass = (isActive) =>
    [
      'text-sm font-medium transition-colors',
      isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex flex-shrink-0 items-center" onClick={closeMenu}>
          <span className="text-[2rem] font-bold tracking-tight text-slate-950">
            Nowshin
          </span>
          <span className="ml-1 text-[2rem] font-bold tracking-tight text-blue-600">
            Fashion
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
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
              onClick={() => setCategoryMenuOpen((open) => !open)}
              className={[
                'flex items-center gap-1 text-sm font-medium transition-colors',
                location.pathname.startsWith('/products/')
                  ? 'text-slate-950'
                  : 'text-slate-600 hover:text-slate-950',
              ].join(' ')}
            >
              {categoryMenuLabel}
              <ChevronDown
                size={16}
                className={[
                  'transition-transform',
                  categoryMenuOpen ? 'rotate-180' : '',
                ].join(' ')}
              />
            </button>

            {categoryMenuOpen && (
              <div className="absolute left-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                {NAV_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/products/${category.slug}`}
                    onClick={() => setCategoryMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
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

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={toggleLanguage}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {languageToggleLabel}
          </button>
          <Link
            to="/login"
            className="px-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            {t('auth.login')}
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            {t('auth.register')}
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-2xl border border-slate-200 p-2.5 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-20 border-t border-slate-200 bg-white shadow-2xl lg:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              {t('header.home')}
            </Link>

            <div className="pt-1">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                {categoryMenuLabel}
              </p>
              {NAV_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  to={`/products/${category.slug}`}
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {getCategoryLabel(category, language)}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              onClick={closeMenu}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('header.about')}
            </Link>

            <div className="mt-2 space-y-2.5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between px-4">
                <span className="text-xs text-slate-500">
                  {language === 'en' ? 'Language' : 'ভাষা'}
                </span>
                <button
                  onClick={toggleLanguage}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {mobileLanguageLabel}
                </button>
              </div>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block w-full rounded-2xl bg-slate-950 py-3 text-center text-sm font-semibold text-white"
              >
                {t('auth.register')}
              </Link>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full rounded-2xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700"
              >
                {t('auth.login')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
