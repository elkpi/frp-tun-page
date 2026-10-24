# frp-tun Release Readiness

此仓库当前只能构建私有预览站点。任何一项未完成时，禁止公开部署 GitHub Pages、创建可下载 GitHub Release 或把预览说明改写为支持声明。

## 法律与权利

- [ ] 发行主体法定名称已确认并获权利人批准。
- [ ] 法律联系邮箱已确认且由长期维护者控制。
- [ ] 私密安全报告邮箱已确认且由长期维护者控制。
- [ ] 适用法律与争议解决地已确认。
- [ ] 专有 EULA 已由权利主体批准。
- [ ] CC BY 4.0 的文档/示例/拓扑署名已由权利主体批准。
- [ ] Go 模块、嵌入资产、UPX、构建镜像和分发脚本的第三方许可/NOTICE 审计完成。

## 技术与供应链

- [ ] `npm run check`、`npm test` 和 `npm run build` 在 GitHub-hosted runner 通过。
- [ ] 公开内容自动扫描和人工上下文复核完成。
- [ ] 私有 `elkpi/frp-tun` 的受保护 tag 构建流程经过审批。
- [ ] 四架构二进制、SHA-256、Sigstore/cosign OIDC 签名、provenance、SBOM 和 NOTICE 已验证。
- [ ] 新 preview 标签已建立，且距离公开 Release 至少 48 小时。
- [ ] 自定义域名 DNS 验证、HTTPS 证书与根路径检查完成。
- [ ] `PUBLIC_RELEASE_APPROVED` 仅在上述项目完成后设为 `true`。

## 证据边界

- [ ] 每一项 OpenWrt、非零 `SO_MARK`、长期负载、WAN/netem 与公网穿透结论都有可复现证据。
- [ ] 未有证据的结论均在 Release Notes、兼容性和示例中保持“待验证/实验性”。

## 撤回流程

- [ ] 发行审批人已确认：受影响资产立即下架、Release 标记为 `REVOKED — DO NOT USE`、安全说明与替代版本同步发布，且不得静默替换同名资产。
