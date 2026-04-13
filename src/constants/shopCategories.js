const ALL_PRODUCTS_CATEGORY = {
  slug: 'all',
  labelBn: 'সব পণ্য',
  labelEn: 'All Products',
  badgeClass: 'bg-slate-100 text-slate-700',
};

export const FEATURED_HOME_CATEGORIES = [
  {
    slug: 'sari',
    labelBn: 'শাড়ি',
    labelEn: 'Sari',
    badgeClass: 'bg-pink-100 text-pink-700',
  },
  {
    slug: 'three-piece',
    labelBn: 'থ্রিপিস',
    labelEn: 'Three Piece',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  {
    slug: 'perfume',
    labelBn: 'পারফিউম',
    labelEn: 'Perfume',
    badgeClass: 'bg-violet-100 text-violet-700',
  },
  {
    slug: 'women-bag',
    labelBn: 'মেয়েদের ব্যাগ',
    labelEn: 'Women Bags',
    badgeClass: 'bg-rose-100 text-rose-700',
  },
];

export const LEGACY_CATEGORIES = [
  {
    slug: 'panjabi',
    labelBn: 'পাঞ্জাবি',
    labelEn: 'Panjabi',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  {
    slug: 'shoes',
    labelBn: 'জুতা / কেডস',
    labelEn: 'Shoes & Keds',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  {
    slug: 'kids',
    labelBn: 'কিডস',
    labelEn: 'Kids',
    badgeClass: 'bg-yellow-100 text-yellow-700',
  },
  {
    slug: 'kids-fashion',
    labelBn: 'কিডস পোশাক',
    labelEn: 'Kids Fashion',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
];

export const PRODUCT_CATEGORIES = [
  ...FEATURED_HOME_CATEGORIES,
  ...LEGACY_CATEGORIES,
];

export const SHOP_CATEGORIES = [ALL_PRODUCTS_CATEGORY, ...PRODUCT_CATEGORIES];

export const NAV_CATEGORIES = PRODUCT_CATEGORIES;

export const ALL_CATEGORIES = SHOP_CATEGORIES;

export function getCategoryLabel(category, language = 'bn') {
  if (!category) return '';
  return language === 'en' ? category.labelEn : category.labelBn;
}

export function findCategoryBySlug(slug) {
  return ALL_CATEGORIES.find((category) => category.slug === slug) || null;
}
