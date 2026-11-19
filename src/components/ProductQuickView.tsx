import { useState } from 'react';
import { ImageOff, MessageCircle, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../data/defaultStore';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onOrderWhatsApp: (product: Product, size: string, quantity: number) => void;
}

export function ProductQuickView({
  product,
  onClose,
  onAddToCart,
  onOrderWhatsApp,
}: ProductQuickViewProps) {
  const sizes = product?.sizes.length ? product.sizes : ['Standard'];
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const activeSize = sizes.includes(selectedSize) ? selectedSize : sizes[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-rose-100 shadow-xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          <div className="aspect-[4/3] md:aspect-auto bg-rose-50/40">
            {!imgError && product.image ? (
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-2 bg-rose-50/60 p-6 text-center">
                <ImageOff className="h-10 w-10 text-rose-300" />
                <span className="text-sm text-slate-500">{product.title}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-7 gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="uppercase tracking-wider text-rose-600">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className={product.inStock ? 'text-emerald-700' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h2 id="quickview-title" className="text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-snug">
              {product.title}
            </h2>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#1A1A1A] tabular-nums">
                {formatPKR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  {formatPKR(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-2">
                Available Sizes
              </span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      activeSize === size
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Quantity</span>
              <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="h-10 w-10 inline-flex items-center justify-center text-slate-600 hover:text-rose-600"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="h-10 w-10 inline-flex items-center justify-center text-slate-600 hover:text-rose-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-auto pt-3 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => {
                  onClose();
                  onOrderWhatsApp(product, activeSize, quantity);
                }}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white text-sm font-semibold transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Order Now on WhatsApp</span>
              </button>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => {
                  onAddToCart(product, activeSize, quantity);
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 text-rose-700 text-sm font-semibold transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
