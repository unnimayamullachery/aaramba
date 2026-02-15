#!/bin/bash

# Aaramba - Automatic Startup Script
# This script starts both backend and frontend servers and opens the application

echo "🚀 Starting Aaramba Online Jewellery Store..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is already running
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Backend is already running on port 5000${NC}"
else
    echo -e "${BLUE}📦 Starting Backend Server...${NC}"
    cd backend
    npm run dev > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    sleep 3
fi

# Check if frontend is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Frontend is already running on port 3001${NC}"
else
    echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
    cd frontend
    npm run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
    sleep 5
fi

echo ""
echo -e "${GREEN}✅ Application is ready!${NC}"
echo ""
echo -e "${BLUE}📍 Access the application:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3001${NC}"
echo -e "   Backend API: ${GREEN}http://localhost:5000/api${NC}"
echo ""
echo -e "${BLUE}🔐 Demo Credentials:${NC}"
echo -e "   Admin: ${GREEN}admin@aaramba.com / admin123${NC}"
echo -e "   Customer: ${GREEN}customer@aaramba.com / customer123${NC}"
echo ""

# Open in browser
echo -e "${BLUE}🌐 Opening application in browser...${NC}"
sleep 2

# Detect OS and open browser accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3001
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:3001 2>/dev/null || echo "Please open http://localhost:3001 in your browser"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start http://localhost:3001
else
    echo "Please open http://localhost:3001 in your browser"
fi

echo ""
echo -e "${GREEN}🎉 Aaramba is running!${NC}"
echo ""
echo -e "${YELLOW}📝 To stop the servers, press Ctrl+C${NC}"
echo ""

# Keep script running
wait