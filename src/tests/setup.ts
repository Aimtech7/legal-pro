
// Test setup file for frontend testing
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { server } from './mocks/server';

// Mock environment variables
Object.defineProperty(window, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: 'http://localhost:5000',
      VITE_APP_NAME: 'LegalPro',
      VITE_APP_VERSION: '1.0.1',
      VITE_NODE_ENV: 'test'
    }
  }
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn()
  },
  writable: true
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: vi.fn()
});

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true)
});

// Mock window.alert
Object.defineProperty(window, 'alert', {
  value: vi.fn()
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

import '@testing-library/jest-dom';
import React from 'react';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};


// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,

  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock File and FileReader
global.File = class MockFile {
  constructor(bits: any[], filename: string, options: any = {}) {
    this.name = filename;
    this.size = bits.reduce((acc, bit) => acc + (bit.length || 0), 0);
    this.type = options.type || '';
    this.lastModified = Date.now();
  }
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

global.FileReader = class MockFileReader {
  result: string | ArrayBuffer | null = null;
  error: any = null;
  readyState: number = 0;
  onload: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onabort: ((event: any) => void) | null = null;

  readAsDataURL(file: File) {
    this.readyState = 2;
    this.result = `data:${file.type};base64,dGVzdA==`;
    if (this.onload) {
      this.onload({ target: this });
    }
  }

  readAsText(file: File) {
    this.readyState = 2;
    this.result = 'test file content';
    if (this.onload) {
      this.onload({ target: this });
    }
  }

  abort() {
    this.readyState = 2;
    if (this.onabort) {
      this.onabort({ target: this });
    }
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost:3000/test');
global.URL.revokeObjectURL = vi.fn();

// Mock fetch if not using MSW
if (!global.fetch) {
  global.fetch = vi.fn();
}

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn()
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn()
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    img: 'img',
    a: 'a',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    ul: 'ul',
    li: 'li'
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn()
  })
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => {
  const MockIcon = ({ className, ...props }: any) =>
    React.createElement('svg', { className, ...props, 'data-testid': 'mock-icon' });

  return new Proxy({}, {
    get: () => MockIcon
  });
});

// Setup MSW
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

afterAll(() => {
  server.close();
});

// Global test utilities
global.testUtils = {
  // Create mock user data
  createMockUser: (role: string = 'client', overrides: any = {}) => ({
    _id: `user-${Date.now()}`,
    firstName: 'Test',
    lastName: 'User',
    email: `test-${role}@example.com`,
    role,
    isVerified: true,
    isActive: true,
    ...overrides
  }),

  // Create mock case data
  createMockCase: (overrides: any = {}) => ({
    _id: `case-${Date.now()}`,
    caseNumber: `CASE-2024-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
    title: 'Test Case',
    description: 'Test case description',
    category: 'Family Law',
    status: 'pending',
    priority: 'medium',
    clientId: {
      _id: 'client-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    },
    assignedTo: {
      _id: 'advocate-id',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@lawfirm.com'
    },
    documents: [],
    notes: [],
    timeline: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),

  // Create mock document data
  createMockDocument: (overrides: any = {}) => ({
    _id: `doc-${Date.now()}`,
    name: 'Test Document',
    originalName: 'test.pdf',
    type: 'application/pdf',
    size: 1024,
    url: 'https://test.cloudinary.com/test.pdf',
    publicId: 'test-public-id',
    uploadedBy: {
      _id: 'user-id',
      firstName: 'Test',
      lastName: 'User'
    },
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  // Create mock file for upload testing
  createMockFile: (name: string = 'test.pdf', size: number = 1024, type: string = 'application/pdf') => {
    return new File(['test content'], name, { type });
  },

  // Wait for async operations
  wait: (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock JWT token
  createMockToken: () => 'mock-jwt-token-for-testing'
};

// Custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received && received.ownerDocument && received.ownerDocument.contains(received);
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass
    };
  }
});

// Suppress console warnings in tests unless explicitly needed
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args: any[]) => {
  if (process.env.VERBOSE_TESTS) {
    originalConsoleWarn(...args);
  }
};

console.error = (...args: any[]) => {
  if (process.env.VERBOSE_TESTS) {
    originalConsoleError(...args);
  }
};

// Restore console methods after tests
afterAll(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});


// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Mock framer-motion components
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => React.createElement('div', props),
    h1: (props: any) => React.createElement('h1', props),
    h2: (props: any) => React.createElement('h2', props),
    h3: (props: any) => React.createElement('h3', props),
    p: (props: any) => React.createElement('p', props),
    section: (props: any) => React.createElement('section', props),
    button: (props: any) => React.createElement('button', props),
    span: (props: any) => React.createElement('span', props),
    a: (props: any) => React.createElement('a', props),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Google Maps (if needed)
global.google = {
  maps: {
    Map: class {
      constructor() {}
    },
    Marker: class {
      constructor() {}
    },
    InfoWindow: class {
      constructor() {}
    },
    LatLng: class {
      constructor() {}
    },
    event: {
      addListener: () => {},
    },
  },
} as any;

