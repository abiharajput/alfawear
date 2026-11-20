import { ChangeEvent, FormEvent, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  Edit3,
  ImagePlus,
  KeyRound,
  LogOut,
  Megaphone,
  Package,
  Plus,
  RotateCcw,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react';
import { PRODUCT_CATEGORIES, DEFAULT_STORE_DATA, formatPKR } from '../data/defaultStore';
import { Product, ProductCategory, StoreData } from '../types';
import { AlfaWearLogo } from './AlfaWearLogo';

interface AdminPanelProps {
  storeData: StoreData;
  onUpdateStore: (next: StoreData) => void;
  onExitAdmin: () => void;
}

type AdminTab = 'products' | 'payment' | 'social' | 'content' | 'security';

const EMPTY_PRODUCT_FORM = {
  title: '',
  category: 'Men' as ProductCategory,
  price: '',
  compareAtPrice: '',
  sizesText: 'S, M, L, XL',
  image: '',
  description: '',
  inStock: true,
};

export function AdminPanel({
  storeData,
  onUpdateStore,
  onExitAdmin,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'pin'>('email');
  const [emailInput, setEmailInput] = useState(storeData.admin.email);
  const [passwordInput, setPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [statusMessage, setStatusMessage] = useState('');

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [showProductForm, setShowProductForm] = useState(false);

  // Security Form State
  const [newPassword, setNewPassword] = useState(storeData.admin.password);
  const [newPin, setNewPin] = useState(storeData.admin.pin);

  const notifySaved = (msg: string) => {
    setStatusMessage(msg);
    window.setTimeout(() => setStatusMessage(''), 2600);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (loginMode === 'email') {
      const normalizedEmail = emailInput.trim().toLowerCase();
      const allowedEmail = storeData.admin.email.trim().toLowerCase();
      if (normalizedEmail !== allowedEmail) {
        setAuthError(`Only authorized owner email (${storeData.admin.email}) can access Admin.`);
        return;
      }
      if (passwordInput !== storeData.admin.password) {
        setAuthError('Incorrect password. You can also use Owner Quick PIN so you are never locked out.');
        return;
      }
      setIsAuthenticated(true);
      return;
    }

    if (pinInput.trim() !== storeData.admin.pin) {
      setAuthError('Incorrect Owner PIN.');
      return;
    }
    setIsAuthenticated(true);
  };

  const handleImageFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        setProductForm((prev) => ({ ...prev, image: compressed }));
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      title: product.title,
      category: product.category,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
      sizesText: product.sizes.join(', '),
      image: product.image,
      description: product.description,
      inStock: product.inStock,
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    const numericPrice = Math.max(0, Number(productForm.price) || 0);
    const numericCompare = Number(productForm.compareAtPrice) || 0;
    const sizes = productForm.sizesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Product = {
      id: editingProductId ?? `aw-${Date.now()}`,
      title: productForm.title.trim(),
      category: productForm.category,
      price: numericPrice,
      compareAtPrice: numericCompare > numericPrice ? numericCompare : undefined,
      sizes: sizes.length > 0 ? sizes : ['Standard'],
      image:
        productForm.image.trim() ||
        '/src/assets/images/product_canvas_tote_bag_1795113650171.jpg',
      description: productForm.description.trim() || 'Crafted by AlfaWear Gujrat.',
      inStock: productForm.inStock,
    };

    const nextProducts = editingProductId
      ? storeData.products.map((p) => (p.id === editingProductId ? payload : p))
      : [payload, ...storeData.products];

    onUpdateStore({ ...storeData, products: nextProducts });
    setShowProductForm(false);
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    notifySaved(editingProductId ? 'Product updated.' : 'New product added to store.');
  };

  const handleDeleteProduct = (id: string) => {
    const nextProducts = storeData.products.filter((p) => p.id !== id);
    onUpdateStore({ ...storeData, products: nextProducts });
    notifySaved('Product removed.');
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(storeData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alfawear-store-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as StoreData;
        if (Array.isArray(parsed.products) && parsed.payment && parsed.social && parsed.content) {
          onUpdateStore({
            ...DEFAULT_STORE_DATA,
            ...parsed,
          });
          notifySaved('Store backup imported successfully.');
        }
      } catch {
        notifySaved('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-[75vh] bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl bg-white border border-rose-100 shadow-lg p-7 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </button>
            <AlfaWearLogo size={48} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
              AlfaWear Admin Access
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage products, payment details, social links, and hero banner content.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-rose-50/80 border border-rose-100">
            <button
              type="button"
              onClick={() => {
                setLoginMode('email');
                setAuthError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                loginMode === 'email'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-[#1A1A1A]'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('pin');
                setAuthError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                loginMode === 'pin'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-[#1A1A1A]'
              }`}
            >
              Owner Quick PIN
            </button>
          </div>

          {authError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMode === 'email' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Authorized Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  4-Digit Owner Fallback PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 text-base tracking-widest text-[#1A1A1A] tabular-nums focus:border-rose-400 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[46px] rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              Sign In to Admin Panel
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] bg-rose-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Admin Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white border border-rose-100 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <AlfaWearLogo size={54} className="shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A]">
                AlfaWear Admin Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Signed in as <strong className="text-rose-600">{storeData.admin.email}</strong> · Changes save automatically
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>View Storefront</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-semibold transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Save Notification */}
        {statusMessage && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'products', label: 'Products Catalog', icon: Package, color: 'bg-rose-500 text-white' },
            { id: 'payment', label: 'Payment Details', icon: CreditCard, color: 'bg-emerald-600 text-white' },
            { id: 'social', label: 'Social Links', icon: Share2, color: 'bg-orange-500 text-white' },
            { id: 'content', label: 'Hero & Announcement', icon: Megaphone, color: 'bg-pink-600 text-white' },
            { id: 'security', label: 'Access & Backup', icon: KeyRound, color: 'bg-amber-500 text-white' },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? tab.color
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  Store Products ({storeData.products.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Add, edit, upload images, adjust PKR prices, or remove items across all categories.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewProduct}
                className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {showProductForm && (
              <form
                onSubmit={handleSaveProduct}
                className="rounded-3xl bg-white border border-rose-200 p-6 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {editingProductId ? 'Edit Product' : 'Create New Product'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-rose-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.title}
                      onChange={(e) =>
                        setProductForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="e.g. Classic Wolf Canvas Tote"
                      className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          category: e.target.value as ProductCategory,
                        }))
                      }
                      className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm focus:border-rose-400 focus:outline-none"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm((prev) => ({ ...prev, price: e.target.value }))
                      }
                      placeholder="2450"
                      className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm tabular-nums focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Original / Compare Price (Optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={productForm.compareAtPrice}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          compareAtPrice: e.target.value,
                        }))
                      }
                      placeholder="2950"
                      className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm tabular-nums focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={productForm.sizesText}
                      onChange={(e) =>
                        setProductForm((prev) => ({ ...prev, sizesText: e.target.value }))
                      }
                      placeholder="S, M, L, XL"
                      className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Product Image URL
                      </label>
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) =>
                          setProductForm((prev) => ({ ...prev, image: e.target.value }))
                        }
                        placeholder="https://... or upload image below"
                        className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm focus:border-rose-400 focus:outline-none"
                      />
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors">
                      <ImagePlus className="h-4 w-4" />
                      <span>Upload Product Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Fabric quality, fit, dimensions, or artwork details..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) =>
                        setProductForm((prev) => ({ ...prev, inStock: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Available In Stock</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="min-h-[42px] px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                    >
                      {editingProductId ? 'Save Changes' : 'Publish Product'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeData.products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
                >
                  <div className="aspect-[4/3] bg-rose-50/40">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-600 uppercase">
                        {product.category}
                      </span>
                      <span className={product.inStock ? 'text-emerald-700 font-medium' : 'text-red-600 font-medium'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-sm font-extrabold text-[#1A1A1A] tabular-nums">
                      {formatPKR(product.price)}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      Sizes: {product.sizes.join(', ')}
                    </p>
                    <div className="mt-auto pt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[38px] rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100 text-xs font-semibold text-red-700 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENT INFO */}
        {activeTab === 'payment' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              notifySaved('Payment and delivery details updated.');
            }}
            className="rounded-3xl bg-white border border-slate-200 p-6 space-y-6"
          >
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                Payment & Delivery Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Shown to customers during WhatsApp Checkout when selecting Cash on Delivery or Advance Payment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeData.payment.codEnabled}
                  onChange={(e) =>
                    onUpdateStore({
                      ...storeData,
                      payment: { ...storeData.payment, codEnabled: e.target.checked },
                    })
                  }
                  className="h-4 w-4 text-emerald-600 rounded"
                />
                <span className="text-sm font-semibold text-emerald-900">
                  Enable Cash on Delivery (COD)
                </span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Delivery Fee (PKR)
                </label>
                <input
                  type="number"
                  value={storeData.payment.deliveryFee}
                  onChange={(e) =>
                    onUpdateStore({
                      ...storeData,
                      payment: {
                        ...storeData.payment,
                        deliveryFee: Math.max(0, Number(e.target.value) || 0),
                      },
                    })
                  }
                  className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Free Delivery Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={storeData.payment.freeDeliveryThreshold}
                  onChange={(e) =>
                    onUpdateStore({
                      ...storeData,
                      payment: {
                        ...storeData.payment,
                        freeDeliveryThreshold: Math.max(0, Number(e.target.value) || 0),
                      },
                    })
                  }
                  className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
              <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                <h3 className="text-sm font-bold text-emerald-900">EasyPaisa Details</h3>
                <input
                  type="text"
                  value={storeData.payment.easypaisaTitle}
                  onChange={(e) =>
                    onUpdateStore({
                      ...storeData,
                      payment: { ...storeData.payment, easypaisaTitle: e.target.value },
                    })
                  }
                  placeholder="Account Title"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />
                <input
                  type="text"
                  value={storeData.payment.easypaisaNumber}
                  onChange={(e) =>
                    onUpdateStore({
                      ...storeData,
                      payment: { ...storeData.payment, easypaisaNumber: e.target.value },
                    })
                  }
                  placeholder="EasyPaisa Number"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
