# 通知

Watchtower 在容器更新时可发送通知。通知通过日志系统中的钩子触发，基于 [logrus](http://github.com/sirupsen/logrus)。

::: info 使用环境变量配置多个通知
Viper 存在一个问题（https://github.com/spf13/viper/issues/380），导致在通过环境变量时无法使用逗号分隔的切片。
一种可行的解决方案是为变量值加上引号，并将逗号替换为空格：
```
WATCHTOWER_NOTIFICATIONS="slack msteams"
```
如果你使用 `docker-compose`，请确保在 `.yml` 文件中为环境变量赋值时不要使用双引号（`"`），以避免 watchtower 启动时出现意外错误。
:::

## 设置项

- `--notifications-level`（env `WATCHTOWER_NOTIFICATIONS_LEVEL`）：控制通知的日志级别；默认 `info`。可选值：`panic`、`fatal`、`error`、`warn`、`info`、`debug`、`trace`。
- `--notifications-hostname`（env `WATCHTOWER_NOTIFICATIONS_HOSTNAME`）：自定义标题/主题中的主机名；用于覆盖操作系统主机名。
- `--notifications-delay`（env `WATCHTOWER_NOTIFICATIONS_DELAY`）：发送通知前的延迟（秒）。
- Watchtower 每次启动都会发送一条通知。该行为可以通过参数进行[更改](/zh/arguments/#without-sending-a-startup-message)。
- `--notification-title-tag`（env `WATCHTOWER_NOTIFICATION_TITLE_TAG`）：在标题中添加前缀；在运行多个 watchtower 时很有用。
- `--notification-skip-title`（env `WATCHTOWER_NOTIFICATION_SKIP_TITLE`）：不向通知服务传递标题参数；若服务未配置标题，将移除标题。
- `--notification-log-stdout`（env `WATCHTOWER_NOTIFICATION_LOG_STDOUT`）：启用 `logger://` shoutrrr 服务向 stdout 输出。

## 通过 [Shoutrrr](https://github.com/containrrr/shoutrrr) 发送通知

要通过 shoutrrr 发送通知，可以设置以下命令行选项或相应环境变量：

- `--notification-url`（env `WATCHTOWER_NOTIFICATION_URL`）：使用的 shoutrrr 服务 URL；也可引用文件，使用其内容。

访问 [containrrr.dev/shoutrrr/v0.8/services/overview](https://containrrr.dev/shoutrrr/v0.8/services/overview) 了解可用的服务 URL。你可以通过空格分隔多个服务 URL（见下方示例）。

你可以通过设置模板来自定义消息内容：

- `--notification-template`（env `WATCHTOWER_NOTIFICATION_TEMPLATE`）：用于消息的模板。

模板为 Go [template](https://golang.org/pkg/text/template/)，可用于格式化 [log entry](https://pkg.go.dev/github.com/sirupsen/logrus?tab=doc#Entry) 列表或 `notification.Data` 结构体。

除非指定了 `notification-report` 标志，否则使用简单模板：

- `--notification-report`（env `WATCHTOWER_NOTIFICATION_REPORT`）：使用会话报告作为通知模板数据。

## 简单模板

<div v-pre>

如果未设置，默认值为 `{{range .}}{{.Message}}{{println}}{{end}}`。下例使用了一个同时输出时间戳与日志级别的模板。

::: tip 自定义日期格式
如需调整日期/时间格式，需要展示[参考时间](https://pkg.go.dev/time#pkg-constants)（_Mon Jan 2 15:04:05 MST 2006_）在你的自定义格式中的显示方式。
例如：一年中的日需为 1，月份需为 2（二月），小时为 3（或 24 小时制为 15）等。
:::

示例：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_NOTIFICATION_URL="discord://token@channel slack://watchtower@token-a/token-b/token-c" \
  -e WATCHTOWER_NOTIFICATION_TEMPLATE="{{range .}}{{.Time.Format \"2006-01-02 15:04:05\"}} ({{.Level}}): {{.Message}}{{println}}{{end}}" \
  marrrrrrrrry/watchtower
```

</div>

## 报表模板

<div v-pre>

默认的报表通知模板如下：
```go
{{- if .Report -}}
  {{- with .Report -}}
    {{- if ( or .Updated .Failed ) -}}
{{len .Scanned}} Scanned, {{len .Updated}} Updated, {{len .Failed}} Failed
      {{- range .Updated}}
- {{.Name}} ({{.ImageName}}): {{.CurrentImageID.ShortID}} updated to {{.LatestImageID.ShortID}}
      {{- end -}}
      {{- range .Fresh}}
- {{.Name}} ({{.ImageName}}): {{.State}}
      {{- end -}}
      {{- range .Skipped}}
- {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
      {{- end -}}
      {{- range .Failed}}
- {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
      {{- end -}}
    {{- end -}}
  {{- end -}}
{{- else -}}
  {{range .Entries -}}{{.Message}}{{"\n"}}{{- end -}}
{{- end -}}
```

该模板会在每次会话中，当存在已更新或更新失败的容器时发送摘要。

::: info 跳过通知
当模板渲染结果为空字符串时，将不会发送通知。默认情况下用于仅在出现值得关注的事件时发送通知。

你可以将 `{{- if ( or .Updated .Failed ) -}}` 替换为任何你希望的逻辑，以决定何时发送通知。
:::

以下示例展示了总是发送会话报告的自定义报表模板：

::: code-group
```bash [docker run]
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_NOTIFICATION_REPORT="true" \
  -e WATCHTOWER_NOTIFICATION_URL="discord://token@channel slack://watchtower@token-a/token-b/token-c" \
  -e WATCHTOWER_NOTIFICATION_TEMPLATE="
  {{- if .Report -}}
    {{- with .Report -}}
  {{len .Scanned}} Scanned, {{len .Updated}} Updated, {{len .Failed}} Failed
        {{- range .Updated}}
  - {{.Name}} ({{.ImageName}}): {{.CurrentImageID.ShortID}} updated to {{.LatestImageID.ShortID}}
        {{- end -}}
        {{- range .Fresh}}
  - {{.Name}} ({{.ImageName}}): {{.State}}
        {{- end -}}
        {{- range .Skipped}}
  - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
        {{- end -}}
        {{- range .Failed}}
  - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
        {{- end -}}
      {{- end -}}
  {{- else -}}
    {{range .Entries -}}{{.Message}}{{"\n"}}{{- end -}}
  {{- end -}}
  " \
  marrrrrrrrry/watchtower
```
```yaml [docker-compose]
version: "3"
services:
  watchtower:
    image: marrrrrrrrry/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    env:
      WATCHTOWER_NOTIFICATION_REPORT: "true"
      WATCHTOWER_NOTIFICATION_URL: >
        discord://token@channel
        slack://watchtower@token-a/token-b/token-c
      WATCHTOWER_NOTIFICATION_TEMPLATE: |
        {{- if .Report -}}
          {{- with .Report -}}
        {{len .Scanned}} Scanned, {{len .Updated}} Updated, {{len .Failed}} Failed
              {{- range .Updated}}
        - {{.Name}} ({{.ImageName}}): {{.CurrentImageID.ShortID}} updated to {{.LatestImageID.ShortID}}
              {{- end -}}
              {{- range .Fresh}}
        - {{.Name}} ({{.ImageName}}): {{.State}}
            {{- end -}}
            {{- range .Skipped}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
            {{- end -}}
            {{- range .Failed}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
            {{- end -}}
          {{- end -}}
        {{- else -}}
          {{range .Entries -}}{{.Message}}{{"\n"}}{{- end -}}
        {{- end -}}
```
:::

</div>

## 旧版通知

为保持兼容，通知也可以使用旧版选项进行配置；当使用旧版选项时，将自动转换为 shoutrrr URL。
通过向 `--notifications`（或环境变量 `WATCHTOWER_NOTIFICATIONS`）传递逗号分隔的值指定要发送的通知类型，有效值包括：

- `email` 电子邮件
- `slack` Slack webhook
- `msteams` Microsoft Teams webhook
- `gotify` Gotify

### `notify-upgrade`
如果以 `notify-upgrade` 作为启动的第一个参数，watchtower 将生成一个 `.env` 文件，将当前的旧版通知选项转换为 shoutrrr URL。

::: code-group

```bash [docker run]
$ docker run -d \
    --name watchtower \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -e WATCHTOWER_NOTIFICATIONS=slack \
    -e WATCHTOWER_NOTIFICATION_SLACK_HOOK_URL="https://hooks.slack.com/services/xxx/yyyyyyyyyyyyyyy" \
    marrrrrrrrry/watchtower \
    notify-upgrade
```

```yaml [docker-compose.yml]
 version: "3"
   services:
     watchtower:
       image: marrrrrrrrry/watchtower
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
       env:
         WATCHTOWER_NOTIFICATIONS: slack
         WATCHTOWER_NOTIFICATION_SLACK_HOOK_URL: https://hooks.slack.com/services/xxx/yyyyyyyyyyyyyyy
       command: notify-upgrade
```
:::

然后你可以从容器中复制该文件（日志中会输出完整命令），并在当前部署中使用：

::: code-group

```bash [docker run]
$ docker run -d \
    --name watchtower \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --env-file watchtower-notifications.env \
    marrrrrrrrry/watchtower
```

```yaml [docker-compose.yml]
 version: "3"
   services:
     watchtower:
       image: marrrrrrrrry/watchtower
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
       env_file:
         - watchtower-notifications.env
```
:::

### Email

要通过电子邮件接收通知，请设置以下命令行选项或对应的环境变量：

- `--notification-email-from`（env `WATCHTOWER_NOTIFICATION_EMAIL_FROM`）：发件人地址。
- `--notification-email-to`（env `WATCHTOWER_NOTIFICATION_EMAIL_TO`）：收件人地址。
- `--notification-email-server`（env `WATCHTOWER_NOTIFICATION_EMAIL_SERVER`）：SMTP 服务器。
- `--notification-email-server-tls-skip-verify`（env `WATCHTOWER_NOTIFICATION_EMAIL_SERVER_TLS_SKIP_VERIFY`）：不验证邮件服务器 TLS 证书；仅用于测试。
- `--notification-email-server-port`（env `WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT`）：SMTP 端口，默认 `25`。
- `--notification-email-server-user`（env `WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER`）：SMTP 用户名。
- `--notification-email-server-password`（env `WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD`）：SMTP 密码；也可引用文件使用其内容。
- `--notification-email-delay`（env `WATCHTOWER_NOTIFICATION_EMAIL_DELAY`）：发送通知的延迟（秒）。
- `--notification-email-subjecttag`（env `WATCHTOWER_NOTIFICATION_EMAIL_SUBJECTTAG`）：主题前缀；在运行多个 watchtower 时有用。注意：该设置会影响所有通知类型。

示例：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_NOTIFICATIONS=email \
  -e WATCHTOWER_NOTIFICATION_EMAIL_FROM=fromaddress@gmail.com \
  -e WATCHTOWER_NOTIFICATION_EMAIL_TO=toaddress@gmail.com \
  -e WATCHTOWER_NOTIFICATION_EMAIL_SERVER=smtp.gmail.com \
  -e WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT=587 \
  -e WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER=fromaddress@gmail.com \
  -e WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD=app_password \
  -e WATCHTOWER_NOTIFICATION_EMAIL_DELAY=2 \
  marrrrrrrrry/watchtower
```

上例假设你已经有可用的 SMTP 服务器可连接。如果没有，或希望在本地部署一个简单的 SMTP 转发器，以下 `docker-compose.yml` 可作为起点。

下例假设你的域名为 `your-domain.com`，并使用对 `smtp.your-domain.com` 有效的证书。该主机名需用于 `WATCHTOWER_NOTIFICATION_EMAIL_SERVER`，否则 TLS 连接将失败（如 `Failed to send notification email` 或 `connect: connection refused`）。我们还需要为此设置添加一个网络以配置别名。如果要启用 DKIM 或其他功能，请参考 [freinet/postfix-relay](https://hub.docker.com/r/freinet/postfix-relay)。

包含 SMTP 转发器的示例：

```yaml
version: '3.8'
services:
  watchtower:
    image: marrrrrrrrry/watchtower:latest
    container_name: watchtower
    env:
      WATCHTOWER_MONITOR_ONLY: 'true'
      WATCHTOWER_NOTIFICATIONS: email
      WATCHTOWER_NOTIFICATION_EMAIL_FROM: from-address@your-domain.com
      WATCHTOWER_NOTIFICATION_EMAIL_TO: to-address@your-domain.com
      # 若使用自有证书，需使用网络别名
      WATCHTOWER_NOTIFICATION_EMAIL_SERVER: smtp.your-domain.com
      WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT: 25
      WATCHTOWER_NOTIFICATION_EMAIL_DELAY: 2
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - watchtower
    depends_on:
      - postfix

  # 用于发送状态邮件的 SMTP
  postfix:
    image: freinet/postfix-relay:latest
    expose:
      - 25
    env:
      MAILNAME: somename.your-domain.com
      TLS_KEY: '/etc/ssl/domains/your-domain.com/your-domain.com.key'
      TLS_CRT: '/etc/ssl/domains/your-domain.com/your-domain.com.crt'
      TLS_CA: '/etc/ssl/domains/your-domain.com/intermediate.crt'
    volumes:
      - /etc/ssl/domains/your-domain.com/:/etc/ssl/domains/your-domain.com/:ro
    networks:
      watchtower:
        # 该别名对于证书的正确使用至关重要
        aliases:
          - smtp.your-domain.com
networks:
  watchtower:
    external: false
```

### Slack

要在 Slack 中接收通知，在 `--notifications` 或 `WATCHTOWER_NOTIFICATIONS` 中添加 `slack`。

此外，需要通过 `--notification-slack-hook-url` 或 `WATCHTOWER_NOTIFICATION_SLACK_HOOK_URL` 设置 Slack webhook URL。该选项也可引用文件并使用其内容。

默认情况下，watchtower 将以 `watchtower` 作为消息发送者名称；你可通过 `--notification-slack-identifier` 或 `WATCHTOWER_NOTIFICATION_SLACK_IDENTIFIER` 进行自定义。

其他可选变量包括：

- `--notification-slack-channel`（env `WATCHTOWER_NOTIFICATION_SLACK_CHANNEL`）：覆盖 webhook 的默认频道，例如：`#my-custom-channel`。

示例：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_NOTIFICATIONS=slack \
  -e WATCHTOWER_NOTIFICATION_SLACK_HOOK_URL="https://hooks.slack.com/services/xxx/yyyyyyyyyyyyyyy" \
  -e WATCHTOWER_NOTIFICATION_SLACK_IDENTIFIER=watchtower-server-1 \
  -e WATCHTOWER_NOTIFICATION_SLACK_CHANNEL=#my-custom-channel \
  marrrrrrrrry/watchtower
```

### Microsoft Teams

要在 MSTeams 频道接收通知，请在 `--notifications` 或环境变量 `WATCHTOWER_NOTIFICATIONS` 中添加 `msteams`。

此外，需要通过 `--notification-msteams-hook` 或环境变量 `WATCHTOWER_NOTIFICATION_MSTEAMS_HOOK_URL` 设置 MSTeams webhook URL。该选项也可引用文件并使用其内容。

MSTeams 通知器可将通过 `log.WithField` 或 `log.WithFields` 添加的键值对作为 MSTeams 消息 facts。要启用此功能，请添加 `--notification-msteams-data` 或设置环境变量 `WATCHTOWER_NOTIFICATION_MSTEAMS_USE_LOG_DATA=true`。

示例：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_NOTIFICATIONS=msteams \
  -e WATCHTOWER_NOTIFICATION_MSTEAMS_HOOK_URL="https://outlook.office.com/webhook/xxxxxxxx@xxxxxxx/IncomingWebhook/yyyyyyyy/zzzzzzzzzz" \
  -e WATCHTOWER_NOTIFICATION_MSTEAMS_USE_LOG_DATA=true \
  marrrrrrrrry/watchtower
```

### Gotify

要向你的 Gotify 实例推送通知，请先注册一个 Gotify 应用，并指定 Gotify URL 与应用 token：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_NOTIFICATIONS=gotify \
  -e WATCHTOWER_NOTIFICATION_GOTIFY_URL="https://my.gotify.tld/" \
  -e WATCHTOWER_NOTIFICATION_GOTIFY_TOKEN="SuperSecretToken" \
  marrrrrrrrry/watchtower
```

`-e WATCHTOWER_NOTIFICATION_GOTIFY_TOKEN` 或 `--notification-gotify-token` 也可引用文件并使用其内容。

如果需要对 Gotify 实例禁用 TLS 验证，可以使用 `-e WATCHTOWER_NOTIFICATION_GOTIFY_TLS_SKIP_VERIFY=true` 或 `--notification-gotify-tls-skip-verify`。
