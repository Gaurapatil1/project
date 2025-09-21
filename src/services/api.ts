import { 
  JobDescription, 
  Resume, 
  EvaluationResult, 
  EvaluationRequest,
  PaginatedResponse,
  ApiResponse 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

class ApiClient {
  private baseURL: string;
  private useMock: boolean;

  constructor(baseURL: string = API_BASE_URL, useMock: boolean = USE_MOCK) {
    this.baseURL = baseURL;
    this.useMock = useMock;
  }

  setMockMode(useMock: boolean) {
    this.useMock = useMock;
  }

  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (this.useMock) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private async handleMockRequest<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const { mockAPI } = await import('../mocks/mockAPI');
    
    try {
      const result = await mockAPI.handleRequest(endpoint, options);
      return {
        success: true,
        data: result as T,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mock API error',
      };
    }
  }

  async uploadJobDescription(file?: File, text?: string): Promise<ApiResponse<JobDescription>> {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      return this.request<JobDescription>('/jd/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Don't set Content-Type for FormData
      });
    } else if (text) {
      return this.request<JobDescription>('/jd/upload', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
    }
    
    throw new Error('Either file or text must be provided');
  }

  async uploadResumes(files: File[]): Promise<ApiResponse<{ uploaded: Resume[] }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.request<{ uploaded: Resume[] }>('/resumes/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }

  async evaluateResumes(request: EvaluationRequest): Promise<ApiResponse<{ results: EvaluationResult[] }>> {
    return this.request<{ results: EvaluationResult[] }>('/evaluate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getResults(
    jobId: string,
    page: number = 1,
    filter?: string,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<EvaluationResult>>> {
    const params = new URLSearchParams({
      job_id: jobId,
      page: page.toString(),
      ...(filter && { filter }),
      ...(search && { search }),
    });

    return this.request<PaginatedResponse<EvaluationResult>>(`/results?${params}`);
  }
}

export const apiClient = new ApiClient();