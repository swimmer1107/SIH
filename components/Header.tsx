import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { NAV_LINKS } from '../constants';
import Button from './ui/Button';
import { useLanguage } from './LanguageProvider';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isAuthenticated: boolean;
  handleLogout: () => void;
  setSidebarOpen: (update: (isOpen: boolean) => boolean) => void;
}

// --- ICONS ---
const LeafIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.9999 1.5C11.9999 1.5 5.43994 4.859 3.41194 11.234C1.38394 17.609 8.24994 22.5 11.9999 22.5C15.7499 22.5 22.6159 17.609 20.5879 11.234C18.5599 4.859 11.9999 1.5 11.9999 1.5Z" />
    </svg>
);
const SunIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const MoonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const GlobeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.758 4.586a10.001 10.001 0 00-4.697 3.31M19.945 11c.05.32.055.644.055.972 0 5.253-4.247 9.528-9.5 9.528S1 17.225 1 11.972c0-.328.005-.652.055-.972m18.89 0A10.001 10.001 0 0016.242 4.586" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, isAuthenticated, setSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = NAV_LINKS.filter(link => [Page.Home, Page.About, Page.Contact].includes(link.name));
  
  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             {isAuthenticated && (
                 <button className="p-2 -ml-2 mr-2 text-gray-500 dark:text-gray-300" onClick={() => setSidebarOpen(isOpen => !isOpen)} aria-label="Open sidebar">
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                 </button>
             )}
             <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Home); }} className="flex items-center space-x-2">
               <LeafIcon className="h-8 w-8 text-primary-600" />
               <span className="text-2xl font-bold text-gray-900 dark:text-white">{t('header.title')}</span>
             </a>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
             {isAuthenticated ? (
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 hidden md:block">
                    {t(currentPage)}
                </h1>
             ) : (
                <div className="hidden md:flex items-baseline space-x-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={(e) => { e.preventDefault(); setCurrentPage(link.name); }}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === link.name
                          ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t(link.name)}
                    </a>
                  ))}
                </div>
             )}
          </div>
          
          <div className="flex items-center space-x-2">
             <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-primary-500">
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
             </button>
             
             {/* Language Dropdown */}
             <div className="relative" ref={langMenuRef}>
                 <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-primary-500">
                     <GlobeIcon className="h-5 w-5" />
                 </button>
                 {isLangMenuOpen && (
                     <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-30">
                         {availableLanguages.map(lang => (
                             <a
                                 key={lang.code}
                                 href="#"
                                 onClick={(e) => {
                                     e.preventDefault();
                                     setLanguage(lang.code);
                                     setIsLangMenuOpen(false);
                                 }}
                                 className={`block px-4 py-2 text-sm ${language === lang.code ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                             >
                                 {lang.name}
                             </a>
                         ))}
                     </div>
                 )}
             </div>
             
             {!isAuthenticated && (
                <>
                  <div className="hidden md:flex items-center ml-2 space-x-2">
                      <Button onClick={() => setCurrentPage(Page.Login)} variant="outline" size="sm">{t('login')}</Button>
                      <Button onClick={() => setCurrentPage(Page.SignUp)} variant="primary" size="sm">{t('signup')}</Button>
                  </div>
                  <div className="ml-2 -mr-2 flex md:hidden">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none"
                      aria-label="Open menu"
                      aria-expanded={isMenuOpen}
                    >
                      <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                      </svg>
                    </button>
                  </div>
                </>
             )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu Sidebar - ONLY FOR UNAUTHENTICATED USERS */}
    {!isAuthenticated && (
        <>
            <div
            className={`fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300 md:hidden ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
            ></div>

            <div
            className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            role="dialog"
            aria-modal="true"
            >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Home); setIsMenuOpen(false); }} className="flex items-center space-x-2">
                <LeafIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-800 dark:text-white">{t('header.title')}</span>
                </a>
                <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close menu"
                >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <nav className="p-4 flex flex-col justify-between" style={{height: 'calc(100% - 73px)'}}>
                <div>
                <div className="space-y-1">
                    {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.path}
                        onClick={(e) => { e.preventDefault(); setCurrentPage(link.name); setIsMenuOpen(false); }}
                        className={`${
                        currentPage === link.name
                            ? 'bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                    >
                        {t(link.name)}
                    </a>
                    ))}
                </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                
                    <Button onClick={() => { setCurrentPage(Page.Login); setIsMenuOpen(false); }} variant="outline" size="sm" className="w-full">{t('login')}</Button>
                    <Button onClick={() => { setCurrentPage(Page.SignUp); setIsMenuOpen(false); }} variant="primary" size="sm" className="w-full">{t('signup')}</Button>

                </div>
            </nav>
            </div>
        </>
    )}
    </>
  );
};

export default Header;