#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="${DIST_DIR:-/tmp/frp-tun-v0.5.4-assets}"
if [ ! -d "$DIST_DIR" ]; then
  DIST_DIR="/home/ping/work/frp-tun/dist"
fi

CHECKSUM_FILE="$DIST_DIR/checksums.txt"
if [ ! -f "$CHECKSUM_FILE" ]; then
  CHECKSUM_FILE="$DIST_DIR/checksums-v0.5.4.txt"
fi

gh release create v0.5.4 \
  --repo elkpi/frp-tun-page \
  --title "Release v0.5.4" \
  --notes "## frp-tun v0.5.4 — 空候选恢复循环抑制、网络纪元退避防护与准备日志降噪

本版本是一个关键的稳定性和恢复机制增强版本。彻底解决节点在无 STUN 候选或未发现直连候选端点时，陷入高频空候选恢复通知与重复准备的忙循环（Recovery Event Storm）缺陷，引入基于网络纪元（Network Epoch）的退避锁定，并大幅净化运行日志。

### 主要改进特性

- **空候选恢复循环与事件风暴抑制**：优化 \`refreshLocalUpdate\` 恢复事件触发判定，仅在准备状态（\`Prepared\`）发生真实翻转或生成新一代有效候选集时才向 supervisor 广播 \`signalRecovery\`，彻底消除由于无候选导致的无限连续恢复调用；
- **网络纪元（Network Epoch）退避重试防护**：在 \`prepareFamilyLoop\` 中对无有效候选（\`errNoLocalCandidates\`）场景增加纪元一致性校验。在退避等待期间，若本地网络拓扑/纪元未发生变化，即使收到重复触发请求也不打断退避定时器，只有在网络真实变动或定时器超时后才发起重试，防止突发重试击穿退避；
- **准备日志降噪与审计优化**：将空候选阶段性未就绪从严重错误日志中剥离，避免无候选正常退避期间刷屏污染运行日志；
- **测试覆盖与边界收敛**：补充 \`empty_candidate_recovery_test.go\` 针对 peering engine 与 supervisor 的端到端测试，覆盖无 STUN 候选、负缓存过期及突发并发请求等严苛场景。

### 资产清单与 SHA256 校验和

包含 amd64、arm (32位 armv7)、arm64、mips-softfloat、mipsle-softfloat 五种 Linux UPX 压缩构建及 \`checksums.txt\`。针对 32 位 ARM 网关提供 \`frp-tun_arm\` 与 \`frp-tun_armv7\` 兼容软链接。

\`\`\`text
c5ee9163a3e904463fe20e1050ea5ea4bc68b97950b4bb0c810d5949e729419d  frp-tun_v0.5.4_amd64
8e949d8f60e948d3fe278c9b8caee0ef49a6f8af201d4b5548f1599f2c493882  frp-tun_v0.5.4_arm
226e62a8e25f82e672c511688db2631b7fe305bd967649122a07b74793fee84c  frp-tun_v0.5.4_arm64
692d2de6558c8a2bdb87d773e5cbb1e2351b19f4cbec68bbc538fca80ad31b6a  frp-tun_v0.5.4_mipsle-softfloat
b8f9cef35cc77936cb12c61ac6c90834c36dbfedeb65c2e97b83a97dc473336c  frp-tun_v0.5.4_mips-softfloat
\`\`\`

### 验证与已知边界

- 全量 Go 单元与集成测试在 Ubuntu Runner 通过；
- 五架构（amd64、arm64、32 位 armv7、mips、mipsle）交叉构建并经 UPX 压缩校验通过；
- 本版本自动化构建资产不代表特定商业硬件或 OpenWrt 物理设备兼容性声明；
- 遵循 [EULA 免责声明](https://github.com/elkpi/frp-tun-page/blob/main/EULA.md)，不提供在线自动更新与可用性 SLA 保证。" \
  "$DIST_DIR/frp-tun_v0.5.4_amd64" \
  "$DIST_DIR/frp-tun_v0.5.4_arm" \
  "$DIST_DIR/frp-tun_v0.5.4_arm64" \
  "$DIST_DIR/frp-tun_v0.5.4_mips-softfloat" \
  "$DIST_DIR/frp-tun_v0.5.4_mipsle-softfloat" \
  "$CHECKSUM_FILE"
