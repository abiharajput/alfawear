import { useEffect, useMemo, useState } from 'react';
import {
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import {
  BRAND_CONTACT,
  PRODUCT_CATEGORIES,
  buildWhatsAppLink,
  loadStoreData,
  saveStoreData,
} from './data/defaultStore';
import { CartItem, CheckoutOrderLine, NavSection, Product, ProductCategory, StoreData } from './types';
import { AlfaWearLogo } from './components/AlfaWearLogo';
import { SocialButtons } from './components/SocialButtons';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminPanel } from './components/AdminPanel';

const NAV_ITEMS: NavSection[] = [
  'Home',
  'Men',
  'Women',
  'Kids',
  'Accessories',
  'Tote Bags',
  'Art Work',
  'Admin Access',
];

const CATEGORY_ACCENT: Record<'All' | ProductCategory, string> = {
  All: 'bg-rose-500 text-white border-rose-500',
  Men: 'bg-orange-500 text-white border-orange-500',
  Women: 'bg-pink-500 text-white border-pink-500',
  Kids: 'bg-amber-400 text-[#1A1A1A] border-amber-400',
  Accessories: 'bg-emerald-600 text-white border-emerald-600',
  'Tote Bags': 'bg-rose-500 text-white border-rose-500',
  'Art Work': 'bg-red-500 text-white border-red-500',
};

export default function App() {
  const [storeData, setStoreData] = useState<StoreData>(() => loadStoreData());
  const [activeNav, setActiveNav] = useState<NavSection>('Home');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem('alfawear_cart_v1');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [policyOpen, setPolicyOpen] = useState(false);

  const [checkoutState, setCheckoutState] = useState<{
    isOpen: boolean;
    directItem: { product: Product; size: string; quantity: number } | null;
  }>({ isOpen: false, directItem: null });

  useEffect(() => {
    saveStoreData(storeData);
  }, [storeData]);

  useEffect(() => {
    try {
      window.localStorage.setItem('alfawear_cart_v1', JSON.stringify(cart));
    } catch {
      // Ignore storage error
    }
  }, [cart]);

  const isAdminView = activeNav === 'Admin Access';

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return storeData.products.filter((product) => {
      const matchesCat =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesQuery =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [storeData.products, selectedCategory, searchQuery]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (section: NavSection) => {
    setActiveNav(section);
    setMobileMenuOpen(false);
    if (section === 'Admin Access') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (section === 'Home') {
      setSelectedCategory('All');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSelectedCategory(section);
    window.setTimeout(() => {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleAddToCart = (product: Product, size: string, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (idx > -1) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, selectedSize: size, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.selectedSize === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  const handleDirectWhatsAppOrder = (product: Product, size: string, quantity = 1) => {
    setCheckoutState({
      isOpen: true,
      directItem: { product, size, quantity },
    });
  };

  const cartLines: CheckoutOrderLine[] = cart.map((item) => ({
    productId: item.product.id,
    title: item.product.title,
    category: item.product.category,
    size: item.selectedSize,
    quantity: item.quantity,
    unitPrice: item.product.price,
  }));

  const stickyWhatsAppUrl = buildWhatsAppLink(
    storeData.social.whatsappUrl,
    'Assalam-o-Alaikum AlfaWear! I am browsing your online store and would like assistance.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A]">
      {/* Slim Dismissible Announcement Bar */}
      {storeData.content.announcementEnabled && !announcementDismissed && !isAdminView && (
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white px-4 py-1.5 text-xs font-medium">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
            <span className="truncate mx-auto text-center">
              {storeData.content.announcementText}
            </span>
            <button
              type="button"
              onClick={() => setAnnouncementDismissed(true)}
              aria-label="Dismiss announcement"
              className="p-0.5 rounded hover:bg-white/20 transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bright Light Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Centered Brand Row */}
          <div className="grid grid-cols-[44px_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center py-2.5 gap-3">
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-rose-50"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {/* Centered Prominent Brand Logo + Name */}
            <button
              type="button"
              onClick={() => handleNavClick('Home')}
              className="inline-flex items-center justify-center gap-3 justify-self-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500 rounded-xl"
            >
              <AlfaWearLogo size={58} />
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
                AlfaWear
              </span>
            </button>

            {/* Right Action Zone */}
            <div className="flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span>Bag</span>
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-rose-500 px-1.5 text-[11px] font-bold text-white tabular-nums">
                  {totalCartItems}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Centered Navigation Row */}
          <nav
            aria-label="Primary categories"
            className="hidden lg:flex items-center justify-center gap-6 py-2 border-t border-rose-100/70 text-sm font-medium text-slate-600"
          >
            {NAV_ITEMS.map((item) => {
              const isCurrent =
                activeNav === item ||
                (!isAdminView && item === selectedCategory);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isCurrent
                      ? 'border-rose-500 text-rose-600 font-semibold'
                      : 'border-transparent hover:text-[#1A1A1A] hover:border-rose-200'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="lg:hidden border-t border-rose-100 bg-white px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            {NAV_ITEMS.map((item) => {
              const isCurrent = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                    isCurrent
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-50/50 text-slate-700 hover:bg-rose-100'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {isAdminView ? (
          <AdminPanel
            storeData={storeData}
            onUpdateStore={setStoreData}
            onExitAdmin={() => handleNavClick('Home')}
          />
        ) : (
          <>
            {/* Bright Fashion Hero Banner */}
            <section className="bg-gradient-to-br from-white via-[#FFF9FA] to-amber-50/50 border-b border-rose-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                  {/* Left Narrative Column */}
                  <div className="lg:col-span-6 flex flex-col justify-center gap-5">
                    <div className="flex flex-col items-center justify-center text-center gap-2.5 w-full">
                      <div className="flex flex-col items-center gap-1.5">
                        <AlfaWearLogo size={96} className="shrink-0" />
                        <span className="font-display text-lg font-extrabold tracking-tight text-[#1A1A1A]">
                          AlfaWear
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-black tracking-wide uppercase">
                        {storeData.content.heroKicker}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-[#1A1A1A] leading-[1.06] text-balance">
                        {storeData.content.heroHeadline}
                      </h1>
                      <p className="font-display text-lg sm:text-xl font-bold text-rose-600 tracking-wide">
                        {storeData.content.heroTagline}
                      </p>
                    </div>

                    <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                      {storeData.content.heroSubtext}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href="#catalog"
                        onClick={() => setSelectedCategory('All')}
                        className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold tracking-wide shadow-sm transition-all whitespace-nowrap shrink-0"
                      >
                        {storeData.content.primaryCtaText}
                      </a>
                      <a
                        href="#catalog"
                        onClick={() => setSelectedCategory('Tote Bags')}
                        className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-xl border-2 border-orange-400 bg-white hover:bg-orange-50 text-[#1A1A1A] text-sm font-bold tracking-wide transition-colors whitespace-nowrap shrink-0"
                      >
                        {storeData.content.secondaryCtaText}
                      </a>
                    </div>

                    {/* Prominent Main Dashboard Social Buttons */}
                    <div className="pt-3 border-t border-rose-100/80 space-y-2">
                      <span className="block text-xs font-semibold text-slate-500">
                        Connect with AlfaWear Official
                      </span>
                      <SocialButtons social={storeData.social} variant="compact" />
                    </div>
                  </div>

                  {/* Right Lookbook Visual */}
                  <div className="lg:col-span-6">
                    <div className="h-full min-h-[280px] sm:min-h-[380px] rounded-3xl overflow-hidden border border-rose-100 bg-rose-50/40 shadow-sm">
                      <img
                        src="/src/assets/images/hero_alfawear_fashion_1795113647246.jpg"
                        alt="AlfaWear Pakistani fashion apparel and canvas tote bag lookbook"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Catalog & Category Filter Section */}
            <section id="catalog" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="mx-auto max-w-7xl space-y-8">
                {/* Filter Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                      {selectedCategory === 'All'
                        ? 'AlfaWear Collection'
                        : `${selectedCategory} Collection`}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Showing <span className="font-semibold tabular-nums text-[#1A1A1A]">{filteredProducts.length}</span>{' '}
                      {filteredProducts.length === 1 ? 'item' : 'items'} · Order directly on WhatsApp or add to bag
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full lg:w-80">
                    <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search kurtis, hoodies, totes, art..."
                      aria-label="Search AlfaWear products"
                      className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-rose-50/30 pl-10 pr-4 text-sm text-[#1A1A1A] placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Colorful Category Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {(['All', ...PRODUCT_CATEGORIES] as const).map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? CATEGORY_ACCENT[cat]
                            : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50/60'
                        }`}
                      >
                        {cat === 'All' ? 'All Items' : cat}
                      </button>
                    );
                  })}
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="rounded-3xl border border-rose-100 bg-rose-50/30 py-16 px-6 text-center space-y-3">
                    <p className="text-lg font-bold text-[#1A1A1A]">
                      No products matched your search
                    </p>
                    <p className="text-sm text-slate-500">
                      Try clearing your search filter or browsing another AlfaWear category.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchQuery('');
                      }}
                      className="mt-2 min-h-[42px] px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors"
                    >
                      Show All Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(p, size) => handleAddToCart(p, size, 1)}
                        onOrderWhatsApp={(p, size) => handleDirectWhatsAppOrder(p, size, 1)}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Brand Trust & Gujrat Studio Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FFF9FA] border-t border-rose-100">
              <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-white border border-rose-100 p-6 space-y-2">
                  <Truck className="h-6 w-6 text-rose-500" aria-hidden="true" />
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    Nationwide Pakistan Delivery
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dispatched directly from Gujrat, Punjab. Free shipping above{' '}
                    <span className="tabular-nums font-semibold">
                      PKR {storeData.payment.freeDeliveryThreshold.toLocaleString('en-PK')}
                    </span>{' '}
                    with Cash on Delivery, EasyPaisa, JazzCash, and Bank Transfer.
                  </p>
                </div>

                <div className="rounded-2xl bg-white border border-emerald-100 p-6 space-y-2">
                  <MessageCircle className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    Instant WhatsApp Ordering
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Skip complicated checkouts. Send your cart or single item straight to{' '}
                    <strong className="tabular-nums">{BRAND_CONTACT.phoneDisplay}</strong> and confirm within minutes.
                  </p>
                </div>

                <div className="rounded-2xl bg-white border border-amber-100 p-6 space-y-2">
                  <ShieldCheck className="h-6 w-6 text-orange-500" aria-hidden="true" />
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    48-Hour Replacement Guarantee
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Damaged, defective, or wrong item? Report within 48 hours on WhatsApp with photo proof for fast replacement.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPolicyOpen(true)}
                    className="text-xs font-bold text-rose-600 hover:underline pt-1"
                  >
                    Read Replacement Policy
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Bright Light Footer */}
      <footer className="bg-rose-50/60 border-t border-rose-100 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <AlfaWearLogo size={56} className="shrink-0" />
                <div>
                  <span className="font-display text-xl font-extrabold text-[#1A1A1A] block">
                    AlfaWear
                  </span>
                  <span className="text-xs font-bold tracking-wider text-rose-600">
                    {BRAND_CONTACT.tagline}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                Contemporary Pakistani fashion for Men, Women & Kids, canvas Tote Bags, Accessories, and curated Art Work.
              </p>
              <SocialButtons social={storeData.social} variant="compact" />
            </div>

            {/* Categories Column */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Shop Categories
              </h3>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm font-medium text-slate-700">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(cat)}
                      className="hover:text-rose-600 transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Policies Column */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Contact & Studio Address
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-1" aria-hidden="true" />
                  <span>{BRAND_CONTACT.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <a
                    href={stickyWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold tabular-nums hover:text-emerald-700"
                  >
                    {BRAND_CONTACT.phoneDisplay} (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-orange-500 shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${BRAND_CONTACT.adminEmail}`}
                    className="hover:text-rose-600 break-all"
                  >
                    {BRAND_CONTACT.adminEmail}
                  </a>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPolicyOpen(true)}
                  className="text-rose-600 hover:underline"
                >
                  Replacement Policy
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('Admin Access')}
                  className="text-slate-600 hover:text-rose-600"
                >
                  Admin Access
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-rose-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 AlfaWear. All Rights Reserved.</p>
            <p>Gujrat, Punjab, Pakistan</p>
          </div>
        </div>
      </footer>

      {/* Sticky Floating WhatsApp Button */}
      <a
        href={stickyWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AlfaWear on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 shadow-lg transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline text-sm font-bold whitespace-nowrap">
          WhatsApp {BRAND_CONTACT.phoneDisplay}
        </span>
      </a>

      {/* Modals & Drawers */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onOrderWhatsApp={handleDirectWhatsAppOrder}
        />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        payment={storeData.payment}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutState({ isOpen: true, directItem: null });
        }}
      />

      {checkoutState.isOpen && (
        <WhatsAppCheckoutModal
          isOpen={checkoutState.isOpen}
          onClose={() => setCheckoutState({ isOpen: false, directItem: null })}
          directItem={checkoutState.directItem}
          cartLines={cartLines}
          payment={storeData.payment}
          social={storeData.social}
          onOrderPrepared={(clearCart) => {
            if (clearCart) {
              setCart([]);
            }
          }}
          onOpenPolicy={() => setPolicyOpen(true)}
        />
      )}

      <PolicyModal isOpen={policyOpen} onClose={() => setPolicyOpen(false)} />
    </div>
  );
}
