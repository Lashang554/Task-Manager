import React, { Component } from "react";
import { Menu, X, ListTodo, CheckCircle2, Clock } from "lucide-react";
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
      showMobileNav: false,
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
    this.setState({ filter, showMobileNav: false });
  };

  openMobileNav = () => {
    this.setState({ showMobileNav: true });
  };

  closeMobileNav = () => {
    this.setState({ showMobileNav: false });
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Overlay for mobile */}
        {this.state.showMobileNav && (
          <button
            className="fixed inset-0 bg-black/40 sm:hidden z-30"
            aria-label="Close sidebar"
            onClick={this.closeMobileNav}
          />
        )}

        <div className="mx-auto w-full max-w-6xl flex flex-col md:flex-row gap-4 md:gap-6 p-3 md:p-6">
        {/* Sidebar */}
        <aside
          className={
            `bg-white/90 backdrop-blur rounded-xl ring-1 ring-slate-200 shadow p-4 md:p-6 z-40 ` +
            // Mobile: slide-in drawer; Desktop: static left column
            (this.state.showMobileNav
              ? "fixed top-0 left-0 h-full w-72 translate-x-0 sm:static"
              : "fixed top-0 -left-72 h-full w-72 -translate-x-0 sm:static") +
            " sm:translate-x-0 sm:w-64 sm:h-auto sm:left-auto sm:top-auto w-72"
          }
          aria-hidden={!this.state.showMobileNav && typeof window !== 'undefined' && window.innerWidth < 640}
        >
          <h2 className="text-xl font-bold text-gray-700 mb-6">Task Manager</h2>
          <nav className="space-y-3">
            <button
              className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                this.state.filter === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              onClick={() => this.setFilter("all")}
              aria-pressed={this.state.filter === "all"}
            >
              <span className="inline-flex items-center gap-2">
                <ListTodo size={18} />
                <span>All Tasks</span>
              </span>
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                this.state.filter === "completed"
                  ? "bg-emerald-600 text-white shadow"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              onClick={() => this.setFilter("completed")}
              aria-pressed={this.state.filter === "completed"}
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Completed</span>
              </span>
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                this.state.filter === "pending"
                  ? "bg-amber-500 text-white shadow"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              onClick={() => this.setFilter("pending")}
              aria-pressed={this.state.filter === "pending"}
            >
              <span className="inline-flex items-center gap-2">
                <Clock size={18} />
                <span>Pending</span>
              </span>
            </button>
          </nav>
          {/* Close button on mobile */}
          <div className="sm:hidden mt-6">
            <button
              onClick={this.closeMobileNav}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              aria-label="Close sidebar"
            >
              <X size={18} />
              <span>Close</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white/90 backdrop-blur rounded-2xl ring-1 ring-slate-200 shadow p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button
                  className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-gray-50"
                  aria-label="Open sidebar"
                  onClick={this.openMobileNav}
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                  {this.state.filter === "all" && "All Tasks"}
                  {this.state.filter === "completed" && "Completed"}
                  {this.state.filter === "pending" && "Pending"}
                </h1>
                <span className="inline-flex items-center text-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {filtered.length}
                </span>
              </div>
              <form className="flex w-full sm:w-auto items-center gap-2" onSubmit={this.handleAddTask}>
                <label htmlFor="new-task" className="sr-only">New task</label>
                <input
                  id="new-task"
                  type="text"
                  value={this.state.newTitle}
                  onChange={(e) => this.setState({ newTitle: e.target.value })}
                  placeholder="Add a new task and press Enter"
                  className="border border-slate-300 bg-slate-50 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
      </div>
    );
  }
}
