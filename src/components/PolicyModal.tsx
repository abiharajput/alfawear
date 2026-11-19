import { MapPin, MessageCircle, ShieldCheck, X } from 'lucide-react';
import { BRAND_CONTACT, buildWhatsAppLink } from '../data/defaultStore';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PolicyModal({ isOpen, onClose }: PolicyModalProps) {
  if (!isOpen) return null;

  const claimUrl = buildWhatsAppLink(
    BRAND_CONTACT.whatsappBase,
    'Assalam-o-Alaikum AlfaWear! I would like to request a replacement within 48 hours of delivery. Attaching photo proof shortly.'
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-rose-100 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 id="policy-title" className="text-lg font-bold text-[#1A1A1A]">
              AlfaWear Replacement Policy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close replacement policy"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-rose-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            At <strong>AlfaWear</strong>, every apparel piece, tote bag, accessory, and framed artwork is inspected before dispatch. To keep exchanges fair and fast:
          </p>

          <ul className="space-y-2.5 list-disc pl-5">
            <li>
              Items are <strong>only replaced</strong> if received <strong>damaged, defective, or as the wrong size/item</strong>.
            </li>
            <li>
              Issues must be reported within <strong>48 hours of delivery</strong> on WhatsApp (
              <strong className="tabular-nums">{BRAND_CONTACT.phoneIntl}</strong>) with clear{' '}
              <strong>photo proof</strong> of the parcel and item.
            </li>
            <li>
              Items must remain unused, unwashed, and in original packaging with tags intact.
            </li>
          </ul>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3">
            <MapPin className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                Return & Dispatch Address
              </p>
              <p className="mt-0.5 text-sm font-medium text-[#1A1A1A]">
                {BRAND_CONTACT.shortAddress}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Report Issue on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
