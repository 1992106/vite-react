import { ConfigEnv, loadEnv } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import legacy from '@vitejs/plugin-legacy'
// import react from 'vite-preset-react'
import styleImport from 'vite-plugin-style-import'
import ViteHtml from 'vite-plugin-html'
import path from 'path'
import setting from './src/config'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  return {
    server: {
      port: env.VITE_PORT,
      force: true,
      watch: { usePolling: true }
    },
    define: {},
    plugins: [
      reactRefresh(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      // react({ removeDevtoolsInProd: true, injectReact: true }),
      styleImport({
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: (name) => `antd/es/${name}/style/index`
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
      alias: [
        { find: /^~/, replacement: '' }, // 解决引入antd路径
        { find: '@/src', replacement: path.resolve(__dirname, 'src') },
        { find: '@/pages', replacement: path.resolve(__dirname, 'src/pages') },
        { find: '@/components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@/hooks', replacement: path.resolve(__dirname, 'src/hooks') },
        { find: '@/store', replacement: path.resolve(__dirname, 'src/store') },
        { find: '@/utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@/graphql', replacement: path.resolve(__dirname, 'src/graphql') },
        { find: '@/services', replacement: path.resolve(__dirname, 'src/services') }
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // '@primary-color': '#EF435A',
            // '@btn-default-color': '#EF435A',
            // '@btn-default-border': '#EF435A'
          },
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/global.less";'
        }
      }
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
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
}
