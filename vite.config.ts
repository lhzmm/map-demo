import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import type { ComponentResolverObject } from 'unplugin-vue-components/types'
// 如果使用 UI 库（如 Element Plus）
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

/**
 * 引入components 组件
 * @param option {}
 */
function LHResolver(option:any = {}):ComponentResolverObject {
  return {
    type: 'component',
    resolve: (componentName:any) => {
      if (componentName.startsWith('LH')) {
        const partialName = componentName.slice(2)
        return {
          name: 'default',
          from: `@/components/${partialName}/index.vue`
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入组件
    Components({
      // 配置自动导入组件
      dirs: ['src/components'], // 指定组件目录
      extensions: ['vue'], // 支持的文件扩展名
      include: [/\.vue$/, /\.vue\?vue/], // 包含的文件
      // exclude: [/\.spec\.ts$/, /\.test\.ts$/], // 排除测试文件
      // dts: true, // 是否生成类型声明文件
      resolvers: [LHResolver()],
      dts: 'src/components.d.ts', // 生成组件类型声明文件
    }),
  ],
  resolve: {
    alias: {
      '@': '/src', // 设置 @ 为 src 目录的别名
    },
    extensions: ['.js', '.ts', '.vue', '.json'], // 支持的文件扩展名
  },
  server: {
    port: 3000, // 设置开发服务器端口
    open: true, // 启动时自动打开浏览器
  },
  build: {
    outDir: 'dist', // 设置构建输出目录
    sourcemap: true, // 生成源映射文件
  },
  css: {
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `@import "@/styles/variables.scss";` // 全局引入 SCSS 变量
    //   }
    // }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router'] // 优化依赖
  },
})
