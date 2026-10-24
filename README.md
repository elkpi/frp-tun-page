# frp-tun public site

`frp-tun-page` 是 [frp-tun](https://frp-tun.elkpi.com) 的静态文档与公开发行信息仓库。

- 闭源核心、生产配置和内部构建逻辑不在本仓库。
- 当前站点仅用于私有预览；在发行主体、法律联系信息与安全披露渠道确定前，不得公开部署 GitHub Pages 或提供二进制下载。
- 站点使用 Astro + Starlight，所有图表从本地 Mermaid 源构建为 SVG，不加载第三方运行时脚本或 CDN 资源。

## 本地开发

需要 Node.js `>=22.23.4 <25` 与 npm `>=9.6.5`。

```bash
npm install
npm run dev
```

完整检查：

```bash
npm run check
npm test
npm run build
```

发布前必须逐项检查 [`RELEASE_READINESS.md`](./RELEASE_READINESS.md)。
