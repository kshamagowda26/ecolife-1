import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          sustainableLiving: path.resolve(__dirname, 'sustainable-living.html'),
          wasteManagement: path.resolve(__dirname, 'waste-management.html'),
          recycling: path.resolve(__dirname, 'recycling.html'),
          renewableEnergy: path.resolve(__dirname, 'renewable-energy.html'),
          sustainableFood: path.resolve(__dirname, 'sustainable-food.html'),
          ecoProducts: path.resolve(__dirname, 'eco-products.html'),
          greenTips: path.resolve(__dirname, 'green-tips.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
