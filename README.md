# 🛡️ Wiredoor Server

**Wiredoor** is a self-hosted, open-source ingress-as-a-service platform that allows you to expose applications and services running in private or local networks to the internet—securely, reliably, and without complex infrastructure.

It uses reverse VPN connections powered by [WireGuard](https://www.wireguard.com) and exposes services through a built-in [NGINX](https://nginx.org) reverse proxy. Perfect for developers, operators, or teams that want full control of their ingress without relying on public cloud solutions.

---

## ✨ Features

- 🔐 **Secure VPN tunnel** with WireGuard (low latency and high performance)
- 🌐 **Reverse proxy** with NGINX
- 🔑 **Automatic SSL certificates** via Let's Encrypt (or self-signed fallback)
- 🧠 **Web UI** to manage nodes, services, and domains
- 📦 **Multi-environment support**: works with Kubernetes, Docker, legacy servers, IoT, etc.
- 🧰 **CLI client** (`wiredoor-cli`) for service management and automation
- 🚪 **Gateway nodes** for full subnetwork exposure (site-to-site style)
- 🧱 100% **self-hosted and open source**

---

## 🚀 Quick Start (Docker)

### 🧾 Requirements

- Linux VPS (recommended)
- Docker Engine or Docker Desktop
- Open ports: `80`, `443`, and a UDP port for the VPN (default `51820`)
- Optional: Port range for exposing TCP services (e.g. `32760-32767`)

### 📁 Create persistent directories

```bash
mkdir -p ~/{wiredoor-data,wiredoor-certbot} && chown -R 1000:1000 ~/{wiredoor-data,wiredoor-certbot}
```

### 🐳 Sample docker-compose.yml

```yaml filename="docker-compose.yml" copy
services:
  wiredoor:
    image: infladoor/wiredoor:latest
    container_name: wiredoor
    cap_add:
      - NET_ADMIN
    environment:
      TZ: America/New_York # Set your timezone
      VPN_HOST: ${SERVER_PUBLIC_IP_OR_DOMAIN} # Change This Value with your server IP or FQDN
      VPN_PORT: 51820 # VPN Port 
      VPN_SUBNET: 10.12.1.0/24 # VLAN Subnet For VPN Interface
      SERVER_CERTBOT_EMAIL: youremail@email.com # Email used to send notifications about certbot SSL certificates
#      TCP_SERVICES_PORT_RANGE: 32760-32767 # Optional Port range definition to expose TCP services if needed
    restart: unless-stopped
    volumes:
      - ~/wiredoor-data:/data
      - ~/wiredoor-certbot:/etc/letsencrypt
    ports:
      - 80:80/tcp
      - 443:443/tcp
      - 51820:51820/udp # Must match with VPN_PORT defined in environment
#      - 32760-32767 # Must match with TCP_SERVICES_PORT_RANGE defined in environment
    sysctls:
      - net.ipv4.ip_forward=1
```

### ▶️ Run it

```bash
docker compose up -d
```

Once the service is running, visit: [https://<YOUR_PUBLIC_IP_OR_DOMAIN>]()

Login using the default credentials shown in the terminal or provided in the documentation.

## 🧭 How It Works

- Register a domain(local or public) pointing to wiredoor server.
- Nodes / Clients connect to Wiredoor through a secure VPN tunnel.
- Wiredoor exposes your internal service via domain/port configuration.
- Incoming traffic is routed securely and automatically encrypted.

### 🖥️ Client integrations

- ✅ Wiredoor CLI: Manage connection, expose services, get logs, etc.
- ✅ Docker Gateway: Lightweight sidecar container to expose services in Compose environments.
- ✅ Kubernetes Gateway Chart: Helm chart to expose any service inside your Kubernetes cluster.

### 🔐 Domains & Certificates

- Supports public domains with Let's Encrypt SSL.
- Also works with local/internal domains using self-signed certificates.
- Automatically handles renewal and configuration.

### ⚡ Use Cases

- Expose internal apps without opening firewall ports
- Access Kubernetes dashboards securely from the outside
- Remotely monitor or control IoT / industrial devices
- Replace complex VPN setups with a simpler alternative

### 🤝 Why Wiredoor?

| Feature                    |	Wiredoor |   Ngrok  | Cloudflare Tunnel |
|----------------------------|-----------|----------|-------------------|
| Open Source                |	   ✅   |    ❌    |        ❌        |
| Self-Hosted                |	   ✅	 | Partial  |        ❌         |
| Site-to-Site VPN Gateway   |     ✅   |    ❌    |        ❌        |
| TCP + UDP Support          |	   ✅   | TCP only |     HTTP only     |
| Automatic SSL Certificates |     ✅   |    ✅    |        ✅        |

---

### 📄 License

### 🛠️ Coming soon

More documentation, production setup examples, and deployment tools are on the way!