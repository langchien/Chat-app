import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'src',
  ssr: true, // có thể tắt nếu muốn chạy ứng dụng như một SPA
  // async prerender() {
  //   return ['/', '/about'] // các đường dẫn sẽ được prerender
  // },
} satisfies Config
