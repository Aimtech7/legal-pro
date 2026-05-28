#!/bin/bash
# Git workflow automation script for LegalPro v1.0.1

# Git Workflow Management Script for LegalPro Case Management System

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to create feature branch
create_feature_branch() {
    local branch_name=$1
    if [ -z "$branch_name" ]; then
        print_error "Please provide a branch name"
        echo "Usage: ./git-workflow.sh feature <branch-name>"
        exit 1
    fi
    
    print_header "Creating Feature Branch: $branch_name"
    
    # Ensure we're on main/master
    git checkout main 2>/dev/null || git checkout master 2>/dev/null
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
    
    # Create and checkout new branch
    git checkout -b "feature/$branch_name"
    
    print_status "Created and switched to feature/$branch_name"
    print_status "You can now start working on your feature!"
}

# Function to create release branch
create_release_branch() {
    local version=$1
    if [ -z "$version" ]; then
        print_error "Please provide a version number"
        echo "Usage: ./git-workflow.sh release <version>"
        exit 1
    fi
    
    print_header "Creating Release Branch: v$version"
    
    # Ensure we're on main/master
    git checkout main 2>/dev/null || git checkout master 2>/dev/null
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
    
    # Create release branch
    git checkout -b "release/v$version"
    
    print_status "Created and switched to release/v$version"
    print_status "Update version numbers and prepare for release!"
}

# Function to create hotfix branch
create_hotfix_branch() {
    local fix_name=$1
    if [ -z "$fix_name" ]; then
        print_error "Please provide a hotfix name"
        echo "Usage: ./git-workflow.sh hotfix <fix-name>"
        exit 1
    fi
    
    print_header "Creating Hotfix Branch: $fix_name"
    
    # Ensure we're on main/master
    git checkout main 2>/dev/null || git checkout master 2>/dev/null
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
    
    # Create hotfix branch
    git checkout -b "hotfix/$fix_name"
    
    print_status "Created and switched to hotfix/$fix_name"
    print_status "Apply your critical fix!"
}

# Function to finish feature (prepare for PR)
finish_feature() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        print_error "You must be on a feature branch to finish it"
        exit 1
    fi
    
    print_header "Finishing Feature Branch: $current_branch"
    
    # Add all changes
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        print_warning "No changes to commit"
    else
        echo "Enter commit message:"
        read commit_message
        git commit -m "$commit_message"
    fi
    
    # Push to origin
    git push origin "$current_branch"
    
    print_status "Feature branch pushed to origin"
    print_status "You can now create a Pull Request on GitHub!"
    print_status "URL: https://github.com/YOUR_USERNAME/YOUR_REPO/compare/$current_branch"
}

# Function to create and push tags
create_tag() {
    local version=$1
    local message=$2
    
    if [ -z "$version" ]; then
        print_error "Please provide a version number"
        echo "Usage: ./git-workflow.sh tag <version> [message]"
        exit 1
    fi
    
    if [ -z "$message" ]; then
        message="Release version $version"
    fi
    
    print_header "Creating Tag: v$version"
    
    # Ensure we're on main/master
    git checkout main 2>/dev/null || git checkout master 2>/dev/null
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
    
    # Create annotated tag
    git tag -a "v$version" -m "$message"
    
    # Push tag to origin
    git push origin "v$version"
    
    print_status "Tag v$version created and pushed to origin"
    print_status "GitHub will automatically create a release for this tag"
}

# Function to show current status
show_status() {
    print_header "Git Repository Status"
    
    echo -e "${BLUE}Current Branch:${NC}"
    git branch --show-current
    
    echo -e "\n${BLUE}Repository Status:${NC}"
    git status --short
    
    echo -e "\n${BLUE}Recent Commits:${NC}"
    git log --oneline -5
    
    echo -e "\n${BLUE}Available Branches:${NC}"
    git branch -a
    
    echo -e "\n${BLUE}Tags:${NC}"
    git tag -l | tail -5
}

# Function to clean up merged branches
cleanup_branches() {
    print_header "Cleaning Up Merged Branches"
    
    # Switch to main/master
    git checkout main 2>/dev/null || git checkout master 2>/dev/null
    
    # Delete merged local branches
    git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d
    
    # Prune remote tracking branches
    git remote prune origin
    
    print_status "Cleaned up merged branches"
}

# Main script logic
case "$1" in
    "feature")
        create_feature_branch "$2"
        ;;
    "release")
        create_release_branch "$2"
        ;;
    "hotfix")
        create_hotfix_branch "$2"
        ;;
    "finish")
        finish_feature
        ;;
    "tag")
        create_tag "$2" "$3"
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup_branches
        ;;
    *)
        print_header "LegalPro Git Workflow Manager"
        echo "Usage: $0 {feature|release|hotfix|finish|tag|status|cleanup}"
        echo ""
        echo "Commands:"
        echo "  feature <name>     - Create a new feature branch"
        echo "  release <version>  - Create a new release branch"
        echo "  hotfix <name>      - Create a new hotfix branch"
        echo "  finish             - Finish current feature branch (commit & push)"
        echo "  tag <version> [msg]- Create and push a new tag"
        echo "  status             - Show repository status"
        echo "  cleanup            - Clean up merged branches"
        echo ""
        echo "Examples:"
        echo "  $0 feature user-authentication"
        echo "  $0 release 1.2.0"
        echo "  $0 tag 1.2.0 'Major feature release'"
        echo "  $0 finish"
        ;;
esac