#!/bin/bash

# Release Notes Generator for LegalPro v1.0.1 Case Management System

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

generate_release_notes() {
    local version=$1
    local previous_tag=$2
    
    if [ -z "$version" ]; then
        echo "Usage: $0 <version> [previous_tag]"
        echo "Example: $0 1.0.0 v0.9.0"
        exit 1
    fi
    
    if [ -z "$previous_tag" ]; then
        # Get the latest tag if not provided
        previous_tag=$(git describe --tags --abbrev=0 2>/dev/null)
        if [ -z "$previous_tag" ]; then
            previous_tag="HEAD~10" # Last 10 commits if no tags exist
        fi
    fi
    
    print_header "Generating Release Notes for v$version"
    
    local output_file="RELEASE_NOTES_v$version.md"
    
    cat > "$output_file" << EOF
# Release Notes - LegalPro v$version

**Release Date:** $(date +"%B %d, %Y")

## 🚀 What's New

### ✨ Features
$(git log $previous_tag..HEAD --pretty=format:"- %s" --grep="feat:" | sed 's/feat: //')

### 🐛 Bug Fixes
$(git log $previous_tag..HEAD --pretty=format:"- %s" --grep="fix:" | sed 's/fix: //')

### 🔧 Improvements
$(git log $previous_tag..HEAD --pretty=format:"- %s" --grep="improve:" | sed 's/improve: //')

### 📚 Documentation
$(git log $previous_tag..HEAD --pretty=format:"- %s" --grep="docs:" | sed 's/docs: //')

## 📊 Statistics

- **Total Commits:** $(git rev-list $previous_tag..HEAD --count)
- **Files Changed:** $(git diff --name-only $previous_tag..HEAD | wc -l)
- **Contributors:** $(git shortlog -sn $previous_tag..HEAD | wc -l)

## 🔗 Links

- [Full Changelog](https://github.com/mokwathedeveloper/advocate_app/compare/$previous_tag...v$version)
- [Download](https://github.com/mokwathedeveloper/advocate_app/releases/tag/v$version)

## 🙏 Contributors

$(git shortlog -sn $previous_tag..HEAD)

---

## 📋 Installation & Upgrade

### New Installation
\`\`\`bash
git clone https://github.com/mokwathedeveloper/advocate_app.git
cd advocate_app
npm install
cd backend && npm install
\`\`\`

### Upgrade from Previous Version
\`\`\`bash
git pull origin main
npm install
cd backend && npm install
\`\`\`

## 🔧 Configuration

Make sure to update your environment variables:
- Copy \`.env.example\` to \`.env\` in both root and backend directories
- Update database connection strings
- Configure email and SMS settings

## 🐛 Known Issues

- None at this time

## 🆘 Support

If you encounter any issues:
1. Check the [documentation](https://github.com/mokwathedeveloper/advocate_app/wiki)
2. Search [existing issues](https://github.com/mokwathedeveloper/advocate_app/issues)
3. Create a [new issue](https://github.com/mokwathedeveloper/advocate_app/issues/new)

EOF

    echo -e "${GREEN}Release notes generated: $output_file${NC}"
    echo "You can now copy this content to your GitHub release!"
}

# Run the function
generate_release_notes "$1" "$2"