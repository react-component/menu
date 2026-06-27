// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

const basePath = process.env.GH_PAGES ? '/menu/' : '/';
const publicPath = basePath;

export default defineConfig({
  themeConfig: {
    name: 'Menu',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
    nav: [{ title: 'Demo', link: '/demo/antd' }],
  },
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  outputPath: 'docs-dist',
  base: basePath,
  publicPath,
  exportStatic: {},
  mfsu: {},
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ],
});
