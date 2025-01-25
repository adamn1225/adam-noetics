'use client';

import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';
import Navigation from '@components/Navigation';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage('Signup successful! Please check your email to confirm your account.');
        }
    };

    const handleGoogleSignup = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <Navigation isFixed={false} />
            <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sign Up</h1>
                    {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
                    {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block font-medium text-gray-900 dark:text-white">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignup}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                        >
                            Sign Up with Google
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;