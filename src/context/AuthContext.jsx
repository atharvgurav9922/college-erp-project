import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

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
    return null;
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
      const user = await api.login(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      console.warn('API login notice, testing fallback:', error.message);
      const fallbackUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (fallbackUser) {
        setCurrentUser(fallbackUser);
        return { success: true, user: fallbackUser };
      }
      return { success: false, message: error.message || 'Invalid email or password' };
    }
  };

  const quickLoginAs = async (role) => {
    try {
      const users = await api.getUsers();
      if (Array.isArray(users) && users.length > 0) {
        const user = users.find((u) => u.role === role);
        if (user) {
          setCurrentUser(user);
          return user;
        }
      }
    } catch (error) {
      console.warn('API getUsers notice, using local role fallback:', error.message);
    }
    const fallbackUser = MOCK_USERS.find((u) => u.role === role) || null;
    if (fallbackUser) {
      setCurrentUser(fallbackUser);
    }
    return fallbackUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = async (updates) => {
    if (!currentUser) return;
    
    // Save to backend MongoDB
    try {
      const targetId = currentUser.id || currentUser._id;
      const updatedUser = await api.updateUser(targetId, updates);

      // If student, also keep student document in sync
      if (currentUser.role === 'student') {
        try {
          await api.updateStudent(targetId, updates);
        } catch (e) {
          console.warn('Student profile sync notice:', e.message);
        }
      }

      const merged = { ...currentUser, ...(updatedUser || updates) };
      setCurrentUser(merged);
      return merged;
    } catch (error) {
      console.error('Failed to sync profile update to server:', error);
      throw error;
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
