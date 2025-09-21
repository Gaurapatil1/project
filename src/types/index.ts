export interface JobDescription {
  job_id: string;
  title: string;
  must_have_skills: string[];
  nice_to_have: string[];
  description?: string;
  company?: string;
  location?: string;
  created_at?: string;
}

export interface Resume {
  resume_id: string;
  name: string;
  filename: string;
  parsed_text_snippet: string;
  email?: string;
  phone?: string;
  uploaded_at?: string;
}

export interface EvaluationResult {
  resume_id: string;
  name: string;
  score: number;
  verdict: 'High' | 'Medium' | 'Low';
  matched_skills: string[];
  missing_skills: string[];
  feedback: string;
  email?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  per_page: number;
  results: T[];
}

export interface UploadResponse {
  uploaded: Resume[];
}

export interface EvaluationRequest {
  job_id: string;
  resume_ids: string[];
}

export interface FilterOptions {
  verdict?: 'High' | 'Medium' | 'Low' | 'All';
  scoreRange?: [number, number];
  search?: string;
}

export interface AppSettings {
  useMockData: boolean;
  apiBaseUrl: string;
  apiKey?: string;
  theme: 'light' | 'dark';
}

export type VerdictType = 'High' | 'Medium' | 'Low';

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}