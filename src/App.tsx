import { useState, useEffect } from "react";

function App() {
  const storedTasks = localStorage.getItem("tasks");
  const [inputValue, setInputValue] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>(
    storedTasks ? JSON.parse(storedTasks) : []
  );
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addTaskToTasks = () => {
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue) {
      if (isEditMode && editIndex !== null) {
        if (!tasks.includes(trimmedInputValue)) {
          const updatedTasks = [
            trimmedInputValue,
            ...tasks.filter((_, index) => index !== editIndex),
          ];
          setTasks(updatedTasks);
          setEditMode(false);
          setEditIndex(null);
          setInputValue("");
        }
      } else if (
        !tasks.some(
          (task) => task.toLowerCase() === trimmedInputValue.toLowerCase()
        )
      ) {
        setTasks([trimmedInputValue, ...tasks]);
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const editTask = (index: number) => {
    const toEditTaskArray = tasks.filter((_, i) => i === index);
    setInputValue(toEditTaskArray[0]);
    setEditMode(true);
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditIndex(null);
    setInputValue("");
  };

  return (
    <div className="container mt-4">
      <h1>To-Do-List</h1>
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={addTaskToTasks}
          disabled={!inputValue.trim()}
        >
          {isEditMode ? "Save Task" : "Add Task"}
        </button>
        {isEditMode && (
          <button className="btn btn-secondary ms-2" onClick={cancelEdit}>
            Cancel
          </button>
        )}
        <button className="btn btn-danger ms-2" onClick={clearTasks}>
          Clear Tasks
        </button>
      </div>
      <ul className="list-group">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {task}
            <span>
              <button
                className="btn btn-sm btn-outline-danger me-2"
                onClick={() => deleteTask(index)}
              >
                Delete
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => editTask(index)}
              >
                Edit
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
