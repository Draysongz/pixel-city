import { defineConfig } from 'vite';

export default defineConfig({
  // No need to set the root if you're using the root directory directly
  build: {
    outDir: 'dist',  // The directory to output the built files
    rollupOptions: {
      input: {
        main: 'index.html',  // Entry point for the build
      }
    }
  },

  // Configure public directory for static assets
  publicDir: 'public',

});
