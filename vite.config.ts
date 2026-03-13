import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Generates a visualizer report for bundle size analysis
      visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Output directory
      outDir: 'dist',
      // Clean the output directory before building
      emptyOutDir: true,
      // Generate source maps for debugging
      sourcemap: true,
      // Minify using esbuild (default, very fast and effective)
      minify: 'esbuild',
      // Generate manifest.json with build assets
      manifest: true,
      // CSS code splitting (extracts CSS to separate files instead of inline)
      cssCodeSplit: true,
      // Note: CSS minification and autoprefixing are handled automatically by Vite
      // and Tailwind CSS v4 (which uses Lightning CSS under the hood).
      // Target modern browsers (ESM by default for apps)
      // Note: For library builds requiring both ESM and CJS, you would configure build.lib
      target: 'esnext',
      rollupOptions: {
        // Tree shaking is enabled by default in Rollup
        treeshake: true,
        output: {
          // Version hash for cache busting
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
          // Code splitting: separate vendor code into its own chunk
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react', 'motion', 'clsx', 'tailwind-merge']
          }
        }
      }
    }
  };
});
