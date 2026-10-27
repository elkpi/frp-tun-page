#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="/home/ping/work/frp-tun/dist"

gh release create v0.5.3 \
  --repo elkpi/frp-tun-page \
  --title "Release v0.5.3" \
  --notes "## frp-tun v0.5.3 — 自研 QUIC 直连建联方向对称化与端口块 NAT 修复

本版本重点实现自研 native QUIC P2P 直连链路的端到端对等发起（建联方向对称化），彻底解决单向固定发起导致的不可逆 NAT 穿透失败；同时修复端口块（CGNAT）打洞成功端点被新鲜度门槛误杀卡在中继的缺陷。

### 主要变更特性

- **端口块 NAT 新鲜度误杀修复**：针对对端处于 CGNAT 端口块环境，放行已通过 QUIC 双向加密认证的同一对端 IP 映射端点，丢弃日志精确打印失败原因，彻底解决真机打洞命中后仍卡死在 relay 的缺陷；
- **自研 QUIC 直连建联方向对称化（Peer 对等）**：引入动态单发起方状态机，默认由站点角色决定起始发起方（visitor 发起、proxy 接受），连续 3 次终结性失败自动翻转建联方向，翻转事件立即触发首拨重试；配置 2 分钟迟滞防抖，网络拓扑变化与改号时自动重置回默认方向；
- **双端常驻 QUIC 监听与冲突收敛**：visitor 与 proxy 角色均在 loopback UDP 套接字上常驻监听，任一端可作为 acceptor 接受入站。双 dialer 同时拨号时由 openDialerSession 收集候选，基于全局 SiteID 字典序（大者胜出）确定性保留一条连接，无副作用关闭败者；
- **流握手首帧防死锁**：重构 authenticateWithOrder，由建联方向（而不是站点角色）决定 TLS/认证首写顺序，消除 dialer 空流不发 STREAM 帧导致 acceptor AcceptStream 永久阻塞的死锁缺陷；
- **全链路 DialRole 可观测性**：会话与运行状态（顶层及 Peers[]）透出 DialRole（\"dialer\" / \"acceptor\"），会话建立日志行输出 \", dial=\" 标记；
- **严格向后兼容与平稳回退**：wire 协议保持严格 canonical 编码兼容；中继路径（STCP/XTCP 经 frps）完整保留原有 visitor/proxy 语义及私有中继 Preferred Hub 优选逻辑。

### 资产清单与 SHA256 校验和

包含 amd64、arm (32位 armv7)、arm64、mips-softfloat、mipsle-softfloat 五种 Linux UPX 压缩构建及 \`checksums.txt\`。针对 32 位 ARM 网关提供 \`frp-tun_arm\` 与 \`frp-tun_armv7\` 兼容软链接。

\`\`\`text
7a3018b5758a279928a44fc51c9243c4422b9f2b291fd76358edd9fa091511f0  frp-tun_v0.5.3_amd64
07128bdd3f9c441559a01c4d57b56cb8287a7744bb1d099ba67125ef9c224942  frp-tun_v0.5.3_arm
1971b3d0af9726102bbc52971ffcaf8ec7221a16b7cc3c2c65301b9fc0fb4064  frp-tun_v0.5.3_arm64
fcfd80aed65cceaf4d4f59d1cc9b85899bf4118afa71b3320f24dc40ef5022f3  frp-tun_v0.5.3_mipsle-softfloat
554beb76b16157e273c4f20a321526a45fac611ff930f8dff624c0103b1cbadb  frp-tun_v0.5.3_mips-softfloat
\`\`\`

### 验证与已知边界

- 全量 Go 单元与集成测试（包含真实反向 NAT 拓扑翻转验证 TestReverseNATSymmetricDial）在 Ubuntu Runner 通过；
- 五架构（amd64、arm64、32 位 armv7、mips、mipsle）交叉构建并经 UPX 压缩校验通过；
- 本版本自动化构建资产不代表特定商业硬件或 OpenWrt 物理设备兼容性声明；
- 遵循 [EULA 免责声明](https://github.com/elkpi/frp-tun-page/blob/main/EULA.md)，不提供在线自动更新与可用性 SLA 保证。" \
  "$DIST_DIR/frp-tun_v0.5.3_amd64" \
  "$DIST_DIR/frp-tun_v0.5.3_arm" \
  "$DIST_DIR/frp-tun_v0.5.3_arm64" \
  "$DIST_DIR/frp-tun_v0.5.3_mips-softfloat" \
  "$DIST_DIR/frp-tun_v0.5.3_mipsle-softfloat" \
  "$DIST_DIR/checksums.txt"
