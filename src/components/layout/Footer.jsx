import { useLanguage } from '../../context/LanguageContext';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-gray-200">Nowshin</span>
              <span className="text-blue-400"> Fashion</span>
              <span className="text-gray-200"> House</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your destination for authentic Bengali fashion. Experience the finest collection 
              of traditional and contemporary wear.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('header.products')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('categories.sari')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('categories.threePiece')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('categories.shirt')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('categories.panjabi')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('footer.contactUs')}
            </h4>

            <div className="space-y-2 text-sm text-gray-300">
              <p>📞 Phone: 01946223113</p>
              <p>📧 Email: info@nowshinfashion.com</p>
              <p>📍 Address: Dhaka, Bangladesh</p>
            </div>

            <div className="mt-4 space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                {t('footer.aboutUs')}
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                {t('footer.privacyPolicy')}
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center space-y-2">
          
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Nowshin Fashion House. {t('footer.rights')}
          </p>

          <p className="text-gray-400 text-xs tracking-wide">
            Powered by{' '}
            <a
              href="https://insafwebsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              INSAF WEB SOLUTION
            </a>
          </p>

        </div>
      </div>
    </footer>
  );
}
