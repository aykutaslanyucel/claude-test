#!/bin/bash

set -e

echo "🚀 Setting up Legal Due Diligence Platform"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your credentials."
else
    echo "✅ .env file already exists"
fi

# Start services
echo ""
echo "🐳 Starting Docker containers..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
else
    echo "✅ Backend dependencies already installed"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "✅ Frontend dependencies already installed"
fi

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
cd backend
npm run migrate

# Seed demo data
echo ""
echo "🌱 Seeding demo data..."
npm run db:seed

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo ""
echo "Demo Users (password: Demo123!):"
echo "  👤 Admin:    admin@legaldd.demo"
echo "  👤 Manager:  manager@legaldd.demo"
echo "  👤 Reviewer: reviewer@legaldd.demo"
echo "  👤 Viewer:   viewer@legaldd.demo"
echo ""
echo "To start the application:"
echo "  docker-compose up -d              # Start all services"
echo "  OR"
echo "  cd backend && npm run dev         # Terminal 1"
echo "  cd frontend && npm run dev        # Terminal 2"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  API Docs: http://localhost:3001/api"
echo ""
echo "For more information, see docs/DEMO_USERS.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
