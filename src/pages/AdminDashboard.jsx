import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  Monitor,
  Package,
  PackagePlus,
  Pencil,
  Search,
  Settings,
  ShoppingBag,
  Smartphone,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  PRODUCT_CATEGORIES,
  findCategoryBySlug,
  getCategoryLabel,
} from '../constants/shopCategories';

const EMPTY_FORM = {
  name: '',
  price: '',
  category_slug: PRODUCT_CATEGORIES[0]?.slug || 'phone',
  delivery_charge: '100',
  description: '',
  image_url: '',
};

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
  import.meta.env.VITE_CLOUDINARY_CLOUDNAME ||
  '';

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
  import.meta.env.VITE_CLOUDINARY_PRESET ||
  '';

const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || '';
const MAX_BANNER_SLOTS = 4;

function createEmptyBannerSlots() {
  return Array.from({ length: MAX_BANNER_SLOTS }, (_, index) => ({
    id: `slot-${index + 1}`,
    imageUrl: '',
    preview: '',
    file: null,
  }));
}

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
      .slice(0, MAX_BANNER_SLOTS);
  } catch {
    return [];
  }
}

function normalizeBannerSlots(slides = []) {
  const slots = createEmptyBannerSlots();

  slides.slice(0, MAX_BANNER_SLOTS).forEach((slide, index) => {
    const imageUrl = slide?.imageUrl || slide?.url || '';
    slots[index] = {
      ...slots[index],
      imageUrl,
      preview: imageUrl,
    };
  });

  return slots;
}

function buildBannerPayload(slots, prefix) {
  return slots
    .filter((slot) => slot.imageUrl)
    .map((slot, index) => ({
      id: `${prefix}-${index + 1}`,
      imageUrl: slot.imageUrl,
    }));
}

function Toast({ type, message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={[
        'fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-xl',
        isSuccess ? 'bg-emerald-600' : 'bg-red-600',
      ].join(' ')}
    >
      {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <p className="flex-1 leading-6">{message}</p>
      <button type="button" onClick={onClose} className="rounded-md p-0.5 hover:bg-white/10">
        <X size={14} />
      </button>
    </div>
  );
}

function SupportMessagesModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase
      .from('support_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (!mounted) return;
        setMessages(data ?? []);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-emerald-600" />
            <h3 className="text-base font-bold text-gray-900">সাপোর্ট মেসেজ</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-400">লোড হচ্ছে...</p>
          ) : messages.length === 0 ? (
            <div className="py-14 text-center">
              <MessageCircle size={34} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">কোনো মেসেজ নেই</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{message.name || 'অজানা'}</p>
                    {message.phone ? (
                      <p className="text-xs text-blue-600">{message.phone}</p>
                    ) : null}
                  </div>
                  <span className="text-xs text-gray-400">
                    {message.created_at
                      ? new Date(message.created_at).toLocaleDateString('bn-BD')
                      : ''}
                  </span>
                </div>
                <p className="text-sm leading-6 text-gray-600">{message.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Trash2 size={20} className="text-red-600" />
        </div>
        <h3 className="text-center text-lg font-bold text-gray-900">ডিলিট নিশ্চিত করুন</h3>
        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
          এই প্রোডাক্টটি স্থায়ীভাবে মুছে যাবে।
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            হ্যাঁ, মুছুন
          </button>
        </div>
      </div>
    </div>
  );
}

function BannerSlotCard({ title, hint, accent, slot, onFileChange, onClear }) {
  const accentStyles =
    accent === 'amber'
      ? {
          wrapper: 'border-amber-100 bg-amber-50/70',
          icon: 'bg-amber-100 text-amber-700',
          hover: 'hover:border-amber-400 hover:text-amber-600',
        }
      : {
          wrapper: 'border-blue-100 bg-blue-50/70',
          icon: 'bg-blue-100 text-blue-700',
          hover: 'hover:border-blue-400 hover:text-blue-600',
        };

  return (
    <div className={`rounded-2xl border p-4 ${accentStyles.wrapper}`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${accentStyles.icon}`}>
          {accent === 'amber' ? <Smartphone size={17} /> : <Monitor size={17} />}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-[11px] text-gray-500">{hint}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <label
          className={[
            'flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 transition-colors',
            accentStyles.hover,
          ].join(' ')}
        >
          <Upload size={16} />
          ছবি আপলোড
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>

        {slot.preview ? (
          <div className="relative">
            <img
              src={slot.preview}
              alt={title}
              className="h-20 w-32 rounded-xl border border-white/90 object-cover shadow-sm"
            />
            <button
              type="button"
              onClick={onClear}
              className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-1 text-white shadow"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white/70 text-gray-300">
            <ImageIcon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const [products, setProducts] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showSupportMessages, setShowSupportMessages] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [bannerText, setBannerText] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const [desktopBannerSlots, setDesktopBannerSlots] = useState(createEmptyBannerSlots());
  const [mobileBannerSlots, setMobileBannerSlots] = useState(createEmptyBannerSlots());

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    window.setTimeout(() => {
      setToast({ type: '', message: '' });
    }, 3200);
  }, []);

  const resetProductForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
  }, []);
