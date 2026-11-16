import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import marketPrices from './api/market-prices.js'
import uploadDocuments from './api/upload-documents.js'
import documentContent from './api/document-content.js'

// Vite only serves the front end. The Vercel functions in /api need the project
// env in process.env and a minimal res.status().json() shim to run under the dev
// server, so the preview behaves like the deployment.
const env = loadEnv('development', process.cwd(), '')
for (const key of ['USDA_AMS_API_KEY', 'BLOB_READ_WRITE_TOKEN', 'DATABASE_URL', 'BETTER_AUTH_SECRET']) {
  if (!process.env[key] && env[key]) process.env[key] = env[key]
}

function mountApi(server, path, fn) {
  server.middlewares.use(path, async (req, res) => {
    const shim = {
      status(code) { res.statusCode = code; return shim },
      setHeader(name, value) { res.setHeader(name, value); return shim },
      json(payload) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(payload)) },
      end(payload) { res.end(payload) },
    }
    try {
      await fn(req, shim)
    } catch (error) {
      console.error(`[mfp] ${path} failed in dev`, error)
      if (!res.headersSent) shim.status(500).json({ error: 'Request failed' })
    }
  })
}

function apiRoutes() {
  return {
    name: 'mfp-api-routes',
    configureServer(server) {
      mountApi(server, '/api/market-prices', marketPrices)
      mountApi(server, '/api/upload-documents', uploadDocuments)
      mountApi(server, '/api/document-content', documentContent)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiRoutes()],
})
