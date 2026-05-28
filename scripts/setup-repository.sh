#!/bin/bash

# Repository Setup Script for LegalPro v1.0.1 Case Management System
# This script sets up the complete GitHub workflow and repository structure

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This is not a git repository. Please run 'git init' first."
    exit 1
fi

print_header "Setting Up LegalPro Repository"

# Set up remote origin if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_status "Adding remote origin..."
    git remote add origin https://github.com/mokwathedeveloper/advocate_app.git
else
    print_status "Remote origin already exists"
fi

# Create and switch to main branch if not exists
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_status "Creating and switching to main branch..."
    git checkout -b main 2>/dev/null || git checkout main
fi

# Create development branch
print_status "Creating development branch..."
git checkout -b develop 2>/dev/null || git checkout develop

# Switch back to main
git checkout main

# Create initial commit if no commits exist
if ! git log --oneline -1 > /dev/null 2>&1; then
    print_status "Creating initial commit..."
    git add .
    git commit -m "Initial commit: LegalPro Case Management System

- Complete React frontend with TypeScript
- Node.js backend with Express
- MongoDB integration
- Authentication system
- Case management features
- Appointment scheduling
- Payment integration ready
- Responsive design with Tailwind CSS"
fi

# Push to GitHub
print_status "Pushing to GitHub..."
git push -u origin main
git push -u origin develop

# Create release branch for v1.0.0
print_status "Creating release branch for v1.0.0..."
git checkout -b release/v1.0.0
git push -u origin release/v1.0.0

# Switch back to main
git checkout main

# Create and push tags
print_status "Creating initial tags..."
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- Complete case management system
- User authentication and authorization
- Appointment scheduling
- Document management
- Payment integration framework
- Responsive web design
- RESTful API backend
- MongoDB database integration"

git push origin v1.0.0

print_header "Repository Setup Complete!"
print_status "Repository URL: https://github.com/mokwathedeveloper/advocate_app"
print_status "Main branch: main"
print_status "Development branch: develop"
print_status "Release branch: release/v1.0.0"
print_status "Initial tag: v1.0.0"

echo ""
print_status "Next steps:"
echo "1. Go to GitHub and enable branch protection for main branch"
echo "2. Set up GitHub Actions workflows"
echo "3. Configure issue and PR templates"
echo "4. Add collaborators if needed"
echo "5. Set up deployment environments"