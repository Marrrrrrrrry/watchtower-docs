# 指标

::: warning 实验特性
该功能在 v1.0.4 中加入，仍处于实验阶段。如发现异常行为，请在仓库 Issues 中反馈。
:::

指标可用于跟踪 Watchtower 随时间的行为。

要使用该功能，需要设置一个 [API token](/zh/arguments/#http-api-token) 并 [启用 metrics API](/zh/arguments/#http-api-metrics)，同时为容器创建端口 `8080` 的映射。

Metrics API 端点为 `/v1/metrics`。

## 可用指标

| 名称                              | 类型    | 描述                                             |
| --------------------------------- | ------- | ------------------------------------------------ |
| `watchtower_containers_scanned`   | Gauge   | 上次扫描中被 watchtower 检查的容器数量           |
| `watchtower_containers_updated`   | Gauge   | 上次扫描中被 watchtower 更新的容器数量           |
| `watchtower_containers_failed`    | Gauge   | 上次扫描中更新失败的容器数量                     |
| `watchtower_scans_total`          | Counter | watchtower 启动以来进行的扫描总次数              |
| `watchtower_scans_skipped`        | Counter | watchtower 启动以来被跳过的扫描总次数            |

## Prometheus `scrape_config` 示例

```yaml
scrape_configs:
  - job_name: watchtower
    scrape_interval: 5s
    metrics_path: /v1/metrics
    bearer_token: demotoken
    static_configs:
      - targets:
        - 'watchtower:8080'
```

请将 `demotoken` 替换为你设置的 Bearer token。

## 演示

仓库中包含一个基于 Prometheus 与 Grafana 的演示，使用 `docker-compose.yml` 提供。该演示已预配置了一个仪表板，效果如下：

![grafana metrics](/assets/grafana-dashboard.png)
