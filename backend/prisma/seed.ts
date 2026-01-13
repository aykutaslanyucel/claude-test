import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo data...');

  // Hash password for demo users
  const passwordHash = await bcrypt.hash('Demo123!', 12);

  // Create demo admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@legaldd.demo' },
    update: {},
    create: {
      email: 'admin@legaldd.demo',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // Create demo manager user
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@legaldd.demo' },
    update: {},
    create: {
      email: 'manager@legaldd.demo',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Manager',
      role: UserRole.MANAGER,
      isActive: true,
    },
  });
  console.log('✅ Created manager user:', managerUser.email);

  // Create demo reviewer user
  const reviewerUser = await prisma.user.upsert({
    where: { email: 'reviewer@legaldd.demo' },
    update: {},
    create: {
      email: 'reviewer@legaldd.demo',
      passwordHash,
      firstName: 'John',
      lastName: 'Reviewer',
      role: UserRole.REVIEWER,
      isActive: true,
    },
  });
  console.log('✅ Created reviewer user:', reviewerUser.email);

  // Create demo viewer user
  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@legaldd.demo' },
    update: {},
    create: {
      email: 'viewer@legaldd.demo',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Viewer',
      role: UserRole.VIEWER,
      isActive: true,
    },
  });
  console.log('✅ Created viewer user:', viewerUser.email);

  // Create a demo project
  const demoProject = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Acme Corp M&A Due Diligence',
      description: 'Demo project for merger and acquisition due diligence review',
      status: ProjectStatus.ACTIVE,
      clientName: 'Acme Corporation',
      dealValue: 50000000.00,
      targetDate: new Date('2026-03-01'),
      vdrProvider: 'Datasite',
      vdrProjectId: 'demo-vdr-12345',
    },
  });
  console.log('✅ Created demo project:', demoProject.name);

  // Add team members to the project
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: demoProject.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      projectId: demoProject.id,
      userId: adminUser.id,
      role: UserRole.ADMIN,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: demoProject.id,
        userId: managerUser.id,
      },
    },
    update: {},
    create: {
      projectId: demoProject.id,
      userId: managerUser.id,
      role: UserRole.MANAGER,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: demoProject.id,
        userId: reviewerUser.id,
      },
    },
    update: {},
    create: {
      projectId: demoProject.id,
      userId: reviewerUser.id,
      role: UserRole.REVIEWER,
    },
  });

  console.log('✅ Added team members to project');

  // Create demo checklists
  const checklist1 = await prisma.checklist.create({
    data: {
      projectId: demoProject.id,
      name: 'Corporate Documents',
      description: 'Review all corporate governance documents',
      order: 1,
    },
  });

  await prisma.checklistItem.createMany({
    data: [
      {
        checklistId: checklist1.id,
        title: 'Articles of Incorporation',
        description: 'Review and verify articles of incorporation',
        order: 1,
      },
      {
        checklistId: checklist1.id,
        title: 'Bylaws',
        description: 'Review corporate bylaws',
        order: 2,
      },
      {
        checklistId: checklist1.id,
        title: 'Board Minutes',
        description: 'Review board meeting minutes for past 3 years',
        order: 3,
      },
    ],
  });

  const checklist2 = await prisma.checklist.create({
    data: {
      projectId: demoProject.id,
      name: 'Financial Documents',
      description: 'Review financial statements and tax returns',
      order: 2,
    },
  });

  await prisma.checklistItem.createMany({
    data: [
      {
        checklistId: checklist2.id,
        title: 'Audited Financial Statements',
        description: 'Review last 3 years of audited financials',
        order: 1,
      },
      {
        checklistId: checklist2.id,
        title: 'Tax Returns',
        description: 'Review federal and state tax returns',
        order: 2,
      },
    ],
  });

  console.log('✅ Created demo checklists');

  // Create activity log entries
  await prisma.activityLog.createMany({
    data: [
      {
        projectId: demoProject.id,
        userId: adminUser.id,
        action: 'PROJECT_CREATED',
        entityType: 'project',
        entityId: demoProject.id,
        metadata: { name: demoProject.name },
      },
      {
        projectId: demoProject.id,
        userId: adminUser.id,
        action: 'TEAM_MEMBER_ADDED',
        entityType: 'project_member',
        entityId: managerUser.id,
        metadata: { role: 'MANAGER' },
      },
    ],
  });

  console.log('✅ Created activity logs');

  console.log('\n🎉 Demo data seeded successfully!\n');
  console.log('Demo Users:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin:    admin@legaldd.demo    / Demo123!');
  console.log('👤 Manager:  manager@legaldd.demo  / Demo123!');
  console.log('👤 Reviewer: reviewer@legaldd.demo / Demo123!');
  console.log('👤 Viewer:   viewer@legaldd.demo   / Demo123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
