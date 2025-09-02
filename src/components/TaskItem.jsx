import { Pencil, CheckCircle2, Circle, Trash2 } from "lucide-react";
import React, { useState } from "react";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = draft.trim();
    if (!next) return setIsEditing(false);
    if (next !== task.title) onEdit(next);
    setIsEditing(false);
  };

  return (
    <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <button
          className="text-green-600 hover:text-green-800"
          onClick={onToggle}
          aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
        >
          {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={handleSubmit}
              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>
        ) : (
          <span
            className={`text-gray-700 font-medium ${task.completed ? "line-through text-gray-400" : ""}`}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          className="flex items-center text-red-600 hover:text-red-800"
          onClick={onDelete}
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
        <button
          className="flex items-center text-blue-600 hover:text-blue-800"
          onClick={() => {
            setDraft(task.title);
            setIsEditing(true);
          }}
          aria-label="Edit task"
        >
          <Pencil size={18} />
        </button>
      </div>
    </li>
  );
}
