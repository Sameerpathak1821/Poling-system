import React, { useState, useEffect } from "react";
import PollResults from "./PollResults";

const TeacherDashboard = ({ socket }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [canCreatePoll, setCanCreatePoll] = useState(true);

  useEffect(() => {
    socket.on("pollCreated", (poll) => {
      setCurrentPoll(poll);
      setCanCreatePoll(false);
      setQuestion("");
      setOptions(["", ""]);
    });

    socket.on("pollResults", (poll) => {
      setCurrentPoll(poll);
    });

    socket.on("pollEnded", (poll) => {
      setCurrentPoll(poll);
      setCanCreatePoll(true);
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollResults");
      socket.off("pollEnded");
    };
  }, [socket]);

  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Please fill in all fields");
      return;
    }

    socket.emit("createPoll", {
      question: question.trim(),
      options: options.filter((opt) => opt.trim()),
      timeLimit,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleEndPoll = () => {
    if (currentPoll) {
      socket.emit("endPoll", currentPoll.id);
    }
  };

  return (
    <div className="teacher-dashboard">
      <h1>Teacher Dashboard</h1>

      {canCreatePoll ? (
        <div className="create-poll-section">
          <h2>Create New Poll</h2>
          <form onSubmit={handleCreatePoll}>
            <div className="form-group">
              <label>Question:</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                className="question-input"
              />
            </div>

            <div className="form-group">
              <label>Time Limit (seconds):</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                min="10"
                max="300"
                className="time-input"
              />
            </div>

            <div className="options-section">
              <label>Options:</label>
              {options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="option-input"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="remove-option-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="add-option-btn"
                >
                  Add Option
                </button>
              )}
            </div>

            <button type="submit" className="create-poll-btn">
              Create Poll
            </button>
          </form>
        </div>
      ) : (
        <div className="active-poll-section">
          <h2>Active Poll</h2>
          <button onClick={handleEndPoll} className="end-poll-btn">
            End Poll
          </button>
        </div>
      )}

      {currentPoll && <PollResults poll={currentPoll} />}
    </div>
  );
};

export default TeacherDashboard;
