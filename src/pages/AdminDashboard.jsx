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
  ShoppingBag,
  Smartphone,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { value: 'sari', label: 'শাড়ি', labelEn: 'Sari', badge: 'bg-pink-100 text-pink-700' },
  { value: 'panjabi', label: 'পাঞ্জাবি', labelEn: 'Panjabi', badge: 'bg-blue-100 text-blue-700' },
  { value: 'three-piece', label: 'থ্রিপিস', labelEn: 'Three Piece', badge: 'bg-purple-100 text-purple-700' },
  { value: 'kids', label: 'কিডস', labelEn: 'Kids', badge: 'bg-amber-100 text-amber-700' },
];

const EMPTY_FORM = {
  name: '',
  price: '',
  category_slug: 'sari',
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

function FilePickerCard({ title, hint, accent = 'blue', preview, onFileChange, onClear }) {
  const wrapperClasses =
    accent === 'amber'
      ? 'border-amber-100 bg-amber-50/70 text-amber-700'
      : 'border-blue-100 bg-blue-50/70 text-blue-700';

  const uploaderClasses =
    accent === 'amber'
      ? 'hover:border-amber-400 hover:text-amber-600'
      : 'hover:border-blue-400 hover:text-blue-600';

  return (
    <div className={`rounded-2xl border p-4 ${wrapperClasses}`}>
      <div className="mb-3 flex items-center gap-2">
        {accent === 'amber' ? <Smartphone size={16} /> : <Monitor size={16} />}
        <h3 className="text-sm font-bold">{title}</h3>
        {hint ? (
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold">
            {hint}
          </span>
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        <label
          className={[
            'flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 transition-colors',
            uploaderClasses,
          ].join(' ')}
        >
          <Upload size={16} />
          ছবি আপলোড
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-32 rounded-xl border border-white/80 object-cover shadow-sm"
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
                    {message.phone ? <p className="text-xs text-blue-600">{message.phone}</p> : null}
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
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerImagePreview, setBannerImagePreview] = useState('');
  const [bannerMobileImageFile, setBannerMobileImageFile] = useState(null);
  const [bannerMobileImageUrl, setBannerMobileImageUrl] = useState('');
  const [bannerMobileImagePreview, setBannerMobileImagePreview] = useState('');

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

  const loadDashboard = useCallback(async () => {
    const [productsRes, adminsRes, settingsRes, messagesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_users').select('*', { count: 'exact', head: true }),
      supabase
        .from('site_settings')
        .select('key,value')
        .in('key', ['banner_text', 'banner_active', 'banner_image_url', 'banner_image_url_mobile']),
      supabase.from('support_messages').select('*', { count: 'exact', head: true }),
    ]);

    setProducts(productsRes.data ?? []);
    setUserCount(adminsRes.count ?? 0);
    setMessageCount(messagesRes.count ?? 0);

    (settingsRes.data ?? []).forEach((item) => {
      if (item.key === 'banner_text') setBannerText(item.value ?? '');
      if (item.key === 'banner_active') setBannerActive(item.value !== 'false');

      if (item.key === 'banner_image_url') {
        setBannerImageUrl(item.value ?? '');
        setBannerImagePreview(item.value ?? '');
      }

      if (item.key === 'banner_image_url_mobile') {
        setBannerMobileImageUrl(item.value ?? '');
        setBannerMobileImagePreview(item.value ?? '');
      }
    });

    setPageLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredProducts = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(term) ||
        product.category_slug?.toLowerCase().includes(term)
      );
    });
  }, [products, searchQuery]);

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((category) => ({
      ...category,
      count: products.filter((product) => product.category_slug === category.value).length,
    }));
  }, [products]);

  const uploadToCloudinary = async (file) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        'Cloudinary config পাওয়া যায়নি। VITE_CLOUDINARY_CLOUD_NAME এবং VITE_CLOUDINARY_UPLOAD_PRESET সেট করুন।'
      );
    }

    const payload = new FormData();
    payload.append('file', file);
    payload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    if (CLOUDINARY_FOLDER) {
      payload.append('folder', CLOUDINARY_FOLDER);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: payload,
      }
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        body?.error?.message ||
          'ছবি আপলোড ব্যর্থ। Cloudinary unsigned upload preset ঠিক আছে কি না চেক করুন।'
      );
    }

    return body?.secure_url ?? '';
  };

  const onProductFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'ছবি ৫MB এর বেশি হবে না।');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData((current) => ({ ...current, image_url: '' }));
  };

  const onBannerFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'ছবি ৫MB এর বেশি হবে না।');
      return;
    }

    setBannerImageFile(file);
    setBannerImagePreview(URL.createObjectURL(file));
  };

  const onBannerMobileFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'ছবি ৫MB এর বেশি হবে না।');
      return;
    }

    setBannerMobileImageFile(file);
    setBannerMobileImagePreview(URL.createObjectURL(file));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      showToast('error', 'প্রোডাক্টের নাম এবং দাম দিন।');
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        category_slug: formData.category_slug,
        delivery_charge: Number(formData.delivery_charge) || 100,
        description: formData.description.trim(),
        image_url: finalImageUrl || null,
        is_in_stock: true,
      };

      const { error } = editingId
        ? await supabase.from('products').update(payload).eq('id', editingId)
        : await supabase.from('products').insert([payload]);

      if (error) throw error;

      showToast('success', editingId ? 'প্রোডাক্ট আপডেট হয়েছে।' : 'প্রোডাক্ট যোগ হয়েছে।');
      resetProductForm();
      setTab('products');
      await loadDashboard();
    } catch (error) {
      showToast('error', error.message || 'প্রোডাক্ট সেভ করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name ?? '',
      price: String(product.price ?? ''),
      category_slug: product.category_slug ?? 'sari',
      delivery_charge: String(product.delivery_charge ?? '100'),
      description: product.description ?? '',
      image_url: product.image_url ?? '',
    });
    setImageFile(null);
    setImagePreview(product.image_url ?? '');
    setTab('add');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteId);
      if (error) throw error;

      showToast('success', 'প্রোডাক্ট মুছে গেছে।');
      setDeleteId(null);
      await loadDashboard();
    } catch (error) {
      showToast('error', error.message || 'ডিলিট করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleBannerSave = async () => {
    setLoading(true);

    try {
      let finalBannerUrl = bannerImageUrl;
      if (bannerImageFile) {
        finalBannerUrl = await uploadToCloudinary(bannerImageFile);
      }

      let finalBannerMobileUrl = bannerMobileImageUrl;
      if (bannerMobileImageFile) {
        finalBannerMobileUrl = await uploadToCloudinary(bannerMobileImageFile);
      }

      const updates = [
        { key: 'banner_text', value: bannerText, updated_at: new Date().toISOString() },
        { key: 'banner_active', value: String(bannerActive), updated_at: new Date().toISOString() },
        { key: 'banner_image_url', value: finalBannerUrl, updated_at: new Date().toISOString() },
        {
          key: 'banner_image_url_mobile',
          value: finalBannerMobileUrl,
          updated_at: new Date().toISOString(),
        },
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      setBannerImageUrl(finalBannerUrl);
      setBannerImagePreview(finalBannerUrl);
      setBannerImageFile(null);

      setBannerMobileImageUrl(finalBannerMobileUrl);
      setBannerMobileImagePreview(finalBannerMobileUrl);
      setBannerMobileImageFile(null);

      showToast('success', 'ব্যানার আপডেট হয়েছে।');
    } catch (error) {
      showToast('error', error.message || 'ব্যানার সেভ করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      showToast('error', 'কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন।');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'পাসওয়ার্ড মিলছে না।');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      showToast('success', 'পাসওয়ার্ড পরিবর্তন হয়েছে।');
    } catch (error) {
      showToast('error', error.message || 'পাসওয়ার্ড পরিবর্তন করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
    { id: 'products', label: 'প্রোডাক্ট', icon: Package },
    { id: 'add', label: editingId ? 'এডিট প্রোডাক্ট' : 'নতুন প্রোডাক্ট', icon: PackagePlus },
    { id: 'banner', label: 'ব্যানার', icon: Megaphone },
    { id: 'settings', label: 'সেটিংস', icon: KeyRound },
  ];

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: '', message: '' })}
      />

      {showSupportMessages ? (
        <SupportMessagesModal onClose={() => setShowSupportMessages(false)} />
      ) : null}

      {deleteId ? (
        <DeleteConfirmModal
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteProduct}
          loading={loading}
        />
      ) : null}

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={[
          'fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="border-b border-gray-100 px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Nowshin Fashion</p>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-2 hover:bg-gray-100 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
            মেনু
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setSidebarOpen(false);
                  if (item.id !== 'add') resetProductForm();
                }}
                className={[
                  'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')}
              >
                <Icon size={18} className={active ? 'text-blue-600' : 'text-gray-400'} />
                <span>{item.label}</span>
                {item.id === 'products' && products.length ? (
                  <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    {products.length}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="pt-4">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
              অন্যান্য
            </p>

            <button
              type="button"
              onClick={() => setShowSupportMessages(true)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <MessageCircle size={18} className="text-gray-400" />
              <span>সাপোর্ট মেসেজ</span>
              {messageCount ? (
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                  {messageCount}
                </span>
              ) : null}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Home size={18} className="text-gray-400" />
              <span>সাইট দেখুন</span>
            </a>
          </div>
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={17} />
            লগআউট
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          <h1 className="flex-1 text-sm font-semibold text-gray-900 sm:text-base">
            {navItems.find((item) => item.id === tab)?.label || 'ড্যাশবোর্ড'}
          </h1>

          <button
            type="button"
            onClick={() => setShowSupportMessages(true)}
            className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-100"
          >
            <MessageCircle size={18} />
            {messageCount ? (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
            ) : null}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === 'overview' ? (
            <div className="mx-auto max-w-5xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  স্বাগতম, {user?.email?.split('@')[0] || 'Admin'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">আজকের ড্যাশবোর্ড সারাংশ</p>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: 'প্রোডাক্ট',
                    value: products.length,
                    icon: Package,
                    color: 'bg-blue-500',
                  },
                  {
                    label: 'অ্যাডমিন',
                    value: userCount,
                    icon: Users,
                    color: 'bg-violet-500',
                  },
                  {
                    label: 'মেসেজ',
                    value: messageCount,
                    icon: MessageCircle,
                    color: 'bg-emerald-500',
                  },
                  {
                    label: 'ব্যানার',
                    value: bannerActive ? 'চালু' : 'বন্ধ',
                    icon: Megaphone,
                    color: bannerActive ? 'bg-amber-500' : 'bg-gray-400',
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="rounded-3xl border border-gray-100 bg-white p-5">
                      <div
                        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}
                      >
                        <Icon size={19} className="text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                        {card.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-6">
                <div className="mb-5 flex items-center gap-2">
                  <Users size={18} className="text-blue-500" />
                  <h3 className="font-bold text-gray-900">ক্যাটাগরি বিশ্লেষণ</h3>
                </div>

                <div className="space-y-4">
                  {categoryStats.map((category) => {
                    const percentage = products.length
                      ? Math.round((category.count / products.length) * 100)
                      : 0;

                    return (
                      <div key={category.value}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{category.label}</span>
                          <span className="text-sm text-gray-500">
                            {category.count}টি ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'products' ? (
            <div className="mx-auto max-w-5xl space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="প্রোডাক্ট খুঁজুন..."
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none ring-0 transition focus:border-blue-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetProductForm();
                    setTab('add');
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <PackagePlus size={16} />
                  নতুন প্রোডাক্ট
                </button>
              </div>

              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                <div className="border-b border-gray-100 px-5 py-4">
                  <p className="text-sm font-medium text-gray-500">
                    {filteredProducts.length}টি প্রোডাক্ট পাওয়া গেছে
                  </p>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center">
                    <Package size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const category = CATEGORIES.find(
                        (item) => item.value === product.category_slug
                      );

                      return (
                        <div key={product.id} className="flex items-center gap-4 px-5 py-4">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-16 w-16 rounded-2xl border border-gray-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
                              <ImageIcon size={20} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="mt-1 text-sm font-medium text-blue-600">
                              ৳{Number(product.price || 0).toLocaleString()}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              {category ? (
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${category.badge}`}
                                >
                                  {category.label}
                                </span>
                              ) : null}
                              <span className="text-xs text-gray-400">
                                Delivery: ৳{Number(product.delivery_charge || 0)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditProduct(product)}
                              className="rounded-xl p-2 text-blue-600 hover:bg-blue-50"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(product.id)}
                              className="rounded-xl p-2 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {tab === 'add' ? (
            <div className="mx-auto max-w-3xl">
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {editingId ? 'প্রোডাক্ট এডিট' : 'নতুন প্রোডাক্ট'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                      নাম, দাম, ছবি এবং বর্ণনা দিয়ে প্রোডাক্ট সেভ করুন।
                    </p>
                  </div>

                  {editingId ? (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                    >
                      বাতিল
                    </button>
                  ) : null}
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-5 px-6 py-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                        নাম
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="যেমন: সিল্ক শাড়ি"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                        ক্যাটাগরি
                      </label>
                      <select
                        value={formData.category_slug}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            category_slug: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label} ({category.labelEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                        দাম
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, price: event.target.value }))
                        }
                        placeholder="4500"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                        ডেলিভারি চার্জ
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.delivery_charge}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            delivery_charge: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                        ছবি আপলোড
                      </label>

                      <div className="flex flex-wrap items-start gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600">
                          <Upload size={16} />
                          ফাইল বেছে নিন
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onProductFileChange}
                          />
                        </label>

                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-20 w-20 rounded-2xl border border-gray-100 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview('');
                                setFormData((current) => ({ ...current, image_url: '' }));
                              }}
                              className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-1 text-white shadow"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-3 text-xs text-gray-400">অথবা image URL দিন</p>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(event) => {
                          const value = event.target.value;
                          setFormData((current) => ({ ...current, image_url: value }));
                          setImagePreview(value);
                          setImageFile(null);
                        }}
                        placeholder="https://..."
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                        বর্ণনা
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="প্রোডাক্ট সম্পর্কে সংক্ষিপ্ত বর্ণনা..."
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : editingId ? (
                      <Pencil size={16} />
                    ) : (
                      <PackagePlus size={16} />
                    )}
                    {editingId ? 'প্রোডাক্ট আপডেট করুন' : 'প্রোডাক্ট সেভ করুন'}
                  </button>
                </form>
              </div>
            </div>
          ) : null}

          {tab === 'banner' ? (
            <div className="mx-auto max-w-3xl space-y-5">
              <div className="rounded-3xl border border-gray-100 bg-white p-6">
                <div className="mb-5">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Megaphone size={18} className="text-amber-500" />
                    ব্যানার ম্যানেজমেন্ট
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    ফোন আর কম্পিউটারের জন্য আলাদা ব্যানার ছবি ব্যবহার করুন।
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      ব্যানার টেক্সট
                    </label>
                    <input
                      type="text"
                      value={bannerText}
                      onChange={(event) => setBannerText(event.target.value)}
                      placeholder="ব্যানারে কী লেখা দেখাবে..."
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                    />
                  </div>

                  <FilePickerCard
                    title="কম্পিউটার ব্যানার"
                    hint="প্রস্তাবিত: 1440×420 বা wide ratio"
                    accent="blue"
                    preview={bannerImagePreview}
                    onFileChange={onBannerFileChange}
                    onClear={() => {
                      setBannerImageFile(null);
                      setBannerImageUrl('');
                      setBannerImagePreview('');
                    }}
                  />

                  <FilePickerCard
                    title="মোবাইল ব্যানার"
                    hint="প্রস্তাবিত: 750×450 বা 4:3 ratio"
                    accent="amber"
                    preview={bannerMobileImagePreview}
                    onFileChange={onBannerMobileFileChange}
                    onClear={() => {
                      setBannerMobileImageFile(null);
                      setBannerMobileImageUrl('');
                      setBannerMobileImagePreview('');
                    }}
                  />

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">ব্যানার স্ট্যাটাস</p>
                        <p className="text-xs text-gray-400">
                          {bannerActive ? 'সাইটে দেখাচ্ছে' : 'বন্ধ আছে'}
                        </p>
                      </div>

                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={bannerActive}
                          onChange={(event) => setBannerActive(event.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-amber-500 peer-after:absolute peer-after:left-[2px] peer-after:top-0.5 peer-after:h-5 peer-after:w-5 peer-after:rounded-full peer-after:bg-white peer-after:transition-all peer-checked:peer-after:translate-x-full" />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    মোবাইল ব্যানার না দিলে স্বয়ংক্রিয়ভাবে PC ব্যানারই দেখাবে।
                  </div>

                  <button
                    type="button"
                    onClick={handleBannerSave}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Megaphone size={16} />
                    )}
                    ব্যানার সেভ করুন
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'settings' ? (
            <div className="mx-auto max-w-3xl space-y-5">
              <div className="rounded-3xl border border-gray-100 bg-white p-6">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <KeyRound size={18} className="text-violet-500" />
                  পাসওয়ার্ড পরিবর্তন
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      নতুন পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="কমপক্ষে ৮ অক্ষর"
                        minLength={8}
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-violet-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      পাসওয়ার্ড নিশ্চিত করুন
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="আবার লিখুন"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-violet-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <KeyRound size={16} />
                    )}
                    পাসওয়ার্ড পরিবর্তন করুন
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Users size={18} className="text-blue-500" />
                  অ্যাকাউন্ট তথ্য
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <span className="text-gray-500">ইমেইল</span>
                    <span className="max-w-[60%] truncate font-medium text-gray-900">
                      {user?.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <span className="text-gray-500">ভূমিকা</span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                      Admin
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <span className="text-gray-500">শেষ লগইন</span>
                    <span className="text-xs text-gray-700">
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString('bn-BD')
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
