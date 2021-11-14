import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import { useState, useEffect } from "react";
import About from "./components/About";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const resp = await fetch("http://localhost:5000/tasks/");
    const data = await resp.json();
    return data;
  };
  const fetchTask = async (id) => {
    const resp = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await resp.json();
    return data;
  };

  useEffect(() => {
    const getTasks = (async () => {
      const data = await fetchTasks();
      setTasks(data);
    })();
  }, []);

  const randInt = (min = 1000, max = 9999) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const addTask = async (task) => {
    task = {
      id: randInt(),
      ...task,
    };
    const resp = await fetch(`http://localhost:5000/tasks`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await resp.json();
    setTasks([...tasks, data]);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.id != id));
  };
  const toggleReminder = async (id) => {
    const task = await fetchTask(id);
    const updatedTask = { ...task, reminder: !task.reminder };
    const resp = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    const data = await resp.json();
    console.log(data);
    setTasks(
      tasks.map((task) =>
        task.id == data.id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          toggleForm={() => setIsVisibleForm(!isVisibleForm)}
          isVisibleForm={isVisibleForm}
        />

        <Routes>
          <Route
            path="/"
            exact
            element={
              <>
                {isVisibleForm && <AddTask addTask={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    toggleReminder={toggleReminder}
                  />
                ) : (
                  <p className="no-tasks">Nothing here.</p>
                )}
                <Footer />
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
