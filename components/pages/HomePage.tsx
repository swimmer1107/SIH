import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Page } from '../../types';
import { useLanguage } from '../LanguageProvider';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <Card className="text-center h-full">
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-gray-700 mb-4">
        {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </Card>
);

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4zm6-8a2 2 0 100-4 2 2 0 000 4zm-12 0a2 2 0 100-4 2 2 0 000 4z" /></svg>,
      title: t('home.feature.farming.title'),
      description: t('home.feature.farming.desc')
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      title: t('home.feature.chatbot.title'),
      description: t('home.feature.chatbot.desc')
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: t('home.feature.disease.title'),
      description: t('home.feature.disease.desc')
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
      title: t('home.feature.weather.title'),
      description: t('home.feature.weather.desc')
    }
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-12">
        <div 
          className="absolute inset-0 -z-10 h-[600px] w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {t('home.hero.title')}{' '}<span className="text-primary-600 dark:text-primary-400">{t('home.hero.title.highlight')}</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
          {t('home.hero.subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={() => setCurrentPage(Page.Dashboard)} variant="primary" className="w-full sm:w-auto">
            {t('home.hero.button.demo')}
          </Button>
          <Button onClick={() => setCurrentPage(Page.Contact)} variant="outline" className="w-full sm:w-auto">
            {t('home.hero.button.contact')}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{t('home.features.title')}</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t('home.features.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-primary-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <span className="block text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400">30%</span>
              <span className="mt-2 block text-lg font-medium text-gray-700 dark:text-gray-200">{t('home.impact.yield.title')}</span>
            </div>
            <div>
              <span className="block text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400">40%</span>
              <span className="mt-2 block text-lg font-medium text-gray-700 dark:text-gray-200">{t('home.impact.water.title')}</span>
            </div>
            <div>
              <span className="block text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400">70%</span>
              <span className="mt-2 block text-lg font-medium text-gray-700 dark:text-gray-200">{t('home.impact.scouting.title')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;