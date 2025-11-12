import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import ThemeToggle from '../ui/ThemeToggle';
import TokenDisplay from '../ui/TokenDisplay';
import TokenModal from '../ui/TokenModal';

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userType, setUserType] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const isHomePage = router.pathname === '/';
  const isAuthPage = router.pathname === '/wallet-connect' || router.pathname === '/role-selection';
  const isProfileSetupPage = router.pathname.includes('/profile-setup');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle wallet connection
  const handleConnectWallet = () => {
    router.push('/wallet-connect');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  // Get wallet address and user type
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    const userRole = localStorage.getItem('userRole');
    
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
      setUserType(userRole || 'learner');
    } else {
      // Set demo data for showcasing
      const demoWallet = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      const demoRole = 'learner';
      setWalletAddress(demoWallet);
      setUserType(demoRole);
      localStorage.setItem('connectedWalletAddress', demoWallet);
      localStorage.setItem('userRole', demoRole);
    }
  }, []);

  // Navigation links for different pages
  const renderNavLinks = () => {
    if (isAuthPage || isProfileSetupPage) {
      // Don't show any navigation links on wallet-connect, role-selection, and profile setup pages
      return null;
    } else if (isHomePage) {
      return (
        <>
          <Link href="#how-it-works" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium relative group">
            How It Works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="#communities" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium relative group">
            Communities
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="#who-its-for" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium relative group">
            Who It's For
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </>
      );
    } else if (router.pathname === '/verify-prediction' || router.pathname === '/verified-predictions') {
      return (
        <>
          <Link href="/verify-prediction" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium relative group">
            Verify Prediction
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/verified-predictions" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium relative group">
            Verified Predictions
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/role-selection" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium relative group">
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </>
      );
    }
  };

  // Mobile navigation links
  const renderMobileNavLinks = () => {
    if (isAuthPage || isProfileSetupPage) {
      // Don't show any navigation links on wallet-connect, role-selection, and profile setup pages
      return null;
    } else if (isHomePage) {
      return (
        <>
          <Link 
            href="#how-it-works" 
            className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="#communities" 
            className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Communities
          </Link>
          <Link 
            href="#who-its-for" 
            className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Who It's For
          </Link>
        </>
      );
    } else if (router.pathname === '/verify-prediction' || router.pathname === '/verified-predictions') {
      return (
        <>
          <Link 
            href="/verify-prediction" 
            className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Verify Prediction
          </Link>
          <Link 
            href="/verified-predictions" 
            className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Verified Predictions
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link 
            href="/" 
            className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/role-selection" 
            className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Dashboard
          </Link>
        </>
      );
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] border-b border-gray-200/50 dark:border-gray-800/50 ${
      isScrolled || isMobileMenuOpen
        ? 'bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg' 
        : 'bg-white/40 dark:bg-gray-900/40 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-16 md:h-15">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-600 dark:from-purple-400 dark:to-blue-500 bg-clip-text text-transparent">
              Inverstra
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {renderNavLinks()}
            </nav>
            
            {/* Token Display */}
            {walletAddress && !isHomePage && !isAuthPage && (
              <div 
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setShowTokenModal(true)}
              >
                <TokenDisplay 
                  walletAddress={walletAddress} 
                  userType={userType}
                  showDetails={false}
                />
              </div>
            )}
            
            {isHomePage && (
              <Button 
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Connect Wallet
              </Button>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-4 px-2 rounded-lg mt-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-gray-200/50 dark:border-gray-800/50 animate-fadeIn">
            <nav className="flex flex-col space-y-3 mb-4">
              {renderMobileNavLinks()}
            </nav>
            
            {isHomePage && (
              <Button 
                onClick={handleConnectWallet}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Token Modal */}
      <TokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        walletAddress={walletAddress}
        userType={userType}
      />
    </header>
  );
};

export default Navbar;
