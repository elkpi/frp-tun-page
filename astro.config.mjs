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
          label: '架构与原理',
          items: [
            { label: '架构概览', slug: 'architecture' },
            { label: 'P2P与中继回退', slug: 'architecture/direct-fallback' },
            { label: '双站点网关', slug: 'architecture/two-site-gateway' },
            { label: '私有中继Hub', slug: 'architecture/private-relay' },
          ],
        },
        {
          label: '配置指南',
          items: [
            { label: '配置总览', slug: 'configuration' },
            { label: '完整配置项字典', slug: 'configuration/full-reference' },
            { label: '最小双站点配置', slug: 'configuration/minimal-two-site' },
            { label: '双栈与QoS配置', slug: 'configuration/dual-stack-qos' },
            { label: 'OpenWrt注意事项', slug: 'configuration/openwrt' },
          ],
        },
        {
          label: '运行与安全',
          items: [
            { label: '运维与回退', slug: 'operations/upgrade-rollback' },
            { label: '故障排查', slug: 'operations/troubleshooting' },
            { label: '安全边界与准则', slug: 'security' },
            { label: '隐私政策', slug: 'security/privacy' },
            { label: '漏洞披露与支持', slug: 'security/support-and-disclosure' },
            { label: '版本发行说明', slug: 'releases' },
          ],
        },
      ],
    }),
  ],
});
