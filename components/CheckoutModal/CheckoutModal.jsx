import { useLanguage } from '../../context/LanguageContext';
import { X, User, Phone, MapPin, CreditCard } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, productName, productPrice }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order placed! Cash on Delivery. Backend connection coming soon.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              {t('checkout.title')}
            </h2>
            {productName && (
              <div className="bg-soft-gray rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">{productName}</span>
                <span className="font-bold text-blue-600">{productPrice}</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                {t('checkout.name')}
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('auth.fullName')}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                {t('checkout.phone')}
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder={t('auth.phoneNumber')}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Full Address Field */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                {t('checkout.address')}
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  placeholder={t('auth.fullAddress')}
                  rows="2"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Cash on Delivery Option */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 text-white p-2 rounded-lg">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-semibold text-green-800">{t('checkout.paymentMethod')}</p>
                  <p className="text-sm text-green-600">{t('checkout.cod')}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('checkout.confirmOrder')}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-gray-300 text-charcoal py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm"
            >
              {t('checkout.cancel')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
