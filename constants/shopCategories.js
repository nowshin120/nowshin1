export const SHOP_CATEGORIES = [
  { slug: 'all', labelBn: 'সব পণ্য', labelEn: 'All Products' },
  { slug: 'sari', labelBn: 'শাড়ি', labelEn: 'Sari' },
  { slug: 'panjabi', labelBn: 'পাঞ্জাবি', labelEn: 'Panjabi' },
  { slug: 'three-piece', labelBn: 'থ্রিপিস', labelEn: 'Three Piece' },
  { slug: 'kids', labelBn: 'কিডস', labelEn: 'Kids' },
];

export const NAV_CATEGORIES = SHOP_CATEGORIES.filter(
  (category) => category.slug !== 'all'
);

export function getCategoryLabel(category, language = 'bn') {
  if (!category) return '';
  return language === 'en' ? category.labelEn : category.labelBn;
}
