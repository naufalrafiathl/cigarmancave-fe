import React, { useState, useEffect, useRef } from 'react';
import { Country, State, City, ICountry } from 'country-state-city';
import { Search, ChevronDown, Loader2, X } from 'lucide-react';

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState<Array<{ name: string; countryName: string }>>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search
  const filteredCountries = Country.getAllCountries().filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Search cities when country is selected
  useEffect(() => {
    if (!selectedCountry || !citySearch) {
      setCities([]);
      return;
    }

    const term = citySearch.toLowerCase();
    const allCities: Array<{ name: string; countryName: string }> = [];

    State.getStatesOfCountry(selectedCountry.isoCode).forEach(state => {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, state.isoCode) || [];
      stateCities.forEach(city => {
        if (city.name.toLowerCase().includes(term)) {
          allCities.push({
            name: city.name,
            countryName: selectedCountry.name
          });
        }
      });
    });

    setCities(allCities.slice(0, 50));
  }, [selectedCountry, citySearch]);

  const handleSelect = (cityName: string, countryName: string) => {
    onChange(`${cityName}, ${countryName}`);
    setIsOpen(false);
    setCitySearch('');
    setCountrySearch('');
    setSelectedCountry(null);
  };

  const handleReset = () => {
    setSelectedCountry(null);
    setCitySearch('');
    setCountrySearch('');
    setCities([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white flex items-center justify-between cursor-pointer hover:bg-neutral-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-white' : 'text-neutral-400'}>
          {value || 'Select location'}
        </span>
        <ChevronDown className="w-4 h-4 text-neutral-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-800 rounded-xl shadow-lg border border-neutral-700 overflow-hidden">
          {selectedCountry ? (
            <>
              <div className="p-2 border-b border-neutral-700 flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
                <span className="text-white text-sm">{selectedCountry.name}</span>
              </div>
              <div className="p-2 border-b border-neutral-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2 bg-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                    placeholder="Search cities..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {cities.length > 0 ? (
                  cities.map((city, index) => (
                    <div
                      key={`${city.name}-${index}`}
                      className="px-4 py-2 hover:bg-neutral-700 cursor-pointer text-white text-sm"
                      onClick={() => handleSelect(city.name, city.countryName)}
                    >
                      {city.name}
                    </div>
                  ))
                ) : citySearch ? (
                  <div className="px-4 py-2 text-neutral-400 text-sm">
                    No cities found
                  </div>
                ) : (
                  <div className="px-4 py-2 text-neutral-400 text-sm">
                    Type to search cities
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="p-2 border-b border-neutral-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2 bg-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                    placeholder="Search country..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map(country => (
                    <div
                      key={country.isoCode}
                      className="px-4 py-2 hover:bg-neutral-700 cursor-pointer text-white text-sm"
                      onClick={() => setSelectedCountry(country)}
                    >
                      {country.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-neutral-400 text-sm">
                    No countries found
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationSelector;