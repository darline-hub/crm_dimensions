'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Utilisateur } from '../types/auth'; // Ajustez le chemin vers vos types si besoin

interface AuthContextType {
  user: Utilisateur | null;
  token: string | null;
  login: (token: string, user: Utilisateur) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permissionNom: string) => boolean;
  hasRole: (roleLibelle: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('crm_token');
    const storedUser = localStorage.getItem('crm_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur lors de la lecture de la session locale", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: Utilisateur) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('crm_token', newToken);
    localStorage.setItem('crm_user', JSON.stringify(newUser));
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Identifiants incorrects ou compte inactif.' };
      }

      login(data.token, data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors de la connexion au serveur.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
  };

  const hasPermission = (permissionNom: string): boolean => {
    if (!user) return false;
    if (user.role?.libelle === 'ADMINISTRATEUR') return true;
    return user.permissions?.includes(permissionNom) ?? false;
  };

  const hasRole = (roleLibelle: string): boolean => {
    return user?.role?.libelle === roleLibelle;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signIn, logout, hasPermission, hasRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};