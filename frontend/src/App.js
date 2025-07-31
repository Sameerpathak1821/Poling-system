import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentView from "./components/StudentView";
import NameEntry from "./components/NameEntry";
import "./styles/App.css";

const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://your-app-name.onrender.com"
    : "http://localhost:5000"
);

function App() {
  const [userType, setUserType] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  useEffect(() => {
    // Check if student name is stored in session
    const storedName = sessionStorage.getItem("studentName");
    if (storedName) {
      setStudentName(storedName);
      setIsNameSet(true);
      socket.emit("joinAsStudent", storedName);
    }
  }, []);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleNameSubmit = (name) => {
    setStudentName(name);
    setIsNameSet(true);
    sessionStorage.setItem("studentName", name);
    socket.emit("joinAsStudent", name);
  };

  if (!userType) {
    return (
      <div className="app">
        <div className="user-type-selection">
          <h1>Welcome to Live Polling System</h1>
          <div className="button-container">
            <button
              className="user-type-btn teacher-btn"
              onClick={() => handleUserTypeSelect("teacher")}
            >
              I'm a Teacher
            </button>
            <button
              className="user-type-btn student-btn"
              onClick={() => handleUserTypeSelect("student")}
            >
              I'm a Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userType === "teacher") {
    return (
      <div className="app">
        <TeacherDashboard socket={socket} />
      </div>
    );
  }

  if (userType === "student" && !isNameSet) {
    return (
      <div className="app">
        <NameEntry onNameSubmit={handleNameSubmit} />
      </div>
    );
  }

  return (
    <div className="app">
      <StudentView socket={socket} studentName={studentName} />
    </div>
  );
}

export default App;
