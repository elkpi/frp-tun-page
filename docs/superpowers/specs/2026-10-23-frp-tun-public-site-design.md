# frp-tun 闭源公网发行与文档站设计

## 意图

建立 `elkpi/frp-tun-page` 作为 **frp-tun 的唯一公开产品入口**，但不公开 `elkpi/frp-tun` 中的闭源 Go 核心、内部构建逻辑、生产基线或部署秘密。站点面向具备 Linux/OpenWrt、frp 与 WireGuard 运维经验的用户，优先帮助其判断该软件是否适合自己的网络，再提供安全、可验证的技术预览下载与部署资料。

首发不是营销页或镜像源码仓库：它是可审计的发行记录、证据驱动的兼容性说明、脱敏配置资料和网络拓扑文档。

## 已确认决策

### 仓库与托管边界

- 私有核心仓库保持 `elkpi/frp-tun`；它负责构建受保护 tag 的闭源二进制。
- 公开仓库为 `elkpi/frp-tun-page`；它只保存网站源、公开政策、脱敏示例、拓扑源/SVG、发布元数据、签名/校验文件与 GitHub Release 资产。
- 正式网站域名为 `https://frp-tun.elkpi.com`。GitHub Pages 是唯一首发托管服务；DNS 只在既有权威提供方添加最低限度验证与 CNAME 记录，启用强制 HTTPS。
- GitHub Pages 默认不自动对外部署。普通 CI 可以构建并验证站点；部署必须由受保护分支的人工 workflow 触发，且 GitHub repository variable `PUBLIC_RELEASE_APPROVED` 精确为 `true`。缺失或其他值一律跳过部署。
- 网站源不读取私有仓库、不使用组织 secrets、不访问生产网络。构建与文档测试使用 GitHub-hosted ephemeral runner。

### 发行与信任模型

- 首个公开二进制必须使用新 preview 标签，例如 `v0.6.0-preview.1`，不得重新宣告现有开发标签已经通过公网发行验收。
- GitHub Releases 是四架构原生压缩包的唯一首发下载渠道。每个发行包含 SHA-256 校验清单、Sigstore/cosign OIDC 签名与 provenance、SBOM、专有 EULA 和第三方 NOTICE。
- 私有构建管道在人工批准后单向投递产物到公开仓库；公开仓库不能构建闭源核心，也不能拥有私有源码或长期发布凭据。
- preview 阶段无自动更新、无固定发布时间表、无 SLA；仅维护最新 preview，升级与回退显式手动执行。
- 单维护者仅可在 preview 采用例外流程：受保护 tag、全自动门禁、不可变发布清单、签名/provenance 和不少于 48 小时的 tag 到 Release 冷静期。稳定版或承诺支持的版本必须双人审批。
- 发现签名、构建、依赖或安全问题时，立即下架受影响资产，保留 Release 页面并标记 `REVOKED — DO NOT USE`，发布安全说明和替代版本；禁止静默替换同名资产。

### 法律与发布状态

- 核心二进制采用专有 EULA。公开文档、示例与原创拓扑图计划采用 CC BY 4.0。
- 发行主体法定名称、法律邮箱、安全报告邮箱、适用法律及争议解决地尚未确定。
- 因 CC BY 4.0 与 EULA 都需要真实权利主体，站点在这些信息确定前只能私有预览；不得公开部署 Pages，也不得创建可下载的二进制 Release。
- 第三方许可证、NOTICE、UPX、构建镜像和嵌入资产审计是二进制发行的不可豁免门禁。

### 内容与隐私

- 默认语言为简体中文；产品首页、快速开始、安装/验证、安全边界与核心架构提供英文对应页。
- 首发不加载广告、分析、聊天组件、外部图片 CDN 或行为追踪。客户端默认不发送使用遥测、崩溃报告或配置内容。
- 公开社区支持通过 GitHub Issues/Discussions；安全问题走私密渠道。所有公开入口都提示禁止提交密钥、token、配置、拓扑、日志和公网 IP。
- 网站必须提供：产品与 preview 边界、下载/校验/签名验证、升级与回退、最小双站点配置、双栈与 QoS 示例、OpenWrt 示例、架构/安全/兼容性/故障排查、隐私/支持/漏洞披露、按版本归档的 Release Notes。
- 每个说明、示例、拓扑图和兼容性结论都标记适用版本。默认导航只显示“最新 preview”；历史资料为不可变版本快照，不能暗示持续支持。

### 图与配置

- 三张首发图均以 Mermaid 源文件维护，并在本地构建为内嵌/本地静态 SVG：
  1. P2P XTCP/QUIC 优先、STCP 回退的加密数据路径；
  2. 两端 Linux/OpenWrt 网关的 WireGuard overlay、underlay 与策略路由位置；
  3. 多站点经私有 Hub-and-Spoke 中继的拓扑。
- SVG 需要有中文与英文可理解的标题、替代文字和正文解释；禁止通过 Mermaid CDN 或在线画图服务在运行时渲染。
- 每份公开配置、日志片段、截图文字和图中标签都先过自动敏感信息扫描，再人工复核。示例使用 `example.com`、RFC 5737/3849 文档地址和显式不可用占位密钥。扫描发现真实 WireGuard `PrivateKey`、frp token、`shared_secret`、内网 IP、生产主机名或真实域名时必须失败。

## 信息架构

- `/`：简体中文首页，按“是否适合部署 → 安全限制 → 快速开始 → 架构 → Release 状态”顺序呈现；页面仅提供私有预览状态，不能含二进制直链。
- `/en/`：英文核心入口，覆盖相同安全与安装边界。
- `/getting-started/`、`/architecture/`、`/configuration/`、`/operations/`、`/releases/`、`/security/`：中文文档树。
- `/en/...`：英文核心文档树。
- `/releases/<version>/`：冻结的版本说明、资产清单、验证命令、已验证范围、已知限制与回退步骤。
- `/legal/`：仅在权利主体信息确定后导航到 EULA、文档许可、隐私、支持和安全披露页；当前仅保留站内构建所需的非公开预览说明，不伪造法律文本。

## 实现架构

- 使用 Astro、Starlight 与 TypeScript；站点只在构建期生成静态 HTML/CSS/SVG，不使用运行时服务或第三方浏览器脚本。
- `src/content/docs/` 保存 Starlight Markdown/MDX，根目录为简体中文，`en/` 为英文核心内容。
- `src/assets/diagrams/` 保存 `.mmd` 源；`scripts/build-diagrams.mjs` 使用本地 Mermaid CLI 生成 `public/images/diagrams/*.svg`。构建前运行该脚本，生成文件不手工编辑。
- `scripts/validate-public-content.mjs` 递归检查公开内容，不允许秘密模式、私网/保留外生产端点或不安全示例值；单元测试覆盖允许的文档占位符、拒绝的秘密模式和 SVG 源/产物一一对应关系。
- `scripts/validate-release-metadata.mjs` 验证 `src/content/docs/releases/` 下每个版本具有必需 frontmatter 和章节；每个 Release Notes 页不得将未验证硬件状态描述为支持。
- GitHub Actions 分为：普通 CI（依赖安装、图生成、内容验证、构建）与受限 Pages 部署（仅 protected main + 手动运行 + `PUBLIC_RELEASE_APPROVED == 'true'`）。没有实现自动 Release 资产发布工作流。

## 非目标

- 不在本仓库实现或公开 frp-tun Go 源码、交叉编译、OpenWrt feed/IPK、Docker 镜像、APT/RPM、Homebrew、自动更新、付费/许可校验、遥测或用户账户。
- 不将模拟测试或历史数据写成当前真机、公网穿透或非零 `SO_MARK` 验证。
- 不在法律信息确定前创建伪 EULA、伪安全邮箱、下载链接或公开 Pages 部署。

## 验收条件

1. `npm run check`、`npm test`、`npm run build` 都成功，且构建输出没有外部运行时资源请求。
2. 内容校验器会拒绝真实密钥、token、常见私网地址、未替换的密钥占位错误和未登记生产端点；受控 `example.com` 与 RFC 文档地址可通过。
3. 每个 Mermaid 图存在源文件、生成 SVG、替代文字与中英说明；生成任务可重复执行而不要求在线服务。
4. 文档首页、导航、示例、Release Notes 和 GitHub 模板都明确 preview、闭源、无自动更新与未验证边界。
5. CI 没有 self-hosted runner、没有私有源码访问、没有持久发布秘密；Pages 工作流在未设置批准 variable 时不部署。
6. 自定义域名、公开 CC BY/EULA、公开下载和 GitHub Pages 正式启用均记录为外部发布门禁，而非当前构建成功的声明。
