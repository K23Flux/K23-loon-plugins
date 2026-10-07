# K23-loon-plugins

自用 [Loon](https://nsloon.com) 插件仓库，插件文件都在 [`plugins/`](plugins/) 下，格式为 `.lpx`。改动记录见 [CHANGELOG.md](CHANGELOG.md)。

**使用方法：** 在手机上点插件后面的「一键导入」，会直接跳到 Loon 并弹出安装；也可以复制「订阅链接」，到 Loon →「配置」→「插件」→「+」里粘贴。

## 插件列表

### 去广告

| 插件 | 用途 | 一键导入 | 订阅链接 |
| --- | --- | --- | --- |
| （暂无） | | | |

### 重定向与重写

| 插件 | 用途 | 一键导入 | 订阅链接 |
| --- | --- | --- | --- |
| （暂无） | | | |

### 脚本与工具

| 插件 | 用途 | 一键导入 | 订阅链接 |
| --- | --- | --- | --- |
| （暂无） | | | |

### 其他

| 插件 | 用途 | 一键导入 | 订阅链接 |
| --- | --- | --- | --- |
| （暂无） | | | |

<!--
新增插件时，在对应分类的表格里加一行，并删掉该表里「（暂无）」那一行。
把 xxx 换成插件文件名（不带扩展名）：

| 插件名称 | 一句话说明用途 | [一键导入](https://www.nsloon.com/openloon/import?plugin=https://raw.githubusercontent.com/K23Flux/K23-loon-plugins/main/plugins/xxx.lpx) | `https://raw.githubusercontent.com/K23Flux/K23-loon-plugins/main/plugins/xxx.lpx` |

分类不合适时可以新增小节。
-->

## 说明

- GitHub raw 链接有几分钟缓存，仓库刚更新时拉不到最新内容，稍等一会儿再刷新。
- 「一键导入」是 `nsloon.com` 的跳转页，GitHub 会过滤 `loon://` 这类自定义协议，所以不能直接写 `loon://`。

## 插件文件约定

- 位置：`plugins/`，扩展名 `.lpx`，文件名用小写英文和连字符。
- 头部元信息写完整：

  ```
  #!name = 插件名称
  #!desc = 一句话说明用途
  #!author = K23Flux
  #!homepage = https://github.com/K23Flux/K23-loon-plugins
  #!icon = 图标链接
  ```

- 仓库是公开的，插件里不放节点、密码、UUID 等私人信息。
