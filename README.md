# K23 Loon Plugins

[Loon](https://nsloon.com) 插件合集，格式为 `.lpx`。同一个站点的功能合并在一个插件里，每项功能都可以在插件设置中单独开关。

## 安装

- **一键导入**：在装有 Loon 的 iPhone / iPad 上点下面表格里的「一键导入」，会跳到 Loon 并弹出安装。
- **手动添加**：复制「订阅链接」，到 Loon →「配置」→「插件」→ 右上角「+」粘贴。

安装后在 Loon 的插件列表里点开插件，就能调整各项功能的开关和参数。

## 插件列表

### 站点聚合

| 插件 | 功能 | 一键导入 | 订阅链接 |
| --- | --- | --- | --- |
| NodeSeek 聚合 | 外链直跳：跳过外链提醒页，直接打开目标地址<br>自动签到：自动获取 Cookie，每天在设定时段内随机时间签到领鸡腿，漏签自动补签 | [一键导入](https://www.nsloon.com/openloon/import?plugin=https://raw.githubusercontent.com/K23Flux/K23-loon-plugins/main/plugins/nodeseek.lpx) | `https://raw.githubusercontent.com/K23Flux/K23-loon-plugins/main/plugins/nodeseek.lpx` |

## 使用前须知

- **需要 MITM**：插件要解密对应站点的 HTTPS 流量才能生效，请先在 Loon 里安装并信任证书，并打开 MITM。
- **版本要求**：Loon 3.5.1(978) 及以上。
- **NodeSeek 自动签到怎么用**：装好插件后，用 Safari 登录并打开 [nodeseek.com](https://www.nodeseek.com)，看到「Cookie 获取成功」的通知就可以了，之后每天自动签到。Cookie 只保存在你自己手机的 Loon 里，不会上传到任何地方。
- **更新有延迟**：GitHub raw 链接有几分钟缓存，仓库刚更新时可能拉不到最新内容，稍等再刷新。

## 更新记录

见 [CHANGELOG.md](CHANGELOG.md)。

## 说明

插件仅供学习交流使用，使用产生的后果由使用者自行承担。有问题或建议欢迎提 [Issue](https://github.com/K23Flux/K23-loon-plugins/issues)。
