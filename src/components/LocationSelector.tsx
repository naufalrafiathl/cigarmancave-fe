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
  const [selectedCity, setSelectedCity] = useState<string>('');

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setCities(City.getCitiesOfCountry(selectedCountry.isoCode) || []);
    }
  }, [selectedCountry]);

  // Initialize from provided value
  useEffect(() => {
    if (value) {
      const [cityPart, countryPart] = value.split(',').map(part => part.trim());
      const country = countries.find(c => c.name === countryPart);
      if (country) {
        setSelectedCountry(country);
        setSelectedCity(cityPart);
      }
    }
  }, [value, countries]);

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find(c => c.isoCode === e.target.value);
    setSelectedCountry(country || null);
    setSelectedCity(''); // Reset city when country changes
    if (country) {
      onChange(country.name);
    }
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city && selectedCountry) {
      onChange(`${city}, ${selectedCountry.name}`);
    } else if (selectedCountry) {
      onChange(selectedCountry.name);
    }
  };

  return (
    <div className="space-y-2">
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

      {selectedCountry && cities.length > 0 && (
        <select
          className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white"
          onChange={handleCitySelect}
          value={selectedCity}
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