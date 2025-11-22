import type { DefaultTheme } from 'vitepress'

export const themeConfig: DefaultTheme.Config = {
  // 导航栏配置
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Guide', link: '/introduction' },
    { 
      text: 'API', 
      items: [
        { text: 'HTTP API', link: '/http-api-mode' },
        { text: 'Metrics', link: '/metrics' }
      ]
    },
    { text: 'GitHub', link: 'https://github.com/containrrr/watchtower' }
  ],

  // 侧边栏配置
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

  // 编辑链接
  editLink: {
    pattern: 'https://github.com/containrrr/watchtower/edit/main/docs/:path',
    text: 'Edit this page on GitHub'
  },

  // 社交链接
  socialLinks: [
    { icon: 'github', link: 'https://github.com/containrrr/watchtower' }
  ],

  // 页脚
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2019-present containrrr'
  },

  // 搜索配置
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

  // 最后更新时间
  lastUpdatedText: 'Last updated',

  // 文档加载配置
  docFooter: {
    prev: 'Previous page',
    next: 'Next page'
  },

  // 外部链接图标
  externalLinkIcon: true,

  // 平滑滚动
  smoothScroll: true,

  // 代码块配置
  codeBlocks: {
    lineNumbers: true
  }
}
