# 参数

默认情况下，watchtower 会监控它所连接的 Docker 守护进程中所有正在运行的容器（通常是本地 Docker 守护进程，但可通过下一节的 `--host` 选项覆盖）。不过，你也可以在启动 watchtower 时通过传递容器名称参数来限制监控范围。

```bash
$ docker run -d \
    --name watchtower \
    -v /var/run/docker.sock:/var/run/docker.sock \
    marrrrrrrrry/watchtower \
    nginx redis
```

上述示例中，watchtower 仅监控名为 "nginx" 与 "redis" 的容器，其余容器将被忽略。如果不希望 watchtower 以守护进程运行，可以传递 `--run-once` 并在执行后移除容器。

```bash
$ docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    marrrrrrrrry/watchtower \
    --run-once \
    nginx redis
```

上述示例会对指定容器执行一次升级尝试。该模式会启用更详细的调试输出，便于交互式使用；完成后容器会因 `--rm` 自动退出并删除。

当未指定任何参数时，watchtower 将监控所有正在运行的容器。

## Secrets/Files

部分参数也可以引用文件，此时会使用该文件内容作为值。这有助于避免在配置文件或命令行中明文放置敏感信息。

当前支持以下参数（及对应的 `WATCHTOWER_` 环境变量）：
- `notification-url`
- `notification-email-server-password`
- `notification-slack-hook-url`
- `notification-msteams-hook`
- `notification-gotify-token`
- `http-api-token`

## docker-compose 示例
```yaml
secrets:
  access_token:
    file: access_token

services:
  watchtower:
    secrets:
      - access_token
    environment:
      - WATCHTOWER_HTTP_API_TOKEN=/run/secrets/access_token
```

## 帮助
显示受支持标志的文档。

```text
            Argument: --help
Environment Variable: N/A
                Type: N/A
             Default: N/A
```

## 时区
设置 Watchtower 日志与可选 Cron 调度参数（`--schedule`）使用的时区。如果未设置该环境变量，Watchtower 将使用默认时区：UTC。要查找正确值，请参阅[此列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)，找到你的位置并使用 _TZ Database Name_ 的值，例如 _Europe/Rome_。也可通过挂载宿主机的 `/etc/localtime` 文件设置时区：`-v /etc/localtime:/etc/localtime:ro`。

```text
Environment Variable: TZ
            Argument: N/A
                Type: String
             Default: "UTC"
```

## 清理旧镜像
更新后移除旧镜像。指定该标志后，watchtower 会在用新镜像重启容器后移除旧镜像，以避免系统中积累孤儿镜像。

```text
            Argument: --cleanup
Environment Variable: WATCHTOWER_CLEANUP
                Type: Boolean
             Default: false
```

## 移除匿名卷
更新后移除匿名卷。指定该标志后，watchtower 会在用新镜像重启前移除容器中的所有匿名卷。命名卷不会被移除。

```text
            Argument: --remove-volumes
Environment Variable: WATCHTOWER_REMOVE_VOLUMES
                Type: Boolean
             Default: false
```

## 调试
启用带有详细日志的调试模式。

::: info 说明
`--log-level debug` 的别名。参见[最大日志级别](#最大日志级别)。不接收参数；使用 `--debug true` **不会**生效。
:::

```text
            Argument: --debug, -d
Environment Variable: WATCHTOWER_DEBUG
                Type: Boolean
             Default: false
```

## 跟踪
启用更为详细的跟踪模式。注意：可能暴露凭据。

::: info 说明
`--log-level trace` 的别名。参见[最大日志级别](#最大日志级别)。不接收参数；使用 `--trace true` **不会**生效。
:::

```text
            Argument: --trace
Environment Variable: WATCHTOWER_TRACE
                Type: Boolean
             Default: false
```

## 最大日志级别
将写入 STDERR 的最大日志级别（在容器中使用 `docker log` 时可见）。

```text
            Argument: --log-level
Environment Variable: WATCHTOWER_LOG_LEVEL
     Possible values: panic, fatal, error, warn, info, debug or trace
             Default: info
```

## 日志格式
设置控制台输出的日志格式。

```text
            Argument: --log-format, -l
Environment Variable: WATCHTOWER_LOG_FORMAT
     Possible values: Auto, LogFmt, Pretty or JSON
             Default: Auto
```

## ANSI 颜色
在日志输出中禁用 ANSI 颜色转义序列。

```text
            Argument: --no-color
Environment Variable: NO_COLOR
                Type: Boolean
             Default: false
```

## Docker 主机
Docker 守护进程的连接地址。可通过指定 `tcp://hostname:port` 指向远程主机。

```text
            Argument: --host, -H
Environment Variable: DOCKER_HOST
                Type: String
             Default: "unix:///var/run/docker.sock"
```

## Docker API 版本
Docker 客户端连接到 Docker 守护进程时使用的 API 版本。最小支持版本为 1.24。

```text
            Argument: --api-version, -a
Environment Variable: DOCKER_API_VERSION
                Type: String
             Default: "1.24"
```

## 包含重启中容器
将处于重启中的容器也纳入监控与更新范围。

```text
            Argument: --include-restarting
Environment Variable: WATCHTOWER_INCLUDE_RESTARTING
                Type: Boolean
             Default: false
```

## 包含已停止容器
将处于 created 与 exited 状态的容器也纳入范围。

```text
            Argument: --include-stopped, -S
Environment Variable: WATCHTOWER_INCLUDE_STOPPED
                Type: Boolean
             Default: false
```

## 复活已停止容器
当镜像已更新时启动任何已停止的容器。仅与 `--include-stopped` 搭配使用。

```text
            Argument: --revive-stopped
Environment Variable: WATCHTOWER_REVIVE_STOPPED
                Type: Boolean
             Default: false
```

## 轮询间隔
轮询间隔（秒）。该值控制 watchtower 检查新镜像的频率。`--schedule` 与轮询间隔二选一，不能同时定义。

```text
            Argument: --interval, -i
Environment Variable: WATCHTOWER_POLL_INTERVAL
                Type: Integer
             Default: 86400 (24 hours)
```

## 按启用标签过滤
仅监控并更新设置了 `com.centurylinklabs.watchtower.enable=true` 的容器。

```text
            Argument: --label-enable
Environment Variable: WATCHTOWER_LABEL_ENABLE
                Type: Boolean
             Default: false
```

## 按禁用标签过滤
当未传递 `--label-enable` 时，__不__监控并更新设置了 `com.centurylinklabs.watchtower.enable=false` 的容器。注意：按启用标签过滤与按禁用标签过滤不可同时使用。

## 按容器名禁用特定容器
监控并更新容器，但排除名称在给定集合中的容器。

在无法设置标签时可用于排除特定容器；即使这些容器设置了启用标签为 true，列表中的容器也会被排除。

```text
            Argument: --disable-containers, -x
Environment Variable: WATCHTOWER_DISABLE_CONTAINERS
                Type: Comma- or space-separated string list
             Default: ""
```

## 仅监控不更新
仅监控新镜像、发送通知并调用[pre-check/post-check 钩子](../lifecycle-hooks/index.md)，但__不会__更新容器。

::: info
由于 Docker API 限制，仍会从镜像仓库拉取最新镜像。HEAD 摘要检查允许在没有变更时跳过拉取，但为了识别具体变更，只要仓库摘要与本地镜像摘要不匹配，就仍会执行拉取。
:::

```text
            Argument: --monitor-only
Environment Variable: WATCHTOWER_MONITOR_ONLY
                Type: Boolean
             Default: false
```

监控仅模式也可通过容器标签在每个容器上单独指定：`com.centurylinklabs.watchtower.monitor-only=true`。

另见[标签优先于参数](#标签优先于参数)一节，了解同时设置参数与标签时的行为。

## 标签优先于参数

默认情况下，参数优先于标签。这意味着如果设置了 `WATCHTOWER_MONITOR_ONLY=true` 或使用了 `--monitor-only`，即便某容器设置了 `com.centurylinklabs.watchtower.monitor-only=false`，也不会更新该容器。如果设置了 `WATCHTOWER_LABEL_TAKE_PRECEDENCE=true` 或使用了 `--label-take-precedence`，则仍会更新该容器。

该行为也适用于不拉取镜像的选项：如果设置了 `WATCHTOWER_NO_PULL=true` 或使用了 `--no-pull`，即便容器标签 `com.centurylinklabs.watchtower.no-pull=false`，也不会拉取；若设置了 `WATCHTOWER_LABEL_TAKE_PRECEDENCE=true` 或使用了 `--label-take-precedence`，则会拉取新镜像。

```text
            Argument: --label-take-precedence
Environment Variable: WATCHTOWER_LABEL_TAKE_PRECEDENCE
                Type: Boolean
             Default: false
```

## 不重启容器
更新后不重启容器。该选项在容器启动由外部系统（如 systemd）管理时很有用。

```text
            Argument: --no-restart
Environment Variable: WATCHTOWER_NO_RESTART
                Type: Boolean
             Default: false
```

## 不拉取新镜像
不从仓库拉取新镜像。指定该标志后，watchtower 不会尝试从仓库拉取新镜像，而仅监控本地镜像缓存的变化。若你在 Docker 主机上直接构建新镜像且不推送至仓库，可使用该选项。

```text
            Argument: --no-pull
Environment Variable: WATCHTOWER_NO_PULL
                Type: Boolean
             Default: false
```

也可在每个容器上通过标签指定不拉取：`com.centurylinklabs.watchtower.no-pull=true`。

另见[标签优先于参数](#标签优先于参数)了解同时设置参数与标签时的行为。

## 不发送启动消息
watchtower 启动后不发送消息。否则将有一条 info 级别通知。

```text
            Argument: --no-startup-message
Environment Variable: WATCHTOWER_NO_STARTUP_MESSAGE
                Type: Boolean
             Default: false
```

## 运行一次
立即针对给定容器名列表执行一次更新尝试并退出。

```text
            Argument: --run-once, -R
Environment Variable: WATCHTOWER_RUN_ONCE
                Type: Boolean
             Default: false
```

## HTTP API 模式
以 HTTP API 模式运行，仅允许通过 HTTP 请求触发镜像更新。详见 [HTTP API](../http-api-mode/index.md)。

```text
            Argument: --http-api-update
Environment Variable: WATCHTOWER_HTTP_API_UPDATE
                Type: Boolean
             Default: false
```

## HTTP API Token
为 HTTP API 请求设置认证 token。也可引用文件，此时使用文件内容。

```text
            Argument: --http-api-token
Environment Variable: WATCHTOWER_HTTP_API_TOKEN
                Type: String
             Default: -
```

## HTTP API 保持周期轮询
在启用 HTTP API 模式时仍保持周期性更新；否则 HTTP API 会阻止周期轮询。

```text
            Argument: --http-api-periodic-polls
Environment Variable: WATCHTOWER_HTTP_API_PERIODIC_POLLS
                Type: Boolean
             Default: false
```

## 按 scope 过滤
仅更新设置了 `com.centurylinklabs.watchtower.scope` 标签且其值与参数一致的容器。用于[运行多个实例](../running-multiple-instances/index.md)。

::: info 按缺失的 scope 过滤
如希望其他 watchtower 实例忽略带有 scope 的容器，将该参数设为 `none`。未设置时，watchtower 会不区分 scope 地更新所有容器。
:::

```text
            Argument: --scope
Environment Variable: WATCHTOWER_SCOPE
                Type: String
             Default: -
```

## HTTP API 指标
启用通过 HTTP 暴露的 Prometheus 指标端点。详见 [指标](../metrics/index.md)。

```text
            Argument: --http-api-metrics
Environment Variable: WATCHTOWER_HTTP_API_METRICS
                Type: Boolean
             Default: false
```

## 调度
使用 6 字段的 [Cron 表达式](https://pkg.go.dev/github.com/robfig/cron@v1.2.0?tab=doc#hdr-CRON_Expression_Format) 定义检查新镜像的时间与频率。`--schedule` 与轮询间隔二选一，不能同时定义。例如：`--schedule "0 0 4 * * *"`。

```text
            Argument: --schedule, -s
Environment Variable: WATCHTOWER_SCHEDULE
                Type: String
             Default: -
```

## 滚动重启
一次仅重启一个镜像，而不是同时停止并启动所有容器。通常与生命周期钩子配合以实现零停机部署。

```text
            Argument: --rolling-restart
Environment Variable: WATCHTOWER_ROLLING_RESTART
                Type: Boolean
             Default: false
```

## 停止超时
强制停止容器前的等待时间。设置后会将默认值（`10s`）改为给定值。例如：`--stop-timeout 30s` 将超时设置为 30 秒。

```text
            Argument: --stop-timeout
Environment Variable: WATCHTOWER_TIMEOUT
                Type: Duration
             Default: 10s
```

## TLS 验证
连接 Docker socket 时使用 TLS 并验证服务器证书。用于通知的相关配置见下文。

```text
            Argument: --tlsverify
Environment Variable: DOCKER_TLS_VERIFY
                Type: Boolean
             Default: false
```

## HEAD 拉取失败警告
何时对 HEAD 拉取请求失败发出警告。Auto 表示在仓库已知支持并可能对拉取请求进行速率限制时（主要是 docker.io）发出警告。

```text
            Argument: --warn-on-head-failure
Environment Variable: WATCHTOWER_WARN_ON_HEAD_FAILURE
     Possible values: always, auto, never
             Default: auto
```

## 健康检查
返回成功的退出码，以便配合 Docker `HEALTHCHECK` 使用。该检查较为简单，仅检查容器内是否仍有进程运行，因为这是 watchtower 容器已知的唯一失败形态。

::: info 仅用于 HEALTHCHECK
不要将其放在主容器可执行命令行上；它仅适用于 Docker HEALTHCHECK。
:::

```text
            Argument: --health-check
```

## 稳定的机器可读输出（porcelain）
将会话结果以稳定、机器可读的格式写入 STDOUT（由 VERSION 指示）。

等价于：

```text
        --notification-url logger://
        --notification-log-stdout
        --notification-report
        --notification-template porcelain.VERSION.summary-no-log

            Argument: --porcelain, -P
Environment Variable: WATCHTOWER_PORCELAIN
     Possible values: v1
             Default: -
```
