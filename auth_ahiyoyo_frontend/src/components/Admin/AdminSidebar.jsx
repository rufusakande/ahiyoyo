import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Logo from "@/components/Logo";

const AdminSidebar = ({ user, onLogout, currentPath = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: currentPath === '/dashboard'
    },
    {
      name: 'Demandes',
      href: '/adminrequests',
      icon: FileText,
      current: currentPath === '/adminrequests'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      onLogout();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fermer le menu mobile lors du redimensionnement de l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Bouton hamburger pour mobile - Position fixe */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar Desktop - Position relative dans le layout */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30">
        <div className="flex flex-col h-full bg-white shadow-lg">
          {/* Header du sidebar */}
          <div className="flex items-center justify-center h-16 px-4 bg-white-600 flex-shrink-0">
            {/* Logo */}
                        <Logo />
                        {/* End Logo */}
          </div>

          {/* Informations utilisateur */}
          {user && (
            <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'Administrateur'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${item.current
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                      ${item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bouton de déconnexion */}
          <div className="px-4 py-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              <span className="truncate">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Mobile - Slide-in */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header du sidebar */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Informations utilisateur */}
          {user && (
            <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'Administrateur'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${item.current
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                      ${item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bouton de déconnexion */}
          <div className="px-4 py-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              <span className="truncate">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;