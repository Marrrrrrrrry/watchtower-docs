import { type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 应用级别的配置
    console.log('Theme enhanced app')
  }
} satisfies Theme