import { useEffect, useMemo, useState } from 'react';
import {
  Footprints,
  Laptop2,
  Search,
  Smartphone,
  Watch,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCT_CATEGORIES, SHOP_CATEGORIES, getCategoryLabel } from '../../constants/shopCategories';

const ROTATION_MS = 3800;
const MAX_BANNERS = 4;

const QUICK_ACTIONS = [
  {
    slug: 'phone',
    icon: Smartphone,
    iconWrap: 'bg-sky-100 text-sky-700',
    card: 'border-sky-100 bg-white',
  },
  {
    slug: 'laptop',
    icon: Laptop2,
    iconWrap: 'bg-indigo-100 text-indigo-700',
    card: 'border-indigo-100 bg-white',
  },
  {
    slug: 'watch',
    icon: Watch,
    iconWrap: 'bg-emerald-100 text-emerald-700',
    card: 'border-emerald-100 bg-white',
  },
  {
    slug: 'shoes',
    icon: Footprints,
    iconWrap: 'bg-rose-100 text-rose-700',
    card: 'border-rose-100 bg-white',
  },
];

function parseSlides(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((slide, index) => {
        if (typeof slide === 'string') {
          return { id: `slide-${index + 1}`, imageUrl: slide };
        }

        const imageUrl = slide?.imageUrl || slide?.url || '';
        if (!imageUrl) return null;

        return {
          id: slide.id || `slide-${index + 1}`,
          imageUrl,
        };
      })
      .filter(Boolean)
      .slice(0, MAX_BANNERS);
  } catch {
    return [];
  }
}

function BannerStage({ slides, currentIndex, heightClass, roundedClass }) {
  if (!slides.length) {
    return (
      <div
        className={[
          'w-full bg-gradient-to-br from-slate-100 via-white to-slate-100',
          heightClass,
          roundedClass,
        ].join(' ')}
      />
    );
  }

  return (
    <div className={['relative isolate overflow-hidden', heightClass, roundedClass].join(' ')}>
      {slides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.imageUrl}
          alt="Nowshin banner"
          className={[
            'absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out',
            index === currentIndex ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

function SlideDots({ slides, currentIndex }) {
  if (slides.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      {slides.map((slide, index) => (
        <span
          key={slide.id}
          className={[
            'h-2 rounded-full transition-all duration-300',
            index === currentIndex ? 'w-7 bg-slate-950' : 'w-2 bg-white/70',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

function DesktopSidebar({ activeCategory, language, onCategoryChange }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-100 px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
          {language === 'en' ? 'Browse' : 'ব্রাউজ'}
        </p>
        <h2 className="mt-1.5 text-lg font-bold text-slate-950">
          {language === 'en' ? 'Categories' : 'ক্যাটাগরি'}
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {language === 'en'
            ? 'Curated sections for trending products.'
            : 'ট্রেন্ডিং পণ্যের জন্য সুন্দরভাবে সাজানো সেকশন।'}
        </p>
      </div>

      <nav className="p-2.5">
        {SHOP_CATEGORIES.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategoryChange(category.slug)}
            className={[
              'mb-1 w-full rounded-[14px] px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98]',
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
}

export default function Hero({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) {
  const [bannerText, setBannerText] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const [desktopSlides, setDesktopSlides] = useState([]);
  const [mobileSlides, setMobileSlides] = useState([]);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  useEffect(() => {
    let mounted = true;

    supabase
      .from('site_settings')
      .select('key,value')
      .in('key', [
        'banner_text',
        'banner_active',
        'banner_slides_desktop',
        'banner_slides_mobile',
        'banner_image_url',
        'banner_image_url_mobile',
      ])
      .then(({ data }) => {
        if (!mounted || !data) return;

        let nextText = '';
        let nextActive = true;
        let fallbackDesktop = '';
        let fallbackMobile = '';
        let parsedDesktop = [];
        let parsedMobile = [];

        data.forEach((setting) => {
          if (setting.key === 'banner_text') nextText = setting.value ?? '';
          if (setting.key === 'banner_active') nextActive = setting.value !== 'false';
          if (setting.key === 'banner_image_url') fallbackDesktop = setting.value ?? '';
          if (setting.key === 'banner_image_url_mobile') fallbackMobile = setting.value ?? '';
          if (setting.key === 'banner_slides_desktop') parsedDesktop = parseSlides(setting.value);
          if (setting.key === 'banner_slides_mobile') parsedMobile = parseSlides(setting.value);
        });

        const finalDesktopSlides =
          parsedDesktop.length > 0
            ? parsedDesktop
            : fallbackDesktop
              ? [{ id: 'desktop-1', imageUrl: fallbackDesktop }]
              : [];

        const finalMobileSlides =
          parsedMobile.length > 0
            ? parsedMobile
            : fallbackMobile
              ? [{ id: 'mobile-1', imageUrl: fallbackMobile }]
              : finalDesktopSlides;

        setBannerText(nextText);
        setBannerActive(nextActive);
        setDesktopSlides(finalDesktopSlides);
        setMobileSlides(finalMobileSlides);
        setDesktopIndex(0);
        setMobileIndex(0);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (desktopSlides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setDesktopIndex((current) => (current + 1) % desktopSlides.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [desktopSlides]);

  useEffect(() => {
    if (mobileSlides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setMobileIndex((current) => (current + 1) % mobileSlides.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [mobileSlides]);

  const activeQuickActions = useMemo(() => {
    return QUICK_ACTIONS.map((item) => ({
      ...item,
      meta: PRODUCT_CATEGORIES.find((category) => category.slug === item.slug),
    })).filter((item) => item.meta);
  }, []);

  const activeDesktopIndex = desktopSlides.length ? desktopIndex % desktopSlides.length : 0;
  const activeMobileIndex = mobileSlides.length ? mobileIndex % mobileSlides.length : 0;

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-slate-100 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-md lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={isEnglish ? 'Search products...' : 'পণ্য খুঁজুন...'}
              className="w-full rounded-[18px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {activeQuickActions.map(({ slug, meta, icon: Icon, iconWrap, card }) => (
              <button
                key={slug}
                onClick={() => onCategoryChange(slug)}
                className={[
                  'rounded-[20px] border p-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 active:scale-[0.98]',
                  card,
                  activeCategory === slug ? 'ring-2 ring-slate-900/10' : '',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={['flex h-10 w-10 items-center justify-center rounded-2xl', iconWrap].join(' ')}>
                    <Icon size={18} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {activeCategory === slug ? (isEnglish ? 'Live' : 'চালু') : 'Go'}
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900">
                  {getCategoryLabel(meta, language)}
                </p>
              </button>
            ))}
          </div>

          <div
            className="mt-3 flex items-center gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {SHOP_CATEGORIES.map((category) => (
              <button
                key={category.slug}
                onClick={() => onCategoryChange(category.slug)}
                className={[
                  'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                  activeCategory === category.slug
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600',
                ].join(' ')}
              >
                {getCategoryLabel(category, language)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {bannerActive ? (
        <section className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.06),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.08),_transparent_40%),#f8fafc]">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-7">
            <div className="grid gap-5 lg:grid-cols-[240px,minmax(0,1fr)] xl:grid-cols-[260px,minmax(0,1fr)]">
              <div className="hidden lg:block">
                <DesktopSidebar
                  activeCategory={activeCategory}
                  language={language}
                  onCategoryChange={onCategoryChange}
                />
              </div>

              <div className="relative">
                <div className="block lg:hidden">
                  <BannerStage
                    slides={mobileSlides}
                    currentIndex={activeMobileIndex}
                    heightClass="h-[230px]"
                    roundedClass="rounded-[28px]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-end justify-between gap-4">
                      <div className="rounded-[20px] bg-white/92 px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.12)] backdrop-blur-md">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                          {isEnglish ? 'Featured' : 'ফিচার্ড'}
                        </p>
                        <h1 className="mt-1 text-base font-bold leading-tight text-slate-950">
                          {bannerText || (isEnglish ? 'Smart picks for you' : 'আপনার জন্য স্মার্ট পিক')}
                        </h1>
                      </div>
                      <div className="rounded-full bg-white/85 px-3 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md">
                        <SlideDots slides={mobileSlides} currentIndex={activeMobileIndex} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/50 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
                    <BannerStage
                      slides={desktopSlides}
                      currentIndex={activeDesktopIndex}
                      heightClass="h-[340px] xl:h-[380px]"
                      roundedClass=""
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 xl:p-7">
                    <div className="flex items-end justify-between gap-5">
                      <div className="max-w-sm rounded-[24px] bg-white/92 px-5 py-4 shadow-[0_16px_38px_rgba(15,23,42,0.12)] backdrop-blur-md">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                          {isEnglish ? 'Now showing' : 'এখন দেখুন'}
                        </p>
                        <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950 xl:text-[2rem]">
                          {bannerText || (isEnglish ? 'Trending store highlights' : 'ট্রেন্ডিং স্টোর হাইলাইটস')}
                        </h1>
                      </div>

                      <div className="rounded-full bg-white/88 px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.12)] backdrop-blur-md">
                        <SlideDots slides={desktopSlides} currentIndex={activeDesktopIndex} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="hidden border-b border-slate-100 bg-white lg:block">
          <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
            <div className="w-[240px] xl:w-[260px]">
              <DesktopSidebar
                activeCategory={activeCategory}
                language={language}
                onCategoryChange={onCategoryChange}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
