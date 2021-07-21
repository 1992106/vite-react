import { ConfigEnv, loadEnv } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import legacy from '@vitejs/plugin-legacy'
import react from 'vite-preset-react'
import styleImport from 'vite-plugin-style-import'
import ViteHtml from 'vite-plugin-html'
import path from 'path'
import setting from './src/config'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      reactRefresh(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      react({ removeDevtoolsInProd: true, injectReact: true }),
      styleImport({
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: name => `antd/es/${name}/style/index`
          }
        ]
      }),
      ViteHtml({
        minify: true,
        inject: {
          injectData: {
            title: setting.title
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@/src': path.resolve(__dirname, 'src'),
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/hooks': path.resolve(__dirname, 'src/hooks'),
        '@/store': path.resolve(__dirname, 'src/store'),
        '@/graphql': path.resolve(__dirname, 'src/graphql'),
        '@/utils': path.resolve(__dirname, 'src/utils')
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/global.less";'
        }
      }
    },
    server: {
      port: env.VITE_PORT,
      open: true
    },
    optimizeDeps: {
      include: [
        'antd/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'antd/es/locale/en_US',
        'moment/dist/locale/eu'
      ],
      exclude: []
    },
    build: {
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true
        }
      }
    }
  }
}
