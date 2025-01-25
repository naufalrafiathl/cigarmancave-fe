import React, { useState, useEffect } from 'react';
import { Country, City, ICountry, ICity } from 'country-state-city';

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

  useEffect(() => {
    // Get all countries on mount
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    // Get cities when country is selected
    if (selectedCountry) {
      setCities(City.getCitiesOfCountry(selectedCountry.isoCode) || []);
      // Update location with just country when country changes
      onChange(selectedCountry.name);
    }
  }, [selectedCountry, onChange]);

  // Find and set initial country from value if it exists
  useEffect(() => {
    if (value && !selectedCountry) {
      const countryName = value.split(',').pop()?.trim();
      const country = countries.find(c => c.name === countryName);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [value, countries, selectedCountry]);

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find(c => c.isoCode === e.target.value);
    setSelectedCountry(country || null);
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    if (cityName && selectedCountry) {
      onChange(`${cityName}, ${selectedCountry.name}`);
    } else if (selectedCountry) {
      // If no city is selected, just use the country name
      onChange(selectedCountry.name);
    }
  };

  return (
    <div className="space-y-2">
      {/* Country Selection */}
      <select
        className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white"
        onChange={handleCountrySelect}
        value={selectedCountry?.isoCode || ''}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>

      {/* City Selection - Optional */}
      {selectedCountry && cities.length > 0 && (
        <select
          className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white"
          onChange={handleCitySelect}
          value={value.includes(',') ? value.split(',')[0].trim() : ''}
        >
          <option value="">Select City (Optional)</option>
          {cities.map((city) => (
            <option key={`${city.name}-${city.stateCode}`} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}