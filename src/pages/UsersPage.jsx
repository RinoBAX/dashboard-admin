import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorComponent from '../components/common/ErrorComponent';

const UsersPage = ({ showMessage }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const debounce = setTimeout(() => {
            const fetchUsers = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await api.getUsers(searchTerm);
                    setUsers(Array.isArray(data) ? data : []);
                } catch (err) {
                    const errorMessage = err.message || 'Failed to fetch user data.';
                    setError(errorMessage);
                    showMessage(errorMessage, 'error');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchUsers();
        }, 500);

        return () => clearTimeout(debounce);
    }, [searchTerm, showMessage]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-c-white uppercase">User Database</h1>
                <input
                    type="text"
                    placeholder="Search by name, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="futuristic-input w-full max-w-sm"
                />
            </div>

            {isLoading && <LoadingComponent text="QUERYING USER DATABASE" />}
            {error && <ErrorComponent text={error} />}
            {!isLoading && !error && (
                 <div className="glassmorphism rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-c-light-navy/50">
                            <tr>
                               {['Name', 'Email', 'Phone Number', 'Referral Code'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-c-chocolate uppercase tracking-wider">{h}</th>
                               ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-c-lightest-navy/20">
                            {users.length > 0 ? (
                                users.map(u => (
                                    <tr key={u.id} className="hover:bg-c-lightest-navy/10 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-c-white">{u.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{u.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{u.phoneNumber || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{u.referralCode || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-c-slate">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
