// App.js — JSX compiled in browser via Babel standalone

// Expecting these globals to already be loaded by index.html:
//   window.supabase
//   window.supabaseService
//   window.Page  (enum)
//   window.AuthForm
//   window.HomePage
//   window.ProfilePage
//   window.Header

function App() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(Page.Auth);
  const [viewingUserId, setViewingUserId] = React.useState(null);

  // CONFIG WARNING (kept identical)
  if (!window.isSupabaseConfigured) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-light p-8">
        <div className="text-center bg-white p-10 rounded-lg shadow-lg max-w-lg">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Configuration Required</h1>
          <p className="text-gray-700">
            Welcome to Innovation Engine 2.0! To get started, you need to connect the app to your own
            Supabase backend.
          </p>
          <p className="mt-4 text-gray-700 text-left">
            1. Open the <code>supabaseClient.ts</code> file in the editor.<br />
            2. Replace the placeholder values for <code>supabaseUrl</code> and <code>supabaseAnonKey</code>.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Detailed instructions for setting up your database are in the <code>INSTRUCTIONS.md</code> file.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------
  // AUTH LISTENER
  // -------------------------------------------
  React.useEffect(() => {
    setLoading(true);

    const { data: { subscription } } = supabaseService.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        setCurrentPage(prev => (prev === Page.Auth ? Page.Home : prev));
      } else {
        setCurrentPage(Page.Auth);
        setViewingUserId(null);
      }

      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // -------------------------------------------
  // INVALID PROFILE NAVIGATION GUARD
  // -------------------------------------------
  React.useEffect(() => {
    if (currentPage === Page.Profile && !viewingUserId) {
      console.warn("Attempted to navigate to Profile page without a user ID. Redirecting to Home.");
      setCurrentPage(Page.Home);
    }
  }, [currentPage, viewingUserId]);

  // -------------------------------------------
  // LOGOUT
  // -------------------------------------------
  const handleLogout = async () => {
    await supabaseService.signOut();
  };

  // -------------------------------------------
  // PAGE ROUTER
  // -------------------------------------------
  const setPage = (page, userId = null) => {
    setCurrentPage(page);
    setViewingUserId(userId);
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
          return (
            <ProfilePage
              userId={viewingUserId}
              session={session}
              setPage={setPage}
              supabaseService={supabaseService}
            />
          );
        }
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
      case Page.MyProfile:
        return (
          <ProfilePage
            userId={session.user.id}
            session={session}
            setPage={setPage}
            supabaseService={supabaseService}
          />
        );
      default:
        return <AuthForm supabaseService={supabaseService} />;
    }
  };

  // -------------------------------------------
  // RENDER APP
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-brand-light font-sans">
      {session && (
        <Header
          session={session}
          setPage={setPage}
          onLogout={handleLogout}
        />
      )}
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

// Export globally so main.js can call <App/>
window.App = App;
