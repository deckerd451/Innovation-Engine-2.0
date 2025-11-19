
import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';
import { Page } from '../types';
import { UserCard } from '../components/UserCard';
import { SearchIcon } from '../components/icons';

interface HomePageProps {
  setPage: (page: Page, userId?: string) => void;
  supabaseService: any;
}

export const HomePage: React.FC<HomePageProps> = ({ setPage, supabaseService }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const users = await supabaseService.searchUsersBySkill(query);
      setResults(users);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, [supabaseService]);

  useEffect(() => {
    performSearch(''); // Initial load with all users
  }, [performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-brand-dark">Find Your Co-Founder</h2>
        <p className="mt-2 text-gray-600">Search for innovators, creators, and entrepreneurs by their skills.</p>
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., React, UI/UX Design, Machine Learning"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
            />
          </div>
          <button type="submit" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary">
            Search
          </button>
        </form>
      </div>

      <div>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading profiles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-100 p-4 rounded-md">
            <p>{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map(user => (
              <UserCard key={user.id} user={user} setPage={setPage} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-brand-dark">No users found</h3>
            <p className="mt-2 text-gray-500">Try a different skill or broaden your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
