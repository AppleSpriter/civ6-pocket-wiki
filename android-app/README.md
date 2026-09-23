# 文明 6 口袋百科 Android 版

这是由 **Applespriter** 制作、可离线使用的安卓应用。内容包括科技树、文化树、奇观的建造前置与效果、地形与资源分布、48 个城邦的使者与宗主国奖励、519 个单位、建筑、区域、改良设施、政体政策条目、按文明筛选的领袖、伟人和游戏机制。百科内的关联词条直接打开本地详情。资料来源与权利说明见项目根目录的 [README](../README.md)。

应用内容从 `../civ6-pocket/dist/` 复制到 `app/src/main/assets/`。更新网页数据后，请重新复制 `index.html`、`app.js`、`style.css`、`data.json` 及 `images/` 图标目录，再运行 `assembleDebug` 构建 APK。

项目使用 Android Gradle Plugin 8.5.2、Gradle 8.7、JDK 17 和 Android SDK 34。最低支持 Android 7.0（API 24）。当前 GitHub 安装包采用项目现有的测试签名，适合侧载安装；正式商店发布需要单独配置发布签名。
