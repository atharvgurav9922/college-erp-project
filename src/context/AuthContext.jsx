import React, { createContext, useContext, useState, useEffect } from 'react';
// import { MOCK_USERS } from '../data/mockData'; // Removed mock data usage

const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('erp_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    return null; // Don't default to admin anymore without backend validation
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('erp_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('erp_auth_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        return { success: true, user };
      }
      
      const errorData = await response.json().catch(() => ({}));
      return { success: false, message: errorData.message || 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server connection failed. Is the backend running?' };
    }
  };

  const quickLoginAs = async (role) => {
    // Quick login needs a specific email/password from the db for that role.
    // For demonstration, we'll try to find a user of that role in the backend
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (response.ok) {
        const users = await response.json();
        const user = users.find(u => u.role === role);
        if (user) {
          setCurrentUser(user);
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('Quick login error:', error);
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = async (updates) => {
    if (!currentUser) return;
    
    // Optimistic update locally
    const newUserState = { ...currentUser, ...updates };
    setCurrentUser(newUserState);
    
    // Sync to backend
    try {
      // Find which collection this user belongs to based on role
      const endpoint = currentUser.role === 'student' ? 'students' : 
                       currentUser.role === 'faculty' ? 'facultys' : 'users';
      
      await fetch(`${API_BASE_URL}/${endpoint}/${currentUser.id || currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Failed to sync profile update to server:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        quickLoginAs,
        logout,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
