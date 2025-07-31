import React, { useState, useEffect } from "react";
import PollResults from "./PollResults";

const StudentView = ({ socket, studentName }) => {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    socket.on("newPoll", (poll) => {
      setCurrentPoll(poll);
      setHasVoted(false);
      setSelectedOption(null);
      setShowResults(false);
      setTimeLeft(poll.timeLimit);
    });

    socket.on("voteSubmitted", (poll) => {
      setShowResults(true);
      setCurrentPoll(poll);
    });

    socket.on("pollResults", (poll) => {
      if (hasVoted) {
        setCurrentPoll(poll);
      }
    });

    socket.on("pollEnded", (poll) => {
      setCurrentPoll(poll);
      setShowResults(true);
    });

    socket.on("voteError", (message) => {
      alert(message);
    });

    return () => {
      socket.off("newPoll");
      socket.off("voteSubmitted");
      socket.off("pollResults");
      socket.off("pollEnded");
      socket.off("voteError");
    };
  }, [socket, hasVoted]);

  useEffect(() => {
    let timer;
    if (currentPoll && currentPoll.isActive && timeLeft > 0 && !hasVoted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentPoll, timeLeft, hasVoted]);

  const handleVote = () => {
    if (selectedOption !== null && currentPoll) {
      socket.emit("submitVote", {
        pollId: currentPoll.id,
        optionIndex: selectedOption,
      });
      setHasVoted(true);
    }
  };

  if (!currentPoll) {
    return (
      <div className="student-view">
        <h2>Welcome, {studentName}!</h2>
        <p>Waiting for teacher to start a poll...</p>
      </div>
    );
  }

  if (showResults || !currentPoll.isActive) {
    return (
      <div className="student-view">
        <h2>Welcome, {studentName}!</h2>
        <PollResults poll={currentPoll} />
      </div>
    );
  }

  return (
    <div className="student-view">
      <h2>Welcome, {studentName}!</h2>
      <div className="poll-section">
        <h3>{currentPoll.question}</h3>
        <div className="time-left">Time left: {timeLeft} seconds</div>

        <div className="options">
          {currentPoll.options.map((option, index) => (
            <div key={index} className="option">
              <label>
                <input
                  type="radio"
                  name="poll-option"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                />
                {option.text}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleVote}
          disabled={selectedOption === null || hasVoted}
          className="vote-btn"
        >
          {hasVoted ? "Vote Submitted" : "Submit Vote"}
        </button>
      </div>
    </div>
  );
};

export default StudentView;
