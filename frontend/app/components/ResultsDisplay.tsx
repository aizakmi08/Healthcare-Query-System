'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  birthDate: string;
}

interface Statistics {
  total_patients: number;
  total_conditions: number;
  age_distribution: Record<string, number>;
  gender_distribution: Record<string, number>;
  condition_distribution: Record<string, number>;
  average_age: number;
}

interface ResultsDisplayProps {
  data: {
    patients: Patient[];
    statistics: Statistics;
    explanation: string;
    total_results: number;
    query: string;
  };
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'charts'>('overview');
  const [ageFilter, setAgeFilter] = useState<{ min?: number; max?: number }>({});
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'gender'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = data.patients.filter(patient => {
      const ageMatch = (!ageFilter.min || patient.age >= ageFilter.min) &&
                       (!ageFilter.max || patient.age <= ageFilter.max);
      const genderMatch = !genderFilter || patient.gender === genderFilter;
      const conditionMatch = !conditionFilter || 
                            patient.conditions.some(cond => 
                              cond.toLowerCase().includes(conditionFilter.toLowerCase())
                            );
      
      return ageMatch && genderMatch && conditionMatch;
    });

    // Sort patients
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'age':
          comparison = a.age - b.age;
          break;
        case 'gender':
          comparison = a.gender.localeCompare(b.gender);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [data.patients, ageFilter, genderFilter, conditionFilter, sortBy, sortDirection]);

  // Enhanced chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500 as const
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Modern color palettes
  const modernColors = {
    primary: ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF'],
    gradient: ['#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'],
    healthcare: ['#10B981', '#059669', '#047857', '#065F46', '#064E3B']
  };

  const ageChartData = {
    labels: Object.keys(data.statistics.age_distribution),
    datasets: [
      {
        label: 'Patients',
        data: Object.values(data.statistics.age_distribution),
        backgroundColor: modernColors.gradient.map(color => color + '20'),
        borderColor: modernColors.gradient,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const genderChartData = {
    labels: Object.keys(data.statistics.gender_distribution),
    datasets: [
      {
        data: Object.values(data.statistics.gender_distribution),
        backgroundColor: ['#3B82F6', '#EC4899'],
        borderColor: ['#1D4ED8', '#BE185D'],
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  };

  const conditionChartData = {
    labels: Object.keys(data.statistics.condition_distribution),
    datasets: [
      {
        data: Object.values(data.statistics.condition_distribution),
        backgroundColor: modernColors.healthcare.map(color => color + '80'),
        borderColor: modernColors.healthcare,
        borderWidth: 2,
      },
    ],
  };

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
          : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
      {/* Modern Header */}
      <div className="p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Query Results</h2>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-white">Query:</span> 
                <span className="ml-2 font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">"{data.query}"</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-white">Analysis:</span> 
                <span className="ml-2">{data.explanation}</span>
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Patients', value: data.total_results, icon: '👥', color: 'blue' },
                { label: 'Average Age', value: Math.round(data.statistics.average_age), icon: '📊', color: 'green' },
                { label: 'Conditions Found', value: data.statistics.total_conditions, icon: '🩺', color: 'purple' },
                { label: 'Filtered Results', value: filteredAndSortedPatients.length, icon: '🔍', color: 'orange' }
              ].map((metric, index) => (
                <div key={index} className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 border border-white/40 dark:border-slate-600/40">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{metric.icon}</span>
                    <div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white">{metric.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{metric.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/40 dark:bg-slate-700/40 rounded-2xl p-6 border border-white/60 dark:border-slate-600/60">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Advanced Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-white/60 dark:bg-slate-600/60 border border-slate-200 dark:border-slate-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={ageFilter.min || ''}
                  onChange={(e) => setAgeFilter(prev => ({ 
                    ...prev, 
                    min: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-white/60 dark:bg-slate-600/60 border border-slate-200 dark:border-slate-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={ageFilter.max || ''}
                  onChange={(e) => setAgeFilter(prev => ({ 
                    ...prev, 
                    max: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
              <select
                className="w-full px-3 py-2 bg-white/60 dark:bg-slate-600/60 border border-slate-200 dark:border-slate-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Condition</label>
              <input
                type="text"
                placeholder="Filter by condition"
                className="w-full px-3 py-2 bg-white/60 dark:bg-slate-600/60 border border-slate-200 dark:border-slate-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
              <div className="flex space-x-1">
                <select
                  className="flex-1 px-3 py-2 bg-white/60 dark:bg-slate-600/60 border border-slate-200 dark:border-slate-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="gender">Gender</option>
                </select>
                <button
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-white/60 dark:bg-slate-600/60 border border-slate-200 dark:border-slate-500 rounded-lg hover:bg-white/80 dark:hover:bg-slate-600/80 transition-colors"
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setAgeFilter({});
              setGenderFilter('');
              setConditionFilter('');
              setSortBy('name');
              setSortDirection('asc');
            }}
            className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex space-x-2">
          <TabButton id="overview" label="Overview" icon="📋" />
          <TabButton id="table" label="Patient Data" icon="📊" />
          <TabButton id="charts" label="Analytics" icon="📈" />
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl p-6 border border-white/40 dark:border-slate-600/40">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Age Distribution</h3>
                <div className="h-64">
                  <Bar data={ageChartData} options={chartOptions} />
                </div>
              </div>
              
              <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl p-6 border border-white/40 dark:border-slate-600/40">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Gender Distribution</h3>
                <div className="h-64">
                  <Doughnut data={genderChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl p-6 border border-white/40 dark:border-slate-600/40">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Patients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedPatients.slice(0, 6).map((patient) => (
                  <div key={patient.id} className="bg-white/80 dark:bg-slate-600/80 rounded-xl p-4 border border-white/60 dark:border-slate-500/60">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        patient.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">{patient.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Age {patient.age} • {patient.gender}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {patient.conditions.map((condition, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'table' && (
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl border border-white/40 dark:border-slate-600/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-600">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {[
                      { key: 'id', label: 'Patient ID' },
                      { key: 'name', label: 'Name' },
                      { key: 'age', label: 'Age' },
                      { key: 'gender', label: 'Gender' },
                      { key: 'conditions', label: 'Conditions' },
                      { key: 'birthDate', label: 'Birth Date' }
                    ].map((column) => (
                      <th key={column.key} className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-700 divide-y divide-slate-200 dark:divide-slate-600">
                  {filteredAndSortedPatients.map((patient, index) => (
                    <tr key={patient.id} className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-600/50 ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-700' : 'bg-slate-50/50 dark:bg-slate-600/20'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600 dark:text-slate-300">
                        {patient.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 ${
                            patient.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                          }`}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-slate-800 dark:text-white">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-white">
                        {patient.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          patient.gender === 'male' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                            : 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
                        }`}>
                          {patient.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {patient.conditions.map((condition, idx) => (
                            <span key={idx} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              {condition}
                            </span>
                          ))}
                          {patient.conditions.length === 0 && (
                            <span className="text-slate-400 dark:text-slate-500 text-xs italic">No conditions</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">
                        {patient.birthDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredAndSortedPatients.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No patients match your current filters</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Try adjusting your filter criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl p-6 border border-white/40 dark:border-slate-600/40">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Age Distribution</h3>
                <div className="h-80">
                  <Bar data={ageChartData} options={chartOptions} />
                </div>
              </div>
              
              <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl p-6 border border-white/40 dark:border-slate-600/40">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Gender Distribution</h3>
                <div className="h-80">
                  <Pie data={genderChartData} options={chartOptions} />
                </div>
              </div>
            </div>
            
            {Object.keys(data.statistics.condition_distribution).length > 0 && (
              <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl p-6 border border-white/40 dark:border-slate-600/40">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Condition Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-80">
                    <Doughnut data={conditionChartData} options={chartOptions} />
                  </div>
                  <div className="space-y-4">
                    {Object.entries(data.statistics.condition_distribution).map(([condition, count], index) => (
                      <div key={condition} className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-600/80 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: modernColors.healthcare[index % modernColors.healthcare.length] }}
                          ></div>
                          <span className="font-medium text-slate-800 dark:text-white">{condition}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(count / Math.max(...Object.values(data.statistics.condition_distribution))) * 100}%`,
                                backgroundColor: modernColors.healthcare[index % modernColors.healthcare.length]
                              }}
                            ></div>
                          </div>
                          <span className="text-lg font-bold text-slate-800 dark:text-white w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 