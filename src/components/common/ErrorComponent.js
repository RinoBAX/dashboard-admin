import React from 'react';

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-c-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


const ErrorComponent = ({ text = "ERROR: Gagal memuat data." }) => {
  return (
    <div 
      className="glassmorphism rounded-lg p-8 my-8 flex flex-col items-center justify-center gap-4 border-2 border-c-red/50 text-center"
      role="alert"
    >
      <div className="animate-pulse">
        <AlertTriangleIcon />
      </div>
      <p className="text-2xl font-bold uppercase tracking-widest text-c-red" style={{ textShadow: '0 0 10px var(--c-red)' }}>
        System Alert
      </p>
      <p className="text-lg text-c-light-slate max-w-md">
        {text}
      </p>
    </div>
  );
};

export default ErrorComponent;
