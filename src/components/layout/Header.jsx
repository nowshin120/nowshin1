import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Globe2, Menu, X } from 'lucide-react';
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

  const desktopNavClass = (isActive) =>
    [
      'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
      isActive
        ? 'bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.10)]'
        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-950',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/98 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link to="/" className="flex flex-shrink-0 items-center gap-2.5 sm:gap-3" onClick={closeMenu}>
          <img
            src="/nowshin-logo-mark.svg"
            alt="Nowshin Fashion House logo"
            className="h-10 w-10 shrink-0 rounded-2xl sm:h-11 sm:w-11"
          />
          <div className="min-w-0">
            <p className="truncate text-[1.05rem] font-black leading-none tracking-tight text-slate-950 sm:text-[1.45rem]">
              Nowshin
            </p>
            <p className="truncate pt-1 text-[0.56rem] font-bold uppercase tracking-[0.28em] text-blue-600 sm:text-[0.68rem]">
              Fashion House
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <Link to="/" className={desktopNavClass(location.pathname === '/')}>
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
                'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                location.pathname.startsWith('/products/') || categoryMenuOpen
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-950',
              ].join(' ')}
            >
              {categoryMenuLabel}
              <ChevronDown
                size={15}
                className={[
                  'transition-transform duration-200',
                  categoryMenuOpen ? 'rotate-180' : '',
                ].join(' ')}
              />
            </button>

            {categoryMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-60 overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
                <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  {language === 'en' ? 'Collections' : 'কালেকশন'}
                </p>
                {NAV_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/products/${category.slug}`}
                    onClick={() => setCategoryMenuOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                  >
                    {getCategoryLabel(category, language)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className={desktopNavClass(location.pathname === '/about')}>
            {t('header.about')}
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:border-blue-200 hover:bg-blue-100"
          >
            <Globe2 size={15} />
            {languageToggleLabel}
          </button>
          <Link
            to="/login"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            {t('auth.login')}
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.14)] transition-all hover:translate-y-[-1px] hover:from-slate-900 hover:to-blue-600"
          >
            {t('auth.register')}
          </Link>
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-16 z-40 border-t border-slate-100 bg-white shadow-2xl lg:hidden sm:top-[72px]">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid grid-cols-2 gap-2 rounded-[28px] bg-slate-50 p-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-2xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700"
              >
                {t('auth.login')}
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 py-3 text-center text-sm font-semibold text-white"
              >
                {t('auth.register')}
              </Link>
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
            >
              <Globe2 size={16} />
              {language === 'en' ? 'বাংলা ভাষা' : 'English Language'}
            </button>

            <div className="mt-4 space-y-1 rounded-[28px] border border-slate-100 bg-white p-2">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                {t('header.home')}
              </Link>

              <div className="mt-1">
                <p className="px-4 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  {categoryMenuLabel}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {NAV_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/products/${category.slug}`}
                      onClick={closeMenu}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
