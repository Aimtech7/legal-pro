# LegalPro Testing Guide

## 🧪 Overview
This guide provides comprehensive instructions for running, maintaining, and extending the test suite for the LegalPro case management system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running (for backend tests)
- All dependencies installed (`npm install`)

### Run All Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
npm test

# Generate coverage reports
cd backend && npm run test:coverage
npm run test:coverage
```

## 📋 Test Structure

### Backend Tests (`backend/tests/`)
```
backend/tests/
├── setup.js                    # Global test configuration
├── case.test.js                # Integration tests for case API
└── unit/
    ├── models/
    │   └── Case.test.js        # Case model unit tests
    └── middleware/
        ├── auth.test.js        # Authentication middleware tests
        └── upload.test.js      # File upload middleware tests
```

### Frontend Tests (`src/tests/`)
```
src/tests/
├── setup.ts                    # Global test configuration
├── mocks/
│   ├── server.ts              # MSW server setup
│   └── handlers.ts            # API mock handlers
├── components/
│   ├── CaseForm.test.tsx      # Case form component tests
│   └── DocumentUpload.test.tsx # Document upload tests
└── services/
    └── caseService.test.ts    # API service tests
```

## 🔧 Test Configuration

### Backend Configuration (Jest)
```javascript
// backend/package.json
{
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "collectCoverageFrom": [
      "controllers/**/*.js",
      "models/**/*.js",
      "middleware/**/*.js",
      "routes/**/*.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 85,
        "lines": 90,
        "statements": 90
      }
    }
  }
}
```

### Frontend Configuration (Vitest)
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 90,
          statements: 90
        }
      }
    }
  }
});
```

## 📝 Test Commands Reference

### Backend Testing Commands
```bash
# Basic test execution
npm test                        # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage report
npm run test:ci                # Run tests for CI/CD (no watch)

# Specific test types
npm run test:unit              # Run only unit tests
npm run test:integration       # Run only integration tests

# Debug mode
npm test -- --verbose          # Verbose output
npm test -- --detectOpenHandles # Detect async operations
```

### Frontend Testing Commands
```bash
# Basic test execution
npm test                       # Run all tests
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Run tests with coverage report
npm run test:ui               # Run tests with UI interface
npm run test:ci               # Run tests for CI/CD

# Specific test patterns
npm test CaseForm             # Run specific test file
npm test -- --grep "upload"  # Run tests matching pattern
```

## 🧩 Writing Tests

### Backend Test Example
```javascript
// backend/tests/unit/models/Case.test.js
describe('Case Model', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await global.testUtils.createTestUser('client');
  });

  test('should create case with valid data', async () => {
    const caseData = {
      title: 'Test Case',
      description: 'Test description',
      category: 'Family Law',
      clientId: testUser._id
    };

    const case_item = await Case.create(caseData);
    
    expect(case_item).toBeDefined();
    expect(case_item.title).toBe(caseData.title);
    expect(case_item.caseNumber).toMatch(/^CASE-\d{4}-\d{4}$/);
  });
});
```

### Frontend Test Example
```typescript
// src/tests/components/CaseForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CaseForm from '../../components/cases/CaseForm';

describe('CaseForm Component', () => {
  test('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(<CaseForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/title/i), 'Test Case');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Case',
      description: 'Test description'
    });
  });
});
```

## 🔍 Test Utilities

### Backend Test Utilities
```javascript
// Available in global.testUtils
global.testUtils = {
  createTestUser: async (role, overrides) => { /* ... */ },
  createTestCase: async (clientId, assignedTo, overrides) => { /* ... */ },
  generateTestToken: (userId) => { /* ... */ },
  createTestFile: (filename, size, type) => { /* ... */ },
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};
```

### Frontend Test Utilities
```typescript
// Available in global.testUtils
global.testUtils = {
  createMockUser: (role, overrides) => { /* ... */ },
  createMockCase: (overrides) => { /* ... */ },
  createMockDocument: (overrides) => { /* ... */ },
  createMockFile: (name, size, type) => new File([...], name, { type }),
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};
```

## 🎯 Testing Best Practices

### 1. Test Structure (AAA Pattern)
```javascript
test('should do something', async () => {
  // Arrange - Set up test data
  const testData = { /* ... */ };
  
  // Act - Execute the functionality
  const result = await functionUnderTest(testData);
  
  // Assert - Verify the results
  expect(result).toBe(expectedValue);
});
```

### 2. Descriptive Test Names
```javascript
// ❌ Bad
test('case creation', () => { /* ... */ });

// ✅ Good
test('should create case with valid data and auto-generate case number', () => { /* ... */ });
```

### 3. Test Independence
```javascript
// Each test should be independent
beforeEach(async () => {
  // Clean up database
  await Case.deleteMany({});
  await User.deleteMany({});
});
```

### 4. Mock External Dependencies
```javascript
// Mock external services
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: 'test-id',
        secure_url: 'https://test.com/file.pdf'
      })
    }
  }
}));
```

## 🐛 Debugging Tests

### Common Issues and Solutions

#### 1. Tests Hanging
```bash
# Add timeout and detect open handles
npm test -- --detectOpenHandles --forceExit
```

#### 2. Database Connection Issues
```javascript
// Ensure proper cleanup
afterAll(async () => {
  await mongoose.connection.close();
});
```

#### 3. Async Operation Issues
```javascript
// Use proper async/await
test('async operation', async () => {
  await expect(asyncFunction()).resolves.toBe(expectedValue);
});
```

#### 4. Mock Issues
```javascript
// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
```

## 📊 Coverage Analysis

### Viewing Coverage Reports
```bash
# Generate HTML coverage report
npm run test:coverage

# Open coverage report
# Backend: open backend/coverage/lcov-report/index.html
# Frontend: open coverage/index.html
```

### Coverage Thresholds
- **Statements**: 90%
- **Branches**: 80%
- **Functions**: 85%
- **Lines**: 90%

### Improving Coverage
1. **Identify uncovered lines** in coverage report
2. **Add tests for edge cases** and error scenarios
3. **Test all code paths** including error handling
4. **Remove dead code** that cannot be tested

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:ci
      - run: cd backend && npm run test:ci
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci && cd backend && npm run test:ci"
    }
  }
}
```

## 🚨 Troubleshooting

### Environment Issues
```bash
# Check Node.js version
node --version  # Should be 18+

# Check MongoDB connection
mongosh "mongodb://localhost:27017/legalpro_test"

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Test Database Issues
```bash
# Reset test database
mongosh legalpro_test --eval "db.dropDatabase()"

# Check test environment variables
cat backend/.env.test
```

### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm test
```

## 📚 Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)

### Test Coverage Tools
- [Istanbul/NYC](https://istanbul.js.org/) - Coverage reporting
- [Codecov](https://codecov.io/) - Coverage tracking
- [SonarQube](https://www.sonarqube.org/) - Code quality analysis

---

**Last Updated**: March 2024  
**Version**: 1.0.1  
**Maintainer**: LegalPro Development Team
