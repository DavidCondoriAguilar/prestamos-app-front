import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV),
  },
  server: {
    port: 3000,
    open: true,
    cors: true, // Enable CORS for the Vite dev server
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // URL de tu backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina el prefijo /api al reenviar
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Error en el proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Enviando solicitud al backend:', req.method, req.url);
            // Asegurarse de que las cabeceras necesarias estén presentes
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Respuesta del backend:', proxyRes.statusCode, req.url);
            // Asegurarse de que las cabeceras CORS estén configuradas correctamente
            proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      }
    }
  },
})
