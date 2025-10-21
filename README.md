# Open Learning Cloud

[![Build Status](https://github.com/bedwards/open-learning-cloud/actions/workflows/ci.yml/badge.svg)](https://github.com/bedwards/open-learning-cloud/actions)
[![codecov](https://codecov.io/gh/bedwards/open-learning-cloud/branch/main/graph/badge.svg)](https://codecov.io/gh/bedwards/open-learning-cloud)
[![Firebase](https://img.shields.io/badge/Firebase-v10+-orange.svg)](https://firebase.google.com/docs/web/setup)
[![Node](https://img.shields.io/badge/node-18.x-brightgreen.svg)](https://nodejs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)](https://developers.cloudflare.com/workers/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> Free, open, and resilient digital learning built on Firebase, Cloudflare R2, and GitHub Pages.

## Mission

Open Learning Cloud reimagines digital education for underfunded schools, community learning centers, and autodidacts left behind by the monetized credential economy. It creates a global, cooperative platform where teachers and students can share interactive lessons, data visualizations, audio lectures, and multimedia exercises entirely within a decentralized, privacy-preserving architecture.

## Features

- 🌐 **Fully Offline-Capable**: Service Worker caching and IndexedDB sync
- 🔥 **Firebase Integration**: Realtime Firestore, Authentication, Cloud Storage
- ☁️ **Cloudflare R2**: Scalable media storage with zero egress fees
- 🎨 **Web Components**: Modern, modular UI with shadow DOM isolation
- 📊 **Interactive Visualizations**: Three.js and D3.js for immersive learning
- 🔒 **Privacy-First**: Encrypted storage, anonymized analytics
- 🆓 **Forever Free**: Built on free tiers (Firebase Spark, GitHub Pages, R2)

## Architecture

```
┌─────────────────┐
│  GitHub Pages   │  ← Static hosting (Vite build output)
│   (Frontend)    │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Firebase │
    │ Firestore│  ← User data, lessons, progress
    │   Auth   │  ← Anonymous & OAuth authentication
    └────┬─────┘
         │
    ┌────▼──────────┐
    │ Cloudflare R2 │  ← Media storage (videos, PDFs, audio)
    │   + Workers   │  ← Upload proxy, analytics jobs
    └───────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- Wrangler CLI: `npm install -g wrangler`

### Installation

```bash
# Clone repository
git clone https://github.com/bedwards/open-learning-cloud.git
cd open-learning-cloud

# Install dependencies
npm install

# Setup Firebase (use your project ID)
firebase login
firebase use --add

# Setup Cloudflare (requires account)
wrangler login
```

### Development

```bash
# Start dev server with Firebase emulators
npm run dev

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Deployment

```bash
# Deploy to GitHub Pages (automated via CI)
npm run deploy

# Deploy Cloudflare Worker
npm run deploy:worker
```

## Project Structure

```
open-learning-cloud/
├── .github/
│   └── workflows/
│       ├── ci.yml           # CI pipeline
│       ├── deploy.yml       # Auto-deploy to GitHub Pages
│       └── nightly.yml      # Analytics job
├── cloudflare-worker/
│   ├── src/
│   │   ├── index.js         # R2 upload handler
│   │   ├── analytics.js     # Nightly analytics
│   │   └── auth.js          # Firebase token verification
│   └── wrangler.toml
├── docs/
│   ├── ARCHITECTURE.md      # System design
│   └── API.md               # API documentation
├── public/
│   └── assets/              # Static assets
├── src/
│   ├── components/
│   │   ├── lesson-viewer.js
│   │   ├── lesson-editor.js
│   │   ├── user-profile.js
│   │   └── analytics-dashboard.js
│   ├── services/
│   │   ├── firebase.js      # Firebase SDK setup
│   │   ├── sync.js          # Offline sync manager
│   │   ├── storage.js       # R2 upload client
│   │   └── analytics.js     # Analytics tracker
│   ├── workers/
│   │   └── service-worker.js
│   ├── styles/
│   │   └── main.css
│   ├── index.html
│   └── main.js              # App entry point
├── tests/
│   ├── unit/
│   └── integration/
├── .eslintrc.cjs
├── .firebaserc
├── .prettierrc
├── firebase.json
├── package.json
├── vite.config.js
├── vitest.config.js
└── wrangler.toml
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run CI tests (mimics GitHub Actions)
npm run test:ci
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Acknowledgments

Built with love for educators and learners worldwide. Powered by Firebase, Cloudflare, and the open web.
