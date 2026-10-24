import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://frp-tun.elkpi.com',
  integrations: [
    starlight({
      title: 'frp-tun',
      description: '闭源 frp-tun 技术预览的静态文档与发行信息站。',
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
        en: { label: 'English', lang: 'en' },
      },
      sidebar: [
        { label: '开始使用', items: [{ label: '项目概览', slug: 'getting-started' }] },
        {
          label: '架构与配置',
          items: [
            { label: '架构概览', slug: 'architecture' },
            { label: '配置示例', slug: 'configuration' },
          ],
        },
        {
          label: '运行与安全',
          items: [
            { label: '运维指南', slug: 'operations' },
            { label: '安全边界', slug: 'security' },
            { label: '发行说明', slug: 'releases' },
          ],
        },
      ],
    }),
  ],
});
