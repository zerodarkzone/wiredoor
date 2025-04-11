<p align="center"> <img src="https://www.wiredoor.net/images/wiredoor.svg" alt="Wiredoor logo" width="60" /> </p>

<h1 align="center" style="color:#1c398e">
  Wiredoor
</h1>

<p align="center">
  <strong>Expose private services securely through reverse VPN tunnel powered by WireGuard and NGINX.</strong><br />
  Open-source | Self-hosted
</p>

<p align="center">
  <a href="https://www.wiredoor.net/docs">Documentation</a> •
  <a href="https://github.com/wiredoor/wiredoor">Core Server</a> •
  <a href="https://github.com/wiredoor/wiredoor-cli">CLI</a> •
  <a href="https://charts.wiredoor.net">Helm Charts</a>
</p>

---

# What is Wiredoor?

**Wiredoor** is a self-hosted, open-source ingress-as-a-service platform that allows you to expose applications and services running in private or local networks to the internet—securely, reliably, and without complex infrastructure.

It uses reverse VPN connections powered by [WireGuard](https://www.wireguard.com) and exposes services through a built-in [NGINX](https://nginx.org) reverse proxy. Perfect for developers, operators, or teams that want full control of their ingress without relying on public cloud solutions.

---

## Features

- **Secure VPN tunnel** with WireGuard (low latency and high performance)
- **Reverse proxy** with NGINX
- **Automatic SSL certificates** via Let's Encrypt (or self-signed fallback)
- **Web UI** to manage nodes, services, and domains
- **Multi-environment support**: works with Kubernetes, Docker, legacy servers, IoT, etc.
- **CLI client** (`wiredoor-cli`) for service management and automation
- **Gateway nodes** for full subnetwork exposure (site-to-site style)
- 100% **self-hosted and open source**

---

## 🚀 Quick Start (Docker) with Docker Compose

### Requirements

- Linux VPS (recommended)
- Docker Engine or Docker Desktop
- Open ports: `80`, `443`, and a UDP port for the VPN (default `51820`)
- Optional: Port range for exposing TCP services (e.g. `32760-32767`)

### Project structure

```bash
wiredoor/
├── wiredoor-data/
├── wiredoor-certbot/
├── wiredoor-logs/
├── docker-compose.yml
├── .env
```

### Prepare persistent directories

Wiredoor requires persistent directories to store configuration files, WireGuard keys, and SSL certificates.

Create the necessary folders and ensure proper permissions:

```bash copy
mkdir -p ./{wiredoor-data,wiredoor-certbot,wiredoor-logs} && chown -R 1000:1000 ./{wiredoor-data,wiredoor-certbot,wiredoor-logs}
```

### Config Environment variables in `.env`

Create a `.env` file at the root of the project to configure **Wiredoor** securely and flexibly, without hardcoding sensitive data into your `docker-compose.yml`.

```dotenv filename=".env" copy
# Wiredoor admin credentials
ADMIN_EMAIL=admin@example.com           # Required. Also used by certbot if SSL is enabled
ADMIN_PASSWORD=ChangeMe1st!             # Required. Use a secure password

# VPN Information
VPN_HOST=public_host_or_ip              # Required. Public address that clients will connect to
VPN_PORT=51820                          # Default WireGuard UDP port
VPN_SUBNET=10.0.0.0/24                  # Subnet for clients (in CIDR format)

# TCP Port range
TCP_SERVICES_PORT_RANGE=32760-32767     # Optional. Port range to expose TCP/UDP services

# TCP/UDP Exposure (Public Port Range)
TZ=America/New_York                     # Time zone (recommended for logging)
```

Check the [configuration documentation](https://www.wiredoor.net/docs/configuration#environment-variables) for a full list of supported environment variables.

### Sample docker-compose.yml

`docker-compose.yml`

```yaml
services:
  wiredoor:
    image: ghcr.io/wiredoor/wiredoor:latest
    container_name: wiredoor
    cap_add:
      - NET_ADMIN
    env_file:
      - .env
    restart: unless-stopped
    volumes:
      - ~/wiredoor-data:/data
      - ~/wiredoor-certbot:/etc/letsencrypt
      # - ~/wiredoor-logs:/var/log/nginx        # <--- Optional: Mount for collecting NGINX logs
    ports:
      - 80:80/tcp
      - 443:443/tcp
      - 51820:51820/udp # Must match with VPN_PORT in .env
    #      - 32760-32767                            # Must match with TCP_SERVICES_PORT_RANGE in .env
    sysctls:
      - net.ipv4.ip_forward=1
```

### Run it

```bash
docker compose up -d
```

Once the service is running, visit: [https://<YOUR_PUBLIC_IP_OR_DOMAIN>]()

Login using the provided credentials in the environemnt variables.

## How It Works

- Register a domain(local or public) pointing to wiredoor server.
- Nodes / Clients connect to Wiredoor through a secure VPN tunnel.
- Wiredoor exposes your internal service via domain/port configuration.
- Incoming traffic is routed securely and automatically encrypted.

### Client integrations

- ✅ [Wiredoor CLI](https://www.wiredoor.net/docs/cli): Manage connection, expose services, get logs, etc.
- ✅ [Docker Gateway](https://www.wiredoor.net/docs/docker-gateway): Lightweight sidecar container to expose services in Compose environments.
- ✅ [Kubernetes Gateway Chart](https://www.wiredoor.net/docs/kubernetes-gateway): Helm chart to expose any service inside your Kubernetes cluster.

### Domains & Certificates

- Supports public domains with Let's Encrypt SSL.
- Also works with local/internal domains using self-signed certificates.
- Automatically handles renewal and configuration.

### Use Cases

- Expose internal apps without opening firewall ports
- Access Kubernetes dashboards securely from the outside
- Remotely monitor or control IoT / industrial devices
- Replace complex VPN setups with a simpler alternative

### 🤝 Why Wiredoor?

| Feature                    | Wiredoor | Ngrok    | Cloudflare Tunnel |
| -------------------------- | -------- | -------- | ----------------- |
| Open Source                | ✅       | ❌       | ❌                |
| Self-Hosted                | ✅       | Partial  | ❌                |
| Site-to-Site VPN Gateway   | ✅       | ❌       | ❌                |
| TCP + UDP Support          | ✅       | TCP only | HTTP only         |
| Automatic SSL Certificates | ✅       | ✅       | ✅                |

---

### 🛠️ Coming soon

More documentation, production setup examples, and deployment tools are on the way!
