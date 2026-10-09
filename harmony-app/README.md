# 文明 6 口袋百科 · 鸿蒙版

鸿蒙版使用 ArkTS Stage 模型和 ArkWeb 组件，把现有百科完整打包在 HAP 内。科技树、文化树、奇观、地图资源、城邦、领袖、伟人和机制资料与网页版一致，离线可查看；页面中的 **Applespriter** 签名也一并保留。

## 工程与兼容性

- Bundle ID：`com.applespriter.civ6pocket`。
- 手机、平板；工程配置的最低兼容版本为 HarmonyOS 5.0（API 12），使用本机 HarmonyOS 7 / API 26 SDK 编译。由于尚未连接真机，目前只验证了编译和 HAP 内资源。
- `entry/src/main/resources/rawfile/web/` 是离线网页资源；ArkWeb 拦截应用内部的虚拟 HTTPS 地址，返回本地 HTML、JavaScript、CSS、JSON 和图标，不依赖网站服务器。
- 页面导航限定在应用内部，不需要网络权限。游戏规则与图标的来源见项目根目录 [README](../README.md)。

## 更新离线内容

网页内容更新后，在项目根目录执行：

```sh
python3 harmony-app/scripts/sync_web.py
```

该脚本将 `civ6-pocket/dist/` 同步到鸿蒙工程的 `rawfile/web/`，避免网页与 HAP 内容不一致。

## 构建

用 DevEco Studio 打开 `harmony-app/`，选择 `entry` 模块构建 HAP。此 Mac 已安装 DevEco Studio 26.0.0.851；命令行也可使用其自带的 SDK、Node、JBR 和 Hvigor：

```sh
cd harmony-app
NODE_HOME=/Applications/DevEco-Studio.app/Contents/tools/node \
DEVECO_SDK_HOME=/Applications/DevEco-Studio.app/Contents/sdk \
JAVA_HOME=/Applications/DevEco-Studio.app/Contents/jbr/Contents/Home \
/Applications/DevEco-Studio.app/Contents/tools/hvigor/bin/hvigorw \
  assembleHap --mode module -p product=default -p buildMode=debug --no-daemon
```

未配置签名时，编译产物是 `entry/build/default/outputs/default/entry-default-unsigned.hap`，不能直接安装到真机。真机安装需要连接设备，并在 DevEco Studio 为本应用配置对应设备与 Bundle ID 的调试签名。证书、签名密码和签名配置不应提交到公开仓库。
