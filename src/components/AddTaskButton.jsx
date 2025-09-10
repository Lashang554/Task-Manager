export default function AddTaskButton({ type = "button", ariaLabel = "Add task" }) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:bg-blue-800 transition"
    >
      + Add Task
    </button>
  );
}
