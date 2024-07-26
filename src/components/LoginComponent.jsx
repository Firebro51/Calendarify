import React, { useState, useRef, useEffect } from 'react';
import { LogIn, UserPlus, LogOut, User, ChevronDown } from 'lucide-react';

function LoginComponent({ onAuthChange }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${authMode === 'login' ? 'Logging in' : 'Signing up'} with:`, { username, password });
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setUserDisplayName(username);
    onAuthChange(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserDisplayName('');
    setShowProfileDropdown(false);
    onAuthChange(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      setDropdownWidth(buttonRef.current.offsetWidth);
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center justify-between transition-colors"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            <span className="mr-2">{userDisplayName}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>
        {showProfileDropdown && (
          <div 
            className="absolute right-0 mt-2 bg-gray-800 rounded-md overflow-hidden shadow-xl z-10"
            style={{ width: `${dropdownWidth}px` }}
          >
            <button
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="inline-block mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!showAuthModal) {
    return (
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors"
        onClick={() => setShowAuthModal(true)}
      >
        <LogIn className="mr-2" /> Login / Signup
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">
          {authMode === 'login' ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors"
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