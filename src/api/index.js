// File: src/api/index.js

/**
 * URL dasar untuk semua panggilan ke backend API.
 * Pastikan backend Anda berjalan di port ini.
 */
const API_BASE_URL = "http://localhost:3001/api";

/**
 * Fungsi pembantu (helper) generik untuk melakukan request ke API.
 * Fungsi ini secara otomatis menangani:
 * - Menambahkan header 'Content-Type'.
 * - Menambahkan token otentikasi jika tersedia di localStorage.
 * - Mengubah body menjadi format JSON.
 * - Menangani error dari respons server.
 * @param {string} endpoint - Endpoint API yang akan diakses (misal: '/auth/login').
 * @param {object} options - Opsi konfigurasi untuk fetch, termasuk body, method, dll.
 * @returns {Promise<any>} - Promise yang akan resolve dengan data JSON dari server.
 */
async function request(endpoint, { body, ...customConfig } = {}) {
    // Mengambil token dari localStorage
    const token = localStorage.getItem('authToken');
    
    // Konfigurasi header default
    const headers = { 'Content-Type': 'application/json' };

    // Menambahkan header otentikasi jika token ada
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Menggabungkan konfigurasi kustom dengan konfigurasi default
    const config = {
        method: body ? 'POST' : (customConfig.method || 'GET'),
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    // Menambahkan body ke konfigurasi jika ada
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Jika respons tidak OK (status bukan 2xx), lempar error
        if (!response.ok) {
            const errorData = await response.json();
            return Promise.reject(errorData);
        }

        // Jika respons berhasil tetapi tidak ada konten, kembalikan objek kosong
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        }
        return {};

    } catch (error) {
        console.error('API Request Error:', error);
        return Promise.reject({ message: 'Network error or could not connect to API.' });
    }
}

// =================================================================
// Kumpulan fungsi API yang diekspor untuk digunakan di aplikasi
// =================================================================

export const api = {
    /**
     * Otentikasi: Login pengguna.
     * Endpoint: POST /api/auth/login
     */
    login: (email, password) => request('/auth/login', { body: { email, password } }),

    /**
     * Proyek: Mendapatkan semua proyek.
     * Endpoint: GET /api/projects
     */
    getProjects: () => request('/projects'),

    /**
     * Proyek: Membuat proyek baru.
     * Endpoint: POST /api/projects
     */
    createProject: (projectData) => request('/projects', { body: projectData }),

    /**
     * Admin: Mendapatkan daftar pengguna dengan opsi pencarian.
     * Endpoint: GET /api/admin/users
     */
    getUsers: (searchTerm = '') => request(`/admin/users?search=${encodeURIComponent(searchTerm)}`),
    
    /**
     * Admin: Mendapatkan daftar registrasi yang masih pending.
     * Endpoint: GET /api/admin/registrations (Asumsi endpoint berdasarkan kebutuhan)
     */
    getPendingRegistrations: () => request('/admin/registrations'),

    /**
     * Admin: Menyetujui atau menolak registrasi.
     * Endpoint: POST /api/admin/registrations/review/:id
     */
    reviewRegistration: (id, status) => request(`/admin/registrations/review/${id}`, { 
        method: 'POST', 
        body: { status } 
    }),

    /**
     * Admin: Mendapatkan daftar submission yang masih pending.
     * Endpoint: GET /api/admin/submissions (Asumsi endpoint berdasarkan kebutuhan)
     */
    getPendingSubmissions: () => request('/admin/submissions'),
    
    /**
     * Admin: Menyetujui atau menolak submission.
     * Endpoint: POST /api/admin/submissions/review/:id
     */
    reviewSubmission: (id, status) => request(`/admin/submissions/review/${id}`, { 
        method: 'POST', 
        body: { status } 
    }),

    /**
     * Superadmin: Melakukan penarikan dana (withdraw) manual untuk pengguna.
     * Endpoint: POST /api/admin/withdrawals (Asumsi endpoint berdasarkan kebutuhan)
     */
    manualWithdrawal: (data) => request('/admin/withdrawals', { 
        method: 'POST', 
        body: data 
    }),
};
