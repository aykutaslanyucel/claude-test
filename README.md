# Legal Due Diligence Platform

A high-end legal due diligence platform that connects to VDR providers and streamlines legal document analysis and review workflows.

## Features

- 🔐 Secure authentication and role-based access control
- 📁 Integration with major VDR providers (Datasite, Intralinks, Box)
- 🤖 AI-powered document analysis and risk assessment
- 📊 Real-time collaboration and workflow management
- 🔍 Advanced search and document categorization
- 📈 Analytics and reporting dashboard
- ✅ GDPR and CCPA compliant

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + Redis
- Prisma ORM
- Anthropic Claude API

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- React Query

## 🚀 Deploy to Production

### Railway (Recommended - 10 minutes)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**Quick Deploy**: See [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) for step-by-step instructions.

Railway provides:
- Free tier with $5/month credit
- Automatic PostgreSQL and Redis
- Zero-config deployments
- SSL certificates included

**Other Platforms**: Render, Heroku, AWS, Google Cloud, Azure (docs coming soon)

## Getting Started

### Quick Start (Recommended)

Run the automated setup script:

```bash
./setup.sh
```

This will:
- Start PostgreSQL and Redis with Docker
- Install all dependencies
- Run database migrations
- Seed demo users and sample data

**Demo Users** (password: `Demo123!`):
- **Admin:** admin@legaldd.demo
- **Manager:** manager@legaldd.demo
- **Reviewer:** reviewer@legaldd.demo
- **Viewer:** viewer@legaldd.demo

See [Demo Users Guide](./docs/DEMO_USERS.md) for detailed information.

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (recommended)

### Manual Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd claude-test
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
cd backend
npm run migrate
```

5. Seed demo data (optional but recommended):
```bash
npm run db:seed
```

6. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Using Docker

```bash
docker-compose up -d
```

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed documentation on the codebase structure and development guidelines.

## Documentation

- **[Railway Deployment](./DEPLOY_RAILWAY.md)** - Quick 10-minute deployment guide
- **[Demo Users Guide](./docs/DEMO_USERS.md)** - Test accounts and sample data
- **[API Documentation](./docs/api/)** - REST API reference
- **[Setup Guide](./docs/SETUP.md)** - Detailed local setup instructions
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant and development guidelines
- **[Full Railway Guide](./docs/RAILWAY_DEPLOYMENT.md)** - Advanced deployment options

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm test`
4. Commit using conventional commits
5. Push and create a Pull Request

## Security

If you discover a security vulnerability, please email security@example.com instead of creating a public issue.

## License

Proprietary - All rights reserved

## Support

For questions and support, please contact the development team.
