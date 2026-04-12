import { MessageCircle, PhoneCall, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const PHONE_NUMBER = '8801946223113';
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}`;
const MESSENGER_URL = 'https://m.me/nowshinfashionhouse';
const CALL_URL = 'tel:+8801946223113';

const CONTACT_ACTIONS = [
  {
    id: 'whatsapp',
    labelEn: 'WhatsApp',
    labelBn: 'হোয়াটসঅ্যাপ',
    href: WHATSAPP_URL,
    bgClass: 'bg-green-500 hover:bg-green-600',
    icon: MessageCircle,
  },
  {
    id: 'messenger',
    labelEn: 'Messenger',
    labelBn: 'মেসেঞ্জার',
    href: MESSENGER_URL,
    bgClass: 'bg-sky-500 hover:bg-sky-600',
    icon: Send,
  },
  {
    id: 'call',
    labelEn: 'Direct Call',
    labelBn: 'সরাসরি কল',
    href: CALL_URL,
    bgClass: 'bg-orange-500 hover:bg-orange-600',
    icon: PhoneCall,
  },
];

export default function WhatsAppButton() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const isEnglish = language === 'en';

  return (
    <div className="fixed bottom-28 right-4 z-50 md:bottom-6 md:right-6">
      <div className="flex flex-col items-end gap-3">
        {isOpen
          ? CONTACT_ACTIONS.map((action) => {
              const Icon = action.icon;
              const label = isEnglish ? action.labelEn : action.labelBn;

              return (
                <a
                  key={action.id}
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-3"
                  title={label}
                >
                  <span className="rounded-full bg-slate-950/88 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    {label}
                  </span>
                  <span
                    className={[
                      'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition-all duration-200 hover:scale-105',
                      action.bgClass,
                    ].join(' ')}
                  >
                    <Icon size={24} />
                  </span>
                </a>
              );
            })
          : null}

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className={[
            'relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_16px_36px_rgba(15,23,42,0.22)] transition-all duration-300 hover:scale-105',
            isOpen ? 'bg-slate-900 hover:bg-slate-800' : 'bg-emerald-500 hover:bg-emerald-600',
          ].join(' ')}
          aria-label={isOpen ? 'Close contact buttons' : t('whatsapp.chatWithUs')}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
          {!isOpen ? (
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 animate-ping" />
          ) : null}
        </button>
      </div>
    </div>
  );
}
