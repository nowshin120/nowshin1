import { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  Receipt,
  User,
  X,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { summarizeCartItems } from '../../context/CartContext';

function formatPrice(value) {
  return `৳${Number(value).toLocaleString()}`;
}

function getOrderErrorMessage(error, isEnglish) {
  const rawMessage = error?.message || '';
  const normalizedMessage = rawMessage.toLowerCase();

  if (
    normalizedMessage.includes('relation') ||
    normalizedMessage.includes('orders') ||
    normalizedMessage.includes('order_items')
  ) {
    return isEnglish
      ? 'Orders tables are missing in Supabase. Run the SQL setup first, then try again.'
      : 'Supabase-এ orders বা order_items table পাওয়া যায়নি। আগে SQL setup চালান, তারপর আবার চেষ্টা করুন।';
  }

  return isEnglish
    ? rawMessage || 'Order could not be submitted right now.'
    : rawMessage || 'এই মুহূর্তে অর্ডার পাঠানো যাচ্ছে না।';
}

export default function CheckoutModal({
  isOpen,
  items = [],
  mode = 'cart',
  onClose,
  onOrderSuccess,
}) {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const orderSummary = useMemo(() => summarizeCartItems(items), [items]);

  if (!isOpen) return null;

  const handleInputChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      notes: '',
    });
    setStatus({ type: '', message: '' });
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!items.length) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const orderPayload = {
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: formData.address.trim(),
        payment_method: 'cod',
        status: 'pending',
        subtotal: orderSummary.subtotal,
        delivery_total: orderSummary.deliveryTotal,
        grand_total: orderSummary.grandTotal,
        total_items: orderSummary.totalItems,
        notes: formData.notes.trim() || null,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsPayload = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image_url: item.image_url || null,
        category_slug: item.category_slug || null,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) {
        await supabase.from('orders').delete().eq('id', order.id);
        throw itemsError;
      }

      setStatus({
        type: 'success',
        message: isEnglish
          ? 'Order placed successfully. We will contact you soon.'
          : 'অর্ডার সফলভাবে নেওয়া হয়েছে। খুব শিগগিরই যোগাযোগ করা হবে।',
      });

      window.setTimeout(() => {
        resetForm();
        onOrderSuccess?.(order);
      }, 1200);
    } catch (error) {
      setStatus({
        type: 'error',
        message: getOrderErrorMessage(error, isEnglish),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto">
      <button
        type="button"
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/55 backdrop-blur-[2px]"
        aria-label="Close checkout"
      />

      <div className="relative flex min-h-screen items-center justify-center p-3 sm:p-5">
        <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                {isEnglish ? 'Complete your order' : 'অর্ডার সম্পন্ন করুন'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {mode === 'buy-now'
                  ? isEnglish
                    ? 'Quick checkout for this product.'
                    : 'এই পণ্যের জন্য দ্রুত checkout.'
                  : isEnglish
                    ? 'All selected products will be ordered together.'
                    : 'নির্বাচিত সব পণ্য একসাথে অর্ডার হবে।'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr),360px]">
            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
              {status.message ? (
                <div
                  className={[
                    'flex items-start gap-3 rounded-2xl px-4 py-3 text-sm',
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700',
                  ].join(' ')}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  )}
                  <p className="leading-6">{status.message}</p>
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  {isEnglish ? 'Full name' : 'পূর্ণ নাম'}
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder={isEnglish ? 'Enter your full name' : 'আপনার পূর্ণ নাম লিখুন'}
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  {isEnglish ? 'Phone number' : 'ফোন নম্বর'}
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    placeholder={isEnglish ? '01XXXXXXXXX' : '০১XXXXXXXXX'}
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  {isEnglish ? 'Delivery address' : 'ডেলিভারি ঠিকানা'}
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    placeholder={
                      isEnglish
                        ? 'House, road, area, district'
                        : 'বাসা, রোড, এলাকা, জেলা লিখুন'
                    }
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  {isEnglish ? 'Order note (optional)' : 'অর্ডার নোট (ঐচ্ছিক)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
                  placeholder={
                    isEnglish
                      ? 'Color, size, delivery notes, or special requests'
                      : 'রঙ, সাইজ, ডেলিভারি নির্দেশনা বা বিশেষ কিছু লিখুন'
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                />
              </div>

              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">
                      {isEnglish ? 'Payment method' : 'পেমেন্ট পদ্ধতি'}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {isEnglish ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {isEnglish ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  disabled={loading || !items.length}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? isEnglish
                      ? 'Submitting...'
                      : 'পাঠানো হচ্ছে...'
                    : isEnglish
                      ? 'Confirm order'
                      : 'অর্ডার নিশ্চিত করুন'}
                </button>
              </div>
            </form>

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 lg:border-l lg:border-t-0 lg:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Receipt size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-950">
                    {isEnglish ? 'Order summary' : 'অর্ডার সারাংশ'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {isEnglish
                      ? `${orderSummary.totalItems} item${orderSummary.totalItems === 1 ? '' : 's'} in this order`
                      : `${orderSummary.totalItems}টি পণ্য এই অর্ডারে আছে`}
                  </p>
                </div>
              </div>

              <div className="mt-5 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-white bg-white p-3">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-bold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {isEnglish ? 'Qty' : 'পরিমাণ'}: {item.quantity}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-blue-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] bg-white p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{isEnglish ? 'Subtotal' : 'সাবটোটাল'}</span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(orderSummary.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{isEnglish ? 'Delivery' : 'ডেলিভারি'}</span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(orderSummary.deliveryTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="font-bold text-slate-950">
                      {isEnglish ? 'Grand total' : 'সর্বমোট'}
                    </span>
                    <span className="text-lg font-extrabold text-slate-950">
                      {formatPrice(orderSummary.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
