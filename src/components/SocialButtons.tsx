import { MessageCircle } from 'lucide-react';
import { SocialLinks } from '../types';
import { buildWhatsAppLink } from '../data/defaultStore';

interface SocialButtonsProps {
  social: SocialLinks;
  variant?: 'compact' | 'full';
}

export function SocialButtons({ social, variant = 'full' }: SocialButtonsProps) {
  const whatsappGreetingUrl = buildWhatsAppLink(
    social.whatsappUrl,
    'Assalam-o-Alaikum AlfaWear! I would like to know more about your collection.'
  );

  const items = [
    {
      name: 'Facebook',
      href: social.facebook || 'https://www.facebook.com/',
      bg: 'bg-[#1877F2] hover:bg-[#1465D1] text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.5-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2V11H7.5v3h2.6v8h3.4z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: social.instagram || 'https://www.instagram.com/',
      bg: 'bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      href: social.tiktok || 'https://www.tiktok.com/',
      bg: 'bg-white border border-rose-200 text-[#1A1A1A] hover:bg-rose-50',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28 6.34 6.34 0 0 0 9.34 21.62a6.34 6.34 0 0 0 6.34-6.34V8.81a8.18 8.18 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.86-.24z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: whatsappGreetingUrl,
      bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: <MessageCircle className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {items.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit AlfaWear on ${item.name}`}
          className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 whitespace-nowrap shrink-0 ${
            variant === 'compact' ? 'px-3 py-2 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm shadow-xs'
          } ${item.bg}`}
        >
          {item.icon}
          <span>{item.name}</span>
        </a>
      ))}
    </div>
  );
}
