
import React, { useState } from 'react';
import Card from '../ui/Card';
import { GOV_SCHEMES } from '../../constants';
import { Scheme } from '../../types';

const SchemeCard: React.FC<{ scheme: Scheme }> = ({ scheme }) => (
  <Card className="flex flex-col h-full">
    <div className="flex-grow">
      <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-secondary-800 bg-secondary-100 dark:text-secondary-100 dark:bg-secondary-800/50 rounded-full uppercase">
        {scheme.category}
      </span>
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{scheme.title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{scheme.description}</p>
      <p className="mt-4 text-sm"><span className="font-semibold">Eligibility:</span> {scheme.eligibility}</p>
    </div>
    <div className="mt-6">
      <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
        Learn More &rarr;
      </a>
    </div>
  </Card>
);

const SchemesPage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(GOV_SCHEMES.map(s => s.category)))];
  
  const filteredSchemes = filter === 'All' 
    ? GOV_SCHEMES 
    : GOV_SCHEMES.filter(scheme => scheme.category === filter);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Government Schemes & Benefits</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Stay updated with the latest government initiatives, subsidies, and alerts to support your farming.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              filter === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSchemes.map((scheme, index) => (
          <SchemeCard key={index} scheme={scheme} />
        ))}
      </div>
    </div>
  );
};

export default SchemesPage;
