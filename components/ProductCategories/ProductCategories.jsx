import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Panjabi SVG Icon Component
const PanjabiIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16">
    <path d="M32 4L28 8V16L20 20V24L18 26V30L16 32V56H48V32L46 30V26L44 24V20L36 16V8L32 4Z" strokeWidth="2" stroke="currentColor" fill="none"/>
    <path d="M28 8H36" strokeWidth="2" stroke="currentColor"/>
    <circle cx="32" cy="12" r="2" fill="currentColor"/>
    <path d="M24 40H40" strokeWidth="1.5" stroke="currentColor" opacity="0.5"/>
    <path d="M26 46H38" strokeWidth="1.5" stroke="currentColor" opacity="0.5"/>
  </svg>
);

const categories = [
  {
    id: 'sari',
    emoji: '🥻',
    gradient: 'from-rose-400 to-pink-500'
  },
  {
    id: 'threePiece',
    emoji: '👗',
    gradient: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'panjabi',
    emoji: 'Panjabi',
    gradient: 'from-amber-400 to-orange-500',
    isCustomIcon: true
  },
  {
    id: 'pants',
    emoji: '👖',
    gradient: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'tshirts',
    emoji: '👕',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    id: 'babyProducts',
    emoji: '🧸',
    gradient: 'from-pink-300 to-rose-400'
  },
  {
    id: 'shoes',
    emoji: '👟',
    gradient: 'from-gray-400 to-gray-600'
  },
  {
    id: 'watches',
    emoji: '⌚',
    gradient: 'from-yellow-400 to-amber-500'
  }
];

export default function ProductCategories() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            {t('categories.title')}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              to={`/products/${category.id}`}
              key={category.id}
              className="group bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer block"
            >
              <div className={`bg-gradient-to-br ${category.gradient} p-8 h-40 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                {category.isCustomIcon ? (
                  <div className="text-white transform group-hover:scale-110 transition-transform duration-500">
                    <PanjabiIcon />
                  </div>
                ) : (
                  <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                    {category.emoji}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-charcoal mb-1 group-hover:text-blue-600 transition-colors">
                  {t(`categories.${category.id}`)}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {t(`categories.${category.id}Desc`)}
                </p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                  <span>{t('categories.viewAll')}</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
