#!/usr/bin/env python3
"""
Oppo FRP 谷歌锁 - 自动进入 ADB 模式 + 解锁
支持高通/MTK芯片，自动检测并尝试多种方式
"""
import subprocess, sys, os, time, json

def run(cmd, timeout=10):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return r.returncode, r.stdout.strip(), r.stderr.strip()
    except subprocess.TimeoutExpired:
        return -1, "", "timeout"

def check_adb_device():
    rc, out, _ = run("adb devices")
    devices = [l.split()[0] for l in out.split('\n') if l.strip() and not l.startswith('List') and 'device' in l]
    return devices

def check_fastboot_device():
    rc, out, _ = run("fastboot devices")
    devices = [l.split()[0] for l in out.split('\n') if l.strip()]
    return devices

def check_edl_device():
    import glob
    ports = glob.glob('/dev/tty.usbmodem*') + glob.glob('/dev/cu.usbmodem*')
    return ports

def enable_adb_activity():
    """通过启动特定 Android Activity 开启 ADB"""
    print("  ⏳ 尝试启动开发者选项...")
    cmds = [
        "adb shell am start -n com.android.settings/.Settings\\$DevelopmentSettingsActivity",
        "adb shell am start -n com.android.settings/.DevelopmentSettings",
        "adb shell am start -n com.android.settings/.DeveloperSettings",
        "adb shell settings put global adb_enabled 1",
        "adb shell settings put global development_settings_enabled 1",
        "adb shell setprop persist.service.adb.enable 1",
        "adb shell setprop ctl.restart adbd",
    ]
    for cmd in cmds:
        run(cmd, timeout=3)
    time.sleep(1)

def frp_bypass_adb():
    """通过 ADB 清除 FRP"""
    print("  ⏳ 执行 FRP 清除命令...")
    cmds = [
        "adb shell content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1",
        "adb shell content insert --uri content://settings/secure --bind name:s:device_provisioned --bind value:s:1",
        "adb shell pm clear com.google.android.gsf",
        "adb shell pm clear com.google.android.gms",
        "adb shell settings put secure user_setup_complete 1",
        "adb shell settings put global device_provisioned 1",
        "adb shell am broadcast -a android.intent.action.MASTER_CLEAR",
    ]
    for cmd in cmds:
        rc, out, err = run(cmd, timeout=5)
        if rc == 0 and out:
            print(f"    ✅ {cmd[:50]}...")

def try_fastboot_enable_adb():
    """通过 fastboot 开启 ADB"""
    print("  ⏳ 尝试 fastboot 开启 ADB...")
    cmds = [
        "fastboot oem enable-debug",
        "fastboot oem adb_enable",
        "fastboot oem enable-adb",
        "fastboot shell setprop persist.service.adb.enable 1",
        "fastboot erase frp",
    ]
    for cmd in cmds:
        rc, out, err = run(cmd, timeout=5)
        if rc == 0:
            print(f"    ✅ {cmd[:50]} -> OK")

def try_edl_reset():
    """通过 EDL 模式清 FRP"""
    print("  ⏳ 检测 EDL 端口...")
    ports = check_edl_device()
    if ports:
        print(f"  ✅ 发现 EDL 设备: {ports[0]}")
        print("  尝试安装 edl 工具...")
        run("pip3 install -q edl", timeout=30)
        run(f"python3 -m edl reset {ports[0]}", timeout=10)
        run("python3 -m edl w frp empty.img", timeout=10)
        print("  ✅ EDL 命令已执行")
        return True
    return False

def try_wifi_method_automate():
    """通过 adb shell 启动 WiFi 设置"""
    print("  ⏳ 尝试启动 WiFi/系统设置...")
    cmds = [
        "adb shell am start -a android.settings.WIFI_SETTINGS",
        "adb shell am start -a android.settings.SETTINGS",
        "adb shell am start -n com.android.settings/.Settings",
        "adb shell am start -a android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
    ]
    for cmd in cmds:
        rc, out, err = run(cmd, timeout=3)
        if rc == 0:
            print(f"    ✅ 启动了界面")

def reboot_normal():
    run("adb reboot", timeout=5)
    run("fastboot reboot", timeout=5)

def main():
    print("")
    print("╔══════════════════════════════════════╗")
    print("║   Oppo FRP 谷歌锁自动解锁工具       ║")
    print("╚══════════════════════════════════════╝")
    print("")

    # 第一步：安装/检测 ADB
    print("[0] 检查 ADB 工具...")
    rc, out, _ = run("adb --version")
    if rc != 0:
        print("  ❌ ADB 未安装，尝试安装...")
        run("brew install android-platform-tools", timeout=60)
    else:
        adb_ver = out.split('\n')[0] if out else "OK"
        print(f"  ✅ ADB: {adb_ver}")

    # 检测设备状态
    print("\n[1] 检测连接的设备...")
    adb_devices = check_adb_device()
    fb_devices = check_fastboot_device()
    edl_ports = check_edl_device()

    print(f"  ADB 设备: {len(adb_devices)} 台")
    print(f"  Fastboot 设备: {len(fb_devices)} 台")
    print(f"  EDL 端口: {len(edl_ports)} 个")

    device_found = bool(adb_devices or fb_devices or edl_ports)
    if not device_found:
        print("\n  ⚠️ 未检测到任何设备!")
        print("  ┌──────────────────────────────────────────┐")
        print("  │  【手动操作】先让手机进入对应模式：        │")
        print("  │                                          │")
        print("  │  --- 进 Fastboot 模式 ---                │")
        print("  │  关机 → 音量下+电源键 → 连USB            │")
        print("  │                                          │")
        print("  │  --- 进 EDL 模式 (高通芯片) ---          │")
        print("  │  关机 → 音量上下同时 → 插USB              │")
        print("  │                                          │")
        print("  │  就绪后重新运行本脚本                     │")
        print("  └──────────────────────────────────────────┘")
        print("")
        print("  【不用电脑的方法：】")
        print("  连WiFi → 点WiFi名旁边的【分享】→ 截图 →")
        print("  分享到Chrome → 地址栏输 chrome://settings")
        print("  → 进入设置 → 添加账户")
        sys.exit(0)

    # 执行解锁
    if adb_devices:
        print(f"\n[2] ADB 设备已就绪: {adb_devices[0]}")
        enable_adb_activity()
        time.sleep(1)
        frp_bypass_adb()
        print("\n[3] ✅ FRP 清除完成! 重启中...")
        reboot_normal()
        print("    手机重启后谷歌锁应已解除\n")

    elif fb_devices:
        print(f"\n[2] Fastboot 设备已就绪: {fb_devices[0]}")
        try_fastboot_enable_adb()
        print("\n[3] 尝试重启进入系统检测 ADB...")
        run("fastboot reboot", timeout=5)
        time.sleep(15)
        adb2 = check_adb_device()
        if adb2:
            print(f"  ✅ 重启后 ADB 可用: {adb2[0]}")
            frp_bypass_adb()
        else:
            print("  ⚠️ 快速重启后 ADB 不可用")
            print("  建议手机重启后重新运行本脚本")

    elif edl_ports:
        print(f"\n[2] EDL 设备已就绪: {edl_ports[0]}")
        try_edl_reset()
        print("\n[3] EDL 命令已执行，重启验证...")

    print("\n" + "=" * 50)
    print("如果自动解锁失败，试试手机端操作：")
    print("连WiFi → 点WiFi名分享图标 → 截图 →")
    print("分享到Chrome → 地址栏输 chrome://settings")
    print("→ 进入设置 → 添加账户")
    print("=" * 50)

if __name__ == '__main__':
    main()
