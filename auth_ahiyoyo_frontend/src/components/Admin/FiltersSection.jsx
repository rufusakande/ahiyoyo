import React from 'react';
import { Search } from 'lucide-react';

const FiltersSection = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              className="pl-10 pr-4 py-2 border border-primary text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-primary rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="verified">Vérifiées</option>
            <option value="unverified">Non soumises</option>
          </select>
          
          <select
            className="px-4 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent"
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
          >
            <option value="all">Tous les pays</option>
            <option value="Bénin">Bénin</option>
            <option value="Togo">Togo</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;