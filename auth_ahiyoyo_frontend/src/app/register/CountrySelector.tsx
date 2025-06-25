import React, { useState } from 'react';

interface Country {
  name: string;
  code: string;
  dial: string;
  flagUrl: string;
}

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  phone,
  onPhoneChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const countries: Country[] = [
    {
      name: 'Benin',
      code: 'BJ',
      dial: '+229',
      flagUrl: 'https://flagcdn.com/w40/bj.png',
    },
    {
      name: "Côte d'Ivoire",
      code: 'CI',
      dial: '+225',
      flagUrl: 'https://flagcdn.com/w40/ci.png',
    },
    {
      name: 'Togo',
      code: 'TG',
      dial: '+228',
      flagUrl: 'https://flagcdn.com/w40/tg.png',
    },
    {
      name: 'Senegal',
      code: 'SN',
      dial: '+221',
      flagUrl: 'https://flagcdn.com/w40/sn.png',
    },
  ];

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden dark:border-neutral-700 focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center h-full px-3 py-4 focus:outline-none bg-gray-50 dark:bg-neutral-800 border-r border-gray-300 dark:border-neutral-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <img
                src={selectedCountry.flagUrl}
                alt={selectedCountry.code}
                className="w-5 h-4 object-cover rounded-sm"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {selectedCountry.dial}
              </span>
            </div>
            <svg 
              className="ml-2 w-4 h-4 text-gray-600 dark:text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
              <div className="py-1 max-h-60 overflow-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-neutral-700"
                    onClick={() => {
                      onCountryChange(country);
                      setIsOpen(false);
                    }}
                  >
                    <img
                      src={country.flagUrl}
                      alt={country.code}
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {country.name} <span className="text-gray-500 dark:text-gray-400">{country.dial}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <input
          type="tel"
          id="phone"
          className="flex-1 p-4 text-sm outline-none bg-transparent border-0 focus:ring-0 focus:border-0 dark:text-white"
          placeholder="Entrez votre numéro"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CountrySelector;