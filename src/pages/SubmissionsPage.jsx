import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorComponent from '../components/common/ErrorComponent';

const SubmissionsPage = ({ showMessage }) => {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubmissions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getPendingSubmissions();
            setSubmissions(Array.isArray(data) ? data.filter(s => s.status === 'PENDING') : []);
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch submission data.';
            setError(errorMessage);
            showMessage(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleReview = async (id, status) => {
        try {
            await api.reviewSubmission(id, status);
            showMessage(`Submission has been ${status.toLowerCase()}.`, 'success');
            fetchSubmissions();
        } catch (err) {
            const errorMessage = err.message || `Failed to ${status.toLowerCase()} submission.`;
            showMessage(errorMessage, 'error');
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-c-white uppercase mb-6">Pending Submissions</h1>
            
            {isLoading && <LoadingComponent text="ANALYSING SUBMISSION DATA" />}
            {error && <ErrorComponent text={error} />}
            {!isLoading && !error && (
                <div className="glassmorphism rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-c-light-navy/50">
                            <tr>
                               {['Project', 'User', 'Submitted At', 'Actions'].map(h => (
                                    <th key={h} className={`px-6 py-3 text-sm font-semibold text-c-chocolate uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>
                                        {h}
                                    </th>
                               ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-c-lightest-navy/20">
                            {submissions.length > 0 ? (
                                submissions.map(s => (
                                    <tr key={s.id} className="hover:bg-c-lightest-navy/10 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-c-white">{s.project?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{s.user?.username || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{new Date(s.submittedAt).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <button 
                                                onClick={() => handleReview(s.id, 'APPROVED')} 
                                                className="futuristic-btn approve !px-3 !py-1 !text-xs"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReview(s.id, 'REJECTED')} 
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
                                        No pending submissions found. All clear.
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

export default SubmissionsPage;
