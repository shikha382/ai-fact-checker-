
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">VeriAI</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">API Status</a>
          <button className="text-sm font-semibold text-white bg-slate-900 px-4 py-2 rounded-full hover:bg-slate-800 transition-colors shadow-sm">
            Try for Free
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
