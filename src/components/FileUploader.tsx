import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';
import { APP_CONFIG } from '../utils/constants';
import { FileUploadProgress } from '../types';

interface FileUploaderProps {
  acceptedFileTypes: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function FileUploader({
  acceptedFileTypes,
  multiple = false,
  maxSize = APP_CONFIG.MAX_FILE_SIZE,
  onFilesSelected,
  disabled = false,
  children,
}: FileUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(({ errors }) => 
        errors.map((e: any) => e.message).join(', ')
      );
      setErrors(newErrors);
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const newProgress = acceptedFiles.map(file => ({
        file,
        progress: 0,
        status: 'pending' as const,
      }));
      
      setUploadProgress(newProgress);
      onFilesSelected(acceptedFiles);

      // Simulate upload progress
      newProgress.forEach((item, index) => {
        const timer = setInterval(() => {
          setUploadProgress(prev => {
            const updated = [...prev];
            if (updated[index]) {
              updated[index].progress = Math.min(updated[index].progress + 10, 100);
              if (updated[index].progress === 100) {
                updated[index].status = 'success';
                clearInterval(timer);
              }
            }
            return updated;
          });
        }, 100);
      });
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple,
    maxSize,
    disabled,
  });

  const removeFile = (index: number) => {
    setUploadProgress(prev => prev.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject 
            ? 'border-blue-400 bg-blue-50' 
            : isDragReject 
            ? 'border-red-400 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={`
            w-12 h-12 mx-auto mb-4 
            ${isDragActive ? 'text-blue-500' : 'text-gray-400'}
          `} />
        </motion.div>

        {children ? (
          children
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400">
              Max file size: {formatFileSize(maxSize)}
            </p>
          </div>
        )}
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {uploadProgress.map((item, index) => (
              <motion.div
                key={`${item.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(item.file.size)}
                  </p>
                  {item.status === 'success' ? (
                    <p className="text-xs text-green-600">Upload complete</p>
                  ) : (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <motion.div
                        className="bg-blue-600 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {errors.map((error, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 flex-1">{error}</p>
                <button
                  onClick={clearErrors}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}