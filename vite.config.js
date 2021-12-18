import {resolve} from 'path';
import nunjucks from 'vite-plugin-nunjucks'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import postcssCustomMedia from 'postcss-custom-media';
import FastGlob from 'fast-glob'

const middleware = {
  name: 'middleware',
    apply: 'serve',
    configureServer(viteDevServer) {
    return () => {
      viteDevServer.middlewares.use(async (req, res, next) => {
        if (!req.originalUrl.endsWith('.html') && req.originalUrl !== '/') {
          req.url = req.originalUrl + '.html';
        }

        next()
      })
    }
  }
}

export default {
  plugins: [
    nunjucks({
      templatesDir: resolve(process.cwd(), 'src', 'templates')
    }),
    middleware
  ],
  css: {
    postcss: {
      plugins: [postcssImport, postcssNesting, postcssCustomMedia, tailwindcss, autoprefixer]
    }
  },
  resolve: {
    alias: {
      '/src': resolve(process.cwd(), 'src')
    }
  },
  root: resolve(process.cwd(), 'src'),
  publicDir: resolve(process.cwd(), 'public'),
  server: {
    watch: {
      usePolling: true
    }
  },
  build: {
    emptyOutDir: false,
    outDir: resolve(process.cwd(), 'public'),
    rollupOptions: {
      input: FastGlob.sync(['./src/*.html']).map(entry => resolve(process.cwd(), entry))
    }
  }
}
