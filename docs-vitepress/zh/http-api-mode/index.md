# HTTP API 模式

Watchtower 提供 HTTP API 模式，开启后会暴露一个 HTTP 端点，可用于触发容器更新。目前可用的端点：

- `/v1/update`：为该 Watchtower 实例监控的所有容器触发一次更新。

---

要启用此模式，请使用 `--http-api-update` 标志。例如，在 Docker Compose 配置中：

```yaml
version: '3'

services:
  app-monitored-by-watchtower:
    image: myapps/monitored-by-watchtower
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  watchtower:
    image: marrrrrrrrry/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --debug --http-api-update
    environment:
      - WATCHTOWER_HTTP_API_TOKEN=mytoken
    labels:
      - "com.centurylinklabs.watchtower.enable=false"
    ports:
      - 8080:8080
```

默认情况下，启用此模式会阻止周期性轮询（即由 `--interval` 或 `--schedule` 指定的轮询）。如果希望继续进行周期性更新，请传入 `--http-api-periodic-polls`。

注意，这里使用了 `WATCHTOWER_HTTP_API_TOKEN` 环境变量。为防止外部服务意外触发镜像更新，所有请求都必须在请求头包含 `Authorization: Bearer <token>`，其中 `<token>` 的值与 `WATCHTOWER_HTTP_API_TOKEN` 相同。本例中通过端口映射可使用 `localhost:8080` 访问 Watchtower。下面的 `curl` 示例将触发一次更新：

```bash
curl -H "Authorization: Bearer mytoken" localhost:8080/v1/update
```

