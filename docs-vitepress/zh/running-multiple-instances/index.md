# 运行多实例

默认情况下，Watchtower 会清理其他实例，并且不允许在同一个 Docker 主机或 Swarm 上同时运行多个实例。你可以通过为每个运行中的实例定义一个 [scope](https://marrrrrrrrry.github.io/watchtower/arguments/#filter_by_scope)（范围）来覆盖这一行为。

::: info
- 多个实例不能使用相同的 scope；
- 未设置 scope 的实例会清理其他正在运行的实例，即使它们已经定义了 scope；
- 当 scope 设置为 `none` 时，`com.centurylinklabs.watchtower.scope=none`、`com.centurylinklabs.watchtower.scope=`（空值）以及缺少 `com.centurylinklabs.watchtower.scope` 标签都会被视为 `none`。这使得你可以在同一台机器上同时运行带 scope 与不带 scope 的 Watchtower 实例。
:::

要定义实例的监控范围，可以在启动时使用 `--scope` 参数或 `WATCHTOWER_SCOPE` 环境变量，并为需要被该实例纳入范围的容器（包括实例自身）设置相同值的 `com.centurylinklabs.watchtower.scope` 标签。

例如，在 Docker Compose 配置文件中：

```yaml
version: '3'

services:
  app-with-scope:
    image: myapps/monitored-by-watchtower
    labels: [ "com.centurylinklabs.watchtower.scope=myscope" ]

  scoped-watchtower:
    image: marrrrrrrrry/watchtower
    volumes: [ "/var/run/docker.sock:/var/run/docker.sock" ]
    command: --interval 30 --scope myscope
    labels: [ "com.centurylinklabs.watchtower.scope=myscope" ] 

  unscoped-app-a:
    image: myapps/app-a

  unscoped-app-b:
    image: myapps/app-b
    labels: [ "com.centurylinklabs.watchtower.scope=none" ]
    
  unscoped-app-c:
    image: myapps/app-b
    labels: [ "com.centurylinklabs.watchtower.scope=" ]
    
  unscoped-watchtower:
    image: marrrrrrrrry/watchtower
    volumes: [ "/var/run/docker.sock:/var/run/docker.sock" ]
    command: --interval 30 --scope none
```
