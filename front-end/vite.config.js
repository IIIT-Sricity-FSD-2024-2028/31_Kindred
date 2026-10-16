import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Original .html addresses are client routes. Serve the single React entry
// for direct navigation and reload in both development and preview.
function reactDocumentFallback() {
  const rewriteDocument = (req, _res, next) => {
    const url = new URL(req.url, 'http://localhost');
    const acceptsHtml = req.headers.accept?.includes('text/html');
    if ((req.method === 'GET' || req.method === 'HEAD') &&
        (url.pathname.endsWith('.html') || acceptsHtml)) {
      req.url = `/index.html${url.search}`;
    }
    next();
  };
  return {
    name: 'kindred-react-document-fallback',
    configureServer(server) { server.middlewares.use(rewriteDocument); },
    configurePreviewServer(server) { server.middlewares.use(rewriteDocument); },
  };
}

export default defineConfig({
  plugins: [reactDocumentFallback(), react()],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
