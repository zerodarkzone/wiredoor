# Contributing to Wiredoor

We welcome contributions of all kinds to the Wiredoor project, whether it's bug reports, feature requests, code, documentation, or community engagement.

## 🧩 What is Wiredoor?

Wiredoor is an open-source platform that allows you to securely expose private services through an encrypted reverse VPN tunnel using WireGuard and a lightweight proxy system powered by NGinx. It's self-hostable, minimal, and privacy-focused.

---

## 📌 How to Contribute

### Prerequisites

- [Docker](https://www.docker.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Remote - Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### 1. Fork & Clone

```bash
git clone https://github.com/wirdoor/wiredoor.git
cd wiredoor
```

Install any dependencies, depending on the component (server/, ui/).

### 2. Open an Issue First

Before submitting a Pull Request, please open an issue to discuss:

- Bugs
- Features
- Documentation updates

That helps us maintain project direction and avoid duplicate work.

### 3. Style Guidelines

- **Server:** Node.js/TypeScript (follow project's ESLint/Prettier rules)
- **UI:** Vue.js/TypeScript (follow project's ESLint/Prettier rules)
- **Docs:** Use MDX following [Nextra Guidelines](https://nextra.site/docs/guide/markdown)
- Keep PRs small and focused

### 4. Submitting a Pull Request

1. Fork the repo
2. Create a feature branch
3. Write your changes
4. Commit with clear messages using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
5. Open a PR against the `development` branch

### 5. Code of conduct

Please be kind and respectfull. All contributions are subject to our [Code of Conduct]()

## 🙏 Thank You!

Your input makes Wiredoor better for everyone. Whether you're reporting a typo or building a new feature, we appreciate your effort!
