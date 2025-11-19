
import React from 'react';
import type { Session } from '../types';
import { Page } from '../types';

interface HeaderProps {
  session: Session | null;
  setPage: (page: Page, userId?: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ session, setPage, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-brand-secondary cursor-pointer"
              onClick={() => setPage(Page.Home)}
            >
              Innovation Engine <span className="text-brand-primary">2.0</span>
            </h1>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative group">
                  <div>
                    <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src={`https://i.pravatar.cc/150?u=${session.user.id}`} alt="" />
                    </button>
                  </div>
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <a href="#" onClick={(e) => { e.preventDefault(); setPage(Page.MyProfile, session.user.id); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setPage(Page.Auth)}
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
