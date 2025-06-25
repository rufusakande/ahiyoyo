// hooks/useAdminAuth.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAdminAuth = (redirectTo = '/adminlogin') => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsLoading(false);
        router.push(redirectTo);
        return;
      }

      // Vérifier la validité du token avec le backend
      const response = await fetch(`${API_BASE_URL}/auth/verify-admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Vérifier si l'utilisateur est vraiment admin
        if (userData.role === 'admin') {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Pas admin, supprimer le token et rediriger
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          router.push(redirectTo);
        }
      } else {
        // Token invalide, supprimer et rediriger
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      router.push(redirectTo);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setUser(null);
    router.push(redirectTo);
  };

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    getAuthToken,
    getAuthHeaders,
    checkAuthStatus
  };
};

export default useAdminAuth;