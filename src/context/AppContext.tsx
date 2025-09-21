import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { JobDescription, Resume, EvaluationResult, AppSettings } from '../types';

interface AppState {
  currentJob: JobDescription | null;
  uploadedResumes: Resume[];
  evaluationResults: EvaluationResult[];
  isEvaluating: boolean;
  settings: AppSettings;
}

type AppAction =
  | { type: 'SET_CURRENT_JOB'; payload: JobDescription }
  | { type: 'SET_UPLOADED_RESUMES'; payload: Resume[] }
  | { type: 'ADD_UPLOADED_RESUMES'; payload: Resume[] }
  | { type: 'SET_EVALUATION_RESULTS'; payload: EvaluationResult[] }
  | { type: 'SET_EVALUATING'; payload: boolean }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'RESET_SESSION' };

const initialState: AppState = {
  currentJob: null,
  uploadedResumes: [],
  evaluationResults: [],
  isEvaluating: false,
  settings: {
    useMockData: import.meta.env.VITE_USE_MOCK === 'true',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    theme: 'light',
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_JOB':
      return { ...state, currentJob: action.payload };
    
    case 'SET_UPLOADED_RESUMES':
      return { ...state, uploadedResumes: action.payload };
    
    case 'ADD_UPLOADED_RESUMES':
      return { 
        ...state, 
        uploadedResumes: [...state.uploadedResumes, ...action.payload] 
      };
    
    case 'SET_EVALUATION_RESULTS':
      return { ...state, evaluationResults: action.payload };
    
    case 'SET_EVALUATING':
      return { ...state, isEvaluating: action.payload };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    case 'RESET_SESSION':
      return {
        ...initialState,
        settings: state.settings, // Preserve settings
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}