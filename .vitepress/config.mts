import { defineConfig } from 'vitepress'
import markdownItAdmonition from 'markdown-it-admonition'

export default defineConfig({
  base: '/watchtower-docs/',
  title: 'Watchtower',
  description: 'A process for automating Docker container base image updates',
  
  // 站点配置
  appearance: true,
  lastUpdated: true,
  
  // 多语言配置
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Watchtower',
      description: 'A process for automating Docker container base image updates',
      themeConfig: {
        logo: '/images/logo-450px.png',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/introduction' },
          { text: 'API', link: '/http-api-mode' },
          { text: 'GitHub', link: 'https://github.com/marrrrrrrrry/watchtower' }
        ],
        sidebar: {
          '/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/introduction' },
                { text: 'Quick Start', link: '/quick-start' },
                { text: 'Usage Overview', link: '/usage-overview' }
              ]
            },
            {
              text: 'Configuration',
              items: [
                { text: 'Arguments', link: '/arguments' },
                { text: 'Container Selection', link: '/container-selection' },
                { text: 'Private Registries', link: '/private-registries' },
                { text: 'Linked Containers', link: '/linked-containers' },
                { text: 'Remote Hosts', link: '/remote-hosts' },
                { text: 'Secure Connections', link: '/secure-connections' },
                { text: 'Stop Signals', link: '/stop-signals' }
              ]
            },
            {
              text: 'Advanced Features',
              items: [
                { text: 'Lifecycle Hooks', link: '/lifecycle-hooks' },
                { text: 'Running Multiple Instances', link: '/running-multiple-instances' },
                { text: 'HTTP API Mode', link: '/http-api-mode' },
                { text: 'Metrics', link: '/metrics' },
                { text: 'Notifications', link: '/notifications' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/marrrrrrrrry/watchtower-docs/edit/main/docs-vitepress/:path',
          text: 'Edit this page on GitHub'
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/marrrrrrrrry/watchtower' }
        ],
        footer: {
          message: 'Released under the MIT License.',
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        },
        lastUpdatedText: 'Last updated',
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        }
      }
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'Watchtower',
      description: '自动化 Docker 容器基础镜像更新的进程',
      link: '/zh/',
      themeConfig: {
        logo: '/images/logo-450px.png',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '指南', link: '/zh/introduction/' },
          { text: 'API', link: '/zh/http-api-mode/' },
          { text: 'GitHub', link: 'https://github.com/marrrrrrrrry/watchtower' }
        ],
        sidebar: {
          '/zh/': [
            {
              text: '开始使用',
              items: [
                { text: '介绍', link: '/zh/introduction/' },
                { text: '快速开始', link: '/zh/quick-start/' },
                { text: '使用概览', link: '/zh/usage-overview/' }
              ]
            },
            {
              text: '配置',
              items: [
                { text: '参数', link: '/zh/arguments/' },
                { text: '容器选择', link: '/zh/container-selection/' },
                { text: '私有仓库', link: '/zh/private-registries/' },
                { text: '链接容器', link: '/zh/linked-containers/' },
                { text: '远程主机', link: '/zh/remote-hosts/' },
                { text: '安全连接', link: '/zh/secure-connections/' },
                { text: '停止信号', link: '/zh/stop-signals/' }
              ]
            },
            {
              text: '高级功能',
              items: [
                { text: '生命周期钩子', link: '/zh/lifecycle-hooks/' },
                { text: '运行多实例', link: '/zh/running-multiple-instances/' },
                { text: 'HTTP API 模式', link: '/zh/http-api-mode/' },
                { text: '指标', link: '/zh/metrics/' },
                { text: '通知', link: '/zh/notifications/' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/marrrrrrrrry/watchtower-docs/edit/main/docs-vitepress/:path',
          text: '在 GitHub 上编辑此页面'
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/marrrrrrrrry/watchtower' }
        ],
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: '版权所有 © 2024-present marrrrrrrrry'
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到结果',
                footer: {
                  selectText: '选择',
                  navigateText: '导航',
                  closeText: '关闭'
                }
              }
            }
          }
        },
        lastUpdatedText: '最后更新',
        docFooter: {
          prev: '上一页',
          next: '下一页'
        }
      }
    }
  },

  // Markdown配置
  markdown: {
    lineNumbers: true,
    config: (md) => {
      // 添加自定义markdown-it插件
      md.use(markdownItAdmonition)
    }
  },

  // 构建配置
  // 使用默认 Vite 设置以确保在不同环境下构建稳定
})
