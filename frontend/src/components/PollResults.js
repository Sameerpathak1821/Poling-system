import React from "react";

const PollResults = ({ poll }) => {
  if (!poll) return null;

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return (
    <div className="poll-results">
      <h3>Poll Results</h3>
      <h4>{poll.question}</h4>
      <div className="results">
        {poll.options.map((option, index) => {
          const percentage =
            totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="result-item">
              <div className="result-header">
                <span className="option-text">{option.text}</span>
                <span className="vote-count">
                  {option.votes} votes ({percentage}%)
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              {option.voters.length > 0 && (
                <div className="voters">Voters: {option.voters.join(", ")}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="total-votes">Total Votes: {totalVotes}</div>
    </div>
  );
};

export default PollResults;
