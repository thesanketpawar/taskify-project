import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  // Ensure tasks is always initialized as an array
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/tasks`);
      // Fallback to empty array if response data is not an array
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Backend API unavailable. Make sure Backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/tasks`, { title });
      setTasks([response.data, ...tasks]);
      setTitle('');
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Is backend server running?');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="container">
      <h1>Taskify App</h1>
      
      <form onSubmit={handleAddTask} className="input-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id || Math.random()}>
              <span>{task.title}</span>
              <button 
                onClick={() => handleDeleteTask(task._id)} 
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
