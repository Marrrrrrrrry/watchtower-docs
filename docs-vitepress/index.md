---
layout: home

hero:
  name: Watchtower
  text: A process for automating Docker container base image updates
  tagline: Update the running version of your containerized app simply by pushing a new image to Docker Hub or your own image registry
  image:
    src: /images/logo-450px.png
    alt: Watchtower logo
  actions:
    - theme: brand
      text: Get Started
      link: /quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/marrrrrrrrry/watchtower

features:
  - icon: 🔄
    title: Automated Updates
    details: Automatically update your running containers when new images are available
  - icon: 🐳
    title: Docker Native
    details: Seamlessly integrates with Docker and Docker Compose
  - icon: 📊
    title: Notifications
    details: Get notified when updates happen via email, Slack, MS Teams and more
  - icon: 🔧
    title: Highly Configurable
    details: Extensive configuration options for different use cases
---

## Features

- **Automatic Updates**: Monitor running containers and update them when new images are available
- **Notifications**: Get notified via email, Slack, MS Teams, Gotify, or webhooks
- **Container Selection**: Choose which containers to monitor using various criteria
- **Private Registries**: Support for private Docker registries with authentication
- **Lifecycle Hooks**: Execute commands before and after updates
- **Rolling Updates**: Control update timing and prevent simultaneous updates
- **Metrics**: Prometheus metrics for monitoring
- **HTTP API**: Control watchtower via HTTP API
- **Secure Connections**: Support for TLS and secure Docker connections
