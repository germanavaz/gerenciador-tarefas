import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TaskList from './TaskList';

export default function Dashboard({ user }) {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState('');

  async function fetchLists() {
    const { data, error } = await supabase.from('lists').select('*').order('created_at', { ascending: false });
    if (!error) setLists(data);
  }

  async function addList() {
    if (!newList) return;
    const { error } = await supabase.from('lists').insert([{ title: newList, user_id: user.id }]);
    if (!error) {
      setNewList('');
      fetchLists();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="dashboard">
      <h2>Bem-vindo, {user.email}</h2>
      <button onClick={handleLogout}>Sair</button>

      <div className="lists">
        <h3>Suas listas</h3>
        <input
          placeholder="Nova lista"
          value={newList}
          onChange={(e) => setNewList(e.target.value)}
        />
        <button onClick={addList}>Adicionar Lista</button>

        <div className="lists-container">
          {lists.map((list) => (
            <TaskList key={list.id} list={list} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
