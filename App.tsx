import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import DashboardPage from './components/pages/DashboardPage';
import DiseaseDetectionPage from './components/pages/DiseaseDetectionPage';
import CropRecommendationPage from './components/pages/CropRecommendationPage';
import SchemesPage from './components/pages/SchemesPage';
import SatellitePage from './components/pages/SatellitePage';
import FertilizerHubPage from './components/pages/FertilizerHubPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import Chatbot from './components/Chatbot';
import Sidebar from './components/Sidebar';
import { Page } from './types';
import { supabase } from './services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

const APP_PAGE_KEY = 'cropGuruCurrentPage';
const PAGE_BEFORE_LOGIN_KEY = 'cropGuruPageBeforeLogin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = sessionStorage.getItem(APP_PAGE_KEY) as Page;
    // Ensure the saved value is a valid page, otherwise default to Home
    return savedPage && Object.values(Page).includes(savedPage) ? savedPage : Page.Home;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const isAuthenticated = !!session;
  const [pageBeforeLogin, setPageBeforeLogin] = useState<Page | null>(() => {
    return sessionStorage.getItem(PAGE_BEFORE_LOGIN_KEY) as Page | null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Save current page to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(APP_PAGE_KEY, currentPage);
  }, [currentPage]);

  // Save the page the user was trying to access before login
  useEffect(() => {
    if (pageBeforeLogin) {
      sessionStorage.setItem(PAGE_BEFORE_LOGIN_KEY, pageBeforeLogin);
    } else {
      sessionStorage.removeItem(PAGE_BEFORE_LOGIN_KEY);
    }
  }, [pageBeforeLogin]);
  
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
            const protectedPages: Page[] = [Page.Dashboard, Page.DiseaseDetection, Page.CropRecommendation, Page.Schemes, Page.Satellite, Page.FertilizerHub];
            if (protectedPages.includes(currentPage)) {
                setCurrentPage(Page.Home);
            }
        }
    }
  }, [session, checkingSession, currentPage, pageBeforeLogin]);

  const handleNavigation = useCallback((page: Page) => {
    const protectedPages: Page[] = [Page.Dashboard, Page.DiseaseDetection, Page.CropRecommendation, Page.Schemes, Page.Satellite, Page.FertilizerHub];
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
      case Page.CropRecommendation:
        return <CropRecommendationPage />;
      case Page.Schemes:
        return <SchemesPage />;
      case Page.Satellite:
        return <SatellitePage />;
      case Page.FertilizerHub:
        return <FertilizerHubPage />;
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="text-primary-600">
                <svg width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <style>{`.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}`}</style>
                    <g className="spinner_V8m1"><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="2"></circle></g>
                </svg>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
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
        <div className="light-mode-bg fixed inset-0 -z-10"></div>
        <Header
          currentPage={currentPage}
          setCurrentPage={handleNavigation}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          setSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {renderPage()}
        </main>
        <Footer />
      </div>
      {isAuthenticated && <Chatbot />}
    </div>
  );
};

export default App;