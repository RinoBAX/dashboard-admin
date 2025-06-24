import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import FuturisticParticleBackground from '../components/layout/FuturisticParticleBackground';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || 'Authentication Failed. Check credentials.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-c-navy p-4 relative overflow-hidden">
            <FuturisticParticleBackground />
            <div className="w-full max-w-md glassmorphism rounded-xl shadow-2xl p-8 space-y-8 z-10 border border-c-chocolate/30">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-c-white tracking-widest uppercase">
                        System Access
                    </h2>
                    <p className="text-c-chocolate">
                        Admin Authentication Required
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                       <input 
                           id="email-address" 
                           name="email" 
                           type="email" 
                           value={email} 
                           onChange={(e) => setEmail(e.target.value)} 
                           required 
                           className="futuristic-input w-full" 
                           placeholder="Operator Email" 
                       />
                       <input 
                           id="password" 
                           name="password" 
                           type="password" 
                           value={password} 
                           onChange={(e) => setPassword(e.target.value)} 
                           required 
                           className="futuristic-input w-full" 
                           placeholder="Passcode"
                       />
                    </div>
                    {error && (
                        <p className="text-red-400 text-sm text-center border border-red-400/50 bg-red-900/20 p-2 rounded">
                            {error}
                        </p>
                    )}
                    <div>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="futuristic-btn w-full !py-3 !text-lg !font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Authenticating...' : 'Engage'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
