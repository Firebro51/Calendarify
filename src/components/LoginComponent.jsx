import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, User } from 'lucide-react';

function LoginComponent({ onAuthChange }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${authMode === 'login' ? 'Logging in' : 'Signing up'} with:`, { username, password });
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setUserDisplayName(username); // Set the display name to username
    onAuthChange(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserDisplayName('');
    onAuthChange(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium dark:text-gray-300">Welcome, {userDisplayName}!</span>
        <button
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center"
          onClick={handleSignOut}
        >
          <User className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    );
  }

  if (!showAuthModal) {
    return (
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center transition duration-300"
        onClick={() => setShowAuthModal(true)}
      >
        <LogIn className="mr-2" /> Login / Signup
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {authMode === 'login' ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition duration-300"
            >
              {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center transition duration-300"
            >
              {authMode === 'login' ? <><LogIn className="mr-2" /> Login</> : <><UserPlus className="mr-2" /> Sign Up</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginComponent;