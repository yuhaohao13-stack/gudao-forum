#!/bin/bash
# 三星 S25 Ultra (SM-S938B) FRP 恢复出厂设置脚本
# 使用 Heimdall (Mac 版 Odin)
# ======================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "═══════════════════════════════════════"
echo "  三星 S25 Ultra FRP 解锁工具"
echo "  型号: SM-S938B"
echo "═══════════════════════════════════════"
echo ""

# 安装 Heimdall（Mac 版 Odin）
echo -e "${YELLOW}[1/4] 安装 Heimdall...${NC}"
if ! command -v heimdall &>/dev/null; then
  brew install heimdall 2>/dev/null
  if [ $? -ne 0 ]; then
    echo -e "${YELLOW}  brew 安装失败，尝试源码...${NC}"
    # Heimdall 其实可以通过 brew 的备选方式安装
    brew tap samsung-exynos/heimdall 2>/dev/null
    brew install heimdall 2>/dev/null
  fi
fi

# 检查 heimdall
if command -v heimdall &>/dev/null; then
  echo -e "${GREEN}  ✅ Heimdall 就绪${NC}"
else
  echo -e "${YELLOW}  Heimdall 不可用，改用 JOdin3 方案...${NC}"
fi

# 设备进入下载模式
echo ""
echo -e "${YELLOW}[2/4] 重启到下载模式...${NC}"
adb reboot download 2>/dev/null
if [ $? -eq 0 ]; then
  echo -e "${GREEN}   ✅ 正在重启到下载模式...${NC}"
else
  echo -e "${RED}   ❌ ADB 不可用，请手动操作：${NC}"
  echo "   ① 关机"
  echo "   ② 同时按住【音量下 + 电源键】"
  echo "   ③ 出现警告界面按【音量上】进入下载模式"
fi

echo ""
echo -e "${YELLOW}[3/4] 检测下载模式设备...${NC}"
sleep 10

# 用 heimdall 检测设备
if command -v heimdall &>/dev/null; then
  heimdall detect 2>&1 | head -5
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ 下载模式设备已检测到${NC}"
    echo -e "${YELLOW}  需要下载固件进行刷机...${NC}"
  else
    echo -e "${RED}  ❌ 未检测到设备${NC}"
  fi
fi

echo ""
echo -e "${YELLOW}[4/4] 刷机方案${NC}"
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  需要下载 S25 Ultra (SM-S938B) 官方固件刷机     │"
echo "  │                                                 │"
echo "  │  下载地址: https://samfw.com/SM-S938B            │"
echo "  │  或: https://www.sammobile.com/firmwares/SM-S938B│"
echo "  │                                                 │"
echo "  │  下载后解压得到 .tar.md5 文件                    │"
echo "  │                                                 │"
echo "  │  用 Odin 刷机（需 Windows）或 JOdin3（Mac）：    │"
echo "  │  BL → 选 BL 开头的文件                           │"
echo "  │  AP → 选 AP 开头的文件                           │"
echo "  │  CP → 选 CP 开头的文件                           │"
echo "  │  CSC → 选 CSC 开头的文件（不要选 HOME_CSC！）   │"
echo "  │                                                 │"
echo "  │  选 CSC 刷机会清除 FRP                          │"
echo "  └─────────────────────────────────────────────────┘"
echo ""
echo -e "${GREEN}  或者在手機上用 Smart Switch 紧急恢复：${NC}"
echo "  电脑装 Smart Switch → 点右上角更多→ 紧急软件恢复"
echo ""

# 最终选择
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  现在执行:"
echo "  1. 重启到下载模式 (adb reboot download)"
echo "  2. 重启到 Recovery (adb reboot recovery)"
echo "  3. 只打印说明"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
