import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import marketPrices from './api/market-prices.js'

const env = loadEnv('development', process.cwd(), '')
if (!process.env.USDA_AMS_API_KEY && env.USDA_AMS_API_KEY) {
  process.env.USDA_AMS_API_KEY = env.USDA_AMS_API_KEY
}

function marketPricesMiddleware() {
  return {
    name: 'market-prices-api',
    configureServer(server) {
      server.middlewares.use('/api/market-prices', async (req, res) => {
        const response = {
          status(code) {
            res.statusCode = code
            return response
          },
          json(payload) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
          },
        }
        await marketPrices(req, response)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), marketPricesMiddleware()],
})
