#!/bin/bash

# CyberForget Development Startup Script
# Kills processes on required ports and starts both frontend and backend

echo "🚀 Starting CyberForget Development Environment..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port)
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}🔪 Killing processes on port $port...${NC}"
        echo $pids | xargs kill -9
        sleep 1
    else
        echo -e "${GREEN}✅ Port $port is free${NC}"
    fi
}

# Function to check if a service is running
check_service() {
    local url=$1
    local name=$2
    local max_attempts=10
    local attempt=1
    
    echo -e "${YELLOW}🔍 Waiting for $name to start...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is running on $url${NC}"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $name failed to start after $max_attempts attempts${NC}"
    return 1
}

# Kill existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"

# Kill processes on ports 3000 and 5002
kill_port 3000
kill_port 5002

# Kill any npm/node processes that might be hanging
pkill -f "npm start" 2>/dev/null || true
pkill -f "tsx watch" 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true

echo -e "${GREEN}✅ Cleanup completed${NC}"

# Start backend
echo -e "${YELLOW}🔧 Starting CyberForget Backend on port 5002...${NC}"
cd /Volumes/SSD/CyberForget/cyberforget-backend
PORT=5002 npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Start frontend
echo -e "${YELLOW}🎨 Starting CyberForget Frontend on port 3000...${NC}"
cd /Volumes/SSD/CyberForget/frontendv2
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for services to start
sleep 5

# Check if services are running
echo -e "\n${YELLOW}🔍 Checking service health...${NC}"

if check_service "http://localhost:5002/health" "Backend API"; then
    BACKEND_OK=true
else
    BACKEND_OK=false
fi

if check_service "http://localhost:3000" "Frontend"; then
    FRONTEND_OK=true
else
    FRONTEND_OK=false
fi

# Summary
echo -e "\n${YELLOW}📊 Development Environment Status:${NC}"
echo "=================================="

if [ "$BACKEND_OK" = true ]; then
    echo -e "Backend:  ${GREEN}✅ Running${NC} (http://localhost:5002)"
    echo -e "API Test: ${GREEN}✅ Available${NC} (http://localhost:5002/health)"
else
    echo -e "Backend:  ${RED}❌ Failed${NC}"
fi

if [ "$FRONTEND_OK" = true ]; then
    echo -e "Frontend: ${GREEN}✅ Running${NC} (http://localhost:3000)"
    echo -e "App URL:  ${GREEN}✅ Available${NC} (http://localhost:3000/temp-email)"
else
    echo -e "Frontend: ${RED}❌ Failed${NC}"
fi

echo -e "\n${YELLOW}📝 Log Files:${NC}"
echo "Backend:  /Volumes/SSD/CyberForget/backend.log"
echo "Frontend: /Volumes/SSD/CyberForget/frontend.log"

if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
    echo -e "\n${GREEN}🎉 CyberForget Development Environment Ready!${NC}"
    echo -e "${GREEN}🌐 Visit: http://localhost:3000/temp-email${NC}"
    
    # Test temp email API
    echo -e "\n${YELLOW}🧪 Testing Temp Email API...${NC}"
    if curl -s -X POST http://localhost:5002/api/v1/temp-email/generate \
         -H "Content-Type: application/json" \
         -d '{"useGuerrillaFallback": true, "prefix": "test"}' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Temp Email API is working${NC}"
    else
        echo -e "${RED}❌ Temp Email API test failed${NC}"
    fi
else
    echo -e "\n${RED}❌ Some services failed to start. Check log files for details.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}💡 Useful Commands:${NC}"
echo "- View backend logs: tail -f /Volumes/SSD/CyberForget/backend.log"
echo "- View frontend logs: tail -f /Volumes/SSD/CyberForget/frontend.log"
echo "- Stop services: pkill -f 'npm start'; pkill -f 'tsx watch'"
echo "- API Health: curl http://localhost:5002/health"

echo -e "\n${GREEN}✨ Happy coding!${NC}"