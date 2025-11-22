# 私有仓库

Watchtower 支持私有 Docker 镜像仓库。在许多情况下，访问私有仓库需要有效的用户名和密码（凭据）。为了在此环境中运行，watchtower 需要知道访问该仓库的凭据。

凭据可以通过名为 `config.json` 的配置文件提供给 watchtower。该文件有两种生成方式：

- 手动创建配置文件。
- 运行 `docker login <REGISTRY_NAME>` 并共享生成的配置文件。

## 手动创建配置文件
创建一个包含 base64 编码用户名与密码（`auth`）的配置文件，语法如下：

```json
{
    "auths": {
        "<REGISTRY_NAME>": {
            "auth": "XXXXXXX"
        }
    }
}
```

将 `<REGISTRY_NAME>` 替换为你的私有仓库名称（例如 `my-private-registry.example.org`）。

::: info 使用 Docker Hub 私有镜像
要访问 Docker Hub 的私有仓库，`<REGISTRY_NAME>` 应为 `https://index.docker.io/v1/`。
在此特殊情况下，不需要在 `docker run` 或 `docker-compose` 中指定仓库域名。与 Docker 一样，当未指定仓库域名时，Watchtower 将使用 Docker Hub 及其凭据。

Watchtower 能识别 `<REGISTRY_NAME>` 为 `index.docker.io` 的凭据，但 Docker CLI 不会。
:::

::: warning 本地私有仓库
如需使用本地托管的私有仓库，请在 `config.json` 和 `docker run`/`docker-compose` 中正确指定仓库主机。有效主机包括 `localhost[:PORT]`、`HOST:PORT`，或任意带/不带端口的多段域名（或 IP 地址）。

示例：
- `localhost` -> `localhost/myimage`
- `127.0.0.1` -> `127.0.0.1/myimage:mytag`
- `host.domain` -> `host.domain/myorganization/myimage`
- `other-lan-host:80` -> `other-lan-host:80/imagename:latest`
:::

生成 `auth` 字符串：

```bash
echo -n 'username:password' | base64
```

::: info GCloud 凭据
对于 gcloud，请使用 `_json_key` 作为用户名，并使用 `gcloudauth.json` 的内容作为密码。

```bash
echo -n "_json_key:$(cat gcloudauth.json)" | base64 -w0
```
:::

启动 watchtower 容器时，需要将创建的配置文件（示例中的 `<PATH>/config.json`）传入容器：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v <PATH>/config.json:/config.json \
  marrrrrrrrry/watchtower
```

## 共享 Docker 配置文件
要从私有仓库拉取镜像，需要先运行 `docker login` 获取访问权限。提供的凭据会被存储在 `<PATH_TO_HOME_DIR>/.docker/config.json` 中。该配置文件可被 watchtower 直接使用，不需要额外创建新文件。

启动容器时，将该配置文件传入 watchtower：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v <PATH_TO_HOME_DIR>/.docker/config.json:/config.json \
  marrrrrrrrry/watchtower
```

如果通过 docker-compose 创建 watchtower 容器，使用以下内容：

```yaml
version: "3.4"
services:
  watchtower:
    image: marrrrrrrrry/watchtower:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - <PATH_TO_HOME_DIR>/.docker/config.json:/config.json
```

### Docker Config 路径
watchtower 默认在 `/` 下查找 `config.json` 文件，但可通过设置环境变量 `DOCKER_CONFIG` 将其改为指向配置所在的目录路径。对于在 watchtower 运行期间需要变更配置的部署，这很有用。

示例：

```yaml
version: "3.4"

services:
  watchtower:
    image: marrrrrrrrry/watchtower
    environment:
      DOCKER_CONFIG: /config
    volumes:
      - /etc/watchtower/config/:/config/
      - /var/run/docker.sock:/var/run/docker.sock
```

## 凭据助手
一些私有 Docker 仓库（最典型的是 AWS ECR）使用非标准的认证方式。要与 watchtower 配合使用，需要使用凭据助手（credential helper）。

为保持镜像体积较小，watchtower 镜像中不包含任何助手；相反，我们将助手构建在一个单独的容器中，并通过挂载卷的方式供 watchtower 使用。

### 示例（AWS ECR）
与 [amazon-ecr-credential-helper](https://github.com/awslabs/amazon-ecr-credential-helper) 的示例实现：

使用下方 Dockerfile 构建凭据助手，将构建产物放在可挂载到 watchtower 容器的卷中。

1. 创建 Dockerfile：

```Dockerfile
FROM golang:1.20

ENV GO111MODULE off
ENV CGO_ENABLED 0
ENV REPO github.com/awslabs/amazon-ecr-credential-helper/ecr-login/cli/docker-credential-ecr-login

RUN go get -u $REPO

RUN rm /go/bin/docker-credential-ecr-login

RUN go build \
 -o /go/bin/docker-credential-ecr-login \
 /go/src/$REPO

WORKDIR /go/bin/
```

2. 构建助手并将输出保存到卷中：

```bash
# 创建用于存放命令的卷（构建后存放）
docker volume create helper 

# 构建容器
docker build -t aws-ecr-dock-cred-helper .

# 构建命令并存放到新卷的 /go/bin
docker run -d --rm --name aws-cred-helper \
  --volume helper:/go/bin aws-ecr-dock-cred-helper
```

3. 创建 Docker 配置文件并保存到 `$HOME/.docker/config.json`（替换 `<AWS_ACCOUNT_ID>` 与 `<AWS_ECR_REGION>`）：

```json
{
  "credsStore": "ecr-login",
  "HttpHeaders": {
    "User-Agent": "Docker-Client/19.03.1 (XXXXXX)"
  },
  "auths": {
    "<AWS_ACCOUNT_ID>.dkr.ecr.<AWS_ECR_REGION>.amazonaws.com": {}
  },
  "credHelpers": {
    "<AWS_ACCOUNT_ID>.dkr.ecr.<AWS_ECR_REGION>.amazonaws.com": "ecr-login"
  }
}
```

4. 使用 docker-compose 启动 watchtower：

```yaml
version: "3.4"
services:
  watchtower:
    image: marrrrrrrrry/watchtower:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - .docker/config.json:/config.json
      - helper:/go/bin
    environment:
      - HOME=/
      - PATH=$PATH:/go/bin
      - AWS_REGION=us-west-1
volumes:
  helper:
    external: true
```

附加说明：

1. 在 docker-compose 中，卷（此处为 `helper`）必须设为 `external: true`，否则 docker-compose 会为其加上目录名前缀。
2. 注意需要 `"credsStore": "ecr-login"` ——如果有该项，可移除 `credHelpers` 部分。
3. 在带有 IAM 角色的 EC2 实例上，可能无需密钥；否则，需要在环境变量中包含 `AWS_ACCESS_KEY_ID` 与 `AWS_SECRET_ACCESS_KEY`。
4. 或者，创建 `~/.aws/config` 与 `~/.aws/credentials` 文件，并将 `~/.aws` 目录挂载到容器中的 `/`。
