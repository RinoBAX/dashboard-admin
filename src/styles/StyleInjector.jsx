import React from 'react';

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-c-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-c-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const MessageModal = ({ message, onClose }) => {
    const isError = message.type === 'error';

    return (
        <div 
            className="fixed top-5 right-5 z-[100] glassmorphism p-4 rounded-lg shadow-2xl border-l-4 w-full max-w-sm"
            style={{ borderColor: isError ? 'var(--c-red)' : 'var(--c-green)' }}
            role="alert"
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    {isError ? <ErrorIcon /> : <SuccessIcon />}
                </div>
                <div className="flex-1">
                    <p className={`text-base font-bold uppercase tracking-wider ${isError ? 'text-c-red' : 'text-c-green'}`}>
                        {isError ? 'System Alert' : 'Success'}
                    </p>
                    <p className="mt-1 text-sm text-c-light-slate">
                        {message.text}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full inline-flex text-c-slate hover:text-c-white hover:bg-c-lightest-navy/20 transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
