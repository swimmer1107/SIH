import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Page } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface SignUpPageProps {
  setCurrentPage: (page: Page) => void;
}

const LeafIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.9999 1.5C11.9999 1.5 5.43994 4.859 3.41194 11.234C1.38394 17.609 8.24994 22.5 11.9999 22.5C15.7499 22.5 22.6159 17.609 20.5879 11.234C18.5599 4.859 11.9999 1.5 11.9999 1.5Z" />
    </svg>
);

const SignUpPage: React.FC<SignUpPageProps> = ({ setCurrentPage }) => {
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
                setError("Account created! Please check your email to confirm your sign up.");
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Create an Account</h1>
                    <p className="text-gray-600 dark:text-gray-400">Join CropGuru to get started.</p>
                </div>
                
                {success ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary-600">Success!</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{error || "Please check your email to verify your account."}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
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
                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
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
                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
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
                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-center text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}

                        <div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button onClick={() => setCurrentPage(Page.Login)} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        Sign In
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default SignUpPage;
