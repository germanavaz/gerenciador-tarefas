import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './styles/main.scss';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  return (
    <div className="app">
      {user ? <Dashboard user={user} /> : <Login />}
    </div>
  );
}

export default App;
