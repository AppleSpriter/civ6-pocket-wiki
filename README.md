# 文明 6 口袋百科

由 **Applespriter** 制作的《文明 VI》非官方速查工具。提供[网页版（当前为私有预览）](https://civilization-vi-pocket-wiki.baidu-jp-gpt-8892.chatgpt.site)、可离线使用的 Android APK，以及鸿蒙工程；各端使用同一套资料、图片和交互。

## 功能

- 科技树与文化树：查看前置、尤里卡／鼓舞条件和解锁内容。
- 奇观：查看效果、建造前置、地形及邻接要求。
- 地图：查看地形、地貌、自然奇观，以及资源的出现位置、改良方式和产出；包含鹿、石油、奢侈品等。
- 城邦：按工业、军事、科技、贸易、文化、宗教筛选，查看使者奖励和宗主国加成。
- 单位、建筑、区域、改良设施、政体、政策卡、领袖、伟人和游戏机制均有站内词条；相关内容可以互相跳转。
- Android 版离线保存资料和图标，最低支持 Android 7.0。
- 鸿蒙版使用 ArkTS + ArkWeb，完整打包百科内容；工程配置的最低兼容版本是 HarmonyOS 5.0（API 12），调试版已在连接设备上安装与启动。构建与签名说明见 [`harmony-app/`](harmony-app/)。

手机端提供分类首页、独立模块筛选、全屏详情、最近查阅和全站搜索；科技与市政可在时代列表和树状图之间切换。

## 安装与使用

网页直接打开上方链接。Android 版可从本仓库的 **Releases** 下载最新 APK，安装后无需联网查阅。已有旧版时，直接安装新版即可覆盖升级。

本地运行网页：

```sh
cd civ6-pocket/dist
python3 -m http.server 8765
```

浏览器打开 `http://localhost:8765/`。Android 项目位于 [`android-app/`](android-app/)，鸿蒙项目位于 [`harmony-app/`](harmony-app/)；各自构建方法见目录内 README。网页源码、数据生成脚本位于 [`civ6-pocket/`](civ6-pocket/)。

## 数据来源

游戏规则资料依据[文明百科 · 简体中文 · 风云变幻规则集](https://www.civilopedia.net/zh-CN/gathering-storm/concepts/intro/)整理，覆盖其[科技](https://www.civilopedia.net/zh-CN/gathering-storm/technologies/)、[市政](https://www.civilopedia.net/zh-CN/gathering-storm/civics/)、[奇观](https://www.civilopedia.net/zh-CN/gathering-storm/wonders/)、[地形与地貌](https://www.civilopedia.net/zh-CN/gathering-storm/features/)、[资源](https://www.civilopedia.net/zh-CN/gathering-storm/resources/)、[城邦](https://www.civilopedia.net/zh-CN/gathering-storm/citystates/)等条目。词条图标取自文明百科对应的静态图片资源，并分别保存在 `civ6-pocket/dist/images/` 与 Android 离线资源中。

采集与整理脚本见 [`build_data.py`](civ6-pocket/scripts/build_data.py) 和 [`fetch_icons.py`](civ6-pocket/scripts/fetch_icons.py)。生成的数据文件保留名称、规则、效果及词条关联，不收录历史背景文章。游戏速度、资料片、DLC 和可选模式会影响实际数值与可用条目，请以游戏内当前规则为准。

本项目是非官方爱好者作品；《文明 VI》名称、游戏资料及图像的权利归各自权利人所有。**Applespriter** 是本项目的制作署名，不表示对原游戏内容拥有权利。
