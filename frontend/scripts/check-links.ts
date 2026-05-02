/**
 * Route Integrity Script
 * This script crawls the app directory to identify all valid routes 
 * and then checks if common links (in navbar/footer) are valid.
 */
import fs from 'fs';
import path from 'path';

function getAppRoutes(dir: string, base: string = ''): string[] {
  const routes: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const name = entry.name;
      // Skip group directories but process their children
      if (name.startsWith('(') && name.endsWith(')')) {
        routes.push(...getAppRoutes(path.join(dir, name), base));
      } else if (name.startsWith('[') && name.endsWith(']')) {
        // Handle dynamic routes
        routes.push(base + '/:slug');
        routes.push(...getAppRoutes(path.join(dir, name), base + '/:slug'));
      } else {
        routes.push(...getAppRoutes(path.join(dir, name), base + '/' + name));
      }
    } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
      routes.push(base === '' ? '/' : base);
    }
  }
  return routes;
}

const appDir = path.join(process.cwd(), 'app');
const routes = Array.from(new Set(getAppRoutes(appDir)));

console.log('--- Valid App Routes ---');
routes.forEach(r => console.log(`  ${r}`));

// Common links to verify
const linksToVerify = [
  '/',
  '/about',
  '/pricing',
  '/login',
  '/register',
  '/dashboard',
  '/monitors',
  '/incidents',
  '/status-pages',
  '/settings',
  '/settings/billing',
  '/settings/profile',
  '/terms',
  '/privacy',
  '/contact',
  '/docs',
  '/blog',
  '/careers',
  '/changelog'
];

console.log('\n--- Link Integrity Check ---');
linksToVerify.forEach(link => {
  const isValid = routes.some(route => {
    if (route === link) return true;
    if (route.includes('/:slug')) {
      const regex = new RegExp('^' + route.replace('/:slug', '/[^/]+') + '$');
      return regex.test(link);
    }
    return false;
  });
  console.log(`${isValid ? '✅' : '❌'} ${link}`);
});

if (linksToVerify.some(link => !routes.some(route => route === link || (route.includes('/:slug') && new RegExp('^' + route.replace('/:slug', '/[^/]+') + '$').test(link))))) {
  console.error('\nFound broken links!');
  process.exit(1);
} else {
  console.log('\nAll links are valid!');
}
