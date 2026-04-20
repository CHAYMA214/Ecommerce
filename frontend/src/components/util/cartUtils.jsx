// utils/cartUtils.js
export const getVariantKey = (product, size, color) => {
  const id = product.productId || product.id;
  return `${id}_${size || ''}_${color || ''}`;
};