import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        https: false, 
        proxy: {
            '/api': {
                target: 'https://localhost:5293', // Backend'in çalýþtýðý adres
                changeOrigin: true,
                secure: false
            }
        }
    }
});