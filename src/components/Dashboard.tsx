import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  XCircle,
  Play,
  Upload
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAppContext } from '../context/AppContext';
import { apiClient } from '../services/api';
import { APP_CONFIG } from '../utils/constants';

export function Dashboard() {
  const { state, dispatch } = useAppContext();
  const [jobText, setJobText] = useState('');
  const [isUploadingJob, setIsUploadingJob] = useState(false);
  const [isUploadingResumes, setIsUploadingResumes] = useState(false);

  const stats = [
    {
      title: 'Total Resumes',
      value: state.uploadedResumes.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'High Match',
      value: state.evaluationResults.filter(r => r.verdict === 'High').length,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Medium Match',
      value: state.evaluationResults.filter(r => r.verdict === 'Medium').length,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Low Match',
      value: state.evaluationResults.filter(r => r.verdict === 'Low').length,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const handleJobUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploadingJob(true);
    try {
      const response = await apiClient.uploadJobDescription(files[0]);
      if (response.success && response.data) {
        dispatch({ type: 'SET_CURRENT_JOB', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to upload job description:', error);
    } finally {
      setIsUploadingJob(false);
    }
  };

  const handleJobTextSubmit = async () => {
    if (!jobText.trim()) return;
    
    setIsUploadingJob(true);
    try {
      const response = await apiClient.uploadJobDescription(undefined, jobText);
      if (response.success && response.data) {
        dispatch({ type: 'SET_CURRENT_JOB', payload: response.data });
        setJobText('');
      }
    } catch (error) {
      console.error('Failed to upload job description:', error);
    } finally {
      setIsUploadingJob(false);
    }
  };

  const handleResumeUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploadingResumes(true);
    try {
      const response = await apiClient.uploadResumes(files);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_UPLOADED_RESUMES', payload: response.data.uploaded });
      }
    } catch (error) {
      console.error('Failed to upload resumes:', error);
    } finally {
      setIsUploadingResumes(false);
    }
  };

  const handleEvaluate = async () => {
    if (!state.currentJob || state.uploadedResumes.length === 0) return;
    
    dispatch({ type: 'SET_EVALUATING', payload: true });
    try {
      const response = await apiClient.evaluateResumes({
        job_id: state.currentJob.job_id,
        resume_ids: state.uploadedResumes.map(r => r.resume_id),
      });
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_EVALUATION_RESULTS', payload: response.data.results });
      }
    } catch (error) {
      console.error('Failed to evaluate resumes:', error);
    } finally {
      dispatch({ type: 'SET_EVALUATING', payload: false });
    }
  };

  const canEvaluate = state.currentJob && state.uploadedResumes.length > 0 && !state.isEvaluating;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Relevance Checker
        </h1>
        <p className="text-lg text-gray-600">
          Upload job descriptions and resumes to get AI-powered relevance analysis
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card hoverable className="text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Upload Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Description Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Job Description
              </h2>
            </div>

            {state.currentJob ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">
                    {state.currentJob.title}
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    {state.currentJob.company} • {state.currentJob.location}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-green-800">Must-have skills:</span>
                      <p className="text-sm text-green-700">
                        {state.currentJob.must_have_skills.join(', ')}
                      </p>
                    </div>
                    {state.currentJob.nice_to_have && state.currentJob.nice_to_have.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-green-800">Nice-to-have skills:</span>
                        <p className="text-sm text-green-700">
                          {state.currentJob.nice_to_have.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_CURRENT_JOB', payload: null as any })}
                >
                  Upload Different Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <FileUploader
                  acceptedFileTypes={APP_CONFIG.ACCEPTED_JD_TYPES}
                  onFilesSelected={handleJobUpload}
                  disabled={isUploadingJob}
                >
                  <div>
                    <Upload className={`w-12 h-12 mx-auto mb-4 text-blue-500`} />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload Job Description
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF or text files supported
                    </p>
                  </div>
                </FileUploader>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or paste text</span>
                  </div>
                </div>

                <div>
                  <textarea
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    placeholder="Paste job description text here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                  />
                  <Button
                    onClick={handleJobTextSubmit}
                    disabled={!jobText.trim() || isUploadingJob}
                    loading={isUploadingJob}
                    className="mt-3"
                  >
                    Process Job Description
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Resume Upload */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Resumes ({state.uploadedResumes.length})
              </h2>
            </div>

            <FileUploader
              acceptedFileTypes={APP_CONFIG.ACCEPTED_RESUME_TYPES}
              multiple
              onFilesSelected={handleResumeUpload}
              disabled={isUploadingResumes}
            >
              <div>
                <Upload className={`w-12 h-12 mx-auto mb-4 text-green-500`} />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Upload Resumes
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  PDF, DOC, or DOCX files • Multiple files supported
                </p>
              </div>
            </FileUploader>

            {state.uploadedResumes.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Uploaded Resumes:</h3>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {state.uploadedResumes.map((resume) => (
                    <div key={resume.resume_id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 flex-1 truncate">
                        {resume.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Evaluate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Button
          onClick={handleEvaluate}
          disabled={!canEvaluate}
          loading={state.isEvaluating}
          size="lg"
          className="px-8"
        >
          <Play className="w-5 h-5 mr-2" />
          {state.isEvaluating ? 'Analyzing Resumes...' : 'Start Evaluation'}
        </Button>
        
        {!canEvaluate && !state.isEvaluating && (
          <p className="text-sm text-gray-500 mt-2">
            Upload a job description and at least one resume to start evaluation
          </p>
        )}
      </motion.div>
    </div>
  );
}