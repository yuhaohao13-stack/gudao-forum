#!/bin/bash
# Oppo 谷歌锁 (FRP) 解锁脚本
# 适用于 Mac 系统，不需要 Windows
# ----------------------------------------

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "══════════════════════════════════"
echo "  Oppo 谷歌锁 (FRP) 解锁工具"
echo "══════════════════════════════════"
echo ""

# ==========================================
# 方法 1：ADB 命令（需要手机已进入系统且开启 USB 调试）
# ==========================================
try_adb_method() {
  echo -e "${YELLOW}[方法1] 尝试 ADB 解锁...${NC}"
  
  # 检查设备
  DEVICES=$(adb devices 2>/dev/null | grep -v "List" | grep "device$" | wc -l)
  if [ "$DEVICES" -eq 0 ]; then
    echo -e "${RED}  ❌ 未检测到 ADB 设备${NC}"
    return 1
  fi
  
  echo -e "${GREEN}  ✅ 检测到 ADB 设备${NC}"
  
  # 执行 FRP 清除命令
  echo "  ⏳ 执行 FRP 清除..."
  adb shell content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1 2>/dev/null
  adb shell content insert --uri content://settings/secure --bind name:s:device_provisioned --bind value:s:1 2>/dev/null
  adb shell pm uninstall -k --user 0 com.google.android.gsf 2>/dev/null
  
  echo -e "${GREEN}  ✅ ADB 命令执行完毕，重启中...${NC}"
  adb reboot
  echo "  手机重启后谷歌锁应已解除"
  return 0
}

# ==========================================
# 方法 2：Fastboot 模式擦除 FRP 分区
# ==========================================
try_fastboot_method() {
  echo ""
  echo -e "${YELLOW}[方法2] Fastboot 模式擦除 FRP 分区...${NC}"
  echo -e "  ${YELLOW}请将手机进入 Fastboot 模式：${NC}"
  echo "  ① 关机"
  echo "  ② 同时按住【音量下 + 电源键】"
  echo "  ③ 出现 Fastboot 界面后连接 USB"
  echo ""
  read -p "  手机已进入 Fastboot 模式了吗？(y/n): " FASTBOOT_READY
  
  if [ "$FASTBOOT_READY" != "y" ]; then
    return 1
  fi
  
  # 检查 fastboot 设备
  FB_DEVICES=$(fastboot devices 2>/dev/null | wc -l)
  if [ "$FB_DEVICES" -eq 0 ]; then
    echo -e "${RED}  ❌ 未检测到 Fastboot 设备${NC}"
    echo "  提示：Oppo 部分机型 ColorOS 锁了 fastboot"
    return 1
  fi
  
  echo -e "${GREEN}  ✅ 检测到 Fastboot 设备${NC}"
  
  # 尝试擦除 FRP 分区
  echo "  ⏳ 擦除 FRP 分区..."
  fastboot erase frp 2>/dev/null
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ FRP 分区已擦除${NC}"
  else
    echo -e "${RED}  ❌ 擦除失败（ColorOS 可能锁了 fastboot）${NC}"
    return 1
  fi
  
  echo "  ⏳ 重启手机..."
  fastboot reboot
  echo -e "${GREEN}  ✅ 完成！手机重启后谷歌锁应已解除${NC}"
  return 0
}

# ==========================================
# 方法 3：EDL 模式（高通芯片专用）
# ==========================================
try_edl_method() {
  echo ""
  echo -e "${YELLOW}[方法3] EDL 模式（高通紧急下载模式）...${NC}"
  echo -e "  ${YELLOW}请将手机进入 EDL 模式：${NC}"
  echo "  ① 关机"
  echo "  ② 同时按住【音量上 + 音量下】，插入 USB 线"
  echo "  ③ 或者使用深度刷机线（Test Point）"
  echo ""
  read -p "  手机已进入 EDL 模式了吗？(y/n): " EDL_READY
  
  if [ "$EDL_READY" != "y" ]; then
    return 1
  fi
  
  # 检测是否有高通 EDL 设备
  EDL_CHECK=$(ls /dev/tty.usbmodem* 2>/dev/null | head -1)
  if [ -z "$EDL_CHECK" ]; then
    echo -e "${RED}  ❌ 未检测到 EDL 设备${NC}"
    echo "  EDL 模式在 macOS 上需要安装高通驱动"
    echo "  建议改用 Windows 电脑运行 QFIL 工具"
    return 1
  fi
  
  echo -e "${GREEN}  ✅ 检测到 EDL 设备: $EDL_CHECK${NC}"
  echo -e "${YELLOW}  macOS 下 EDL 刷机需要用 QFIL (Windows)${NC}"
  echo "  或用 edl 工具: pip install edl"
  return 1
}

# ==========================================
# 方法 4：WiFi 分享跳转法（不用电脑）
# ==========================================
print_wifi_method() {
  echo ""
  echo -e "${YELLOW}[方法4] WiFi 分享跳转法（不用电脑，Oppo 新机可用）${NC}"
  echo "  ┌──────────────────────────────────────────┐"
  echo "  │  ① 连 WiFi → 点 WiFi 名旁边的【分享】图标    │"
  echo "  │  ② 二维码出现后 → 【截图】                  │"
  echo "  │  ③ 点截图的【分享】→ 选 Chrome 浏览器       │"
  echo "  │  ④ 浏览器输: chrome://settings             │"
  echo "  │  ⑤ 跳转到系统设置 → 添加账户 → 登录新谷歌账号  │"
  echo "  └──────────────────────────────────────────┘"
  echo ""
}

# ==========================================
# 主流程
# ==========================================
echo "检查连接的设备..."
adb devices 2>/dev/null | grep -v "List" | grep -v "^$"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  选择解锁方式:"
echo "  1. ADB 命令解锁（有 ADB 设备时）"
echo "  2. Fastboot 模式擦除 FRP"
echo "  3. EDL 模式（高通芯片，需 Windows）"
echo "  4. 看 WiFi 跳转法教程（不用电脑）"
echo "  5. 全自动（按顺序尝试 1→2→3）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "请选择 [1-5]: " CHOICE

case $CHOICE in
  1) try_adb_method ;;
  2) try_fastboot_method ;;
  3) try_edl_method ;;
  4) print_wifi_method ;;
  5)
    try_adb_method || try_fastboot_method || try_edl_method
    if [ $? -ne 0 ]; then
      echo -e "${RED}所有自动方式都失败了${NC}"
      print_wifi_method
    fi
    ;;
  *)
    echo -e "${RED}无效选择${NC}"
    ;;
esac

echo ""
echo "══════════════════════════════════"
echo "  如果以上方法都无效，考虑:"
echo "  • Dr.Fone (Wondershare) - 付费软件，成功率最高"
echo "  • 用 Windows 电脑 + QFIL 工具（高通芯片）"
echo "  • 用 mtkclient (pip install mtkclient) 如果是 MTK 芯片"
echo "══════════════════════════════════"
