import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';

export default function Pagination({ page, pages, onChange }) {
  const { dir } = useLanguage();
  if (pages <= 1) return null;
  const range = Array.from({ length: Math.min(pages, 7) }, (_, i) => {
    if (pages <= 7) return i + 1;
    if (i === 0) return 1;
    if (i === 6) return pages;
    if (page <= 4) return i + 1;
    if (page >= pages - 3) return pages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5">
        <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
      </button>
      {range.map((p, i) => (
        <button key={i} onClick={() => p !== '...' && onChange(p)}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white shadow-glow' : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5'} ${p === '...' ? 'cursor-default' : ''}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === pages}
        className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5">
        <ChevronRightIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
