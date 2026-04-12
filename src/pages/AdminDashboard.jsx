/// src/pages/AdminDashboard.jsx ///
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  PackagePlus, Pencil, Trash2, LogOut, Users, Package,
  Megaphone, KeyRound, CheckCircle2, AlertCircle, X, Upload,
  LayoutDashboard, Image as ImageIcon, MessageCircle, Settings,
  ShoppingBag, Eye, EyeOff, Menu, Star, BarChart2, Home,
  Smartphone, Monitor,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'sari', label: 'শাড়ি', en: 'Sari', color: 'bg-pink-100 text-pink-700' },
  { value: 'panjabi', label: 'পাঞ্জাবি', en: 'Panjabi', color: 'bg-blue-100 text-blue-700' },
  { value: 'three-piece', label: 'থ্রিপিস', en: 'Three Piece', color: 'bg-purple-100 text-purple-700' },
  { value: 'kids', label: 'কিডস', en: 'Kids', color: 'bg-yellow-100 text-yellow-700' },
];

const EMPTY_FORM = {
  name: '', price: '', category_slug: 'sari',
  delivery_charge: '100', description: '', image_url: '',
};

function Toast({ type, text, onClose }) {
  if (!text) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-xs ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      <span className="flex-1">{text}</span>
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

function SupportMessages({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('support_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => { setMessages(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">সাপোর্ট মেসেজ</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {loading ? (
            <p className="text-center py-8 text-gray-400 text-sm">লোড হচ্ছে...</p>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400 text-sm">কোনো মেসেজ নেই</p>
            </div>
          ) : messages.map((m) => (
            <div key={m.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-medium text-gray-800 text-sm">{m.name || 'অজানা'}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(m.created_at).toLocaleDateString('bn-BD')}
                </span>
              </div>
              {m.phone && <p className="text-xs text-blue-600 mb-1">📞 {m.phone}</p>}
              <p className="text-sm text-gray-600">{m.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Reusable image uploader row ──────────────────────────────────────────────
function BannerImageUploader({ label, hint, accentColor, preview, onFileChange, onClear }) {
  const borderHover = accentColor === 'amber' ? 'hover:border-amber-400 hover:text-amber-600' : 'hover:border-blue-400 hover:text-blue-600';
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
        {hint && <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{hint}</span>}
      </div>
      <div className="flex items-start gap-3">
        <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 ${borderHover} rounded-xl px-4 py-2.5 text-sm text-gray-500 transition-colors`}>
          <Upload size={15} /> ছবি আপলোড
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>
        {preview ? (
          <div className="relative">
            <img src={preview} alt="preview" className="w-28 h-16 object-cover rounded-xl border border-gray-100" />
            <button
              type="button"
              onClick={onClear}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow"
            >
              <X size={11} />
            </button>
          </div>
        ) : (
          <div className="w-28 h-16 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300">
            <ImageIcon size={20} />
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
  const [products, setProducts] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSupport, setShowSupport] = useState(false);

  // Banner — PC
  const [bannerText, setBannerText] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  // Banner — Mobile
  const [bannerMobileImageFile, setBannerMobileImageFile] = useState(null);
  const [bannerMobileImagePreview, setBannerMobileImagePreview] = useState('');
  const [bannerMobileImageUrl, setBannerMobileImageUrl] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: '', text: '' }), 3500);
  };

  const loadAll = useCallback(async () => {
    const [prodRes, userRes, settingsRes, msgRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_users').select('*', { count: 'exact', head: true }),
      supabase.from('site_settings').select('key,value').in('key', [
        'banner_text', 'banner_active', 'banner_image_url', 'banner_image_url_mobile',
      ]),
      supabase.from('support_messages').select('*', { count: 'exact', head: true }),
    ]);
    setProducts(prodRes.data ?? []);
    setUserCount(userRes.count ?? 0);
    setMsgCount(msgRes.count ?? 0);
    if (settingsRes.data) {
      settingsRes.data.forEach((s) => {
        if (s.key === 'banner_text') setBannerText(s.value ?? '');
        if (s.key === 'banner_active') setBannerActive(s.value === 'true');
        if (s.key === 'banner_image_url') {
          setBannerImageUrl(s.value ?? '');
          setBannerImagePreview(s.value ?? '');
        }
        if (s.key === 'banner_image_url_mobile') {
          setBannerMobileImageUrl(s.value ?? '');
          setBannerMobileImagePreview(s.value ?? '');
        }
      });
    }
    setPageLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: fd }
    );
    if (!res.ok) throw new Error('ছবি আপলোড ব্যর্থ।');
    return (await res.json()).secure_url;
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'ছবি ৫MB এর বেশি হবে না।'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, image_url: '' }));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'ছবি ৫MB এর বেশি হবে না।'); return; }
    setBannerImageFile(file);
    setBannerImagePreview(URL.createObjectURL(file));
  };

  const handleBannerMobileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'ছবি ৫MB এর বেশি হবে না।'); return; }
    setBannerMobileImageFile(file);
    setBannerMobileImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) { showToast('error', 'নাম এবং দাম দিন।'); return; }
    setLoading(true);
    try {
      let image_url = formData.image_url;
      if (imageFile) image_url = await uploadToCloudinary(imageFile);
      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category_slug: formData.category_slug,
        delivery_charge: parseFloat(formData.delivery_charge) || 100,
        description: formData.description.trim(),
        image_url: image_url || null,
        is_in_stock: true,
      };
      const { error } = editingId
        ? await supabase.from('products').update(payload).eq('id', editingId)
        : await supabase.from('products').insert([payload]);
      if (error) throw error;
      showToast('success', editingId ? 'প্রোডাক্ট আপডেট হয়েছে!' : 'প্রোডাক্ট যোগ হয়েছে!');
      setFormData(EMPTY_FORM); setEditingId(null); setImageFile(null); setImagePreview('');
      setTab('products'); loadAll();
    } catch (err) { showToast('error', err.message); }
    finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name ?? '', price: String(p.price ?? ''),
      category_slug: p.category_slug ?? 'sari',
      delivery_charge: String(p.delivery_charge ?? '100'),
      description: p.description ?? '', image_url: p.image_url ?? '',
    });
    setImagePreview(p.image_url ?? '');
    setTab('add'); setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) showToast('error', 'ডিলিট হয়নি: ' + error.message);
    else { showToast('success', 'প্রোডাক্ট মুছে গেছে।'); loadAll(); }
    setDeleteConfirm(null); setLoading(false);
  };

  const handleBannerSave = async () => {
    setLoading(true);
    try {
      let finalUrl = bannerImageUrl;
      if (bannerImageFile) finalUrl = await uploadToCloudinary(bannerImageFile);

      let finalMobileUrl = bannerMobileImageUrl;
      if (bannerMobileImageFile) finalMobileUrl = await uploadToCloudinary(bannerMobileImageFile);

      const updates = [
        { key: 'banner_text', value: bannerText, updated_at: new Date().toISOString() },
        { key: 'banner_active', value: String(bannerActive), updated_at: new Date().toISOString() },
        { key: 'banner_image_url', value: finalUrl, updated_at: new Date().toISOString() },
        { key: 'banner_image_url_mobile', value: finalMobileUrl, updated_at: new Date().toISOString() },
      ];
      const { error } = await supabase.from('site_settings').upsert(updates);
      if (error) throw error;

      setBannerImageUrl(finalUrl);
      setBannerImageFile(null);
      setBannerMobileImageUrl(finalMobileUrl);
      setBannerMobileImageFile(null);
      showToast('success', 'ব্যানার আপডেট হয়েছে!');
    } catch (err) { showToast('error', err.message); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) { showToast('error', 'কমপক্ষে ৮ অক্ষর দিন।'); return; }
    if (newPassword !== confirmPassword) { showToast('error', 'পাসওয়ার্ড মিলছে না।'); return; }
    setLoading(true);
    try {
      await updatePassword(newPassword);
      showToast('success', 'পাসওয়ার্ড পরিবর্তন হয়েছে!');
      setNewPassword(''); setConfirmPassword('');
    } catch (err) { showToast('error', err.message); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const cancelEdit = () => {
    setEditingId(null); setFormData(EMPTY_FORM);
    setImageFile(null); setImagePreview('');
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const catStats = CATEGORIES.map((c) => ({
    ...c, count: products.filter((p) => p.category_slug === c.value).length,
  }));

  const navItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
    { id: 'products', label: 'প্রোডাক্ট', icon: Package },
    { id: 'add', label: editingId ? 'এডিট' : 'নতুন প্রোডাক্ট', icon: PackagePlus },
    { id: 'banner', label: 'ব্যানার', icon: Megaphone },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toast type={toast.type} text={toast.text} onClose={() => setToast({ type: '', text: '' })} />
      {showSupport && <SupportMessages onClose={() => setShowSupport(false)} />}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-40 flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto',
        ].join(' ')}
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm leading-tight">Nowshin Fashion</p>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg">
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">মেনু</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSidebarOpen(false); if (id !== 'add') cancelEdit(); }}
              className={[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                tab === id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800',
              ].join(' ')}
            >
              <Icon size={18} className={tab === id ? 'text-blue-600' : 'text-gray-400'} />
              {label}
              {id === 'products' && products.length > 0 && (
                <span className="ml-auto text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                  {products.length}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pb-1">অন্যান্য</p>
            <button
              onClick={() => setShowSupport(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all"
            >
              <MessageCircle size={18} className="text-gray-400" />
              সাপোর্ট মেসেজ
              {msgCount > 0 && (
                <span className="ml-auto text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                  {msgCount}
                </span>
              )}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all"
            >
              <Home size={18} className="text-gray-400" />
              সাইট দেখুন
            </a>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{user?.email}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            লগআউট
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Menu size={20} className="text-gray-600" />
          </button>
          <h1 className="font-semibold text-gray-800 text-sm sm:text-base flex-1">
            {navItems.find((n) => n.id === tab)?.label ?? 'ড্যাশবোর্ড'}
          </h1>
          <button
            onClick={() => setShowSupport(true)}
            className="relative p-2 hover:bg-gray-100 rounded-xl text-gray-500"
          >
            <MessageCircle size={18} />
            {msgCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">

          {/* ---- OVERVIEW ---- */}
          {tab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  স্বাগতম, {user?.email?.split('@')[0]} 👋
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">আজকের পরিসংখ্যান</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'প্রোডাক্ট', value: products.length, icon: Package, bg: 'bg-blue-500' },
                  { label: 'অ্যাডমিন', value: userCount, icon: Users, bg: 'bg-purple-500' },
                  { label: 'মেসেজ', value: msgCount, icon: MessageCircle, bg: 'bg-green-500' },
                  { label: 'ব্যানার', value: bannerActive ? 'চালু' : 'বন্ধ', icon: Megaphone, bg: bannerActive ? 'bg-amber-500' : 'bg-gray-400' },
                ].map(({ label, value, icon: Icon, bg }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} mb-3`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart2 size={18} className="text-blue-500" /> ক্যাটাগরি বিশ্লেষণ
                </h3>
                <div className="space-y-3">
                  {catStats.map((c) => {
                    const pct = products.length > 0 ? Math.round((c.count / products.length) * 100) : 0;
                    return (
                      <div key={c.value}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{c.label}</span>
                          <span className="text-sm font-medium text-gray-800">{c.count}টি ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {products.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">এখনো প্রোডাক্ট নেই</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">দ্রুত কাজ</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'নতুন প্রোডাক্ট', icon: PackagePlus, action: () => { cancelEdit(); setTab('add'); }, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                    { label: 'ব্যানার এডিট', icon: Megaphone, action: () => setTab('banner'), color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                    { label: 'মেসেজ দেখুন', icon: MessageCircle, action: () => setShowSupport(true), color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                    { label: 'সেটিংস', icon: Settings, action: () => setTab('settings'), color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                  ].map(({ label, icon: Icon, action, color }) => (
                    <button
                      key={label}
                      onClick={action}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-medium transition-colors ${color}`}
                    >
                      <Icon size={20} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- PRODUCTS ---- */}
          {tab === 'products' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="প্রোডাক্ট খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>
                <button
                  onClick={() => { cancelEdit(); setTab('add'); }}
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <PackagePlus size={16} /> যোগ করুন
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-medium text-gray-600">{filteredProducts.length}টি প্রোডাক্ট</p>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center">
                    <Package size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm">কোনো প্রোডাক্ট নেই</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {filteredProducts.map((p) => {
                      const cat = CATEGORIES.find((c) => c.value === p.category_slug);
                      return (
                        <div key={p.id} className="flex items-center gap-3 p-3 sm:p-4 hover:bg-gray-50/50 transition-colors">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <ImageIcon size={20} className="text-gray-300" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                            <p className="text-blue-600 font-medium text-sm">৳{p.price?.toLocaleString()}</p>
                            {cat && (
                              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-0.5 ${cat.color}`}>
                                {cat.label}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- ADD / EDIT ---- */}
          {tab === 'add' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">
                    {editingId ? 'প্রোডাক্ট এডিট' : 'নতুন প্রোডাক্ট'}
                  </h2>
                  {editingId && (
                    <button
                      onClick={cancelEdit}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      <X size={13} /> বাতিল
                    </button>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">নাম *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="যেমন: সিল্ক বেনারসি শাড়ি"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">ক্যাটাগরি *</label>
                      <select
                        value={formData.category_slug}
                        onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label} ({c.en})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">দাম (৳) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="4500"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">ডেলিভারি চার্জ (৳)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.delivery_charge}
                        onChange={(e) => setFormData({ ...formData, delivery_charge: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">ছবি আপলোড</label>
                    <div className="flex items-start gap-3">
                      <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <Upload size={16} /> ফাইল বেছে নিন
                        <input type="file" accept="image/*" className="hidden" onChange={handleProductImageChange} />
                      </label>
                      {imagePreview && (
                        <div className="relative">
                          <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(''); setFormData((f) => ({ ...f, image_url: '' })); }}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">অথবা URL দিন:</p>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">বর্ণনা</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="প্রোডাক্টের বিস্তারিত..."
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        প্রসেস হচ্ছে...
                      </>
                    ) : editingId ? (
                      <><Pencil size={15} /> আপডেট করুন</>
                    ) : (
                      <><PackagePlus size={15} /> সেভ করুন</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ---- BANNER ---- */}
          {tab === 'banner' && (
            <div className="max-w-xl space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <Megaphone size={18} className="text-amber-500" /> ব্যানার ম্যানেজমেন্ট
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  ফোন ও কম্পিউটারের জন্য আলাদা আলাদা ব্যানার ছবি আপলোড করুন।
                </p>

                <div className="space-y-5">
                  {/* Banner Text */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">ব্যানার টেক্সট</label>
                    <input
                      type="text"
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      placeholder="ব্যানারে কী লেখা দেখাবে..."
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* PC Banner */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Monitor size={16} className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-700">কম্পিউটার ব্যানার</span>
                      <span className="text-[10px] text-blue-400 bg-blue-100 rounded-full px-2 py-0.5">
                        প্রস্থ: ১৪৪০×৪২০ px বা wide ratio
                      </span>
                    </div>
                    <BannerImageUploader
                      label="PC ছবি আপলোড"
                      accentColor="blue"
                      preview={bannerImagePreview}
                      onFileChange={handleBannerImageChange}
                      onClear={() => { setBannerImageFile(null); setBannerImagePreview(''); setBannerImageUrl(''); }}
                    />
                  </div>

                  {/* Mobile Banner */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone size={16} className="text-amber-600" />
                      <span className="text-sm font-bold text-amber-700">মোবাইল ব্যানার</span>
                      <span className="text-[10px] text-amber-500 bg-amber-100 rounded-full px-2 py-0.5">
                        প্রস্থ: ৭৫০×৪৫০ px বা 4:3 ratio
                      </span>
                    </div>
                    <BannerImageUploader
                      label="Mobile ছবি আপলোড"
                      accentColor="amber"
                      preview={bannerMobileImagePreview}
                      onFileChange={handleBannerMobileImageChange}
                      onClear={() => { setBannerMobileImageFile(null); setBannerMobileImagePreview(''); setBannerMobileImageUrl(''); }}
                    />
                    <p className="text-[11px] text-amber-600">
                      💡 মোবাইল ছবি না দিলে স্বয়ংক্রিয়ভাবে PC ছবিই দেখাবে।
                    </p>
                  </div>

                  {/* Status toggle */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">ব্যানার স্ট্যাটাস</p>
                      <p className="text-xs text-gray-400">{bannerActive ? 'সাইটে দেখাচ্ছে' : 'বন্ধ আছে'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bannerActive}
                        onChange={(e) => setBannerActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-checked:bg-amber-500 rounded-full peer after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>

                  {bannerActive && bannerText && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-start gap-2">
                      <Star size={14} className="mt-0.5 flex-shrink-0" />
                      <span><strong>প্রিভিউ:</strong> {bannerText}</span>
                    </div>
                  )}

                  <button
                    onClick={handleBannerSave}
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        আপলোড হচ্ছে...
                      </>
                    ) : 'ব্যানার সেভ করুন'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---- SETTINGS ---- */}
          {tab === 'settings' && (
            <div className="max-w-xl space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <KeyRound size={18} className="text-purple-500" /> পাসওয়ার্ড পরিবর্তন
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">নতুন পাসওয়ার্ড</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="কমপক্ষে ৮ অক্ষর"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">নিশ্চিত করুন</label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="আবার দিন"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                  >
                    পাসওয়ার্ড পরিবর্তন করুন
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users size={18} className="text-blue-500" /> অ্যাকাউন্ট তথ্য
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">ইমেইল</span>
                    <span className="font-medium text-gray-800 truncate ml-4">{user?.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">ভূমিকা</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">শেষ লগইন</span>
                    <span className="text-gray-800 text-xs">
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString('bn-BD')
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-red-100 p-5">
                <h3 className="font-semibold text-red-600 mb-2">লগআউট</h3>
                <p className="text-sm text-gray-500 mb-4">এই ডিভাইস থেকে বের হয়ে যাবেন।</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogOut size={15} /> লগআউট করুন
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ===== DELETE MODAL ===== */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-center mb-1">ডিলিট নিশ্চিত করুন</h3>
            <p className="text-gray-500 text-sm text-center mb-6">এই প্রোডাক্টটি স্থায়ীভাবে মুছে যাবে।</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
