import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Eye,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { useAppContext } from '../context/AppContext';
import { FilterOptions, EvaluationResult, VerdictType } from '../types';
import { VERDICT_COLORS } from '../utils/constants';
import { exportToCSV } from '../utils/helpers';

interface SortConfig {
  key: keyof EvaluationResult;
  direction: 'asc' | 'desc';
}

export function ResultsTable() {
  const { state } = useAppContext();
  const [filters, setFilters] = useState<FilterOptions>({
    verdict: 'All',
    search: '',
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'score', 
    direction: 'desc' 
  });
  const [selectedResult, setSelectedResult] = useState<EvaluationResult | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...state.evaluationResults];

    // Apply filters
    if (filters.verdict && filters.verdict !== 'All') {
      filtered = filtered.filter(result => result.verdict === filters.verdict);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(result =>
        result.name.toLowerCase().includes(searchLower) ||
        result.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return filtered;
  }, [state.evaluationResults, filters, sortConfig]);

  const handleSort = (key: keyof EvaluationResult) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleRowExpanded = (resumeId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resumeId)) {
        newSet.delete(resumeId);
      } else {
        newSet.add(resumeId);
      }
      return newSet;
    });
  };

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedResults, 'resume-evaluation-results');
  };

  const VerdictBadge = ({ verdict }: { verdict: VerdictType }) => {
    const colors = VERDICT_COLORS[verdict];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
        <span className={`w-2 h-2 ${colors.dot} rounded-full mr-1`} />
        {verdict}
      </span>
    );
  };

  const SortButton = ({ column, children }: { column: keyof EvaluationResult; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortConfig.key === column ? (
        sortConfig.direction === 'asc' ? 
          <SortAsc className="w-4 h-4" /> : 
          <SortDesc className="w-4 h-4" />
      ) : (
        <div className="w-4 h-4" />
      )}
    </button>
  );

  if (state.evaluationResults.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-gray-500">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
          <p>Upload job descriptions and resumes, then run evaluation to see results here.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Verdict Filter */}
            <select
              value={filters.verdict}
              onChange={(e) => setFilters(prev => ({ ...prev, verdict: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Verdicts</option>
              <option value="High">High Match</option>
              <option value="Medium">Medium Match</option>
              <option value="Low">Low Match</option>
            </select>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedResults.length} of {state.evaluationResults.length} candidates
        </div>
      </Card>

      {/* Results Table */}
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left">
                  <SortButton column="name">Candidate</SortButton>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton column="score">Score</SortButton>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton column="verdict">Verdict</SortButton>
                </th>
                <th className="px-4 py-3 text-left">Skills Match</th>
                <th className="px-4 py-3 text-left">Actions</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredAndSortedResults.map((result) => {
                  const isExpanded = expandedRows.has(result.resume_id);
                  return (
                    <React.Fragment key={result.resume_id}>
                      {/* Main Row */}
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{result.name}</div>
                            <div className="text-sm text-gray-500">{result.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">{result.score}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  result.score >= 75 ? 'bg-green-500' :
                                  result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${result.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <VerdictBadge verdict={result.verdict} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">
                              {result.matched_skills.length} matched
                            </span>
                            {result.missing_skills.length > 0 && (
                              <>
                                <span className="mx-1">•</span>
                                <span className="text-red-600">
                                  {result.missing_skills.length} missing
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedResult(result)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`mailto:${result.email}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpanded(result.resume_id)}
                            className="p-1"
                          >
                            {isExpanded ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                            }
                          </Button>
                        </td>
                      </motion.tr>

                      {/* Expanded Row */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50"
                          >
                            <td colSpan={6} className="px-4 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Matched Skills</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {result.matched_skills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Missing Skills</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {result.missing_skills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">AI Feedback</h4>
                                <p className="text-sm text-gray-700">{result.feedback}</p>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        title="Candidate Details"
        size="xl"
      >
        {selectedResult && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedResult.name}
                </h3>
                <p className="text-gray-600">{selectedResult.email}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {selectedResult.score}
                </div>
                <VerdictBadge verdict={selectedResult.verdict} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Matched Skills</h4>
                <div className="space-y-2">
                  {selectedResult.matched_skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Missing Skills</h4>
                <div className="space-y-2">
                  {selectedResult.missing_skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Detailed Analysis</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedResult.feedback}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => window.open(`mailto:${selectedResult.email}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Candidate
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}