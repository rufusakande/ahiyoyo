import React from 'react'
import { usePreline } from '../hooks/usePreline'

const DashboardPage: React.FC = () => {
  usePreline()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenue sur le Dashboard</h1>
        <p className="mt-4 text-gray-600 dark:text-neutral-400">
          Gérez vos transactions et votre compte depuis cette interface.
        </p>
      </div>
    </div>
  )
}

export default DashboardPage