# 容器选择

默认情况下，watchtower 会监控所有容器。不过，有时只需要更新部分容器。

有两种选择：

- **完全排除**：可将容器完全排除在 watchtower 监控之外。
- **仅监控**：watchtower 仅检查更新、发送通知并触发容器上的 [pre-check/post-check 钩子](https://marrrrrrrrry.github.io/watchtower/lifecycle-hooks/)，但不会执行更新。

## 完全排除

如需排除某些容器，请在这些容器上设置标签 `com.centurylinklabs.watchtower.enable=false`（该标签设置在被排除的容器上，不是在 watchtower 容器上）。

::: code-group
```docker [dockerfile]
LABEL com.centurylinklabs.watchtower.enable="false"
```
```bash [docker run]
docker run -d --label=com.centurylinklabs.watchtower.enable=false someimage
```
```yaml [docker-compose]
version: "3"
services:
  someimage:
    container_name: someimage
    labels:
      - "com.centurylinklabs.watchtower.enable=false"
```
:::

如果希望 [仅包含设置了 enable 标签的容器](https://marrrrrrrrry.github.io/watchtower/arguments/#filter_by_enable_label)，请在 watchtower 启动时传入 `--label-enable` 或设置环境变量 `WATCHTOWER_LABEL_ENABLE=true`，并在要监控的容器上设置标签 `com.centurylinklabs.watchtower.enable=true`。

::: code-group
```docker [dockerfile]
LABEL com.centurylinklabs.watchtower.enable="true"
```
```bash [docker run]
docker run -d --label=com.centurylinklabs.watchtower.enable=true someimage
```
```yaml [docker-compose]
version: "3"
services:
  someimage:
    container_name: someimage
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
```
:::

如果希望创建监控范围（scope），需要 [运行多个实例并为各自设置 scope](https://containrrr.dev/watchtower/running-multiple-instances/)。

Watchtower 会根据配置的多个条件过滤运行中的容器；仅当所有条件都满足时容器才会被监控。例如：

- 如果容器名称在监控列表中（`--name` 非空），但未启用（`com.centurylinklabs.watchtower.enable=false`），则不会监控；
- 如果容器名称不在监控列表中（`--name` 非空），即使启用（`com.centurylinklabs.watchtower.enable=true` 且设置了 `--label-enable`），也不会监控；

## 仅监控

可以将个别容器标记为仅监控（不执行更新）。

为该容器设置标签 `com.centurylinklabs.watchtower.monitor-only=true`：
```docker
LABEL com.centurylinklabs.watchtower.monitor-only="true"
```
或者作为 `docker run` 命令的一部分：
```bash
docker run -d --label=com.centurylinklabs.watchtower.monitor-only=true someimage
```
当在容器上设置该标签时，watchtower 会将其视为设置了 `WATCHTOWER_MONITOR_ONLY`，但该效果仅对该容器生效。

