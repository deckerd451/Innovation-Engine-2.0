import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { supabaseService } from './services/supabaseService';
import type { Session } from './types';
import { Page } from './types';
import { AuthForm } from './components/AuthForm';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { Header } from './components/Header';
// FIX: Import the Supabase Session type to correctly type the auth state change callback.
import type { Session as SupabaseSession } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Auth);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  // Render a configuration warning if Supabase is not set up
  if (!isSupabaseConfigured) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-light p-8">
        <div className="text-center bg-white p-10 rounded-lg shadow-lg max-w-lg">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Configuration Required</h1>
          <p className="text-gray-700">
            Welcome to Innovation Engine 2.0! To get started, you need to connect the app to your own Supabase backend.
          </p>
          <p className="mt-4 text-gray-700 text-left">
            1. Open the <code>supabaseClient.ts</code> file in the editor.<br/>
            2. Replace the placeholder values for <code>supabaseUrl</code> and <code>supabaseAnonKey</code>.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Detailed instructions for setting up your database are in the <code>INSTRUCTIONS.md</code> file.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setLoading(true);
    // FIX: Explicitly type the session parameter to match the corrected service definition.
    const { data: { subscription } } = supabaseService.onAuthStateChange((_event: string, session: SupabaseSession | null) => {
      setSession(session as Session | null);
      if (session) {
        // Use functional update to avoid stale state for currentPage
        setCurrentPage(prevPage => {
            // If user is on Auth page (e.g., after login), move them to Home. Otherwise, let them stay.
            return prevPage === Page.Auth ? Page.Home : prevPage;
        });
      } else {
        setCurrentPage(Page.Auth);
        setViewingUserId(null);
      }
      setLoading(false);
    });
  
    return () => {
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount


  // This effect handles invalid navigation to the profile page.
  useEffect(() => {
    if (currentPage === Page.Profile && !viewingUserId) {
      console.warn("Attempted to navigate to Profile page without a user ID. Redirecting to Home.");
      setCurrentPage(Page.Home);
    }
  }, [currentPage, viewingUserId]);

  const handleLogout = async () => {
    await supabaseService.signOut();
    // The onAuthStateChange listener will handle setting the session and page
  };

  const setPage = (page: Page, userId?: string) => {
    setCurrentPage(page);
    setViewingUserId(userId || null);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    if (!session) {
      return <AuthForm supabaseService={supabaseService} />;
    }

    switch (currentPage) {
      case Page.Home:
        return <HomePage setPage={setPage} supabaseService={supabaseService} />;
      case Page.Profile:
        if (viewingUserId) {
          return <ProfilePage userId={viewingUserId} session={session} setPage={setPage} supabaseService={supabaseService} />;
        }
        // Fallback while useEffect redirects
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
      case Page.MyProfile:
        return <ProfilePage userId={session.user.id} session={session} setPage={setPage} supabaseService={supabaseService} />;
      default:
        return <AuthForm supabaseService={supabaseService} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      {session && <Header session={session} setPage={setPage} onLogout={handleLogout} />}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;