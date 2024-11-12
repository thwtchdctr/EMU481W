"use client";

import { useEffect, useState } from "react";

const TAGS = ["Finance", "Real Estate", "Stock Market", "Investments", "Banking", "Economy"];

const QAForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState([]);

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (tags.includes(value)) {
      setTags(tags.filter(tag => tag !== value));
    } else {
      setTags([...tags, value]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question, tags);
      setQuestion("");
      setTags([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-white">Your Question</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 mt-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
          rows="4"
          placeholder="Type your question here"
        />
      </div>

      <div className="space-x-2">
        {TAGS.map(tag => (
          <label key={tag} className="inline-flex items-center text-white">
            <input
              type="checkbox"
              value={tag}
              checked={tags.includes(tag)}
              onChange={handleTagChange}
              className="form-checkbox text-secondary"
            />
            <span className="ml-2">{tag}</span>
          </label>
        ))}
      </div>

      <button type="submit" className="mt-4 bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500">
        Submit Question
      </button>
    </form>
  );
};

const QuestionList = ({ questions }) => {
  return (
    <div>
      {questions.map((question) => (
        <div key={question.id} className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <p className="font-semibold text-lg">{question.question}</p>
          <div className="flex space-x-2 mt-2">
            {question.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-300 rounded-full text-sm text-gray-800">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function QA() {
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");

  // Load questions from localStorage when the component mounts
  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      fetchQuestions();
    }
  }, []);

  // Fetch questions from the API and store in local state and localStorage
  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
      localStorage.setItem("questions", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Handle submission of a new question
  const handleNewQuestion = async (question, tags) => {
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, tags }),
      });
      const newQuestion = await res.json();

      // Update local state and localStorage immediately
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  // Handle tag selection for filtering questions
  const handleTagSelection = (tag) => setSelectedTag(tag);

  // Filter questions by the selected tag
  const filteredQuestions = selectedTag === "All" ? questions : questions.filter((q) => q.tags.includes(selectedTag));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className="bg-teal-400 py-10 text-center"> 
        <h1 className="text-5xl font-bold mb-4 text-accent">Ask Questions</h1>
        <p className="text-lg mb-6">Search for topics, posts, users, or categories</p>
        <div className="flex justify-center items-center gap-1 mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-1/2 p-3 rounded-l-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button className="bg-gray-500 px-6 rounded-r-lg text-white font-semibold hover:bg-secondary transition duration-200">
            Search
          </button>
        </div>

        {/* Tags Section */}
        <div className="flex justify-center space-x-4 text-sm">
          <button onClick={() => handleTagSelection("All")} className={`px-3 py-1 rounded-full ${selectedTag === "All" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"} hover:bg-gray-300`}>
            All
          </button>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelection(tag)}
              className={`px-3 py-1 rounded-full ${selectedTag === tag ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"} hover:bg-gray-300`}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10"> 
          <h2 className="text-3xl font-bold mb-6 text-white">Create New Question</h2> 
          <QAForm onSubmit={handleNewQuestion} />
        </div>

        {/* Recently Submitted Question Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-10">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Recently Submitted Question</h3>
          {questions.length > 0 ? (
            <div className="border rounded p-4 bg-white shadow">
              <p className="font-semibold text-lg">{questions[questions.length - 1].question}</p>
              <div className="flex space-x-2 mt-2">
                {questions[questions.length - 1].tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-300 rounded-full text-sm text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p>No recently submitted question.</p>
          )}
        </div>

        {/* List of All Questions */}
        <div className="mt-10">
          <QuestionList questions={filteredQuestions} />
        </div>
      </div>
    </div>
  );
}
