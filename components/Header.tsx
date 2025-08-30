import React, { useState } from 'react';
import { Page } from '../types';
import { NAV_LINKS } from '../constants';
import Button from './ui/Button';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAuthenticated: boolean;
  handleLogout: () => void;
  setSidebarOpen: (update: (isOpen: boolean) => boolean) => void;
}

const LeafIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.9999 1.5C11.9999 1.5 5.43994 4.859 3.41194 11.234C1.38394 17.609 8.24994 22.5 11.9999 22.5C15.7499 22.5 22.6159 17.609 20.5879 11.234C18.5599 4.859 11.9999 1.5 11.9999 1.5Z" />
    </svg>
);

const SunIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12,9c-1.65,0-3,1.35-3,3s1.35,3,3,3s3-1.35,3-3S13.65,9,12,9z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5 S14.76,17,12,17z M12,3c0.55,0,1-0.45,1-1V1c0-0.55-0.45-1-1-1S11,0.45,11,1v1C11,2.55,11.45,3,12,3z M12,21c-0.55,0-1,0.45-1,1v1 c0,0.55,0.45,1,1,1s1-0.45,1-1v-1C13,21.45,12.55,21,12,21z M20.44,4.22c0.2,0.2,0.51,0.2,0.71,0l0.71-0.71 c0.2-0.2,0.2-0.51,0-0.71l0,0c-0.2-0.2-0.51-0.2-0.71,0l-0.71,0.71C20.24,4.02,20.24,4.33,20.44,4.22z M3.56,19.78 c-0.2-0.2-0.51-0.2-0.71,0l-0.71,0.71c-0.2,0.2-0.2,0.51,0,0.71l0,0c0.2,0.2,0.51,0.2,0.71,0l0.71-0.71 C3.76,20.29,3.76,19.98,3.56,19.78z M21.66,20.44c0.2-0.2,0.2-0.51,0-0.71l-0.71-0.71c-0.2-0.2-0.51-0.2-0.71,0l0,0 c-0.2,0.2-0.2,0.51,0,0.71l0.71,0.71C21.15,20.64,21.46,20.64,21.66,20.44z M3.56,4.22c0.2,0.2,0.51,0.2,0.71,0l0.71-0.71 c0.2-0.2,0.2-0.51,0-0.71l0,0c-0.2-0.2-0.51-0.2-0.71,0l-0.71,0.71C3.36,4.02,3.36,4.33,3.56,4.22z M23,11h-1c-0.55,0-1,0.45-1,1 s0.45,1,1,1h1c0.55,0,1-0.45,1-1S23.55,11,23,11z M1,11H2c0.55,0,1,0.45,1,1s-0.45,1-1,1H1c-0.55,0-1-0.45-1-1S0.45,11,1,11z"/>
    </svg>
);

const MoonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.3,4.9C10.1,4.9,8,6.8,8,9.1c0,1.3,0.6,2.4,1.5,3.2c-0.1,0-0.2,0-0.3,0c-3.3,0-6,2.7-6,6s2.7,6,6,6 c2.6,0,4.9-1.7,5.7-4.1C16,20.6,17,19,17,17.2c0-2.3-2.1-4.2-4.7-4.2C12.3,13,12.3,13,12.3,13C11.5,12.2,11,11,11,9.8 c0-1.3,1-2.4,2.3-2.4c0.5,0,0.9,0.1,1.3,0.4C13.9,6.2,12.4,4.9,10.5,4.9L12.3,4.9z"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, theme, toggleTheme, isAuthenticated, handleLogout, setSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = NAV_LINKS.filter(link => [Page.Home, Page.About, Page.Contact].includes(link.name));

  return (
    <>
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             {isAuthenticated && (
                 <button className="p-2 -ml-2 mr-2 text-gray-600 dark:text-gray-300" onClick={() => setSidebarOpen(isOpen => !isOpen)} aria-label="Open sidebar">
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                 </button>
             )}
             <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Home); }} className="flex items-center space-x-2">
               <LeafIcon className="h-8 w-8 text-primary-600" />
               <span className="text-2xl font-bold text-gray-800 dark:text-white">CropGuru</span>
             </a>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
             {isAuthenticated ? (
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden md:block">
                    {currentPage}
                </h1>
             ) : (
                <div className="hidden md:flex items-baseline space-x-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={(e) => { e.preventDefault(); setCurrentPage(link.name); }}
                      className={`relative px-2 py-2 text-sm font-medium transition-colors ${
                        currentPage === link.name
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      }`}
                    >
                      {link.name}
                      {currentPage === link.name && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                      )}
                    </a>
                  ))}
                </div>
             )}
          </div>
          
          <div className="flex items-center">
             <button onClick={toggleTheme} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary-500">
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
             </button>
             
             {!isAuthenticated && (
                <>
                  <div className="hidden md:flex items-center ml-4 space-x-2">
                      <Button onClick={() => setCurrentPage(Page.Login)} variant="outline" size="sm">Login</Button>
                      <Button onClick={() => setCurrentPage(Page.SignUp)} variant="primary" size="sm">Sign Up</Button>
                  </div>
                  <div className="ml-2 -mr-2 flex md:hidden">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
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
            className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            role="dialog"
            aria-modal="true"
            >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Home); setIsMenuOpen(false); }} className="flex items-center space-x-2">
                <LeafIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-800 dark:text-white">CropGuru</span>
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
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                    >
                        {link.name}
                    </a>
                    ))}
                </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                
                    <Button onClick={() => { setCurrentPage(Page.Login); setIsMenuOpen(false); }} variant="outline" size="sm" className="w-full">Login</Button>
                    <Button onClick={() => { setCurrentPage(Page.SignUp); setIsMenuOpen(false); }} variant="primary" size="sm" className="w-full">Sign Up</Button>

                </div>
            </nav>
            </div>
        </>
    )}
    </>
  );
};

export default Header;