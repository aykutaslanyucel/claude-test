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

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

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

5. Start the development servers:
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

- [API Documentation](./docs/api/)
- [Architecture Decisions](./docs/adr/)
- [VDR Provider Integration Guide](./docs/vdr-providers.md)

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
