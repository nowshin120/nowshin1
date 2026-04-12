const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
  import.meta.env.VITE_CLOUDINARY_CLOUDNAME ||
  '';
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
  import.meta.env.VITE_CLOUDINARY_PRESET ||
  '';
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || '';

const uploadToCloudinary = async (file) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary config পাওয়া যায়নি। `VITE_CLOUDINARY_CLOUD_NAME` এবং `VITE_CLOUDINARY_UPLOAD_PRESET` সেট করুন।');
  }

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (CLOUDINARY_FOLDER) fd.append('folder', CLOUDINARY_FOLDER);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.error?.message || 'ছবি আপলোড ব্যর্থ। Cloudinary unsigned preset ঠিক আছে কি না চেক করুন।');
  }

  return body?.secure_url;
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

    const { error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) throw error;

    setBannerImageUrl(finalUrl);
    setBannerImagePreview(finalUrl);
    setBannerImageFile(null);
    setBannerMobileImageUrl(finalMobileUrl);
    setBannerMobileImagePreview(finalMobileUrl);
    setBannerMobileImageFile(null);

    showToast('success', 'ব্যানার আপডেট হয়েছে!');
  } catch (err) {
    showToast('error', err.message);
  } finally {
    setLoading(false);
  }
};
