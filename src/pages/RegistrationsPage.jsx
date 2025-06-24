import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorComponent from '../components/common/ErrorComponent';

const RegistrationsPage = ({ showMessage }) => {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRegistrations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getPendingRegistrations();
            setRegistrations(Array.isArray(data) ? data.filter(r => r.status === 'PENDING') : []);
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch registration data.';
            setError(errorMessage);
            showMessage(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    const handleReview = async (id, status) => {
        try {
            await api.reviewRegistration(id, status);
            showMessage(`Registration has been ${status.toLowerCase()}.`, 'success');
            fetchRegistrations();
        } catch (err) {
            const errorMessage = err.message || `Failed to ${status.toLowerCase()} registration.`;
            showMessage(errorMessage, 'error');
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-c-white uppercase mb-6">Pending Registrations</h1>
            
            {isLoading && <LoadingComponent text="SCANNING FOR PENDING REGISTRATIONS" />}
            {error && <ErrorComponent text={error} />}
            {!isLoading && !error && (
                <div className="glassmorphism rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-c-light-navy/50">
                            <tr>
                               {['Username', 'Email', 'Registration Date', 'Actions'].map(h => (
                                    <th key={h} className={`px-6 py-3 text-sm font-semibold text-c-chocolate uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>
                                        {h}
                                    </th>
                               ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-c-lightest-navy/20">
                            {registrations.length > 0 ? (
                                registrations.map(r => (
                                    <tr key={r.id} className="hover:bg-c-lightest-navy/10 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-c-white">{r.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{r.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{new Date(r.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <button 
                                                onClick={() => handleReview(r.id, 'APPROVED')} 
                                                className="futuristic-btn approve !px-3 !py-1 !text-xs"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReview(r.id, 'REJECTED')} 
                                                className="futuristic-btn reject !px-3 !py-1 !text-xs"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-c-slate">
                                        No pending registrations found. System is clear.
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

export default RegistrationsPage;
