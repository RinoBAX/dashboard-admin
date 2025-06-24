import React from 'react';

/**
 * Komponen yang berfungsi untuk menyuntikkan (inject) style CSS global
 * dan variabel tema ke dalam aplikasi.
 * Ini memastikan bahwa semua komponen memiliki akses ke skema warna
 * dan gaya dasar yang sama.
 */
const StyleInjector = () => {
  return (
    <style>
      {`
        /* Mengimpor font 'Rajdhani' dari Google Fonts untuk tema futuristik */
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        /* Mendefinisikan variabel warna global (CSS Custom Properties) */
        :root {
            --c-navy: #0a192f;
            --c-light-navy: #172a46;
            --c-lightest-navy: #303c55;
            --c-slate: #8892b0;
            --c-light-slate: #a8b2d1;
            --c-lightest-slate: #ccd6f6;
            --c-white: #e6f1ff;
            --c-chocolate: #d97706; /* Warna aksen utama */
            --c-chocolate-dark: #b45309;
            --c-green: #34d399; /* Untuk status sukses/approve */
            --c-red: #f87171;   /* Untuk status error/reject */
            --font-sans: 'Rajdhani', sans-serif;
        }

        /* Gaya dasar untuk body */
        body {
            font-family: var(--font-sans);
            background-color: var(--c-navy);
            color: var(--c-light-slate);
        }
        
        /* Kelas utilitas untuk efek glassmorphism */
        .glassmorphism {
            background: rgba(23, 42, 70, 0.5); /* --c-light-navy dengan transparansi */
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(48, 60, 85, 0.5); /* --c-lightest-navy dengan transparansi */
        }
        
        /* Kelas utilitas untuk tombol futuristik */
        .futuristic-btn {
            background-color: transparent;
            border: 1px solid var(--c-chocolate);
            color: var(--c-chocolate);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: 600;
        }

        .futuristic-btn:hover {
            background-color: var(--c-chocolate);
            color: var(--c-navy);
            box-shadow: 0 0 15px var(--c-chocolate);
        }

        .futuristic-btn.approve { border-color: var(--c-green); color: var(--c-green); }
        .futuristic-btn.approve:hover { background-color: var(--c-green); color: var(--c-navy); box-shadow: 0 0 15px var(--c-green); }
        .futuristic-btn.reject { border-color: var(--c-red); color: var(--c-red); }
        .futuristic-btn.reject:hover { background-color: var(--c-red); color: var(--c-navy); box-shadow: 0 0 15px var(--c-red); }


        /* Kelas utilitas untuk input field futuristik */
        .futuristic-input {
            background-color: rgba(10, 25, 47, 0.7);
            border: 1px solid var(--c-lightest-navy);
            color: var(--c-lightest-slate);
            transition: all 0.3s ease;
            padding: 12px;
            border-radius: 4px;
        }

        .futuristic-input:focus {
            outline: none;
            border-color: var(--c-chocolate);
            box-shadow: 0 0 10px rgba(217, 119, 6, 0.5);
        }

        /* Gaya kustom untuk scrollbar */
        ::-webkit-scrollbar { 
            width: 8px; 
        }
        ::-webkit-scrollbar-track { 
            background: var(--c-navy); 
        }
        ::-webkit-scrollbar-thumb { 
            background: var(--c-lightest-navy); 
            border-radius: 4px; 
        }
        ::-webkit-scrollbar-thumb:hover { 
            background: var(--c-slate); 
        }
      `}
    </style>
  );
};

export default StyleInjector;
