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

  async function deleteList(listId) {
    const { error } = await supabase.from('lists').delete().eq('id', listId);
    if (!error) {
      fetchLists();
    }
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
        <h3>Nova Lista:</h3>
        <input
          placeholder="Nova lista"
          value={newList}
          onChange={(e) => setNewList(e.target.value)}
        />
        <button onClick={addList}>Adicionar Lista</button>

        <h3>Suas Listas:</h3>
        <div className="lists-container">
          {lists.map((list) => (
            <div key={list.id} className="list-item">
              <TaskList list={list} user={user} />
              <button onClick={() => deleteList(list.id)} style={{ marginLeft: '8px', color: 'red' }}>
                Excluir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
