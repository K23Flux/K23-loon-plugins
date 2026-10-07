# 更新记录

最新的记录在最上面。

## 2026-10-07 · plugins/nodeseek-jump.lpx、README.md、CHANGELOG.md、plugins/.gitkeep

- 改了什么：新增第一个插件「NodeSeek 外链直跳」。用新版 Rewrite 语法匹配 `nodeseek.com/jump?to=...`，把提醒页的响应体换成一小段 HTML/JS，由它解码 `to` 参数并直接跳转；只放行 http/https 地址，其他情况显示「无效的跳转地址」。README「重定向与重写」分类加上这一行，带一键导入和订阅链接；删掉占位用的 `plugins/.gitkeep`。
- 为什么：NodeSeek 点外链会先停在一个提醒页，要多点一次才能出去。新版 Rewrite 没有 URL 解码函数，所以用 `response.body.mock` 返回页面来处理。
- 影响什么：导入后会对 `www.nodeseek.com` 做 MITM（需要已安装并信任 Loon 证书），要求 Loon 3.5.1(978) 以上。插件还没有在 Loon 里实测。

## 2026-10-07 · README.md、CHANGELOG.md

- 改了什么：README 的插件列表改成按分类（去广告、重定向与重写、脚本与工具、其他）分表，每个插件一行，带「一键导入」跳转链接（`https://www.nsloon.com/openloon/import?plugin=` + raw 地址）和订阅链接；插件扩展名从 `.plugin` 改为 `.lpx`；作者统一为 `K23Flux`；补了新增插件时的填写模板。
- 为什么：插件统一用 `.lpx` 格式，且希望在 GitHub 主页上点一下就能跳到 Loon 导入，不用手动复制链接。
- 影响什么：只改文档，还没有插件。以后新增插件按 README 里的模板在对应分类加一行。

## 2026-10-07 · README.md、CHANGELOG.md、plugins/.gitkeep

- 改了什么：搭好仓库基础结构。新建 `plugins/` 目录（用 `.gitkeep` 占位，放进第一个插件后可以删掉）；新建 `CHANGELOG.md`；重写 `README.md`，加上插件列表表格模板、Loon 订阅方法和插件文件约定。
- 为什么：仓库原来只有一行说明的 README，先把目录和文档格式定下来，后面加插件时照着填。
- 影响什么：只有文档和目录结构，还没有任何插件，Loon 端暂时没有可订阅的内容。
