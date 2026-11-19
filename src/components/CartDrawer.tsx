import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem, PaymentSettings } from '../types';
import { formatPKR } from '../data/defaultStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  payment: PaymentSettings;
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  payment,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const qualifiesFreeShipping = subtotal >= payment.freeDeliveryThreshold;
  const deliveryFee = items.length === 0 || qualifiesFreeShipping ? 0 : payment.deliveryFee;
  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, payment.freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
      <div
        className="flex h-full w-full max-w-md flex-col bg-white border-l border-rose-100 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/40">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-rose-600" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              Your Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-rose-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Delivery Progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-100 text-xs text-slate-700">
            {qualifiesFreeShipping ? (
              <span className="font-semibold text-emerald-700">
                Your order qualifies for Free Nationwide Delivery across Pakistan.
              </span>
            ) : (
              <span>
                Add <strong className="tabular-nums text-rose-600">{formatPKR(remainingForFree)}</strong> more for Free Nationwide Delivery.
              </span>
            )}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12 gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-[#1A1A1A]">Your bag is empty</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Browse Men, Women, Kids, Accessories, Tote Bags, or Art Work and add items to order smoothly on WhatsApp.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="flex gap-4 py-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-xl object-cover bg-rose-50 shrink-0 border border-slate-100"
                />
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">
                      {item.product.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      aria-label={`Remove ${item.product.title}`}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.product.category} · Size: <span className="font-semibold text-slate-700">{item.selectedSize}</span>
                  </p>

                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                        aria-label="Decrease quantity"
                        className="h-8 w-8 inline-flex items-center justify-center text-slate-600 hover:text-rose-600"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                        aria-label="Increase quantity"
                        className="h-8 w-8 inline-flex items-center justify-center text-slate-600 hover:text-rose-600"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#1A1A1A] tabular-nums">
                      {formatPKR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {items.length > 0 && (
          <div className="border-t border-rose-100 bg-rose-50/30 p-6 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-medium tabular-nums">
                  {deliveryFee === 0 ? 'Free' : formatPKR(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-rose-100">
                <span>Total Payable</span>
                <span className="tabular-nums">{formatPKR(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Place Order via WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
