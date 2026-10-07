# 更新记录

最新的记录在最上面。

## 2026-10-07 · README.md、CHANGELOG.md

- 改了什么：README 的插件列表改成按分类（去广告、重定向与重写、脚本与工具、其他）分表，每个插件一行，带「一键导入」跳转链接（`https://www.nsloon.com/openloon/import?plugin=` + raw 地址）和订阅链接；插件扩展名从 `.plugin` 改为 `.lpx`；作者统一为 `K23Flux`；补了新增插件时的填写模板。
- 为什么：插件统一用 `.lpx` 格式，且希望在 GitHub 主页上点一下就能跳到 Loon 导入，不用手动复制链接。
- 影响什么：只改文档，还没有插件。以后新增插件按 README 里的模板在对应分类加一行。

## 2026-10-07 · README.md、CHANGELOG.md、plugins/.gitkeep

- 改了什么：搭好仓库基础结构。新建 `plugins/` 目录（用 `.gitkeep` 占位，放进第一个插件后可以删掉）；新建 `CHANGELOG.md`；重写 `README.md`，加上插件列表表格模板、Loon 订阅方法和插件文件约定。
- 为什么：仓库原来只有一行说明的 README，先把目录和文档格式定下来，后面加插件时照着填。
- 影响什么：只有文档和目录结构，还没有任何插件，Loon 端暂时没有可订阅的内容。
