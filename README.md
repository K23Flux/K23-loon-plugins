# K23-loon-plugins

自用 Loon 插件仓库。插件文件都在 [`plugins/`](plugins/) 下，改动记录见 [CHANGELOG.md](CHANGELOG.md)。

## 插件列表

| 插件 | 用途 | 订阅链接 |
| --- | --- | --- |
| （暂无） | | |

<!--
新增插件时，在上表按下面的格式加一行，并删掉「（暂无）」那一行：

| 插件名称 | 一句话说明用途 | https://raw.githubusercontent.com/K23Flux/K23-loon-plugins/main/plugins/xxx.plugin |
-->

## 使用方法

1. 复制上表里的订阅链接。
2. 打开 Loon →「配置」→「插件」→ 右上角「+」，粘贴链接后保存。
3. 以后更新：在插件页下拉刷新，或点「更新全部」。

GitHub raw 链接有几分钟缓存，仓库刚更新时如果拉不到最新内容，稍等一会儿再刷新。

## 插件文件约定

- 位置：`plugins/`，扩展名 `.plugin`，文件名用小写英文和连字符。
- 头部元信息写完整：

  ```
  #!name = 插件名称
  #!desc = 一句话说明用途
  #!author = K23Flux
  #!homepage = https://github.com/K23Flux/K23-loon-plugins
  #!icon = 图标链接
  ```

- 仓库是公开的，插件里不放节点、密码、UUID 等私人信息。
