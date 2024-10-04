import React, { useState } from 'react';
import { getCountries } from '../services/api';

interface Country {
  // Define the structure of a country object based on API response
  id: string;
  name: string;
}

interface CountrySearchProps {
  onSelectCountry: (country: Country) => void;
}

const CountrySearch: React.FC<CountrySearchProps> = ({ onSelectCountry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCountries();
      const filteredCountries = data.filter((country: Country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCountries(filteredCountries);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      setError('Failed to fetch countries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a country"
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {countries.map((country) => (
          <li key={country.id} onClick={() => onSelectCountry(country)}>
            {country.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountrySearch;
