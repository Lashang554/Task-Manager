import React, { Component } from "react";
import TaskItem from "./components/TaskItem";
import AddTaskButton from "./components/AddTaskButton";

export default class App extends Component {
  constructor(props) {
    super(props);

    // Instead of useState, we use this.state
    this.state = {
      tasks: [],
      newTitle: "",
      filter: "all", // all | completed | pending
    };
  }

  componentDidMount() {
    try {
      const raw = localStorage.getItem("tm_tasks_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.setState({ tasks: parsed });
        }
      }
    } catch (_) {
      // ignore malformed storage
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tasks !== this.state.tasks) {
      localStorage.setItem("tm_tasks_v1", JSON.stringify(this.state.tasks));
    }
  }

  handleAddTask = (e) => {
    e.preventDefault();
    const title = this.state.newTitle.trim();
    if (!title) return;
    const next = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.setState({
      tasks: [next, ...this.state.tasks],
      newTitle: "",
    });
  };

  handleToggleComplete = (taskId) => {
    this.setState({
      tasks: this.state.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    });
  };

  handleEditTaskTitle = (taskId, nextTitle) => {
    const title = nextTitle.trim();
    if (!title) return;
    this.setState({
      tasks: this.state.tasks.map((t) =>
        t.id === taskId ? { ...t, title } : t
      ),
    });
  };

  handleDeleteTask = (taskId) => {
    this.setState({
      tasks: this.state.tasks.filter((t) => t.id !== taskId),
    });
  };

  setFilter = (filter) => {
    this.setState({ filter });
  };

  getFilteredTasks() {
    const { tasks, filter } = this.state;
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    return tasks;
  }

  render() {
    const filtered = this.getFilteredTasks();
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Task Manager</h2>
          <nav className="space-y-3">
            <button
              className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                this.state.filter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => this.setFilter("all")}
              aria-pressed={this.state.filter === "all"}
            >
              📋 All Tasks
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                this.state.filter === "completed"
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-green-100"
              }`}
              onClick={() => this.setFilter("completed")}
              aria-pressed={this.state.filter === "completed"}
            >
              ✅ Completed
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                this.state.filter === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "hover:bg-yellow-100"
              }`}
              onClick={() => this.setFilter("pending")}
              aria-pressed={this.state.filter === "pending"}
            >
              ⏳ Pending
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-700">All Tasks</h1>
              <form className="flex items-center gap-2" onSubmit={this.handleAddTask}>
                <label htmlFor="new-task" className="sr-only">New task</label>
                <input
                  id="new-task"
                  type="text"
                  value={this.state.newTitle}
                  onChange={(e) => this.setState({ newTitle: e.target.value })}
                  placeholder="Add a new task and press Enter"
                  className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Task title"
                />
                <AddTaskButton type="submit" ariaLabel="Add task" />
              </form>
            </div>

            {/* Task List */}
            <ul className="space-y-4">
              {filtered.length === 0 ? (
                <li className="text-gray-500 text-sm">No tasks to show.</li>
              ) : (
                filtered.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => this.handleToggleComplete(task.id)}
                    onEdit={(nextTitle) => this.handleEditTaskTitle(task.id, nextTitle)}
                    onDelete={() => this.handleDeleteTask(task.id)}
                  />
                ))
              )}
            </ul>
          </div>
        </main>
      </div>
    );
  }
}
