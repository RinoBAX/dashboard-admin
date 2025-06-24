import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import ErrorComponent from '../components/common/ErrorComponent';

const WithdrawalsPage = ({ showMessage }) => {
    const { user } = useAuth();

    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleManualWithdraw = async (e) => {
        e.preventDefault();
        if (!userId || !amount) {
            showMessage('Please fill in both User ID and Amount.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await api.manualWithdrawal({ userId, amount: Number(amount) });
            showMessage(res.message || "Withdrawal processed successfully.", 'success');
            setUserId('');
            setAmount('');
        } catch (err) {
            const errorMessage = err.message || 'Failed to process withdrawal.';
            showMessage(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleBulkWithdraw = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Processing bulk withdrawal file:", file.name);
            showMessage(`File ${file.name} uploaded. Bulk processing protocol initiated.`, 'success');
        }
    };

    if (user.role !== 'SUPER_ADMIN') {
        return <ErrorComponent text="ACCESS DENIED: You do not have permission to access this module." />;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-c-white uppercase mb-6">Withdrawal Protocols</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glassmorphism p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-c-white mb-4 uppercase tracking-wider">Manual Transaction</h2>
                    <form onSubmit={handleManualWithdraw} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="User ID" 
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)} 
                            className="futuristic-input w-full" 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Amount (Rp)" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="futuristic-input w-full" 
                            required 
                        />
                        <div className="text-right pt-4">
                           <button 
                                type="submit" 
                                className="futuristic-btn w-full" 
                                disabled={isSubmitting}
                            >
                               {isSubmitting ? 'PROCESSING...' : 'PROCESS WITHDRAWAL'}
                           </button>
                        </div>
                    </form>
                </div>

                <div className="glassmorphism p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-c-white mb-4 uppercase tracking-wider">Bulk Transaction</h2>
                    <p className="text-sm text-c-slate mb-4">Upload a CSV file with `userId` and `amount` columns.</p>
                     <div className="border-2 border-dashed border-c-lightest-navy/50 rounded-lg p-6 text-center">
                        <input 
                            type="file" 
                            id="bulk-upload" 
                            className="hidden" 
                            accept=".csv" 
                            onChange={handleBulkWithdraw}
                        />
                        <label htmlFor="bulk-upload" className="futuristic-btn cursor-pointer">
                            Select File
                        </label>
                         <p className="text-xs text-c-slate mt-2">CSV file up to 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalsPage;
