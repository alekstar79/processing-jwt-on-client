// noinspection JSCheckFunctionSignatures

/** @see {@link [vitejs.dev/config](https://vitejs.dev/config)} */

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { config } from 'dotenv'

config()

/**
* @function
* @param {import('vite').ConfigEnv} config
* @returns {import('vite').UserConfig}
*/
const configFn = ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      APP_ENV: env.APP_ENV
    },

    base: process.env.BASE_URL,

    plugins: [],

    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.mjs', '.json', '.ts']
    },

    server: {
      open: './',
      proxy: {
        // http://localhost:5173/auth-back/api/v2/login-> https://usnc.dev-webdevep.ru/auth-back/api/v2/login
        '/auth-back/api/v2/': {
          target: process.env.API_SERVICE_URL,
          changeOrigin: true,
          ws: true
        }
      }
    },

    esbuild: {
      drop: command === 'serve' ? [] : ['console'],
    }
  }
}

export default defineConfig(configFn)
