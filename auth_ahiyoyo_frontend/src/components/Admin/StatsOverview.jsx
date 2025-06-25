import React from 'react';
import { Users, Clock, CheckCircle, XCircle, TrendingUp, Globe } from 'lucide-react';
import StatCard from './StatCard';

const StatsOverview = ({ stats }) => {
  return (
    <>
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="Total Clients" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="En Attente" 
          value={stats.pendingRequests} 
          icon={Clock} 
          color="yellow" 
        />
        <StatCard 
          title="Vérifiés ce mois" 
          value={stats.verifiedThisMonth} 
          icon={CheckCircle} 
          color="green" 
        />
        <StatCard 
          title="Nouvelles inscriptions" 
          value={stats.newRegistrations} 
          icon={TrendingUp} 
          color="purple" 
        />
        <StatCard 
          title="Rejets" 
          value={stats.rejectedRequests} 
          icon={XCircle} 
          color="red" 
        />
      </div>

      {/* Répartition par pays */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Répartition par pays
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.usersByCountry.map((country, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{country.country}</span>
              <span className="text-lg font-bold text-blue-600">{country.count}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StatsOverview;