import React from 'react';
import Card from '../ui/Card';
import { useLanguage } from '../LanguageProvider';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{t('about.title')}</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          {t('about.subtitle')}
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">{t('about.mission.title')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {t('about.mission.desc')}
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">{t('about.vision.title')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
         {t('about.vision.desc')}
        </p>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">{t('about.team.title')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t('about.team.desc')}
        </p>
      </Card>
    </div>
  );
};

export default AboutPage;