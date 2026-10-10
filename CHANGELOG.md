# 更新记录

最新的记录在最上面。

## 2026-10-10 · plugins/nodeseek.lpx、scripts/nodeseek-checkin.js、README.md、CHANGELOG.md

- 改了什么：NodeSeek 自动签到加上可选的 Telegram 推送。插件设置多了两项：「Telegram Bot Token」和「Telegram Chat ID」，两项都填了，签到结果（签到成功、Cookie 失效、被 Cloudflare 拦截、其他失败、还没有 Cookie）除了本机通知，还会通过自己的机器人发一条到 Telegram；有一项没填就和以前一样只发本机通知。推送失败只写进脚本日志，不影响签到本身。「Cookie 获取成功 / 已更新」只发本机通知，不推 Telegram。
- 为什么：手机通知容易划掉，想在 Telegram 里留一份签到记录，和别的签到通知放在一起看。
- 影响什么：已经装了插件的，在 Loon 里更新插件后才有这两项设置；不填就没有任何变化。Token 和 Chat ID 只存在本机 Loon 的插件设置里，不进仓库。推送请求发往 `api.telegram.org`，按 Loon 的分流规则走，需要能连上 Telegram 的节点。脚本逻辑只用模拟数据跑过（填了、没填、只填一项、推送失败几种情况），还没有在 Loon 里实测。

## 2026-10-07 · plugins/nodeseek.lpx、scripts/nodeseek-checkin.js、plugins/nodeseek-jump.lpx（删除）、README.md、CHANGELOG.md

- 改了什么：新增「NodeSeek 聚合」插件，把原来的「NodeSeek 外链直跳」并进来，再加上新功能「自动签到」，每项功能一个开关。签到脚本一份两用：登录状态下打开 `www.nodeseek.com` 时保存 Cookie 和 User-Agent（只在登录凭证 `session` 变化时通知）；每天在设定的那一小时里随机挑一分钟（默认 08:00–08:59，按手机本地时间），用保存的 Cookie 请求 `POST /api/attendance` 签到并通知结果；时段内没签上的，之后每两小时补签一次，失败只在当天第一次通知、最多重试 4 次。可调参数：外链直跳开关、自动签到开关、签到时段（整点，默认 8）、随机鸡腿、是否继续获取 Cookie、签到走的策略组（默认留空，跟随分流规则）。删除 `plugins/nodeseek-jump.lpx`；新建 `scripts/` 目录放脚本；README 改成面向访客的主页：安装方法、插件列表、使用前须知，去掉仓库内部的维护约定和填写模板。
- 为什么：NodeSeek 的功能以后还会加，合成一个插件按开关管理，不用每个功能装一个插件；仓库是公开的，主页给别人看，维护约定只留给自己看；签到想每天自动做，时间在早上 8 点到 9 点之间随机、不固定在同一分钟，Cookie 不用手动抄。
- 影响什么：旧的 `nodeseek-jump.lpx` 订阅链接失效，已经导入过的要在 Loon 里删掉旧插件，重新导入 `nodeseek.lpx`。仍然只对 `www.nodeseek.com` 做 MITM，要求 Loon 3.5.1(978) 以上。Cookie 只存在本机 Loon 的持久化存储里，不进仓库。NodeSeek 有 Cloudflare 防护，后台签到可能被拦，脚本会提示。签到时段内脚本每分钟被唤起一次（没到时间就立刻退出），Loon 的脚本日志里会多出这些记录。签到接口对照过油猴脚本「星渊NS助手」的自动签到模块；脚本逻辑只用模拟数据跑过，整个插件还没有在 Loon 里实测。

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
