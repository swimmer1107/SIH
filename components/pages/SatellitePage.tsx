import React from 'react';
import Card from '../ui/Card';
import { useLanguage } from '../LanguageProvider';

const SatelliteIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.758 4.586a10.001 10.001 0 00-4.697 3.31M19.945 11c.05.32.055.644.055.972 0 5.253-4.247 9.528-9.5 9.528S1 17.225 1 11.972c0-.328.005-.652.055-.972m18.89 0A10.001 10.001 0 0016.242 4.586" />
  </svg>
);

const SatellitePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-3xl mx-auto text-center">
        <div className="p-6 md:p-10">
          <SatelliteIcon className="mx-auto h-16 w-16 text-primary-500 dark:text-primary-400" />
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t('satellite.title')}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-secondary-500 dark:text-secondary-400">
            {t('satellite.comingSoon')}
          </p>
          <p className="mt-6 max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            {t('satellite.desc')}
          </p>
          <div className="mt-8 h-2 w-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto animate-pulse"></div>
        </div>
      </Card>
    </div>
  );
};

export default SatellitePage;