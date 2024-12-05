import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensure correct MIME types for JS and JSX
    mimeTypes: {
      js: 'application/javascript',
      jsx: 'application/javascript',  // If using JSX
    },
    // Configure asset handling for static files like images, fonts, etc.
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg'],
  },
  build: {
    // Ensure proper handling of static assets and avoid issues with file paths
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Ensure static assets are copied correctly during build
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    // Ensure proper resolution of file paths, e.g., importing assets
    alias: {
      '@': '/src',  // Adjust if you want to have an alias for the src folder
    },
  },
});
