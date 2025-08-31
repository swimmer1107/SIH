import React from 'react';
import { useLanguage } from './LanguageProvider';

const SocialIcon: React.FC<{ href: string, path: string }> = ({ href, path }) => (
    <a href={href} className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d={path} clipRule="evenodd" />
        </svg>
    </a>
);

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <SocialIcon href="#" path="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.95C18.05 21.45 22 17.5 22 12z" />
            <SocialIcon href="#" path="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.79 1.9 3.55-.7-.02-1.37-.22-1.95-.55v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.13 2.93 4 2.96-1.46 1.14-3.3 1.82-5.3 1.82-.34 0-.68-.02-1.01-.06 1.89 1.2 4.12 1.89 6.56 1.89 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
            <SocialIcon href="#" path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-8h2v8zm-1-9.5c-.69 0-1.25-.56-1.25-1.25S9.31 5 10 5s1.25.56 1.25 1.25S10.69 7.5 10 7.5zM15 17h-2v-4c0-1.1-.8-2-1.8-2-.9 0-1.2.7-1.2 1.4V17H8v-8h2v1c.5-.8 1.6-1.2 2.5-1.2C14.1 9 15 10.3 15 12v5z" />
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-500 dark:text-gray-400">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;