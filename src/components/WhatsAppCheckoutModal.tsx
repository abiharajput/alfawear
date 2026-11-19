import { FormEvent, useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, ShieldCheck, X } from 'lucide-react';
import { CheckoutOrderLine, PaymentMethod, PaymentSettings, Product, SocialLinks } from '../types';
import { BRAND_CONTACT, buildWhatsAppLink, formatPKR } from '../data/defaultStore';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directItem?: {
    product: Product;
    size: string;
    quantity: number;
  } | null;
  cartLines: CheckoutOrderLine[];
  payment: PaymentSettings;
  social: SocialLinks;
  onOrderPrepared: (clearCart: boolean) => void;
  onOpenPolicy: () => void;
}

export function WhatsAppCheckoutModal({
  isOpen,
  onClose,
  directItem,
  cartLines,
  payment,
  social,
  onOrderPrepared,
  onOpenPolicy,
}: WhatsAppCheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [directSize, setDirectSize] = useState(directItem?.size ?? 'Standard');
  const [directQuantity, setDirectQuantity] = useState(directItem?.quantity ?? 1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    payment.codEnabled ? 'Cash on Delivery (COD)' : 'EasyPaisa'
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isDirectOrder = Boolean(directItem);
  const activeDirectSize = directItem
    ? directItem.product.sizes.includes(directSize)
      ? directSize
      : directItem.size
    : '';

  const orderLines: CheckoutOrderLine[] = directItem
    ? [
        {
          productId: directItem.product.id,
          title: directItem.product.title,
          category: directItem.product.category,
          size: activeDirectSize,
          quantity: directQuantity,
          unitPrice: directItem.product.price,
        },
      ]
    : cartLines;

  const subtotal = orderLines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );
  const deliveryFee =
    subtotal >= payment.freeDeliveryThreshold || orderLines.length === 0
      ? 0
      : payment.deliveryFee;
  const total = subtotal + deliveryFee;

  const paymentOptions: PaymentMethod[] = [
    ...(payment.codEnabled ? (['Cash on Delivery (COD)'] as PaymentMethod[]) : []),
    'EasyPaisa',
    'JazzCash',
    'Bank Transfer',
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setError('Please enter your name, phone number, city, and complete delivery address.');
      return;
    }
    setError('');

    const itemSummary = orderLines
      .map(
        (line, index) =>
          `${index + 1}. ${line.title} (${line.category}) — Size: ${line.size} × ${line.quantity} = ${formatPKR(
            line.unitPrice * line.quantity
          )}`
      )
      .join('\n');

    const message = [
      `*NEW ALFAWEAR ORDER*`,
      `Brand: AlfaWear (${BRAND_CONTACT.tagline})`,
      ``,
      `*Customer Details:*`,
      `Name: ${customerName.trim()}`,
      `Phone: ${phone.trim()}`,
      `City: ${city.trim()}`,
      `Address: ${address.trim()}`,
      ``,
      `*Order Items:*`,
      itemSummary,
      ``,
      `Subtotal: ${formatPKR(subtotal)}`,
      `Delivery: ${deliveryFee === 0 ? 'FREE' : formatPKR(deliveryFee)}`,
      `*Total Payable: ${formatPKR(total)}*`,
      `Payment Method: ${paymentMethod}`,
      notes.trim() ? `Notes: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    setPreparedMessage(message);
    onOrderPrepared(!isDirectOrder);
  };

  const whatsappUrl = preparedMessage
    ? buildWhatsAppLink(social.whatsappUrl, preparedMessage)
    : '#';

  const handleCopy = async () => {
    if (!preparedMessage) return;
    try {
      await navigator.clipboard.writeText(preparedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-heading"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl bg-white border border-rose-100 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-gradient-to-r from-rose-50 via-white to-amber-50">
          <div>
            <h2 id="checkout-heading" className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              {preparedMessage ? 'Order Ready to Send on WhatsApp' : 'WhatsApp Order Checkout'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fast nationwide delivery across Pakistan · WhatsApp {social.whatsappNumber || BRAND_CONTACT.phoneDisplay}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-rose-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {preparedMessage ? (
            <div className="space-y-5">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Your order summary is formatted and ready.</p>
                <p className="mt-1 text-emerald-800">
                  Click the button below to open WhatsApp with AlfaWear ({BRAND_CONTACT.phoneDisplay}) and tap Send to confirm your order.
                </p>
              </div>

              <pre className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                {preparedMessage}
              </pre>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Order on WhatsApp</span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setPreparedMessage(null)}
                  className="font-medium text-rose-600 hover:underline"
                >
                  Edit delivery details
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-medium text-slate-600 hover:underline"
                >
                  Return to store
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Order Summary Box */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Order Summary
                  </span>
                  <span className="text-sm font-bold text-[#1A1A1A] tabular-nums">
                    Total: {formatPKR(total)}
                  </span>
                </div>

                {directItem ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">
                        {directItem.product.title}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {formatPKR(directItem.product.price)} each · Delivery:{' '}
                        {deliveryFee === 0 ? 'Free' : formatPKR(deliveryFee)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={activeDirectSize}
                        onChange={(e) => setDirectSize(e.target.value)}
                        aria-label="Selected Size"
                        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700"
                      >
                        {(directItem.product.sizes.length
                          ? directItem.product.sizes
                          : ['Standard']
                        ).map((sz) => (
                          <option key={sz} value={sz}>
                            Size: {sz}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={25}
                        value={directQuantity}
                        onChange={(e) =>
                          setDirectQuantity(Math.max(1, Number(e.target.value) || 1))
                        }
                        aria-label="Quantity"
                        className="h-9 w-16 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 tabular-nums"
                      />
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    {orderLines.map((line) => (
                      <li
                        key={`${line.productId}-${line.size}`}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="truncate">
                          {line.title} ({line.size}) × {line.quantity}
                        </span>
                        <span className="font-semibold tabular-nums shrink-0">
                          {formatPKR(line.unitPrice * line.quantity)}
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-rose-100">
                      <span>Delivery Charges</span>
                      <span className="tabular-nums">
                        {deliveryFee === 0 ? 'Free' : formatPKR(deliveryFee)}
                      </span>
                    </li>
                  </ul>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Customer Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Gujrat, Lahore, Karachi"
                    className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Payment Preference *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                  >
                    {paymentOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Advance Payment Details */}
              {paymentMethod !== 'Cash on Delivery (COD)' && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs sm:text-sm text-slate-800 space-y-1">
                  <p className="font-semibold text-amber-900">
                    {paymentMethod} Account Details (Share screenshot on WhatsApp after transfer):
                  </p>
                  {paymentMethod === 'EasyPaisa' && (
                    <p>
                      Account Title: <strong>{payment.easypaisaTitle}</strong> · Number:{' '}
                      <strong className="tabular-nums">{payment.easypaisaNumber}</strong>
                    </p>
                  )}
                  {paymentMethod === 'JazzCash' && (
                    <p>
                      Account Title: <strong>{payment.jazzcashTitle}</strong> · Number:{' '}
                      <strong className="tabular-nums">{payment.jazzcashNumber}</strong>
                    </p>
                  )}
                  {paymentMethod === 'Bank Transfer' && (
                    <p>
                      Bank: <strong>{payment.bankName}</strong> · Title:{' '}
                      <strong>{payment.bankAccountTitle}</strong> · Account/IBAN:{' '}
                      <strong className="tabular-nums">{payment.bankAccountNumber}</strong>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Complete Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Street / Sector / Nearby Landmark"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Optional Delivery Note
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Preferred delivery timing or gift wrap request"
                  className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#1A1A1A] focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenPolicy}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>48-Hour Replacement Policy Applies</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Generate WhatsApp Order</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
