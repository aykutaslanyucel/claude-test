# CLAUDE.md - AI Assistant Guide

## Project Overview

This is a high-end legal due diligence platform designed to rival Harvey and Legora. The platform connects to Virtual Data Room (VDR) providers and streamlines legal due diligence workflows.

### Core Mission
- Provide AI-powered legal document analysis and due diligence
- Integrate seamlessly with major VDR providers (Datasite, Intralinks, Box, etc.)
- Automate extraction, categorization, and risk assessment of legal documents
- Enable collaboration between legal teams with secure, compliant workflows

---

## Repository Structure

```
/
├── backend/              # Backend API services
│   ├── api/             # REST/GraphQL API endpoints
│   ├── services/        # Business logic layer
│   ├── models/          # Data models and schemas
│   ├── integrations/    # VDR provider integrations
│   ├── ai/              # AI/ML models and processing
│   └── auth/            # Authentication and authorization
├── frontend/            # Frontend application
│   ├── src/
│   │   ├── components/  # React/Vue components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utility functions
│   │   ├── services/    # API clients
│   │   └── store/       # State management
│   └── public/          # Static assets
├── shared/              # Shared types and utilities
├── infrastructure/      # IaC and deployment configs
├── docs/               # Documentation
└── tests/              # Test suites
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## Technology Stack

### Backend (Recommended)
- **Runtime**: Node.js (TypeScript) or Python (FastAPI)
- **API**: GraphQL with REST fallbacks
- **Database**: PostgreSQL (primary), Redis (cache)
- **Message Queue**: RabbitMQ or AWS SQS
- **Storage**: S3-compatible object storage
- **AI/ML**: OpenAI API, Anthropic Claude API, custom models

### Frontend (Recommended)
- **Framework**: Next.js 14+ with React 18+
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand or React Query
- **Forms**: React Hook Form + Zod validation

### Infrastructure
- **Hosting**: AWS, Google Cloud, or Azure
- **Containers**: Docker + Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: DataDog, Sentry, or New Relic

---

## Development Workflows

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (e.g., `feature/vdr-integration`)
- **fix/**: Bug fixes
- **hotfix/**: Critical production fixes
- **claude/**: AI assistant working branches

### Commit Convention
Use Conventional Commits:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi-colons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `security`: Security fixes

**Examples**:
```
feat(vdr): add Datasite API integration
fix(auth): resolve token expiration issue
docs(api): update GraphQL schema documentation
security(upload): sanitize file names to prevent path traversal
```

### Code Review Process
1. All changes must go through PR review
2. Require at least one approval for merges to main
3. Run automated tests and linting
4. Security scan for vulnerabilities
5. Check code coverage (minimum 80%)

---

## Key Conventions

### TypeScript Standards
- **Strict Mode**: Always enabled
- **No `any`**: Use `unknown` or proper types
- **Interfaces over Types**: For object shapes
- **Named Exports**: Prefer over default exports
- **File Naming**: `kebab-case.ts` for files, `PascalCase` for components

### Code Organization
```typescript
// 1. Imports (external, then internal)
import { useState } from 'react';
import { apiClient } from '@/services/api';

// 2. Types/Interfaces
interface UserProfile {
  id: string;
  email: string;
}

// 3. Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// 4. Component/Function
export function UserProfileCard() {
  // ...
}
```

### Error Handling
```typescript
// Always use explicit error types
class VDRConnectionError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code: string
  ) {
    super(message);
    this.name = 'VDRConnectionError';
  }
}

// Wrap external calls with proper error handling
try {
  await vdrClient.connect();
} catch (error) {
  if (error instanceof VDRConnectionError) {
    logger.error('VDR connection failed', { provider: error.provider });
    throw error;
  }
  throw new Error('Unknown VDR error');
}
```

### Security Best Practices
1. **Input Validation**: Validate all user input using Zod or Joi
2. **SQL Injection**: Use parameterized queries only
3. **XSS Prevention**: Sanitize all HTML output
4. **Authentication**: JWT with short expiration + refresh tokens
5. **Authorization**: Role-based access control (RBAC)
6. **Data Encryption**: Encrypt sensitive data at rest and in transit
7. **Secrets Management**: Use environment variables, never commit secrets
8. **File Uploads**: Validate file types, scan for malware, limit size
9. **Rate Limiting**: Implement on all public endpoints
10. **CORS**: Whitelist specific origins only

### API Design Principles
- Use RESTful conventions for CRUD operations
- GraphQL for complex data fetching
- Versioning: `/api/v1/`, `/api/v2/`
- Pagination: Cursor-based for large datasets
- Rate limiting: Include in headers (`X-RateLimit-*`)
- Comprehensive error messages with error codes

```typescript
// Standard API Response Format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}
```

### Database Conventions
- **Naming**: `snake_case` for tables and columns
- **Primary Keys**: Use UUIDs for distributed systems
- **Timestamps**: Always include `created_at`, `updated_at`
- **Soft Deletes**: Use `deleted_at` column
- **Migrations**: Never modify existing migrations, create new ones
- **Indexes**: Index foreign keys and frequently queried columns

### Testing Standards
```typescript
// Unit Tests: Test individual functions/components
describe('DocumentParser', () => {
  it('should extract metadata from PDF', async () => {
    const result = await parser.parse(mockPdf);
    expect(result.metadata).toHaveProperty('title');
  });
});

// Integration Tests: Test service interactions
describe('VDR Integration', () => {
  it('should fetch documents from Datasite', async () => {
    const docs = await vdrService.fetchDocuments('project-123');
    expect(docs).toHaveLength(10);
  });
});

// E2E Tests: Test user workflows
describe('Due Diligence Workflow', () => {
  it('should complete full document review cycle', async () => {
    await login(testUser);
    await uploadDocuments(testFiles);
    await reviewAndApprove();
    expect(await getProjectStatus()).toBe('completed');
  });
});
```

---

## AI Assistant Guidelines

### When Working on This Codebase

#### 1. Understanding Context
- **Always read** existing code before making changes
- **Search** for similar implementations before creating new ones
- **Check** for existing utilities, components, and patterns
- **Review** recent commits to understand ongoing work

#### 2. Code Quality Standards
- Write **type-safe** TypeScript (no `any` types)
- Follow **existing patterns** and conventions in the codebase
- Add **comprehensive error handling** for all external operations
- Include **JSDoc comments** for complex functions
- Write **unit tests** for new business logic
- Ensure **no security vulnerabilities** (XSS, SQL injection, etc.)

#### 3. Security-First Development
- **Never** commit secrets, API keys, or credentials
- **Always** validate and sanitize user input
- **Implement** proper authentication checks
- **Use** parameterized queries for database operations
- **Encrypt** sensitive data (PII, legal documents)
- **Log** security events (failed logins, unauthorized access)

#### 4. VDR Integration Standards
When integrating with VDR providers:
- Implement **retry logic** with exponential backoff
- Handle **rate limiting** gracefully
- Use **OAuth 2.0** for authentication where available
- **Cache** API responses appropriately
- **Log** all API interactions for debugging
- Support **webhook** notifications when available

#### 5. Document Processing
- Support common formats: **PDF, DOCX, XLSX, PPTX**
- Extract **metadata**: title, author, date, document type
- Implement **OCR** for scanned documents
- Detect **PII** and sensitive information
- Categorize documents by type (contracts, financials, etc.)
- Extract **key clauses** and risk factors

#### 6. AI/ML Integration
- Use **Claude API** for document analysis and Q&A
- Implement **streaming** for real-time responses
- Cache **embeddings** for similar document detection
- Use **function calling** for structured data extraction
- Handle **token limits** appropriately
- Implement **fallback strategies** for API failures

#### 7. Performance Optimization
- **Lazy load** large document lists
- Use **pagination** for all lists
- Implement **caching** (Redis) for frequent queries
- **Optimize** database queries (use EXPLAIN)
- **Compress** API responses
- Use **CDN** for static assets

#### 8. Collaboration Features
- Implement **real-time** collaboration (WebSockets)
- Support **comments** and annotations on documents
- Track **change history** and audit logs
- Enable **task assignment** and workflows
- Implement **notifications** (email, in-app)

#### 9. Common Tasks

**Adding a new VDR provider integration:**
1. Create provider client in `backend/integrations/vdr/<provider>/`
2. Implement standard interface: `IVDRProvider`
3. Add authentication configuration
4. Implement document fetch, upload, metadata extraction
5. Add error handling and retry logic
6. Write integration tests
7. Update documentation

**Adding a new document analysis feature:**
1. Define input/output types in `shared/types/`
2. Implement AI service in `backend/ai/services/`
3. Add API endpoint in `backend/api/`
4. Create frontend component in `frontend/src/components/`
5. Add tests (unit + integration)
6. Update API documentation

**Fixing a security vulnerability:**
1. **URGENT**: Assess severity (CVSS score)
2. Create hotfix branch from main
3. Implement fix with tests
4. Security scan and peer review
5. Deploy to production immediately if critical
6. Document in security changelog

#### 10. Before Committing
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Run type check: `npm run type-check`
- [ ] Security scan: `npm audit`
- [ ] Review changes for sensitive data
- [ ] Update documentation if needed
- [ ] Write clear commit message

#### 11. AI-Specific Considerations
- **Never** make assumptions about data structure without verification
- **Always** handle edge cases (empty lists, null values, etc.)
- **Prefer** explicit error messages over silent failures
- **Document** complex AI model decisions
- **Test** with realistic legal documents
- **Consider** privacy and compliance (GDPR, CCPA)

---

## Legal and Compliance

### Data Privacy
- **GDPR Compliance**: Right to erasure, data portability
- **CCPA Compliance**: Data disclosure and deletion
- **Data Residency**: Support region-specific storage
- **Encryption**: AES-256 for data at rest, TLS 1.3 in transit

### Document Retention
- Configurable retention policies per client
- Automated deletion after retention period
- Legal hold support for litigation
- Audit trail of all document access

### Access Control
- Multi-factor authentication (MFA) required
- Role-based permissions (Admin, Reviewer, Viewer)
- IP whitelisting for enterprise clients
- Session timeout after inactivity

---

## Monitoring and Observability

### Logging
```typescript
// Structured logging format
logger.info('Document processed', {
  documentId: doc.id,
  processingTime: elapsed,
  provider: 'datasite',
  userId: user.id
});
```

### Metrics to Track
- API response times (p50, p95, p99)
- Document processing success rate
- VDR API call latency
- AI model inference time
- Error rates by type
- User activity (DAU, MAU)

### Alerts
- API error rate > 5%
- Database connection pool exhaustion
- VDR integration failures
- AI API quota approaching limit
- Security events (brute force, unauthorized access)

---

## Resources

### Documentation
- API Docs: `/docs/api/`
- Architecture Decisions: `/docs/adr/`
- User Guide: `/docs/user-guide.md`
- Deployment Guide: `/docs/deployment.md`

### External References
- [Anthropic Claude API](https://docs.anthropic.com/)
- [VDR Provider APIs](./docs/vdr-providers.md)
- [Legal Tech Best Practices](./docs/legal-tech-guidelines.md)

---

## Getting Help

### For AI Assistants
1. Read this document thoroughly before starting work
2. Search existing code for similar implementations
3. Check `/docs/` for detailed specifications
4. Review recent PRs and commits for context
5. When uncertain, ask clarifying questions

### For Humans
- Technical Issues: Create GitHub issue
- Security Concerns: Contact security team directly
- Feature Requests: Submit via product backlog

---

**Last Updated**: 2026-01-13
**Version**: 1.0.0
**Maintained By**: Development Team
