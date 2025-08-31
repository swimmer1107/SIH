import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { getGovernmentSchemes } from '../../services/geminiService';
import { Scheme } from '../../types';
import { useLanguage } from '../LanguageProvider';

const SchemeCard: React.FC<{ scheme: Scheme }> = ({ scheme }) => (
  <Card className="flex flex-col h-full">
    <div className="flex-grow">
      <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-secondary-800 bg-secondary-100 dark:text-secondary-100 dark:bg-secondary-900/50 rounded-full uppercase">
        {scheme.category}
      </span>
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{scheme.title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{scheme.description}</p>
      <p className="mt-4 text-sm text-gray-800 dark:text-gray-200"><span className="font-semibold">Eligibility:</span> {scheme.eligibility}</p>
    </div>
    <div className="mt-6">
      <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
        Learn More &rarr;
      </a>
    </div>
  </Card>
);

const SkeletonCard = () => (
    <Card className="flex flex-col h-full animate-pulse">
        <div className="flex-grow">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
             <div className="mt-4 h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
             <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="mt-6">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
    </Card>
);


const SchemesPage: React.FC = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  
  useEffect(() => {
    const fetchSchemes = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedSchemes = await getGovernmentSchemes();
            setSchemes(fetchedSchemes);
        } catch (err: any) {
            setError(t(err.message) || 'An unknown error occurred while fetching schemes.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchSchemes();
  }, [t]);

  const categories = ['All', ...Array.from(new Set(schemes.map(s => s.category)))];
  
  const filteredSchemes = filter === 'All' 
    ? schemes
    : schemes.filter(scheme => scheme.category === filter);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('schemes.title')}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          {t('schemes.subtitle')}
        </p>
      </div>

      {!isLoading && schemes.length > 0 && (
         <div className="flex justify-center flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'All' ? t('all') : category}
              </button>
            ))}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      )}

      {error && !isLoading && (
        <Card className="max-w-2xl mx-auto border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-300 font-semibold">{t('schemes.error.prefix')}</p>
            <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchemes.map((scheme, index) => (
            <SchemeCard key={index} scheme={scheme} />
            ))}
        </div>
      )}
    </div>
  );
};

export default SchemesPage;