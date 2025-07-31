import React, { useState } from "react";

const NameEntry = ({ onNameSubmit }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }
    onNameSubmit(name.trim());
  };

  return (
    <div className="name-entry">
      <h2>Enter Your Name</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="name-input"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-btn">
          Join Polling
        </button>
      </form>
    </div>
  );
};

export default NameEntry;
