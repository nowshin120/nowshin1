export function getProductName(product, language = 'en') {
  if (!product) return '';

  const banglaName = product.name_bn?.trim();
  const englishName = product.name_en?.trim();
  const legacyName = product.name?.trim();

  if (language === 'bn') {
    return banglaName || legacyName || englishName || '';
  }

  return englishName || legacyName || banglaName || '';
}

export function getProductAdminLabel(product) {
  if (!product) return '';

  const banglaName = product.name_bn?.trim();
  const englishName = product.name_en?.trim();
  const legacyName = product.name?.trim();

  if (banglaName && englishName) {
    return `${banglaName} / ${englishName}`;
  }

  return banglaName || englishName || legacyName || '';
}

export function getProductSearchText(product) {
  return [
    product?.name,
    product?.name_bn,
    product?.name_en,
    product?.description,
    product?.description_bn,
    product?.description_en,
    product?.category_slug,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function getOrderProductName(product) {
  return product?.name_bn?.trim() || product?.name_en?.trim() || product?.name?.trim() || '';
}
