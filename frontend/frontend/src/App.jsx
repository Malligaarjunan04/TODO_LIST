import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const API = import.meta.env.VITE_URL;

console.log("API Endpoint:", API);

function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get all tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add or Update Task
  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      if (editId) {
        await axios.put(`${API}/update/${editId}`, { text });
        setEditId(null);
      } else {
        await axios.post(`${API}/post`, { text });
      }
      setText("");
      await fetchTasks();
    } catch (error) {
      console.error("Error submitting task", error);
    }

    setLoading(false);
  };

  // Edit Task
  const handleEdit = (task) => {
    setText(task.text);
    setEditId(task._id);
  };

  // Delete Task
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API}/delete/${id}`);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>📝 To-Do List</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id}>
              <span>{task.text}</span>
              <div className="buttons">
                <button onClick={() => handleEdit(task)} disabled={loading}>✏️</button>
                <button onClick={() => handleDelete(task._id)} disabled={loading}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
