import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

function formatPrice(value) {
  return `৳${Number(value).toLocaleString()}`;
}

export default function CartDrawer() {
  const { language } = useLanguage();
  const {
    cartItems,
    cartSummary,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    checkoutCart,
  } = useCart();

  if (!isCartOpen) return null;

  const isEnglish = language === 'en';

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-[0_20px_70px_rgba(15,23,42,0.22)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-950">
                {isEnglish ? 'Your Cart' : 'আপনার কার্ট'}
              </p>
              <p className="text-sm text-slate-500">
                {isEnglish
                  ? `${cartSummary.totalItems} item${cartSummary.totalItems === 1 ? '' : 's'} selected`
                  : `${cartSummary.totalItems}টি পণ্য যোগ করা হয়েছে`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ShoppingBag size={28} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">
              {isEnglish ? 'Cart is empty' : 'কার্ট এখন খালি'}
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              {isEnglish
                ? 'Add a few products and they will appear here for one-step checkout.'
                : 'কিছু পণ্য কার্টে যোগ করুন, তারপর একসাথে অর্ডার দিতে পারবেন।'}
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              {isEnglish ? 'Continue shopping' : 'কেনাকাটা চালিয়ে যান'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ShoppingBag size={22} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="line-clamp-2 text-sm font-bold leading-6 text-slate-950">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            {isEnglish ? 'Unit price' : 'একক দাম'}: {formatPrice(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white hover:text-slate-950"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-10 text-center text-sm font-bold text-slate-950">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white hover:text-slate-950"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            {isEnglish ? 'Line total' : 'মোট'}
                          </p>
                          <p className="text-sm font-extrabold text-blue-600">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4">
              <div className="space-y-2 rounded-[24px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{isEnglish ? 'Subtotal' : 'সাবটোটাল'}</span>
                  <span className="font-semibold text-slate-800">
                    {formatPrice(cartSummary.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{isEnglish ? 'Delivery' : 'ডেলিভারি'}</span>
                  <span className="font-semibold text-slate-800">
                    {formatPrice(cartSummary.deliveryTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                  <span className="font-bold text-slate-950">
                    {isEnglish ? 'Grand total' : 'সর্বমোট'}
                  </span>
                  <span className="text-lg font-extrabold text-slate-950">
                    {formatPrice(cartSummary.grandTotal)}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeCart}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {isEnglish ? 'Keep shopping' : 'আরও দেখুন'}
                </button>
                <button
                  type="button"
                  onClick={checkoutCart}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  {isEnglish ? 'Checkout now' : 'এখনই অর্ডার'}
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
