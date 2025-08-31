import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Page } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { useLanguage } from '../LanguageProvider';

interface SignUpPageProps {
  setCurrentPage: (page: Page) => void;
}

const LeafIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.9999 1.5C11.9999 1.5 5.43994 4.859 3.41194 11.234C1.38394 17.609 8.24994 22.5 11.9999 22.5C15.7499 22.5 22.6159 17.609 20.5879 11.234C18.5599 4.859 11.9999 1.5 11.9999 1.5Z" />
    </svg>
);

const SignUpPage: React.FC<SignUpPageProps> = ({ setCurrentPage }) => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) throw error;

            if (data.user && !data.session) {
                setSuccess(true);
                setError(t('signup.success.message'));
            }
            // If there's a session, the onAuthStateChange listener in App.tsx will handle navigation.
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{t('signup.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{t('signup.subtitle')}</p>
                </div>
                
                {success ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">{t('success')}</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{error || t('signup.success.message')}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('signup.form.name')}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-base"
                                />
                            </div>
                        </div>
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
                                    className="input-base"
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
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-base"
                                />
                            </div>
                        </div>

                        {error && !success && (
                            <p className="text-center text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? t('signup.button.loading') : t('signup.button.submit')}
                            </Button>
                        </div>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                    {t('signup.link.prompt')}{' '}
                    <button onClick={() => setCurrentPage(Page.Login)} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        {t('signup.link.action')}
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default SignUpPage;