import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function TaskList({ list, user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('list_id', list.id)
      .order('created_at', { ascending: false });
    if (!error) setTasks(data);
  }

  async function addTask() {
    if (!newTask) return;
    const { error } = await supabase
      .from('tasks')
      .insert([{ title: newTask, list_id: list.id, user_id: user.id }]);
    if (!error) {
      setNewTask('');
      fetchTasks();
    }
  }

  async function toggleTask(task) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id);
    if (!error) fetchTasks();
  }

  async function deleteTask(taskId) {
    await supabase.from('tasks').delete().eq('id', taskId);
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="tasklist">
      <h4>{list.title}</h4>
      <input
        placeholder="Nova tarefa"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Adicionar</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'done' : ''}>
            <span onClick={() => toggleTask(task)}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
