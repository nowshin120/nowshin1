import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const phoneNumber = '01946223113';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      title={t('whatsapp.chatWithUs')}
    >
      <div className="relative">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-charcoal text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {t('whatsapp.chatWithUs')}
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-charcoal transform rotate-45"></div>
          </div>
        </div>

        {/* Button */}
        <div className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 hover:shadow-xl">
          <MessageCircle size={28} />
        </div>

        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
      </div>
    </a>
  );
}
