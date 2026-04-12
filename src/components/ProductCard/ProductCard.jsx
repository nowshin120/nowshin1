import { useLanguage } from '../../context/LanguageContext';
import { ShoppingCart, Package } from 'lucide-react';

export default function ProductCard({ product, onBuyNow }) {
  const { t } = useLanguage();

  // Supabase column is image_url; legacy static data used image
  const imageUrl = product.image_url || product.image || null;
  // Supabase column is delivery_charge; legacy used deliveryCharge
  const deliveryCharge = product.delivery_charge ?? product.deliveryCharge ?? null;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {/* Fallback when no image or image fails */}
        <div
          className="w-full h-full items-center justify-center flex-col gap-2 text-gray-300"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <Package size={48} />
          <span className="text-sm text-gray-400">কোনো ছবি নেই</span>
        </div>
        {/* Cash on Delivery Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
          {t('checkout.cod')}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ৳{Number(product.price).toLocaleString()}
          </span>
        </div>

        {/* Delivery Info */}
        <div className="text-sm text-gray-500 mb-4">
          {deliveryCharge === 0 || deliveryCharge === '0' ? (
            <span className="text-green-600 font-medium">বিনামূল্যে ডেলিভারি</span>
          ) : deliveryCharge ? (
            <span>ডেলিভারি: ৳{Number(deliveryCharge).toLocaleString()}</span>
          ) : null}
        </div>

        {/* Buy Now Button */}
        <button
          onClick={() => onBuyNow(product)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <ShoppingCart size={18} />
          {t('checkout.buyNow')}
        </button>
      </div>
    </div>
  );
}
