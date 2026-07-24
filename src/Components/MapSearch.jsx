import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function MapSearch({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        // Restricting search to roughly the Delhi bounding box
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=76.83,28.88,77.34,28.40&bounded=1&limit=5`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item) => {
    onLocationSelect(parseFloat(item.lon), parseFloat(item.lat));
    setShowDropdown(false);
    setQuery(''); // Clear after selecting
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-80">
      <div className="relative bg-white/95 backdrop-blur rounded-lg shadow-md border border-slate-200 overflow-hidden flex items-center">
        <div className="pl-3 text-slate-500">
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Search className="w-4 h-4" />}
        </div>
        <input 
          type="text"
          placeholder="Search for a location..."
          className="w-full px-3 py-2.5 outline-none text-sm bg-transparent"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
      </div>
      
      {showDropdown && results.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.place_id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(item);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
            >
              <div className="font-medium text-slate-800 truncate">{item.display_name.split(',')[0]}</div>
              <div className="text-xs text-slate-500 truncate">{item.display_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
