// MSW request handlers for API mocking
import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock data
const mockUsers = [
  {
    _id: 'client-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'client'
  },
  {
    _id: 'advocate-1',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@lawfirm.com',
    role: 'advocate'
  },
  {
    _id: 'admin-1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@lawfirm.com',
    role: 'admin'
  }
];

const mockCases = [
  {
    _id: 'case-1',
    caseNumber: 'CASE-2024-0001',
    title: 'Property Dispute Case',
    description: 'Boundary dispute between neighboring properties',
    category: 'Property Law',
    status: 'in_progress',
    priority: 'high',
    clientId: mockUsers[0],
    assignedTo: mockUsers[1],
    documents: [],
    notes: [],
    timeline: [
      {
        _id: 'timeline-1',
        event: 'case_created',
        description: 'Case opened',
        user: mockUsers[1],
        createdAt: '2024-03-01T09:00:00.000Z'
      }
    ],
    createdAt: '2024-03-01T09:00:00.000Z',
    updatedAt: '2024-03-10T14:30:00.000Z'
  },
  {
    _id: 'case-2',
    caseNumber: 'CASE-2024-0002',
    title: 'Contract Review',
    description: 'Review and analysis of employment contract',
    category: 'Employment Law',
    status: 'pending',
    priority: 'medium',
    clientId: mockUsers[0],
    assignedTo: mockUsers[1],
    documents: [],
    notes: [],
    timeline: [],
    createdAt: '2024-03-02T10:00:00.000Z',
    updatedAt: '2024-03-02T10:00:00.000Z'
  }
];

const mockDocuments = [
  {
    _id: 'doc-1',
    name: 'Property Deed',
    originalName: 'property_deed.pdf',
    type: 'application/pdf',
    size: 1024000,
    url: 'https://test.cloudinary.com/property_deed.pdf',
    publicId: 'test-property-deed',
    uploadedBy: mockUsers[1],
    createdAt: '2024-03-05T11:00:00.000Z'
  }
];

export const handlers = [
  // Authentication endpoints
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: mockUsers[1]
      }
    });
  }),

  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json({
      success: true,
      message: 'User registered successfully'
    });
  }),

  // User management endpoints
  http.get(`${API_BASE_URL}/users`, ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    
    let filteredUsers = mockUsers;
    if (role) {
      const roles = role.split(',');
      filteredUsers = mockUsers.filter(user => roles.includes(user.role));
    }
    
    return HttpResponse.json({
      success: true,
      data: filteredUsers
    });
  }),

  // Case management endpoints
  http.get(`${API_BASE_URL}/cases`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    
    let filteredCases = [...mockCases];
    
    // Apply filters
    if (search) {
      filteredCases = filteredCases.filter(case_item =>
        case_item.title.toLowerCase().includes(search.toLowerCase()) ||
        case_item.description.toLowerCase().includes(search.toLowerCase()) ||
        case_item.caseNumber.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      filteredCases = filteredCases.filter(case_item => case_item.status === status);
    }
    
    if (category) {
      filteredCases = filteredCases.filter(case_item => case_item.category === category);
    }
    
    if (priority) {
      filteredCases = filteredCases.filter(case_item => case_item.priority === priority);
    }
    
    // Pagination
    const total = filteredCases.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCases = filteredCases.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      success: true,
      count: paginatedCases.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      },
      data: paginatedCases
    });
  }),

  http.get(`${API_BASE_URL}/cases/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    
    let filteredCases = [...mockCases];
    
    if (q) {
      filteredCases = filteredCases.filter(case_item =>
        case_item.title.toLowerCase().includes(q.toLowerCase()) ||
        case_item.description.toLowerCase().includes(q.toLowerCase())
      );
    }
    
    return HttpResponse.json({
      success: true,
      count: filteredCases.length,
      total: filteredCases.length,
      data: filteredCases
    });
  }),

  http.get(`${API_BASE_URL}/cases/stats`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        overview: {
          totalCases: mockCases.length,
          pendingCases: mockCases.filter(c => c.status === 'pending').length,
          inProgressCases: mockCases.filter(c => c.status === 'in_progress').length,
          completedCases: mockCases.filter(c => c.status === 'completed').length,
          closedCases: mockCases.filter(c => c.status === 'closed').length,
          urgentCases: mockCases.filter(c => c.priority === 'urgent').length,
          highPriorityCases: mockCases.filter(c => c.priority === 'high').length
        },
        categoryBreakdown: [
          { _id: 'Property Law', count: 1 },
          { _id: 'Employment Law', count: 1 }
        ]
      }
    });
  }),

  http.get(`${API_BASE_URL}/cases/:id`, ({ params }) => {
    const { id } = params;
    const case_item = mockCases.find(c => c._id === id);
    
    if (!case_item) {
      return HttpResponse.json(
        { success: false, message: 'Case not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        ...case_item,
        documentStats: {
          totalDocuments: case_item.documents.length,
          totalSize: 0,
          remainingSlots: 50 - case_item.documents.length,
          remainingSize: 524288000
        }
      }
    });
  }),

  http.post(`${API_BASE_URL}/cases`, async ({ request }) => {
    const body = await request.json() as any;
    
    const newCase = {
      _id: `case-${Date.now()}`,
      caseNumber: `CASE-2024-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
      ...body,
      status: 'pending',
      documents: [],
      notes: [],
      timeline: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockCases.push(newCase);
    
    return HttpResponse.json({
      success: true,
      message: 'Case created successfully',
      data: newCase
    }, { status: 201 });
  }),

  http.put(`${API_BASE_URL}/cases/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    
    const caseIndex = mockCases.findIndex(c => c._id === id);
    if (caseIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Case not found' },
        { status: 404 }
      );
    }
    
    mockCases[caseIndex] = {
      ...mockCases[caseIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json({
      success: true,
      message: 'Case updated successfully',
      data: mockCases[caseIndex]
    });
  }),

  http.delete(`${API_BASE_URL}/cases/:id`, ({ params }) => {
    const { id } = params;
    const caseIndex = mockCases.findIndex(c => c._id === id);
    
    if (caseIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Case not found' },
        { status: 404 }
      );
    }
    
    mockCases.splice(caseIndex, 1);
    
    return HttpResponse.json({
      success: true,
      message: 'Case archived successfully'
    });
  }),

  // Document management endpoints
  http.get(`${API_BASE_URL}/cases/:id/documents`, ({ params }) => {
    const { id } = params;
    const case_item = mockCases.find(c => c._id === id);
    
    if (!case_item) {
      return HttpResponse.json(
        { success: false, message: 'Case not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      count: mockDocuments.length,
      data: mockDocuments
    });
  }),

  http.post(`${API_BASE_URL}/cases/:id/documents`, async ({ params }) => {
    const { id } = params;
    const case_item = mockCases.find(c => c._id === id);
    
    if (!case_item) {
      return HttpResponse.json(
        { success: false, message: 'Case not found' },
        { status: 404 }
      );
    }
    
    const newDocument = {
      _id: `doc-${Date.now()}`,
      name: 'Uploaded Document',
      originalName: 'uploaded.pdf',
      type: 'application/pdf',
      size: 1024,
      url: 'https://test.cloudinary.com/uploaded.pdf',
      publicId: 'test-uploaded',
      uploadedBy: mockUsers[1],
      createdAt: new Date().toISOString()
    };
    
    return HttpResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument
    }, { status: 201 });
  }),

  http.delete(`${API_BASE_URL}/cases/:caseId/documents/:docId`, ({ params }) => {
    const { caseId, docId } = params;
    
    return HttpResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  }),

  http.get(`${API_BASE_URL}/cases/:caseId/documents/:docId/download`, ({ params }) => {
    const { caseId, docId } = params;
    
    return HttpResponse.json({
      success: true,
      data: {
        downloadUrl: 'https://test.cloudinary.com/download/test.pdf',
        filename: 'test.pdf',
        size: 1024,
        type: 'application/pdf'
      }
    });
  }),

  // Timeline and notes endpoints
  http.get(`${API_BASE_URL}/cases/:id/timeline`, ({ params }) => {
    const { id } = params;
    const case_item = mockCases.find(c => c._id === id);
    
    if (!case_item) {
      return HttpResponse.json(
        { success: false, message: 'Case not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: case_item.timeline
    });
  }),

  http.post(`${API_BASE_URL}/cases/:id/notes`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    
    return HttpResponse.json({
      success: true,
      message: 'Note added successfully'
    });
  }),

  // Status update endpoint
  http.put(`${API_BASE_URL}/cases/:id/status`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    
    const caseIndex = mockCases.findIndex(c => c._id === id);
    if (caseIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Case not found' },
        { status: 404 }
      );
    }
    
    mockCases[caseIndex].status = body.status;
    mockCases[caseIndex].updatedAt = new Date().toISOString();
    
    return HttpResponse.json({
      success: true,
      message: 'Case status updated successfully',
      data: mockCases[caseIndex]
    });
  })
];
