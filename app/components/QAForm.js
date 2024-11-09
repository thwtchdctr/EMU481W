// app/components/QAForm.js
import { useState } from "react";

export default function QAForm({ onSubmit }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion(""); // Clear input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="w-full p-4 border rounded-lg"
      />
      <button type="submit" className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
        Submit
      </button>
    </form>
  );
}

