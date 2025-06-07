
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthButton from './AuthButton';

const UserMenu = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="w-20 h-8 bg-gray-700 animate-pulse rounded"></div>;
  }

  return <AuthButton />;
};

export default UserMenu;
