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
        {
          label: '开始使用',
          translations: { en: 'Get started' },
          items: [{ label: '项目概览', translations: { en: 'Project overview' }, slug: 'getting-started' }],
        },
        {
          label: '架构与原理',
          translations: { en: 'Architecture' },
          items: [
            { label: '架构概览', translations: { en: 'Architecture overview' }, slug: 'architecture' },
            { label: 'P2P与中继回退', translations: { en: 'P2P & relay fallback' }, slug: 'architecture/direct-fallback' },
            { label: '双站点网关', translations: { en: 'Two-site gateway' }, slug: 'architecture/two-site-gateway' },
            { label: '私有中继Hub', translations: { en: 'Private relay hub' }, slug: 'architecture/private-relay' },
          ],
        },
        {
          label: '配置指南',
          translations: { en: 'Configuration' },
          items: [
            { label: '配置总览', translations: { en: 'Configuration overview' }, slug: 'configuration' },
            { label: '完整配置项字典', translations: { en: 'Full configuration reference' }, slug: 'configuration/full-reference' },
            { label: '最小双站点配置', translations: { en: 'Minimal two-site configuration' }, slug: 'configuration/minimal-two-site' },
            { label: '双栈与QoS配置', translations: { en: 'Dual-stack & QoS configuration' }, slug: 'configuration/dual-stack-qos' },
            { label: 'OpenWrt注意事项', translations: { en: 'OpenWrt notes' }, slug: 'configuration/openwrt' },
          ],
        },
        {
          label: '运行与安全',
          translations: { en: 'Operations & security' },
          items: [
            { label: 'CLI 命令参考', translations: { en: 'CLI reference' }, slug: 'operations/cli-reference' },
            { label: '运维与回退', translations: { en: 'Upgrade & rollback' }, slug: 'operations/upgrade-rollback' },
            { label: '故障排查', translations: { en: 'Troubleshooting' }, slug: 'operations/troubleshooting' },
            { label: '安全边界与准则', translations: { en: 'Security boundaries' }, slug: 'security' },
            { label: '隐私政策', translations: { en: 'Privacy policy' }, slug: 'security/privacy' },
            { label: '漏洞披露与支持', translations: { en: 'Security disclosure & support' }, slug: 'security/support-and-disclosure' },
            { label: '版本发行说明', translations: { en: 'Release notes' }, slug: 'releases' },
          ],
        },
      ],
    }),
  ],
});
