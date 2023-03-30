// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'rc-menu',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
    nav: [
      { title: 'Demo', link: '/demo/antd'}
    ],
  },
  favicons:
    ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  outputPath: '.doc',
  exportStatic: {},
  mfsu: {},
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ]
});
