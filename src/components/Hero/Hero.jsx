import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { SHOP_CATEGORIES, getCategoryLabel } from '../../constants/shopCategories';

export default function Hero({ activeCategory, onCategoryChange }) {
  const [bannerText, setBannerText] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerMobileImage, setBannerMobileImage] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key,value')
      .in('key', ['banner_text', 'banner_image_url', 'banner_image_url_mobile', 'banner_active'])
      .then(({ data }) => {
        if (!data) return;

        data.forEach((setting) => {
          if (setting.key === 'banner_text') setBannerText(setting.value ?? '');
          if (setting.key === 'banner_image_url') setBannerImage(setting.value ?? '');
          if (setting.key === 'banner_image_url_mobile') setBannerMobileImage(setting.value ?? '');
          if (setting.key === 'banner_active') setBannerActive(setting.value !== 'false');
        });
      });
  }, []);

  const mobileImg = bannerMobileImage || bannerImage;
  const pcImg = bannerImage;

  const PcCategorySidebar = () => (
    <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.07)]">
      <div className="border-b border-slate-100 px-4 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
          {isEnglish ? 'Browse' : 'ব্রাউজ'}
        </p>
        <h2 className="mt-1 text-base font-bold text-slate-950">
          {isEnglish ? 'Categories' : 'ক্যাটাগরি'}
        </h2>
      </div>

      <nav className="p-2">
        {SHOP_CATEGORIES.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategoryChange(category.slug)}
            className={[
              'mb-1 w-full rounded-[12px] px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98]',
              activeCategory === category.slug
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
            ].join(' ')}
          >
            {getCategoryLabel(category, language)}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-slate-100 bg-white/98 backdrop-blur-md lg:hidden">
        <div
          className="flex items-center gap-2 overflow-x-auto px-4 py-2.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SHOP_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              className={[
                'whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95',
                activeCategory === category.slug
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              {getCategoryLabel(category, language)}
            </button>
          ))}
        </div>
      </div>

      {bannerActive && (
        <section className="block lg:hidden">
          {mobileImg ? (
            <div className="relative overflow-hidden">
              <img
                src={mobileImg}
                alt="Nowshin Fashion"
                className="h-[200px] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-transparent" />

              {bannerText && (
                <div className="absolute bottom-3 left-3 right-14">
                  <div className="rounded-[14px] border border-white/60 bg-white/82 px-3 py-2 shadow-md backdrop-blur-md">
                    <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">
                      {isEnglish ? 'Featured' : 'ফিচার্ড'}
                    </p>
                    <h1 className="mt-0.5 text-sm font-bold leading-tight text-slate-950">
                      {bannerText}
                    </h1>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[160px] bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100" />
          )}
        </section>
      )}

      {bannerActive && (
        <section className="hidden border-b border-slate-100 bg-white lg:block">
          <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
            <div className="grid grid-cols-[220px,minmax(0,1fr)] items-start gap-5 xl:grid-cols-[240px,minmax(0,1fr)]">
              <PcCategorySidebar />

              <div className="relative overflow-hidden rounded-[22px] shadow-[0_12px_48px_rgba(15,23,42,0.12)]">
                {pcImg ? (
                  <img
                    src={pcImg}
                    alt="Nowshin Fashion banner"
                    className="h-[280px] w-full object-cover object-center xl:h-[320px]"
                  />
                ) : (
                  <div className="h-[280px] w-full bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 xl:h-[320px]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />

                {bannerText && (
                  <div className="absolute bottom-5 left-5">
                    <div className="max-w-xs rounded-[18px] border border-white/60 bg-white/82 px-4 py-3 shadow-lg backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                        {isEnglish ? 'Featured' : 'ফিচার্ড'}
                      </p>
                      <h1 className="mt-1 text-xl font-bold leading-tight text-slate-950 xl:text-2xl">
                        {bannerText}
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {!bannerActive && (
        <section className="hidden border-b border-slate-100 bg-white lg:block">
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <div className="w-[220px] xl:w-[240px]">
              <PcCategorySidebar />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
