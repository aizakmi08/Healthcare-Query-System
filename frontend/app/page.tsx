'use client';

import { useState } from 'react';
import QueryInput from './components/QueryInput';
import ResultsDisplay from './components/ResultsDisplay';

interface QueryResponse {
  query: string;
  explanation: string;
  extracted_parameters: any;
  fhir_response: any;
  patients: any[];
  statistics: any;
  total_results: number;
}

export default function Home() {
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Header with Glass Morphism */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Modern Logo/Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    HealthQuery AI
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Intelligent FHIR Healthcare Data Interface
                  </p>
                </div>
              </div>
              
              {/* Modern Status Indicator */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Modern Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section with Modern Query Input */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/20 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                  Ask Anything About Patient Data
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Use natural language to query healthcare records. Our AI-powered system understands 
                  complex medical queries and returns FHIR-compliant results with intelligent visualizations.
                </p>
              </div>
              <QueryInput onSubmit={handleQuerySubmit} />
            </div>
          </div>

          {/* Modern Loading State */}
          {isLoading && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/20 p-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
                  <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin border-t-indigo-600 dark:border-t-indigo-400 absolute top-2 left-2 animate-reverse-spin"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Processing Your Query
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Analyzing natural language and querying FHIR resources...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modern Error State */}
          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-xl border border-red-200/50 dark:border-red-700/50 rounded-3xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
                    Query Processing Error
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                    {error}
                  </p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results with Modern Design */}
          {results && (
            <div className="animate-fade-in">
              <ResultsDisplay data={results} />
            </div>
          )}

          {/* Modern Example Queries Section */}
          {!results && !isLoading && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/20 p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                  Try These Example Queries
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Click any example below to see the AI-powered query system in action
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    query: "Show me all diabetic patients over 50",
                    description: "Find patients with diabetes aged 50 or older",
                    icon: "📊",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    query: "Find female patients with hypertension",
                    description: "Search for women diagnosed with high blood pressure",
                    icon: "🩺",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    query: "List male cancer patients between 40 and 60",
                    description: "Display male cancer patients in middle age",
                    icon: "🔬",
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    query: "Show patients with asthma under 30",
                    description: "Find young patients with respiratory conditions",
                    icon: "💨",
                    color: "from-green-500 to-teal-500"
                  }
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuerySubmit(example.query)}
                    className="group relative overflow-hidden bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-white/20 dark:border-slate-600/20"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${example.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="relative text-left">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{example.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {example.query}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {example.description}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="mt-20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  HealthQuery AI - Powered by FHIR Standards
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Built for healthcare professionals and researchers
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              © 2025 Healthcare Query System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 