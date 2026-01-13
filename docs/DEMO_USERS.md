# Demo Users Guide

This document describes the demo users available for testing the Legal Due Diligence Platform.

## Setting Up Demo Users

To seed the database with demo users and sample data:

```bash
cd backend

# Make sure database is running
docker-compose up -d postgres redis

# Run migrations (if not done yet)
npm run migrate

# Seed demo data
npm run db:seed
```

## Demo User Accounts

All demo users share the same password: **Demo123!**

### Available Users

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@legaldd.demo | Demo123! | Full system access, can manage all projects and users |
| **Manager** | manager@legaldd.demo | Demo123! | Can create projects, manage team members, upload documents |
| **Reviewer** | reviewer@legaldd.demo | Demo123! | Can review documents, add comments, complete checklists |
| **Viewer** | viewer@legaldd.demo | Demo123! | Read-only access to assigned projects |

## Demo Project

The seed script creates a demo project:

**Project Name:** Acme Corp M&A Due Diligence
- **Client:** Acme Corporation
- **Deal Value:** $50,000,000
- **Target Date:** March 1, 2026
- **VDR Provider:** Datasite
- **Status:** Active

### Team Members
- Admin User (Admin role)
- Sarah Manager (Manager role)
- John Reviewer (Reviewer role)

### Checklists

1. **Corporate Documents**
   - Articles of Incorporation
   - Bylaws
   - Board Minutes

2. **Financial Documents**
   - Audited Financial Statements
   - Tax Returns

## Testing Different Roles

### As Admin User
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@legaldd.demo",
    "password": "Demo123!"
  }'
```

You can:
- Create and delete projects
- Manage all users
- Upload and delete documents
- Perform AI analysis
- View all activity logs

### As Manager User
You can:
- Create projects
- Add team members
- Upload documents
- Assign tasks
- View analytics

### As Reviewer User
You can:
- View assigned projects
- Review documents
- Add comments and annotations
- Complete checklist items
- Download documents

### As Viewer User
You can:
- View project details
- Read documents
- View analysis results
- Export reports (read-only)

## Frontend Testing

1. Navigate to http://localhost:3000
2. Click "Login"
3. Use any of the demo accounts above
4. Explore the dashboard and features

## Resetting Demo Data

To reset the demo data:

```bash
cd backend

# Reset database
npm run migrate:reset

# Reseed demo data
npm run db:seed
```

Or using Docker:

```bash
# Stop and remove containers
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait for services to be ready, then seed
cd backend
npm run migrate
npm run db:seed
```

## Security Notes

⚠️ **Important:** These demo accounts are for development and testing only!

- Never use these credentials in production
- Change the JWT secrets in production
- Use strong, unique passwords for all accounts
- Enable MFA for production deployments
- Regularly rotate API keys and secrets

## Sample API Requests

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@legaldd.demo",
    "password": "Demo123!"
  }'
```

### Get Current User
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Upload Document
```bash
curl -X POST http://localhost:3001/api/documents/00000000-0000-0000-0000-000000000001/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

### List Documents
```bash
curl http://localhost:3001/api/documents/00000000-0000-0000-0000-000000000001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Cannot login
- Verify database is running: `docker-compose ps`
- Check if seed ran successfully: Look for success message
- Verify environment variables are set correctly

### Database connection errors
- Ensure PostgreSQL is running: `docker-compose up -d postgres`
- Check DATABASE_URL in .env matches docker-compose.yml
- Try restarting containers: `docker-compose restart`

### Seed script fails
- Make sure migrations are up to date: `npm run migrate`
- Check for any Prisma schema errors
- Verify bcryptjs is installed: `npm install`

## Next Steps

After testing with demo users:

1. Create your own user accounts via the registration page
2. Set up your VDR provider credentials
3. Configure your Anthropic API key for AI analysis
4. Set up S3 or compatible storage for documents
5. Invite your team members

For more information, see:
- [Setup Guide](./SETUP.md)
- [API Documentation](./api/README.md)
- [CLAUDE.md](../CLAUDE.md) for development guidelines
