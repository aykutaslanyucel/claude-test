# Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Redis 7+ installed and running
- Docker and Docker Compose (optional, for containerized setup)

## Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd claude-test
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:
- Database connection string
- Redis URL
- JWT secrets (generate secure random strings)
- Anthropic API key (get from https://console.anthropic.com)
- AWS credentials for S3 storage
- VDR provider API keys

## Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Generate Prisma client**
```bash
npx prisma generate
```

3. **Run database migrations**
```bash
npx prisma migrate dev
```

4. **Start the development server**
```bash
npm run dev
```

The backend will be running on http://localhost:3001

## Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start the development server**
```bash
npm run dev
```

The frontend will be running on http://localhost:3000

## Docker Setup (Alternative)

If you prefer using Docker:

```bash
# From the root directory
docker-compose up -d
```

This will start all services (PostgreSQL, Redis, Backend, Frontend) in containers.

## Database Seeding (Optional)

To seed the database with sample data:

```bash
cd backend
npm run db:seed
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## API Documentation

Once the backend is running, you can access:
- Health check: http://localhost:3001/health
- API endpoints: http://localhost:3001/api/*

## Common Issues

### Database Connection Errors
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Redis Connection Errors
- Ensure Redis is running
- Check REDIS_URL in .env

### Frontend API Errors
- Verify backend is running on port 3001
- Check NEXT_PUBLIC_API_URL in frontend/.env

## Next Steps

1. Create your first user account via the registration page
2. Set up VDR provider credentials in settings
3. Create a project and upload documents
4. Explore AI-powered document analysis features

For more information, see [CLAUDE.md](../CLAUDE.md)
