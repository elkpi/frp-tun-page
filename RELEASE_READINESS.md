# frp-tun Release Readiness

此清单记录公开发布前各项法律、合规、供应链与技术验收门槛。

## 法律与权利

- [x] 发行主体法定名称已确认：`Ping (ELKPI)`。
- [x] 法律联系邮箱已确认：`contact@elkpi.com`。
- [x] 私密安全报告邮箱已确认：`security@elkpi.com`。
- [x] 适用法律与争议管辖已确认：`中华人民共和国法律，开发者所在地法院管辖`。
- [x] 专有 EULA 与违法行为彻底免责声明已编写并归档至 `EULA.md`。
- [x] 公开文档/示例/拓扑图许可已确认。
- [ ] Go 模块、嵌入资产、UPX、构建镜像和分发脚本的第三方许可/NOTICE 审计完成（二进制发布硬门槛）。

## 技术与供应链

- [x] `npm test`（19 项安全与契约测试）与 `npm run build` 本地及 GitHub-hosted runner CI 均验证通过。
- [x] 公开内容自动扫描和人工上下文复核完成。
- [ ] 私有 `elkpi/frp-tun` 的受保护 tag 构建流程经过审批。
- [ ] 五架构二进制（amd64, arm64, arm, mips, mipsle）、SHA-256、Sigstore/cosign OIDC 签名、provenance、SBOM 和 NOTICE 已验证。
- [ ] 新 preview 标签已建立，且距离公开 Release 至少 48 小时。
- [ ] 自定义域名 `frp-tun.elkpi.com` DNS 验证、HTTPS 证书与根路径检查完成。
- [ ] `PUBLIC_RELEASE_APPROVED` 仅在上述项目完成后设为 `true`。

## 证据边界

- [x] 所有示例均使用文档保留地址与不可用占位符。
- [x] 架构与配置文档均明确声明 OpenWrt、非零 `SO_MARK`、公网 NAT 穿透为待验证/实验性状态。

## 撤回流程

- [x] 发行审批人已确认：受影响资产立即下架、Release 标记为 `REVOKED — DO NOT USE`、安全说明与替代版本同步发布，且不得静默替换同名资产。
