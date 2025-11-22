# 链接容器

Watchtower 会检测正在运行的容器之间的链接，并确保以不会破坏链接的方式停止/启动容器。如果在一组已链接容器中某个依赖项需要更新，watchtower 会按正确顺序停止并启动所有容器，确保应用能够正确恢复。

例如，假设你运行了一个 _mysql_ 容器以及一个链接到 _mysql_ 的 _wordpress_ 容器。如果 watchtower 检测到 _mysql_ 容器需要更新，它会先停止链接的 _wordpress_ 容器，然后再停止 _mysql_ 容器。重启时会先启动 _mysql_，然后启动 _wordpress_，以确保链接持续有效。

如果你希望覆盖已有的链接，或未使用链接功能，可以使用特殊标签 `com.centurylinklabs.watchtower.depends-on` 指定依赖的容器名称（使用逗号分隔）。

当某个依赖容器使用 `network_mode: service:container` 时，watchtower 会将其视为隐式链接。

