export const SHOP_CATEGORIES = [
  {
    slug: 'all',
    labelBn: 'সব পণ্য',
    labelEn: 'All Products',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  {
    slug: 'phone',
    labelBn: 'ফোন',
    labelEn: 'Phones',
    badgeClass: 'bg-sky-100 text-sky-700',
  },
  {
    slug: 'laptop',
    labelBn: 'ল্যাপটপ',
    labelEn: 'Laptops',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  {
    slug: 'watch',
    labelBn: 'ঘড়ি',
    labelEn: 'Watches',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    slug: 'shoes',
    labelBn: 'জুতা / কেডস',
    labelEn: 'Shoes & Keds',
    badgeClass: 'bg-rose-100 text-rose-700',
  },
  {
    slug: 'kids-fashion',
    labelBn: 'কিডস পোশাক',
    labelEn: 'Kids Fashion',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
];

export const LEGACY_CATEGORIES = [
  {
    slug: 'sari',
    labelBn: 'শাড়ি',
    labelEn: 'Sari',
    badgeClass: 'bg-pink-100 text-pink-700',
  },
  {
    slug: 'panjabi',
    labelBn: 'পাঞ্জাবি',
    labelEn: 'Panjabi',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  {
    slug: 'three-piece',
    labelBn: 'থ্রিপিস',
    labelEn: 'Three Piece',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  {
    slug: 'kids',
    labelBn: 'কিডস',
    labelEn: 'Kids',
    badgeClass: 'bg-yellow-100 text-yellow-700',
  },
];

export const PRODUCT_CATEGORIES = SHOP_CATEGORIES.filter(
  (category) => category.slug !== 'all'
);

export const NAV_CATEGORIES = PRODUCT_CATEGORIES;

export const ALL_CATEGORIES = [...SHOP_CATEGORIES, ...LEGACY_CATEGORIES];

export function getCategoryLabel(category, language = 'bn') {
  if (!category) return '';
  return language === 'en' ? category.labelEn : category.labelBn;
}

export function findCategoryBySlug(slug) {
  return ALL_CATEGORIES.find((category) => category.slug === slug) || null;
}
