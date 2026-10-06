import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api";
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setError("Unable to connect to the backend.");
    }
  };

  const createTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      setTitle("");
      setDescription("");

      await fetchTasks();
    } catch (error) {
      console.error("Create task error:", error);
      setError("Unable to create task.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Update task error:", error);
      setError("Unable to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error);
      setError("Unable to delete task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">THREE-TIER APPLICATION</p>

          <h1>Three-Tier AWS Task App - CI/CD v2</h1>

          <p className="subtitle">
            A production-style task management application built with React,
            Node.js, Express and PostgreSQL.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon total-icon">✓</div>

            <div>
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{tasks.length}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-icon">◷</div>

            <div>
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">{pendingTasks}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed-icon">✓</div>

            <div>
              <span className="stat-label">Completed</span>
              <span className="stat-value completed">{completedTasks}</span>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="card form-card">
            <div className="card-header">
              <div>
                <h2>Create Task</h2>
                <p>Add a new task to your workspace.</p>
              </div>
            </div>

            <form onSubmit={createTask}>
              <label htmlFor="title">Task title</label>

              <input
                id="title"
                type="text"
                placeholder="e.g. Deploy application to AWS"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />

              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                rows="5"
                placeholder="Add some details about this task..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />

              <button
                className="primary-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "+ Add Task"}
              </button>
            </form>
          </div>

          <div className="card tasks-card">
            <div className="card-header">
              <div>
                <h2>Your Tasks</h2>
                <p>Track and manage your current work.</p>
              </div>

              <button
                className="refresh-button"
                type="button"
                onClick={fetchTasks}
              >
                ↻ Refresh
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>

                <h3>No tasks yet</h3>

                <p>Create your first task using the form.</p>
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <div
                    className={`task-item ${
                      task.completed ? "task-completed" : ""
                    }`}
                    key={task.id}
                  >
                    <div className="task-info">
                      <div className="task-title-row">
                        <h3>{task.title}</h3>

                        <span
                          className={`status-badge ${
                            task.completed
                              ? "status-completed"
                              : "status-pending"
                          }`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </div>

                      {task.description && (
                        <p className="task-description">
                          {task.description}
                        </p>
                      )}

                      <span className="task-id">
                        Task #{task.id}
                      </span>
                    </div>

                    <div className="task-actions">
                      <button
                        className="complete-button"
                        type="button"
                        onClick={() => toggleTask(task)}
                      >
                        {task.completed ? "Mark Pending" : "Complete"}
                      </button>

                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <span>Three-Tier AWS Application</span>
        <span>React • Node.js • PostgreSQL</span>
      </footer>
    </div>
  );
}

export default App;
