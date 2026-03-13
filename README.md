# My Library - Build System Documentation

This project uses Vite as its build tool, providing a fast, modern, and highly optimized build pipeline.

## Installation

1. Ensure you have Node.js installed.
2. Run \`npm install\` to install all dependencies.

## Build Commands

- \`npm run dev\`: Starts the development server with hot module replacement (HMR).
- \`npm run build\`: Runs the complete production build process (cleaning, type checking, building, and generating SEO assets).
- \`npm run build:vite\`: Runs only the Vite build process.
- \`npm run watch\`: Watches for file changes and rebuilds automatically.
- \`npm run preview\`: Previews the production build locally.
- \`npm run clean\`: Removes the \`dist\` folder.
- \`npm run test\`: Runs the test suite using Vitest.
- \`npm run lint\`: Runs TypeScript type checking.

## Build Features

The build system (\`vite.config.ts\` and \`scripts/build.js\`) includes:
- **Minification & Optimization**: Uses esbuild for extremely fast minification.
- **Source Maps**: Generates source maps for easier debugging in production.
- **Code Splitting**: Separates vendor libraries (React, UI components) from application code for better caching.
- **Cache Busting**: Adds content hashes to filenames (e.g., \`main.[hash].js\`).
- **Asset Optimization**: Automatically optimizes and inlines small assets, and copies larger ones to the \`dist\` folder.
- **SEO Generation**: Automatically generates \`sitemap.xml\` and \`robots.txt\` during the build process.
- **Bundle Analysis**: Generates a \`stats.html\` file in the \`dist\` directory to analyze bundle sizes.
- **Manifest**: Generates a \`manifest.json\` mapping original filenames to their hashed versions.

## Customizing the Build

You can customize the build process by modifying \`vite.config.ts\`:
- **Code Splitting**: Adjust the \`manualChunks\` configuration under \`build.rollupOptions.output\`.
- **Target Browsers**: Change the \`build.target\` option (default is \`esnext\`).
- **Environment Variables**: Add new variables to \`.env.example\` and \`.env.production\`. Variables prefixed with \`VITE_\` are exposed to the client.

## Deployment

1. Run \`npm run build\`.
2. The \`dist\` folder will contain all production-ready files.
3. Deploy the contents of the \`dist\` folder to your preferred static hosting provider (e.g., Vercel, Netlify, GitHub Pages, or a standard web server).
