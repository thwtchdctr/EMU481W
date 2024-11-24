// app/components/AnswerForm.js
import { useState } from "react";

export default function AnswerForm({ onSubmit }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer(""); // Clear input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer..."
        className="w-full p-4 border rounded-lg"
      />
      <button type="submit" className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
        Submit Answer
      </button>
    </form>
  );
}
