#!/usr/bin/env bash
set -euo pipefail

# 在包含本脚本的检出上执行。若 main 之后又有新提交，先设置 TARGET_COMMIT
# 为应当挂上 v0.5.6 Release 的页面仓库提交。
TARGET_COMMIT="${TARGET_COMMIT:-HEAD}"
TARGET_COMMIT="$(git rev-parse "$TARGET_COMMIT")"

DIST_DIR="${DIST_DIR:-/tmp/frp-tun-v0.5.6-assets}"
if [ ! -d "$DIST_DIR" ]; then
  mkdir -p "$DIST_DIR"
  gh release download v0.5.6 --repo elkpi/frp-tun --dir "$DIST_DIR"
fi

CHECKSUM_FILE="$DIST_DIR/checksums.txt"
if [ ! -f "$CHECKSUM_FILE" ]; then
  CHECKSUM_FILE="$DIST_DIR/checksums-v0.5.6.txt"
fi

# 校验 SHA256 完整性
(cd "$DIST_DIR" && sha256sum -c "$CHECKSUM_FILE")

echo "publishing elkpi/frp-tun-page v0.5.6 at ${TARGET_COMMIT}"

gh release create v0.5.6 \
  --repo elkpi/frp-tun-page \
  --target "$TARGET_COMMIT" \
  --title "Release v0.5.6" \
  --notes "## frp-tun v0.5.6 — 重启恢复已提交配置，apply 失败回滚到上一代

本版本修复崩溃或重启后未恢复已提交配置，以及 \`apply\` 失败后不能回到上一代的问题。

### 主要变更

- **重启恢复已提交配置**：\`journal.json\` 记录服务应启用且摘要一致时，\`run\` 恢复 journal 中的配置。配置文件缺失、损坏或与 journal 不一致只写入 \`config file ignored\`，不会替换已提交配置；
- **拒绝不完整 journal**：损坏、摘要不符、启用状态不一致或缺少可校验配置时，\`run\` 以退出码 4 拒绝启动，不退回配置文件；
- **\`apply\` 失败回滚**：已有上一代时，隔离、转发、运行时或 journal 写入失败会在 30 秒内先恢复上一代隔离，再重建上一代运行时。journal 只在整次 \`apply\` 成功后更新，已记录的退役 IPv6 前缀会保留；
- **回滚失败后要求重启**：回滚失败或超时后，服务标记为未激活，后续 \`apply\` 会包含 \`restart required\`；
- **断开连接取消 apply**：客户端断开会取消这次 \`apply\`。回滚使用独立的 30 秒预算。\`apply\` 的套接字截止时间为 90 秒，操作本身限 60 秒；\`down\` 仍为 60 秒。

### 已知限制

\`frp-tun down\` 写入的停用 journal 不含站点 ID。\`v0.5.6\` 的下一次 \`run\` 会报告 \`journal missing explicit stopped state\` 并拒绝启动。确认网络资源已清理后，删除状态目录中的 \`journal.json\`（默认 \`/etc/frp-tun/journal.json\`），下一次 \`run\` 才会按配置文件全新激活。

### 资产清单与 SHA256 校验和

包含 amd64、arm、arm64、mips-softfloat、mipsle-softfloat 五种 Linux UPX 压缩构建及 \`checksums.txt\`。摘要与上游 \`elkpi/frp-tun\` \`v0.5.6\` 发布资产一致。

\`\`\`text
4076def03d356478e0ce285336fa31d18ba23d5cdf77a00cb7a81ada42d468a5  frp-tun_v0.5.6_amd64
428f16f55f86e6eeeff75bf87b834185e56b0479d7fa5109bfc66e9aba5041ae  frp-tun_v0.5.6_arm
3712f676d994cde8661245e3465d6bb87cacc069b470b4735f49784630f15bc2  frp-tun_v0.5.6_arm64
366e65df18314641f88a028e4f3553ee142d52c3a589ea3bb37036790e505c04  frp-tun_v0.5.6_mipsle-softfloat
ece9e234d62af202ce16c340a45a4cdc76c7f2f9da0a223c8237e43f1c0eb5a1  frp-tun_v0.5.6_mips-softfloat
\`\`\`

### 验证与已知边界

- 恢复与回滚相关的 Go 单元测试覆盖已提交配置恢复、损坏 journal 拒绝启动和 \`apply\` 回滚；
- 五种架构二进制已对照上游 \`checksums.txt\` 校验；
- 本版本自动化构建资产不代表特定商业硬件或物理设备兼容性声明；
- 遵循 [EULA 免责声明](https://github.com/elkpi/frp-tun-page/blob/main/EULA.md)，不提供在线自动更新与可用性 SLA 保证。" \
  "$DIST_DIR/frp-tun_v0.5.6_amd64" \
  "$DIST_DIR/frp-tun_v0.5.6_arm" \
  "$DIST_DIR/frp-tun_v0.5.6_arm64" \
  "$DIST_DIR/frp-tun_v0.5.6_mips-softfloat" \
  "$DIST_DIR/frp-tun_v0.5.6_mipsle-softfloat" \
  "$CHECKSUM_FILE"
