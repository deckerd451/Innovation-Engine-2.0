/******************************************************
 * Innovation Engine 2.0 – GitHub Pages Browser Build
 * ONE FILE VERSION (React18 + Babel + No Imports)
 * All components, services, types, Supabase, and app.
 ******************************************************/

/*******************************************
 * 0. GLOBAL ENUMS (converted from types.ts)
 *******************************************/
window.Page = {
  Auth: "Auth",
  Home: "Home",
  Profile: "Profile",
  MyProfile: "MyProfile",
};

/*******************************************
 * 1. SUPABASE CLIENT (converted)
 *******************************************/
window.isSupabaseConfigured = true;

window.supabase = window.supabase || (() => {
  const url = "https://hvmotpzhliufzomewzfl.supabase.co";
  const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bW90cHpobGl1ZnpvbWV3emZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzY2NDUsImV4cCI6MjA1ODE1MjY0NX0.foHTGZVtRjFvxzDfMf1dpp0Zw4XFfD-FPZK-zRnjc6s";

  return supabaseJs.createClient(url, key);
})();

/*******************************************
 * 2. SUPABASE SERVICE (converted)
 *******************************************/
window.supabaseService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { fullName } },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async getUserById(userId) {
    let { data, error } = await supabase
      .from("community")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  },

  async searchUsersBySkill(query) {
    let { data, error } = await supabase.rpc("search_users_by_skill", {
      skill: query || "",
    });

    if (error) throw error;

    return data || [];
  },

  async addEndorsement(targetUserId, skill, endorserId) {
    const { error } = await supabase.rpc("endorse_skill", {
      target_user_id: targetUserId,
      skill_name: skill,
      endorser_id: endorserId,
    });

    if (error) throw error;
  },

  async addSkill(userId, newSkill) {
    const { error } = await supabase.rpc("add_skill", {
      user_id: userId,
      skill_name: newSkill,
    });
    if (error) throw error;
  },

  async sendConnectionRequest(fromUserId, targetUserId) {
    const { error } = await supabase
      .from("connections")
      .insert([{ from: fromUserId, to: targetUserId }]);
    if (error) throw error;
  },

  async updateProfile(userId, update) {
    const { error } = await supabase
      .from("community")
      .update(update)
      .eq("id", userId);
    if (error) throw error;
  },
};

/*******************************************
 * 3. ICONS (converted from icons.tsx)
 *******************************************/
window.SearchIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round"
     d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 
        5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

window.UserPlusIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 
         3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 
         19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 
         12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
);

window.CheckCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round"
     d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 
        11-18 0 9 9 0 0118 0z" />
  </svg>
);

window.PlusCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 9v6m3-3H9m12 0a9 9 0 
         11-18 0 9 9 0 0118 0z" />
  </svg>
);

window.SparklesIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 
         4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 
         4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 
         4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 
         4.5 0 00-3.09 3.09z" />
  </svg>
);

window.PencilIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 
         1.875 0 112.652 2.652L10.582 16.07a4.5 
         4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 
         4.5 0 011.13-1.897l8.932-8.931z" />
  </svg>
);

window.XMarkIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round"
     d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/*******************************************
 * 4. USER CARD COMPONENT
 *******************************************/
window.UserCard = function UserCard({ user, setPage }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 flex flex-col">
      <div className="flex items-center space-x-4">
        <img className="w-16 h-16 rounded-full" src={user.avatarUrl} alt={user.fullName} />
        <div>
          <h3
            className="text-lg font-semibold text-brand-dark cursor-pointer hover:text-brand-primary"
            onClick={() => setPage(Page.Profile, user.id)}
          >
            {user.fullName}
          </h3>
          <p className="text-sm text-gray-600">{user.headline}</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-brand-secondary">Top Skills</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {(user.skills || []).slice(0, 3).map((s) => (
            <span key={s.skill}
              className="px-2 py-1 text-xs bg-brand-accent bg-opacity-20 text-brand-primary rounded-full">
              {s.skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setPage(Page.Profile, user.id)}
        className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 
                   text-sm font-medium rounded-md text-white bg-brand-primary"
      >
        <UserPlusIcon className="w-5 h-5 mr-2" />
        View Profile & Connect
      </button>
    </div>
  );
};

/*******************************************
 * 5. HEADER COMPONENT
 *******************************************/
window.Header = function Header({ session, setPage, onLogout }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">

        <div className="flex justify-between items-center h-16">

          <h1
            className="text-2xl font-bold text-brand-secondary cursor-pointer"
            onClick={() => setPage(Page.Home)}
          >
            Innovation Engine <span className="text-brand-primary">2.0</span>
          </h1>

          <div className="flex items-center">
            {session ? (
              <div className="relative group">
                <button className="rounded-full">
                  <img className="h-8 w-8 rounded-full"
                    src={`https://i.pravatar.cc/150?u=${session.user.id}`} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg 
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="block px-4 py-2"
                    onClick={(e) => { e.preventDefault(); setPage(Page.MyProfile) }}>
                    Your Profile
                  </a>
                  <a href="#" className="block px-4 py-2"
                    onClick={(e) => { e.preventDefault(); onLogout() }}>
                    Sign out
                  </a>
                </div>
              </div>
            ) : (
              <button className="px-4 py-2 bg-brand-primary text-white rounded-md"
                onClick={() => setPage(Page.Auth)}>
                Sign in
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

/*******************************************
 * 6. CONNECT MODAL (simplified)
 *******************************************/
window.ConnectModal = function ConnectModal({
  isOpen, onClose, targetUser, currentUser, onSendRequest
}) {
  const [message, setMessage] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-semibold mb-4">
          Connect with {targetUser.fullName}
        </h3>

        <textarea
          className="w-full border p-3 rounded-md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end space-x-3 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-brand-primary text-white rounded-md"
            onClick={() => { onSendRequest(message); onClose(); }}>
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

/*******************************************
 * 7. AUTH FORM COMPONENT
 *******************************************/
window.AuthForm = function AuthForm({ supabaseService }) {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await supabaseService.signIn(email, password);
      } else {
        await supabaseService.signUp(email, password, fullName);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-center text-3xl font-extrabold text-brand-dark mb-6">
          Innovation Engine <span className="text-brand-primary">2.0</span>
        </h1>

        {error && <p className="text-red-600">{error}</p>}

        {!isLogin && (
          <input
            className="border w-full p-2 mb-3"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <input
          className="border w-full p-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border w-full p-2 mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-brand-primary text-white w-full p-2 rounded-md"
        >
          {loading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
        </button>

        <div className="text-center mt-4">
          <button
            className="text-brand-primary underline"
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account?" : "Already have an account?"}
          </button>
        </div>
      </form>
    </div>
  );
};

/*******************************************
 * 8. HOME PAGE COMPONENT
 *******************************************/
window.HomePage = function HomePage({ setPage, supabaseService }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);

  const search = async () => {
    const res = await supabaseService.searchUsersBySkill(query);
    setResults(res);
  };

  React.useEffect(() => {
    search();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-brand-dark mb-4">
        Find Your Co-Founder
      </h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="flex"
        >
          <input
            className="border p-3 flex-grow rounded-l-md"
            placeholder="Search skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-brand-primary text-white px-6 rounded-r-md">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((u) => (
          <UserCard key={u.id} user={u} setPage={setPage} />
        ))}
      </div>
    </div>
  );
};

/*******************************************
 * 9. PROFILE PAGE COMPONENT
 *******************************************/
window.ProfilePage = function ProfilePage({
  userId, session, setPage, supabaseService
}) {
  const [user, setUser] = React.useState(null);

  const load = async () => {
    const u = await supabaseService.getUserById(userId);
    setUser(u);
  };

  React.useEffect(() => { load(); }, [userId]);

  if (!user)
    return <div className="p-10 text-center">Loading…</div>;

  return (
    <div className="container mx-auto p-8">
      <button className="underline mb-4" onClick={() => setPage(Page.Home)}>
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">
          {user.fullName}
        </h2>
        <p className="text-gray-600">{user.email}</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {(user.skills || []).map((s) => (
            <span key={s.skill}
              className="bg-brand-accent bg-opacity-20 px-3 py-1 rounded-full text-brand-primary">
              {s.skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/*******************************************
 * 10. ROOT APP COMPONENT
 *******************************************/
window.App = function App() {
  const [session, setSession] = React.useState(null);
  const [page, setPage] = React.useState(Page.Auth);

  React.useEffect(() => {
    const { data: listener } = supabaseService.onAuthStateChange(
      (_ev, session) => {
        setSession(session);
        setPage(session ? Page.Home : Page.Auth);
      }
    );
    return () => listener.subscription?.unsubscribe();
  }, []);

  if (!session) return <AuthForm supabaseService={supabaseService} />;

  switch (page) {
    case Page.Home:
      return <HomePage setPage={setPage} supabaseService={supabaseService} />;
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
      return <div>Unknown</div>;
  }
};

/*******************************************
 * 11. ENTRYPOINT (converted main.js)
 *******************************************/
document.addEventListener("DOMContentLoaded", () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
 /*******************************************
 * 11. ENTRYPOINT (fixed for UMD + Babel)
 *******************************************/
document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("root");
  const root = ReactDOM.createRoot(rootEl);

  root.render(
    React.createElement(App, {})
  );
});

