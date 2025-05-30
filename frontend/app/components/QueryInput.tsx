'use client';

import { useState, useRef, useEffect } from 'react';

interface Suggestion {
  text: string;
  description: string;
}

interface QueryInputProps {
  onSubmit: (query: string) => void;
}

export default function QueryInput({ onSubmit }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (prefix: string) => {
    if (prefix.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/suggestions?prefix=${encodeURIComponent(prefix)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSubmit(suggestion.text);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const quickActions = [
    { icon: '👥', text: 'All patients', query: 'Show me all patients' },
    { icon: '🩺', text: 'Diabetes', query: 'Find diabetic patients' },
    { icon: '💊', text: 'Hypertension', query: 'Show patients with hypertension' },
    { icon: '🫁', text: 'Respiratory', query: 'Find patients with asthma' }
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Search Input with Modern Design */}
          <div className={`relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 transition-all duration-300 ${
            isFocused 
              ? 'border-blue-500 dark:border-blue-400 shadow-blue-500/20 shadow-xl' 
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
          }`}>
            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <svg className={`w-6 h-6 transition-colors duration-300 ${
                isFocused 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-slate-400 dark:text-slate-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Ask about patient data in natural language..."
              className="w-full pl-14 pr-32 py-6 bg-transparent rounded-2xl text-lg text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none font-medium"
              autoComplete="off"
              aria-label="Healthcare query input"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
            />

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-300 dark:border-blue-600 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                query.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105 dark:from-blue-600 dark:to-indigo-700'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>Search</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </span>
            </button>
          </div>

          {/* Auto-complete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-600/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              role="listbox"
            >
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-4 py-3 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      index === selectedIndex 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500 dark:border-blue-400' 
                        : ''
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 dark:text-white truncate">
                          {suggestion.text}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {suggestion.description}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Quick Action Buttons */}
      <div className="mt-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="h-px bg-slate-200 dark:bg-slate-600 flex-1"></div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 px-3">Quick Actions</span>
          <div className="h-px bg-slate-200 dark:bg-slate-600 flex-1"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(action.query);
                onSubmit(action.query);
                setQuery('');
              }}
              className="group flex items-center space-x-2 px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200/50 dark:border-slate-600/50 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {action.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Pro Tips</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <li>• Try: "Show me diabetic patients over 50"</li>
              <li>• Use gender filters: "Find female patients with..."</li>
              <li>• Specify age ranges: "between 40 and 60"</li>
              <li>• Combine conditions: "cancer patients under 45"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 