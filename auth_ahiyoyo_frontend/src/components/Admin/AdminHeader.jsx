import React from 'react';
import { Download } from 'lucide-react';

const AdminHeader = ({ onExport }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onExport}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;