import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function SearchBar({ onSearch, loading, currentQuery }) {
  const [query, setQuery] = useState(currentQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by sender, receiver, cause or ID..."
          className="input-field pl-10 pr-10"
          disabled={loading}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={loading}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </button>
        
        {currentQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary flex items-center"
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Search
          </button>
        )}
      </div>
    </form>
  );
}