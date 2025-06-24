// File: src/services/cloudinary.js

// --- Konfigurasi Cloudinary ---
// PENTING: Ganti nilai-nilai di bawah ini dengan kredensial dari akun Cloudinary Anda.
// Anda bisa menemukan informasi ini di dasbor Cloudinary Anda.
const CLOUDINARY_CLOUD_NAME = "ganti-dengan-cloud-name-anda"; 
const CLOUDINARY_UPLOAD_PRESET = "ganti-dengan-upload-preset-anda";

/**
 * Mengunggah file (misalnya gambar) ke Cloudinary.
 * @param {File} file - Objek file yang didapat dari input <input type="file">.
 * @returns {Promise<string>} - Sebuah promise yang akan resolve dengan URL aman (secure_url) dari gambar yang diunggah.
 * @throws {Error} - Melempar error jika proses unggah gagal.
 */
export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || "Failed to upload image to Cloudinary.");
        }

        const data = await response.json();
        
        return data.secure_url;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
