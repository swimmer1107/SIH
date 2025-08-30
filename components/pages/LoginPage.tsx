import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Page } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { useLanguage } from '../LanguageProvider';

interface LoginPageProps {
  setCurrentPage: (page: Page) => void;
}

const LeafIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.9999 1.5C11.9999 1.5 5.43994 4.859 3.41194 11.234C1.38394 17.609 8.24994 22.5 11.9999 22.5C15.7499 22.5 22.6159 17.609 20.5879 11.234C18.5599 4.859 11.9999 1.5 11.9999 1.5Z" />
    </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                throw error;
            }
            // Navigation is now handled by the onAuthStateChange listener in App.tsx
        } catch (error: any) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <LeafIcon className="h-12 w-12 text-primary-600 mx-auto" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{t('login.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{t('login.subtitle')}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('login.form.email')}
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('login.form.password')}
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-center text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t('login.button.loading') : t('login.button.submit')}
                        </Button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                    {t('login.link.prompt')}{' '}
                    <button onClick={() => setCurrentPage(Page.SignUp)} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        {t('login.link.action')}
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;