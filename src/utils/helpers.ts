import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VerdictType, EvaluationResult } from '../types';
import { SCORE_THRESHOLDS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getVerdictFromScore(score: number): VerdictType {
  if (score >= SCORE_THRESHOLDS.HIGH) return 'High';
  if (score >= SCORE_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function exportToCSV(data: EvaluationResult[], filename: string = 'resume-evaluation-results') {
  const headers = [
    'Name',
    'Email',
    'Score',
    'Verdict',
    'Matched Skills',
    'Missing Skills',
    'Feedback Summary'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.name}"`,
      `"${row.email || 'N/A'}"`,
      row.score,
      row.verdict,
      `"${row.matched_skills.join('; ')}"`,
      `"${row.missing_skills.join('; ')}"`,
      `"${truncateText(row.feedback, 100)}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}