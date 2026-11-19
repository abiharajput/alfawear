import { useState } from 'react';
import { Check, ImageOff, MessageCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../data/defaultStore';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onOrderWhatsApp: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onOrderWhatsApp,
  onQuickView,
}: ProductCardProps) {
  const sizes = product.sizes.length > 0 ? product.sizes : ['Standard'];
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const activeSize = sizes.includes(selectedSize) ? selectedSize : sizes[0];
  const hasDiscount =
    typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, activeSize);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      {/* Product Image */}
      <button
        type="button"
        onClick={() => onQuickView(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-rose-50/40 text-left focus-visible:outline-2 focus-visible:outline-rose-500"
        aria-label={`View details for ${product.title}`}
      >
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-4 text-center">
            <ImageOff className="h-8 w-8 text-rose-300" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500 line-clamp-1">{product.title}</span>
          </div>
        )}
      </button>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        {/* Clean Unboxed Metadata */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span className="uppercase tracking-wider text-rose-600">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className={product.inStock ? 'text-emerald-700' : 'text-red-600'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          {hasDiscount && (
            <span className="text-xs font-semibold text-red-600 tabular-nums">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="text-left focus-visible:outline-2 focus-visible:outline-rose-500 rounded"
          >
            <h3 className="text-base font-semibold text-[#1A1A1A] leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </button>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2.5 pt-0.5">
          <span className="text-lg font-bold text-[#1A1A1A] tabular-nums">
            {formatPKR(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through tabular-nums">
              {formatPKR(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Size Selector */}
        <div className="pt-1">
          <span className="block text-xs font-medium text-slate-500 mb-1.5">
            Select Size
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((size) => {
              const isSelected = activeSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-3 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => onOrderWhatsApp(product, activeSize)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Order on WhatsApp</span>
          </button>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAdd}
            className={`inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
              justAdded
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
