#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="/home/ping/work/frp-tun/dist"

gh release create v0.5.2 \
  --repo elkpi/frp-tun-page \
  --title "Release v0.5.2" \
  --notes "## frp-tun v0.5.2 — WAN 改号自动恢复与平稳回切

本版本重点实现动态网络环境下 WAN 地址改号自动感知、P2P 候选平稳晋升恢复以及自适应平滑回切。

### 主要变更特性

- **Netlink 地址与出口指纹观察**：动态订阅 Linux Netlink 地址与路由事件，提取出口网卡索引及默认/直连路由指纹，支持 250ms 防抖与 30s 周期兜底，并支持优雅降级；
- **按族网络代次与资源隔离**：引入独立 NetworkEpoch 与租约计数，IPv4/IPv6 环境变更独立递增，确保连接平滑过渡且失效资源有界回收（每族最多 1 个退役资源）；
- **不可变代次栅栏**：异步 STUN 探测、端口映射与 QUIC 握手均绑定不可变代次，杜绝跨代旧结果污染新候选集合；
- **候选数据面探针与单拥有者交接**：Stream 候选通道采用独立 Nonce Ping/Pong 在业务流上验证双向连通；Supervisor 发起 Token 化单拥有者交接，旧中继保留 5 秒只收不发窗口避免倒换丢包；
- **WireGuard 非对称保活策略**：区分 Visitor 与 Proxy 角色，仅发起方配置持久保活，消除双端并发握手交叉碰撞缺陷；
- **跨版本兼容性保证**：补充与 v0.5.1 历史版本的受控互通夹具，确保混合版本组网平滑兼容。

### 资产清单与 SHA256 校验和

包含 amd64、arm (32位 armv7)、arm64、mips-softfloat、mipsle-softfloat 五种 Linux UPX 压缩构建及 \`checksums.txt\`。针对 32 位 ARM 网关提供 \`frp-tun_arm\` 与 \`frp-tun_armv7\` 兼容软链接。

\`\`\`text
43a3968760ec8669c6d15de615e0ea4b3a66f8ae0d37d680c5d980edf24b4233  frp-tun_v0.5.2_amd64
8bb0a0e1974eceb02079900327dcc77a3f59182484fc7e46e502b8c60a9b4e81  frp-tun_v0.5.2_arm
4660d6db03252325fb0e6d70617fd4c15109125827c3647e795254ee779a3d8e  frp-tun_v0.5.2_arm64
b1fd80a1248456bd880465a134ee8c930f71c2828ca37d6e8e664e4d60f2a0be  frp-tun_v0.5.2_mips-softfloat
15f9692064578ee5ccd41a35b3fb471a8f7821ef7f0470e9387d65d8f7749e40  frp-tun_v0.5.2_mipsle-softfloat
\`\`\`

### 验证与已知边界

- 全量 Go 单元与集成测试（包含 ThreadSanitizer 竞态检测）在 Ubuntu Runner 通过；
- 五架构（amd64、arm64、32 位 armv7、mips、mipsle）交叉构建并经 UPX 压缩校验通过；
- 本版本自动化构建资产不代表特定商业硬件或 OpenWrt 物理设备兼容性声明；
- 遵循 [EULA 免责声明](https://github.com/elkpi/frp-tun-page/blob/main/EULA.md)，不提供在线自动更新与可用性 SLA 保证。" \
  "$DIST_DIR/frp-tun_v0.5.2_amd64" \
  "$DIST_DIR/frp-tun_v0.5.2_arm" \
  "$DIST_DIR/frp-tun_v0.5.2_arm64" \
  "$DIST_DIR/frp-tun_v0.5.2_mips-softfloat" \
  "$DIST_DIR/frp-tun_v0.5.2_mipsle-softfloat" \
  "$DIST_DIR/checksums.txt"
