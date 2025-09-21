import jobDescriptionsData from './jobDescriptions.json';
import resumesData from './resumes.json';
import evaluationResultsData from './evaluationResults.json';
import { 
  JobDescription, 
  Resume, 
  EvaluationResult, 
  EvaluationRequest,
  PaginatedResponse 
} from '../types';
import { generateId } from '../utils/helpers';

class MockAPI {
  private jobDescriptions: JobDescription[] = jobDescriptionsData;
  private resumes: Resume[] = resumesData;
  private evaluationResults: EvaluationResult[] = evaluationResultsData;

  async handleRequest(endpoint: string, options: RequestInit): Promise<any> {
    const method = options.method || 'GET';
    const url = new URL(`http://localhost${endpoint}`);
    
    switch (true) {
      case endpoint === '/jd/upload' && method === 'POST':
        return this.uploadJobDescription(options);
      
      case endpoint === '/resumes/upload' && method === 'POST':
        return this.uploadResumes();
      
      case endpoint === '/evaluate' && method === 'POST':
        return this.evaluateResumes(options);
      
      case endpoint.startsWith('/results') && method === 'GET':
        return this.getResults(url);
      
      default:
        throw new Error(`Mock endpoint not implemented: ${method} ${endpoint}`);
    }
  }

  private async uploadJobDescription(options: RequestInit): Promise<JobDescription> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return the first job description from mock data for simplicity
    // In real implementation, this would parse the uploaded file/text
    return this.jobDescriptions[0];
  }

  private async uploadResumes(): Promise<{ uploaded: Resume[] }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Return subset of resumes to simulate upload
    const uploadedResumes = this.resumes.slice(0, 5).map(resume => ({
      ...resume,
      uploaded_at: new Date().toISOString(),
    }));
    
    return { uploaded: uploadedResumes };
  }

  private async evaluateResumes(options: RequestInit): Promise<{ results: EvaluationResult[] }> {
    const body = JSON.parse(options.body as string) as EvaluationRequest;
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return evaluation results for requested resume IDs
    const results = this.evaluationResults.filter(result => 
      body.resume_ids.includes(result.resume_id)
    );
    
    return { results };
  }

  private async getResults(url: URL): Promise<PaginatedResponse<EvaluationResult>> {
    const jobId = url.searchParams.get('job_id');
    const page = parseInt(url.searchParams.get('page') || '1');
    const filter = url.searchParams.get('filter');
    const search = url.searchParams.get('search');
    const perPage = 10;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredResults = [...this.evaluationResults];
    
    // Apply filters
    if (filter && filter !== 'All') {
      filteredResults = filteredResults.filter(result => result.verdict === filter);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredResults = filteredResults.filter(result => 
        result.name.toLowerCase().includes(searchLower) ||
        result.email?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * perPage;
    const paginatedResults = filteredResults.slice(startIndex, startIndex + perPage);
    
    return {
      total: filteredResults.length,
      page,
      per_page: perPage,
      results: paginatedResults,
    };
  }
}

export const mockAPI = new MockAPI();