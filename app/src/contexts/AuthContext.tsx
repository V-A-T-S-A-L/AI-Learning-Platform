// Enhanced AuthContext with better debugging
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔥 AuthProvider: Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        console.log('🔥 Auth state changed:', user ? 'User logged in' : 'User logged out');
        console.log('🔥 User data:', user);
        
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('🔥 Auth state error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Check if Firebase is properly initialized
    console.log('🔥 Firebase auth instance:', auth);
    console.log('🔥 Firebase app:', auth.app);

    return () => {
      console.log('🔥 AuthProvider: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Debug component
  useEffect(() => {
    console.log('🔥 AuthProvider state update:', { 
      user: user ? 'User exists' : 'No user', 
      loading, 
      error,
      userEmail: user?.email,
      userId: user?.uid
    });
  }, [user, loading, error]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};