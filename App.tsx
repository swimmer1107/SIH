import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import DashboardPage from './components/pages/DashboardPage';
import DiseaseDetectionPage from './components/pages/DiseaseDetectionPage';
import SchemesPage from './components/pages/SchemesPage';
import SatellitePage from './components/pages/SatellitePage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import Chatbot from './components/Chatbot';
import Sidebar from './components/Sidebar';
import { Page } from './types';
import { supabase } from './services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const isAuthenticated = !!session;
  const [pageBeforeLogin, setPageBeforeLogin] = useState<Page | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setCheckingSession(false);
    };
    
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!checkingSession) {
        if (session && (currentPage === Page.Login || currentPage === Page.SignUp)) {
            const targetPage = pageBeforeLogin || Page.Dashboard;
            setCurrentPage(targetPage);
            setPageBeforeLogin(null);
        } else if (!session) {
            const protectedPages: Page[] = [Page.Dashboard, Page.DiseaseDetection, Page.Schemes, Page.Satellite];
            if (protectedPages.includes(currentPage)) {
                setCurrentPage(Page.Home);
            }
        }
    }
  }, [session, checkingSession, currentPage, pageBeforeLogin]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleNavigation = useCallback((page: Page) => {
    const protectedPages: Page[] = [Page.Dashboard, Page.DiseaseDetection, Page.Schemes, Page.Satellite];
    if (protectedPages.includes(page) && !session) {
      setPageBeforeLogin(page);
      setCurrentPage(Page.Login);
    } else {
      setCurrentPage(page);
    }
    setIsSidebarOpen(false); // Close sidebar on navigation
  }, [session]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={handleNavigation} />;
      case Page.Dashboard:
        return <DashboardPage />;
      case Page.DiseaseDetection:
        return <DiseaseDetectionPage />;
      case Page.Schemes:
        return <SchemesPage />;
      case Page.Satellite:
        return <SatellitePage />;
      case Page.About:
        return <AboutPage />;
      case Page.Contact:
        return <ContactPage />;
      case Page.Login:
        return <LoginPage setCurrentPage={handleNavigation} />;
      case Page.SignUp:
        return <SignUpPage setCurrentPage={handleNavigation} />;
      default:
        return <HomePage setCurrentPage={handleNavigation} />;
    }
  };

  if (checkingSession) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-primary-600">
                <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      {isAuthenticated && (
          <Sidebar
              currentPage={currentPage}
              setCurrentPage={handleNavigation}
              handleLogout={handleLogout}
              isSidebarOpen={isSidebarOpen}
              setSidebarOpen={setIsSidebarOpen}
          />
      )}
      <div className="flex flex-col min-h-screen">
        <Header
          currentPage={currentPage}
          setCurrentPage={handleNavigation}
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          setSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </main>
        <Footer />
      </div>
      {isAuthenticated && <Chatbot />}
    </div>
  );
};

export default App;