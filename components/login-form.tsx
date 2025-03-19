"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import GoogleSignInButton from './google-signin-button';
import { useRouter } from 'next/navigation';
import { TbLoader2 } from 'react-icons/tb';
import { FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { login } from '@/actions/login';

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        setSuccess(undefined);
        setIsLoading(true);

        try {
            const result = await login({email,password})

            if (result?.error) {
                setError('Invalid email or password');
                return;
            }

            if (result?.success) {
                setSuccess('Logged in successfully!');
                router.push('/tasks');
            }
        } catch (error) {
            console.log(error);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg rounded-xl shadow-md bg-white p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-center">
                    <FiAlertCircle className="mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
                    {success}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition flex items-center justify-center disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <TbLoader2 className="w-5 h-5 mr-2 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>
            
            <div className="relative flex items-center justify-center mt-6 mb-6">
                <div className="border-t border-gray-300 absolute w-full"></div>
                <div className="bg-white px-3 relative text-sm text-gray-500">Or continue with</div>
            </div>
            
            <GoogleSignInButton className="w-full" />
            
            <p className="text-center text-gray-600 mt-6">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}