import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('🚀 Starting production build process...\n');

try {
  // 1. Clean dist directory
  console.log('🧹 Cleaning dist directory...');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  console.log('✅ Clean complete.\n');

  // 2. Run TypeScript type checking
  console.log('🔍 Running type checking...');
  execSync('npm run lint', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Type checking passed.\n');

  // 3. Run Vite build
  console.log('📦 Building application...');
  execSync('npm run build:vite', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Build complete.\n');

  // 4. Generate sitemap and robots.txt
  console.log('🗺️ Generating SEO assets...');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
  console.log('✅ SEO assets generated.\n');

  // 5. Report build statistics
  console.log('📊 Build Statistics:');
  const getDirSize = (dirPath) => {
    let size = 0;
    const files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(dirPath, files[i]);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stats.size;
      }
    }
    return size;
  };

  const totalSize = getDirSize(distDir);
  console.log(`Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  console.log('\n✨ Build process completed successfully! The "dist" folder is ready for production deployment.');
} catch (error) {
  console.error('\n❌ Build failed!');
  console.error(error.message);
  process.exit(1);
}
