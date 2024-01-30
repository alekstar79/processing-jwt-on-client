// noinspection JSCheckFunctionSignatures

// lsof -ti tcp:[PORT] | xargs kill -9
// npx kill-port [PORT1] [PORT2] ...

import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'

import { config } from 'dotenv'

config()

const { API_SERVICE_URL, APP_HOST: HOST, APP_PORT: PORT } = process.env
const app = express()

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

app.use(cors({ exposedHeaders: '*' }))
app.use(express.static('dist'))
app.use('/auth-back/api/v2/', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
}))

app.listen(PORT, HOST, () => {
  console.log(`Starting proxy server at ${HOST}:${PORT}`)
})
